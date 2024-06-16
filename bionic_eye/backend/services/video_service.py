import io
import os
import uuid
import zipfile
from pathlib import Path
from typing import List
from fastapi import HTTPException

from cv2 import Mat
from numpy import ndarray
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession
import concurrent.futures

from bionic_eye.backend.logger import logger
from bionic_eye.backend.models.frame import Frame
from bionic_eye.backend.models.metadata import Metadata
from bionic_eye.backend.models.video import Video
from bionic_eye.backend.repositories.video_repository import VideoRepository
import base64
import cv2
from io import BytesIO
import numpy as np
from PIL import Image
import random

BASE_PATH = Path('resources')


def is_frame_tagged(frame: Mat | ndarray):
    """
    Check if frame is tagged.

    :param frame: The frame to check
    :return: True if the frame is tagged, False otherwise
    """

    skull_image_base64 = b'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'
    skull_image = np.array(Image.open(BytesIO(base64.b64decode(skull_image_base64))))

    confidence = 0.666
    skull_image = skull_image[::2, ::2]
    frame = frame[::2, ::2]

    result = cv2.matchTemplate(frame, skull_image, cv2.TM_CCOEFF_NORMED)
    match_indices = np.arange(result.size)[(result > confidence).flatten()]
    matches = np.unravel_index(match_indices[:10000], result.shape)

    return len(matches[0]) != 0


def generate_metadata(frame):
    """
    Generates metadata for a given frame.

    :param frame: The frame to process.
    :return: tuple of (fov, azimuth, elevation).
    """

    fov = random.choice([8.954, 74.654, 24.65])
    azimuth = random.choice([-22.58, 36.54, 1.45])
    elevation = random.choice([11.862, 69.42, 78.4])

    return fov, azimuth, elevation


def saveFramesAndTag(video_path: str, frames_path: str) -> List[Frame]:
    vidcap = cv2.VideoCapture(video_path)
    success, frame = vidcap.read()
    count = 1
    frames = []

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        while success:
            futures.append(executor.submit(save_frame_and_metadata, frame, count, frames_path))
            success, frame = vidcap.read()
            count += 1

        for future in concurrent.futures.as_completed(futures):
            frames.append(future.result())
    logger.debug(f"saved {len(frames)} frames")

    return frames


def save_frame_and_metadata(frame, count, frames_path):
    frame_path = os.path.join(frames_path, f"frame{count}.jpg")
    cv2.imwrite(frame_path, frame)  # Save frame as JPEG file

    fov, azimuth, elevation = generate_metadata(frame)
    tagged = is_frame_tagged(frame)
    metadata = Metadata(fov=fov, azimuth=azimuth, elevation=elevation, tagged=tagged)
    frame_obj = Frame(storage_path=frame_path, frame_index=count, metadata_=metadata)

    return frame_obj


class VideoService:
    def __init__(self, session: AsyncSession):
        self.repository = VideoRepository(session)

    async def addVideo(self, path: str):
        if not path.endswith(".mp4"):
            raise HTTPException(status_code=400, detail=f"{path} is not mp4")
        elif not os.path.exists(path):
            raise HTTPException(status_code=404, detail=f"{path} doesn't exist")

        filename = os.path.basename(path)
        observation_name = filename[:filename.find('_')]
        os.mkdir(BASE_PATH / observation_name)
        frames = saveFramesAndTag(path, str((BASE_PATH / observation_name)))
        video = Video(frames=frames, observation_name=observation_name, storage_path=path, frame_count=len(frames))
        await self.repository.createVideo(video)
        return video

    async def getVideosPath(self):
        paths = await self.repository.getVideosPaths()

        logger.debug(f"fetched {len(paths)} video paths")

        return paths

    async def getVideoPath(self, video_id: uuid.UUID):
        try:
            path = await self.repository.getVideoPath(video_id)
            logger.debug(f"fetched video: {video_id} path {path}")

            return path
        except NoResultFound:
            raise HTTPException(status_code=404, detail=f"video with id: {video_id} not found")

    async def getVideoFramesPaths(self, video_id: uuid.UUID):
        frames = await self.repository.getVideoFrames(video_id)
        logger.debug(f"fetched {len(frames)} of video: {video_id}")

        if len(frames) == 0:
            raise HTTPException(status_code=404,
                                detail=f"video with id: {video_id} not found")

        return frames

    async def getVideoFramePath(self, video_id: uuid.UUID, frame_index: int):
        try:
            frame = await self.repository.getVideoFrame(video_id, frame_index)
            logger.info(f"fetched frame number: {frame_index} of video: {video_id}")

            return frame
        except NoResultFound:
            raise HTTPException(status_code=404,
                                detail=f"video with id: {video_id} not found or frame with index: {frame_index} not "
                                       f"found")

    async def getTaggedFramesFiles(self, video_id: uuid.UUID):
        paths = await self.repository.getFramesPathsWithThreat(video_id)
        logger.debug(f"fetched {len(paths)} frames with target of video: {video_id}")
        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for path in paths:
                zip_file.write(path, arcname=os.path.basename(path))  # Use os.path.basename to remove directories

        zip_buffer.seek(0)

        return zip_buffer.getvalue()
