import logging
import sys
import coloredlogs

coloredlogs.install()  # install a handler on the root logger
logger = logging.getLogger()

formatter = logging.Formatter(fmt="%(levelname)-8s |%(asctime)s - %(funcName)s - %(message)s")
stream_handler = logging.StreamHandler(stream=sys.stdout)
file_handler = logging.FileHandler(filename="logs.log")

stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

logger.handlers = [stream_handler, file_handler]

logger.level = logging.DEBUG
