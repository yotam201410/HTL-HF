import uvicorn
from fastapi import FastAPI

from bionic_eye.backend.controllers.video_controller import video_router
from bionic_eye.backend.middelwares.error_middleware import ErrorLoggingMiddleware
app = FastAPI(
    title="Bionic Eye API", docs_url="/docs")

app.router.include_router(video_router)
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)