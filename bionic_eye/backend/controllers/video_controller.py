import os
import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, Response
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from bionic_eye.backend.db import get_db
from bionic_eye.backend.schemas.video import VideoInput
from bionic_eye.backend.services.video_service import VideoService

video_router = APIRouter(prefix="/videos")


@video_router.post("", status_code=201, responses={
    201: {"description": "Video created successfully"},
    400: {"description": "Invalid video format"},
    404: {"description": "Video file not found"}
})
async def create_video_handler(video: VideoInput, session: AsyncSession = Depends(get_db)) -> uuid.UUID:
    video_service = VideoService(session)
    video_obj = await video_service.add_video(video.storage_path)
    await session.flush()

    return video_obj.id


@video_router.get("/{video_id}/paths", status_code=200, responses={
    200: {"description": "Video path retrieved successfully"},
    404: {"description": "Video not found"}
})
async def get_video_path_handler(video_id: uuid.UUID, session: AsyncSession = Depends(get_db)) -> Path:
    video_service = VideoService(session)
    path = await video_service.get_video_path(video_id)

    return path


@video_router.get("/paths", status_code=200, responses={
    200: {"description": "All video paths retrieved successfully"}
})
async def get_videos_paths_handler(session: AsyncSession = Depends(get_db)) -> List[Path]:
    video_service = VideoService(session)
    paths = await video_service.get_videos_path()

    return paths


@video_router.get("/{video_id}/frames/paths", status_code=200, responses={
    200: {"description": "Video frames paths retrieved successfully"},
    404: {"description": "Video not found"}
})
async def get_frames_paths(video_id: uuid.UUID, session: AsyncSession = Depends(get_db)) -> List[Path]:
    video_service = VideoService(session)
    paths = await video_service.get_video_frames_path(video_id)

    return paths


@video_router.get("/{video_id}/frames/{frame_index}/paths", status_code=200, responses={
    200: {"description": "Video frame path retrieved successfully"},
    404: {"description": "Video or frame not found"}
})
async def get_frame_paths(video_id: uuid.UUID, frame_index: int, session: AsyncSession = Depends(get_db)) -> Path:
    video_service = VideoService(session)
    path = await video_service.get_video_frame_path(video_id, frame_index)

    return path


@video_router.get("/{video_id}", status_code=200, responses={
    200: {"description": "Video file retrieved successfully"},
    404: {"description": "Video not found"}
})
async def download_video_handler(video_id: uuid.UUID, session: AsyncSession = Depends(get_db)) -> FileResponse:
    video_service = VideoService(session)
    video_path = await video_service.get_video_path(video_id)

    return FileResponse(path=video_path, filename=os.path.basename(video_path), media_type='application/octet-stream')


@video_router.get("/{video_id}/frames/tagged", status_code=200, responses={
    200: {"description": "Tagged frames retrieved and zipped successfully"},
    404: {"description": "Video not found"}
})
async def download_tagged_frames(video_id: uuid.UUID, session: AsyncSession = Depends(get_db)):
    video_service = VideoService(session)
    zip_data = await video_service.get_tagged_frames_zip(video_id)
    headers = {"Content-Disposition": "attachment; filename=files.zip"}

    return Response(zip_data, headers=headers, media_type="application/zip")
