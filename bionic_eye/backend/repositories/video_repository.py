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

    async def create_video(self, video: Video):
        self.session.add(video)
        await self.session.commit()

    async def get_videos_paths(self) -> List[str]:
        query = select(Video.storage_path)
        result = await self.session.execute(query)

        return result.scalars().all()

    async def get_video_path(self, video_id: uuid.UUID) -> str:
        query = select(Video.storage_path).where(Video.id == video_id)
        result = await self.session.execute(query)

        return result.scalars().one()

    async def get_video_frames(self, video_id: uuid.UUID) -> List[str]:
        query = (
            select(Frame.storage_path)
                .join(Video, Video.id == Frame.video_id)
                .where(Video.id == video_id)
        )
        result = await self.session.execute(query)

        return result.scalars().all()

    async def get_frames_paths_with_threat(self, video_id: uuid.UUID) -> List[str]:
        query = (
            select(Frame.storage_path)
                .join(Video, Video.id == Frame.video_id)
                .join(Metadata, Metadata.id == Frame.metadata_id)
                .where(Video.id == video_id, Metadata.tagged == True)
        )
        result = await self.session.execute(query)

        return result.scalars().all()

    async def get_video_frame(self, video_id: uuid.UUID, frame_index: int) -> str:
        query = (
            select(Frame.storage_path)
                .join(Video, Video.id == Frame.video_id)
                .where(Video.id == video_id, Frame.frame_index == frame_index)
        )
        result = await self.session.execute(query)

        return result.scalars().one()
