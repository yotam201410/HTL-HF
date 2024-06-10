from models.base import Base

from models.video import Video
from models.frame import Frame
from models.metadata import Metadata
from db import engine
import asyncio


async def create_db():
    """
    coroutine responsible for creating database tables
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose()


asyncio.run(create_db())
