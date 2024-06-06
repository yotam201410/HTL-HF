import os
import pandas as pd
import yfinance as yf

from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from typing import Tuple
from dotenv import load_dotenv

load_dotenv()

DESTINATION_FILE_PATH = os.environ.get("DESTINATION_FILE")
BITCOIN_DATES_PATH = os.environ.get("BITCOIN_DATES")
GOOGLE_DATES_PATH = os.environ.get("GOOGLE_DATES")
AMAZON_DATES_PATH = os.environ.get("AMAZON_DATES")


def convert_to_datetime(date_string: str) -> datetime:
    return datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S.%f')


def fetch_stock_data(stock: str, start_time: datetime, end_time: datetime) -> Tuple[datetime, str, float]:
    data = yf.Ticker(stock).history(start=start_time, end=end_time)
    open_price = data.iloc[0]['Open']
    close_price = data.iloc[0]['Close']
    change = ((close_price - open_price) / open_price) * 100

    return start_time, stock, change


def read_time_file(file_path: str) -> list[datetime]:
    with open(file_path, 'r') as times_file:
        return list(map(lambda x: convert_to_datetime(x[:-2]), times_file.readlines()))


def search_for_stock(stock: str, dates_path: str):
    search_times = read_time_file(dates_path)
    print(f"starting to fetch data of {stock}")

    with ThreadPoolExecutor(max_workers=50) as executor:
        results = list(executor.map(
            lambda search_time: fetch_stock_data(stock, search_time,
                                                 search_time + timedelta(hours=1)),
            search_times))

    print(f"finished fetching data of {stock}")

    return pd.DataFrame(results, columns=['Timestamp', 'Stock', 'Percentage Change'])


def main():
    search_for_stock("BTC-USD", BITCOIN_DATES_PATH).to_csv(DESTINATION_FILE_PATH, index=False)


if __name__ == '__main__':
    main()
