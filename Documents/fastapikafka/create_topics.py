from kafka.admin import KafkaAdminClient, NewTopic

try:
  
    admin_client = KafkaAdminClient(
        bootstrap_servers=['localhost:9092'],
        client_id='admin-client'
    )

    topics = [
        NewTopic(name='UserEvents', num_partitions=1, replication_factor=1),
        NewTopic(name='PurchasedItems', num_partitions=1, replication_factor=1)
    ]

  
    result = admin_client.create_topics(topics)
    print("Topic'ler başarıyla oluşturuldu!")
    print("Oluşturulan topic'ler:", result)
    
except Exception as e:
    print(f"Hata: {e}")
    
finally:
    if 'admin_client' in locals():
        admin_client.close()