import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker

load_dotenv()

url = URL.create(drivername=os.environ.get("DB_TYPE"), username=os.environ.get("DB_USERNAME"),
                 password=os.environ.get("DB_PASSWORD"), host=os.environ.get("DB_IP"),
                 database=os.environ.get("DB_NAME"),
                 port=os.environ.get("DB_PORT"))
engine = create_engine(url, echo=True)

Session = sessionmaker(bind=engine)
session = Session()

