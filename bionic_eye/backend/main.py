import uvicorn
from fastapi import FastAPI

from bionic_eye.backend.controllers.video_controller import video_router

app = FastAPI(
    title="Noted API", description="This is a simple note taking service", docs_url="/")

app.router.include_router(video_router)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)