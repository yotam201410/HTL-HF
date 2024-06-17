import uvicorn
from fastapi import FastAPI, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import PlainTextResponse

from bionic_eye.backend.controllers.video_controller import video_router
from bionic_eye.backend.logger import logger
from bionic_eye.backend.middlewares.log_middleware import log_middleware
from bionic_eye.backend.profiler.profile_middleware import profile_middleware

app = FastAPI(
    title="Bionic Eye API", docs_url="/docs")


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    log_dict = {'url': request.url, "method": request.method, 'status_code': exc.status_code, 'details': exc.detail}

    if 400 <= exc.status_code < 500:
        logger.warning(log_dict)
    elif 500 <= exc.status_code < 600:
        logger.critical(log_dict)

    return PlainTextResponse(str(exc.detail), status_code=exc.status_code)


app.add_middleware(BaseHTTPMiddleware, dispatch=log_middleware)
app.add_middleware(BaseHTTPMiddleware, dispatch=profile_middleware)

app.include_router(video_router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
