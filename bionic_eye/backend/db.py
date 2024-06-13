from sqlalchemy import URL
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()

# engine object to connect to db
url = URL.create(drivername=os.environ.get("DB_TYPE"), username=os.environ.get("DB_USERNAME"),
                 password=os.environ.get("DB_PASSWORD"), host=os.environ.get("DB_IP"),
                 database=os.environ.get("DB_NAME"),
                 port=os.environ.get("DB_PORT"))
engine = create_async_engine(url, echo=True)

SessionLocal = sessionmaker(
    expire_on_commit=False,
    class_=AsyncSession,
    bind=engine,
)


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
