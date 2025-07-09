import requests
import json
import time
import random
from faker import Faker
from datetime import datetime, timedelta
from models import SendEventModel, PurchasedItemModel, ProductModel, EventNameEnum, PaymentTypeEnum
import logging
from fastapi.encoders import jsonable_encoder

# Logging ayarları
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Faker instance'ı oluştur
fake = Faker('tr_TR')

class DataGenerator:
    def __init__(self, api_base_url="http://localhost:8000"):
        self.api_base_url = api_base_url
        self.session = requests.Session()
        
    def generate_user_event(self):
      
        event_names = [EventNameEnum.PAGE_VISITED, EventNameEnum.ADDED_BASKET, EventNameEnum.CHECKED_PRODUCT_REVIEWS]
        
        event = SendEventModel(
            UserId=fake.uuid4(),
            SessionId=fake.uuid4(),
            EventName=random.choice(event_names),
            TimeStamp=fake.date_time_between(start_date='-1h', end_date='now'),
            Attributes={
                "ProductId": f"prod_{fake.random_number(digits=6)}",
                "Price": round(random.uniform(10.0, 1000.0), 2),
                "Discount": round(random.uniform(0.0, 50.0), 2)
            }
        )
        return event
    
    def generate_purchased_items(self, count=1):
      
        items = []
        
        for _ in range(count):
           
            product_count = random.randint(1, 5)
            products = []
            
            for _ in range(product_count):
                item_price = round(random.uniform(10.0, 500.0), 2)
                item_discount = round(random.uniform(0.0, item_price), 2)  # Discount hiçbir zaman fiyatı geçmesin
                product = ProductModel(
                    ProductId=f"prod_{fake.random_number(digits=6)}",
                    ItemCount=random.randint(1, 10),
                    ItemPrice=item_price,
                    ItemDiscount=item_discount
                )
                products.append(product)
            
        
            total_price = sum((prod.ItemPrice - prod.ItemDiscount) * prod.ItemCount for prod in products)
            
            item = PurchasedItemModel(
                SessionId=fake.uuid4(),
                TimeStamp=fake.date_time_between(start_date='-1h', end_date='now'),
                UserId=fake.uuid4(),
                TotalPrice=round(total_price, 2),
                OrderId=f"order_{fake.random_number(digits=8)}",
                Products=products,
                PaymentType=random.choice(list(PaymentTypeEnum))
            )
            items.append(item)
        
        return items
    
    def send_user_event(self, event):
       
        try:
            response = self.session.put(
                f"{self.api_base_url}/send_event",
                json=jsonable_encoder(event),
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            logger.info(f"User event gönderildi: {event.EventName}")
            return True
        except Exception as e:
            logger.error(f"User event gönderilirken hata: {e}")
            return False
    
    def send_purchased_items(self, items):
        
        try:
            response = self.session.post(
                f"{self.api_base_url}/purchased_items",
                json=[jsonable_encoder(item) for item in items],
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            logger.info(f"{len(items)} adet satın alma kaydı gönderildi")
            return True
        except Exception as e:
            logger.error(f"Satın alma kayıtları gönderilirken hata: {e}")
            return False
    
    def generate_and_send_batch(self):
     
        user_event_count = random.randint(1, 3)
        user_events_sent = 0
        
        for _ in range(user_event_count):
            event = self.generate_user_event()
            if self.send_user_event(event):
                user_events_sent += 1
        
       
        purchase_count = random.randint(1, 2)
        items = self.generate_purchased_items(purchase_count)
        if self.send_purchased_items(items):
            logger.info(f"Batch tamamlandı: {user_events_sent} user event, {len(items)} satın alma kaydı")
        else:
            logger.error("Batch gönderilirken hata oluştu")
    
    def run_continuous(self, interval_seconds=1):
       
        logger.info(f"Data generator başlatıldı. Her {interval_seconds} saniyede bir batch gönderilecek.")
        logger.info(f"API URL: {self.api_base_url}")
        
        try:
            while True:
                self.generate_and_send_batch()
                time.sleep(interval_seconds)
        except KeyboardInterrupt:
            logger.info("Data generator durduruldu.")
        except Exception as e:
            logger.error(f"Beklenmeyen hata: {e}")

def main():
   
    import argparse
    
    parser = argparse.ArgumentParser(description='E-commerce Analytics Data Generator')
    parser.add_argument('--api-url', default='http://localhost:8000', 
                       help='API base URL (default: http://localhost:8000)')
    parser.add_argument('--interval', type=int, default=1, 
                       help='Veri gönderme aralığı (saniye, default: 1)')
    parser.add_argument('--single-batch', action='store_true',
                       help='Tek bir batch gönder ve çık')
    
    args = parser.parse_args()
    
    generator = DataGenerator(args.api_url)
    
    if args.single_batch:
        logger.info("Tek batch gönderiliyor...")
        generator.generate_and_send_batch()
    else:
        generator.run_continuous(args.interval)

if __name__ == "__main__":
    main() 