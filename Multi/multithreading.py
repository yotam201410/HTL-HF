import os
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from typing import List

import pandas as pd
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()

DESTINATION_FILE_PATH = os.environ.get("DESTINATION_FILE")
BITCOIN_DATES_PATH = os.environ.get("BITCOIN_DATES")
GOOGLE_DATES_PATH = os.environ.get("GOOGLE_DATES")
AMAZON_DATES_PATH = os.environ.get("AMAZON_DATES")


def convert_to_datetime(date_string: str) -> datetime:
    return datetime.strptime(date_string, '%Y-%m-%d %H:%M:%S.%f')


def fetch_stock_data(stock: str, start_time: datetime, end_time: datetime):
    data = yf.Ticker(stock).history(start=start_time, end=end_time)
    open_price = data.iloc[0]['Open']
    close_price = data.iloc[0]['Close']
    change = ((close_price - open_price) / open_price) * 100

    return start_time, stock, change


def read_time_file(file_path: str) -> list[datetime]:
    with open(file_path, 'r') as times_file:
        return list(map(lambda x: convert_to_datetime(x[:-2]), times_file.readlines()))


def main():
    search_times = read_time_file(BITCOIN_DATES_PATH)
    with ThreadPoolExecutor(max_workers=50) as executor:
        results = list(executor.map(
            lambda search_time: fetch_stock_data('BTC-USD', search_time,
                                                 search_time + timedelta(hours=1)),
            search_times))
    df = pd.DataFrame(results, columns=['Hour', 'Stock', 'Percentage Change'])
    df.to_csv(DESTINATION_FILE_PATH, index=False)


if __name__ == '__main__':
    main()
