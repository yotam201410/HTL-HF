import uuid
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from bionic_eye.backend.models.frame import Frame
from bionic_eye.backend.models.metadata import Metadata
from bionic_eye.backend.models.video import Video


class VideoRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def createVideo(self, video: Video):
        self.session.add(video)
        await self.session.commit()

    async def getVideosPaths(self):
        return (await self.session.execute(select(Video.storage_path))).scalars().all()

    async def getVideoPath(self, video_id: uuid.UUID):
        return (await self.session.execute(select(Video.storage_path).where(Video.id == video_id))).scalars().one()

    async def getVideoFrames(self, video_id: uuid.UUID):
        return (await self.session.execute(
            select(Frame.storage_path).where(Video.id == video_id).join(Video,
                                                                        Video.id == Frame.video_id))).scalars().all()

    async def getFramesPathsWithThreat(self, video_id: uuid.UUID):
        return (await self.session.execute(
            select(Frame.storage_path).where(Video.id == video_id, Metadata.frame_tag == True).join(Video,
                                                                                                    Video.id == Frame.video_id).join(
                Metadata, Metadata.id == Frame.metadata_id))).scalars().all()

    async def getVideoFrame(self, video_id: uuid.UUID, frame_index: int):
        return (await self.session.execute(
            select(Frame.storage_path).where(Video.id == video_id, Frame.frame_index == frame_index).join(Video,
                                                                                                          Video.id == Frame.video_id))).scalars().one()
