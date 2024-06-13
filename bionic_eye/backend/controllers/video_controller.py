import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from bionic_eye.backend.db import get_db
from bionic_eye.backend.schemas.video import VideoInput
from bionic_eye.backend.services.video_service import VideoService

video_router = APIRouter(prefix="/videos")


@video_router.post("", status_code=201)
async def create_video_handler(video: VideoInput, session: AsyncSession = Depends(get_db)) -> uuid.UUID:
    video_service = VideoService(session)
    video = await video_service.addVideo(video.storage_path)
    await session.flush()
    return video.id
