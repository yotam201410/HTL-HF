import logging
import sys

logger = logging.getLogger()

formatter = logging.Formatter(fmt="%(levelname)s:   %(asctime)s - %(funcName)s - %(message)s")

stream_handler = logging.StreamHandler(stream=sys.stdout)
file_handler = logging.FileHandler(filename="logs.log")

stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.handlers = [stream_handler, file_handler]

logger.level = logging.DEBUG
