from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import logging
import os

# Logging ayarları
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def create_spark_session():
    """Spark session oluşturur"""
    spark = SparkSession.builder \
        .appName("Kafka-PurchasedItems-Consumer") \
        .config("spark.sql.adaptive.enabled", "true") \
        .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
        .config("spark.sql.adaptive.skewJoin.enabled", "true") \
        .config("spark.sql.streaming.checkpointLocation", "/tmp/checkpoint") \
        .getOrCreate()
    
    # Log seviyesini ayarla
    spark.sparkContext.setLogLevel("WARN")
    
    return spark

def create_purchased_items_schema():
    """PurchasedItems için schema tanımlar"""
    product_schema = StructType([
        StructField("ProductId", StringType(), False),
        StructField("ItemCount", IntegerType(), False),
        StructField("ItemPrice", DoubleType(), False),
        StructField("ItemDiscount", DoubleType(), False)
    ])
    
    purchased_items_schema = StructType([
        StructField("SessionId", StringType(), False),
        StructField("TimeStamp", TimestampType(), False),
        StructField("UserId", StringType(), False),
        StructField("TotalPrice", DoubleType(), False),
        StructField("OrderId", StringType(), False),
        StructField("Products", ArrayType(product_schema), False),
        StructField("PaymentType", StringType(), False)
    ])
    
    return purchased_items_schema

def setup_minio_connection(spark):
    """MinIO bağlantısını ayarlar"""
    # MinIO S3 uyumlu endpoint
    spark.conf.set("spark.hadoop.fs.s3a.endpoint", "http://localhost:9000")
    spark.conf.set("spark.hadoop.fs.s3a.access.key", "minioadmin")
    spark.conf.set("spark.hadoop.fs.s3a.secret.key", "minioadmin")
    spark.conf.set("spark.hadoop.fs.s3a.path.style.access", "true")
    spark.conf.set("spark.hadoop.fs.s3a.impl", "org.apache.hadoop.fs.s3a.S3AFileSystem")
    
    logger.info("MinIO bağlantısı ayarlandı")

def create_kafka_stream(spark, schema):
    """Kafka'dan stream oluşturur"""
    kafka_stream = spark \
        .readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "localhost:9092") \
        .option("subscribe", "PurchasedItems") \
        .option("startingOffsets", "latest") \
        .option("failOnDataLoss", "false") \
        .load()
    
    # JSON'dan DataFrame'e çevir
    stream_df = kafka_stream \
        .selectExpr("CAST(value AS STRING) as json_data") \
        .select(from_json(col("json_data"), schema).alias("data")) \
        .select("data.*")
    
    return stream_df

def write_to_minio(df, epoch_id):
    """MinIO'ya parquet formatında yazar"""
    if df.count() > 0:
        # Timestamp'e göre partition oluştur
        df_with_partition = df.withColumn("year", year(col("TimeStamp"))) \
                              .withColumn("month", month(col("TimeStamp"))) \
                              .withColumn("day", dayofmonth(col("TimeStamp"))) \
                              .withColumn("hour", hour(col("TimeStamp")))
        
        # MinIO'ya yaz
        df_with_partition.write \
            .mode("append") \
            .partitionBy("year", "month", "day", "hour") \
           .parquet("s3a://ecommerce-data/")
        
        logger.info(f"Epoch {epoch_id}: {df.count()} kayıt MinIO'ya yazıldı")
    else:
        logger.info(f"Epoch {epoch_id}: Yazılacak veri yok")

def main():
    """Ana fonksiyon"""
    logger.info("PySpark Kafka Consumer başlatılıyor...")
    
    try:
        # Spark session oluştur
        spark = create_spark_session()
        logger.info("Spark session oluşturuldu")
        
        # MinIO bağlantısını ayarla
        setup_minio_connection(spark)
        
        # Schema oluştur
        schema = create_purchased_items_schema()
        logger.info("Schema oluşturuldu")
        
        # Kafka stream oluştur
        stream_df = create_kafka_stream(spark, schema)
        logger.info("Kafka stream oluşturuldu")
        
        # Stream'i MinIO'ya yaz
        query = stream_df.writeStream \
            .foreachBatch(write_to_minio) \
            .outputMode("append") \
            .trigger(processingTime="30 seconds") \
            .start()
        
        logger.info("Stream yazma başlatıldı. MinIO'ya her 30 saniyede bir yazılacak.")
        logger.info("MinIO Console: http://localhost:9001 (minioadmin/minioadmin)")
        
        # Stream'i bekle
        query.awaitTermination()
        
    except KeyboardInterrupt:
        logger.info("Uygulama kullanıcı tarafından durduruldu.")
    except Exception as e:
        logger.error(f"Beklenmeyen hata: {e}")
        raise
    finally:
        if 'spark' in locals():
            spark.stop()
            logger.info("Spark session kapatıldı.")

if __name__ == "__main__":
    main() 