from fastapi import FastAPI, HTTPException
from models import SendEventModel, PurchasedItemModel
from kafka import KafkaProducer
import json
import logging
from datetime import datetime


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="E-commerce Analytics API", version="1.0.0")


try:
    producer = KafkaProducer(
        bootstrap_servers='localhost:9092',
        value_serializer=lambda v: json.dumps(v, default=str).encode('utf-8'),
        retries=3,
        acks='all'
    )
    logger.info("Kafka producer başarıyla oluşturuldu")
except Exception as e:
    logger.error(f"Kafka producer oluşturulamadı: {e}")
    producer = None

@app.put("/send_event")
async def send_event(event: SendEventModel):
   
    if not producer:
        raise HTTPException(status_code=500, detail="Kafka producer mevcut değil")
    
    try:
   
        future = producer.send('UserEvents', event.dict())
        producer.flush()  
        
        logger.info(f"Event gönderildi: UserId={event.UserId}, EventName={event.EventName}")
        return {"status": "success", "message": "Event başarıyla gönderildi"}
    
    except Exception as e:
        logger.error(f"Event gönderilirken hata: {e}")
        raise HTTPException(status_code=500, detail=f"Event gönderilemedi: {str(e)}")

@app.post("/purchased_items")
async def purchased_items(items: list[PurchasedItemModel]):
   
    if not producer:
        raise HTTPException(status_code=500, detail="Kafka producer mevcut değil")
    
    try:
        sent_count = 0
        for item in items:
            future = producer.send('PurchasedItems', item.dict())
            sent_count += 1
        
        producer.flush()  
        
        logger.info(f"{sent_count} adet satın alma kaydı gönderildi")
        return {
            "status": "success", 
            "message": f"{sent_count} adet kayıt başarıyla gönderildi",
            "sent_count": sent_count
        }
    
    except Exception as e:
        logger.error(f"Satın alma kayıtları gönderilirken hata: {e}")
        raise HTTPException(status_code=500, detail=f"Kayıtlar gönderilemedi: {str(e)}")

@app.get("/health")
async def health_check():
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "kafka_connected": producer is not None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)