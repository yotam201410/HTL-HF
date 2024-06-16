import uvicorn
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware

from bionic_eye.backend.controllers.video_controller import video_router
from bionic_eye.backend.middlewares.log_middleware import log_middleware

app = FastAPI(
    title="Bionic Eye API", docs_url="/docs")
app.add_middleware(BaseHTTPMiddleware, dispatch=log_middleware)
app.include_router(video_router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)
