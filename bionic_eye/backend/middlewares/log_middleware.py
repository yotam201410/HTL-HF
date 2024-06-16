from fastapi import Request

from bionic_eye.backend.logger import logger


async def log_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        log_dict = {'url': request.url, "method": request.method, 'status_code': response.status_code}

        if 400 <= response.status_code < 500:
            logger.warn(log_dict)
        elif 200 <= response.status_code < 300:
            logger.info(log_dict)
        elif 500 <= response.status_code < 600:
            logger.critical(log_dict)
        else:
            logger.warn(log_dict)

        return response

    except Exception as exception:
        logger.critical("something really bad happened " + str(exception))
