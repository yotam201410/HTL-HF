import uuid
from pathlib import Path
from typing import List

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


@video_router.get("/{video_id}/path", status_code=200)
async def get_video_path_handler(video_id: uuid.UUID, session: AsyncSession = Depends(get_db)) -> Path:
    video_service = VideoService(session)
    path = await video_service.getVideoPath(video_id)
    return path


@video_router.get("/paths", status_code=200)
async def get_videos_paths_handler(session: AsyncSession = Depends(get_db)) -> List[Path]:
    video_service = VideoService(session)
    paths = await video_service.getVideosPath()
    return paths


@video_router.get("/{video_id}/frames/paths", status_code=200)
async def get_frames_paths(video_id: uuid.UUID, session: AsyncSession = Depends(get_db)) -> List[Path]:
    video_service = VideoService(session)
    paths = await video_service.getVideoFramesPaths(video_id)
    return paths


@video_router.get("/{video_id}/frames/{frame_index}/paths", status_code=200)
async def get_frame_paths(video_id: uuid.UUID, frame_index: int, session: AsyncSession = Depends(get_db)) -> Path:
    video_service = VideoService(session)
    path = await video_service.getVideoFramePath(video_id, frame_index)
    return path
