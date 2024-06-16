import logging
import sys
from colorlog import ColoredFormatter

logger = logging.getLogger()

formatter = logging.Formatter(fmt="%(levelname)-8s | %(asctime)s - %(funcName)s - "
                                  "%(message)s")
colored_formatter = ColoredFormatter(
    fmt="%(log_color)s%(levelname)-8s%(reset)s | %(log_color)s%(asctime)s - %(funcName)s - "
        "%(message)s%(reset)s")

stream_handler = logging.StreamHandler()
file_handler = logging.FileHandler(filename="logs.log")

stream_handler.setFormatter(formatter)
file_handler.setFormatter(colored_formatter)

logger.handlers = [stream_handler, file_handler]

logger.level = logging.DEBUG
