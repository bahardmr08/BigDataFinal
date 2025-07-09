from pydantic import BaseModel, Field, field_validator
from typing import List, Dict, Any
from datetime import datetime
from enum import Enum

class EventNameEnum(str, Enum):
    PAGE_VISITED = "PageVisited"
    ADDED_BASKET = "AddedBasket"
    CHECKED_PRODUCT_REVIEWS = "CheckedProductReviews"

class PaymentTypeEnum(str, Enum):
    CREDIT_CARD = "CreditCard"
    DEBIT_CARD = "DebitCard"
    PAYPAL = "PayPal"
    BANK_TRANSFER = "BankTransfer"
    CASH_ON_DELIVERY = "CashOnDelivery"

class SendEventModel(BaseModel):
    UserId: str
    SessionId: str
    EventName: EventNameEnum
    TimeStamp: datetime = Field(default_factory=datetime.now)
    Attributes: Dict[str, Any] = Field(default_factory=dict)

    @field_validator('Attributes')
    @classmethod
    def validate_attributes(cls, v):
        if 'ProductId' not in v:
            raise ValueError("Attributes içinde ProductId bulunmalıdır")
        if 'Price' not in v:
            raise ValueError("Attributes içinde Price bulunmalıdır")
        if 'Discount' not in v:
            raise ValueError("Attributes içinde Discount bulunmalıdır")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "UserId": "user123",
                "SessionId": "session456",
                "EventName": "PageVisited",
                "TimeStamp": "2024-01-15T10:30:00",
                "Attributes": {
                    "ProductId": "prod789",
                    "Price": 99.99,
                    "Discount": 10.0
                }
            }
        }
    }

class ProductModel(BaseModel):
    ProductId: str
    ItemCount: int = Field(gt=0)
    ItemPrice: float = Field(ge=0)
    ItemDiscount: float = Field(ge=0)

    model_config = {
        "json_schema_extra": {
            "example": {
                "ProductId": "prod789",
                "ItemCount": 2,
                "ItemPrice": 99.99,
                "ItemDiscount": 10.0
            }
        }
    }

class PurchasedItemModel(BaseModel):
    SessionId: str
    TimeStamp: datetime = Field(default_factory=datetime.now)
    UserId: str
    TotalPrice: float = Field(ge=0)
    OrderId: str
    Products: List[ProductModel] = Field(min_length=1)
    PaymentType: PaymentTypeEnum

    @field_validator('TotalPrice')
    @classmethod
    def validate_total_price(cls, v, info):
        products = info.data.get('Products')
        if products:
            calculated_total = sum(
                (prod.ItemPrice - prod.ItemDiscount) * prod.ItemCount
                for prod in products
            )
            if abs(v - calculated_total) > 0.01:
                raise ValueError(f"Toplam fiyat ({v}) ürünlerin toplamına ({calculated_total}) eşit değil")
        return v

    model_config = {
        "json_schema_extra": {
            "example": {
                "SessionId": "session456",
                "TimeStamp": "2024-01-15T10:30:00",
                "UserId": "user123",
                "TotalPrice": 179.98,
                "OrderId": "order789",
                "Products": [
                    {
                        "ProductId": "prod789",
                        "ItemCount": 2,
                        "ItemPrice": 99.99,
                        "ItemDiscount": 10.0
                    }
                ],
                "PaymentType": "CreditCard"
            }
        }
    }