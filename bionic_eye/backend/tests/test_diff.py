import uuid

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.future import select

from bionic_eye.backend.db import get_db
from bionic_eye.backend.main import app
from bionic_eye.backend.models.base import Base
from bionic_eye.backend.models.frame import Frame
from bionic_eye.backend.models.metadata import Metadata
from bionic_eye.backend.models.video import Video

DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(DATABASE_URL, echo=False)
TestingSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture(scope="module")
async def async_session() -> AsyncSession:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with TestingSessionLocal() as session:
        await setup_test_data(session)
        yield session


async def setup_test_data(session: AsyncSession):
    metadata = Metadata(id=uuid.uuid4(), tagged=True, fov=1.0, azimuth=0.0, elevation=0.0)
    session.add(metadata)
    await session.commit()

    video = Video(id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
                  observation_name="Test Observation",
                  frame_count=5,
                  storage_path="../resources/fake/path1.mp4")

    frames = [
        Frame(id=uuid.uuid4(), storage_path=f"../resources/fake/frame{i}.jpg", frame_index=i, video_id=video.id,
              metadata_id=metadata.id)
        for i in range(1, 6)
    ]

    session.add(video)
    session.add_all(frames)
    await session.commit()


@pytest_asyncio.fixture(scope="module")
async def client(async_session):
    def _get_test_db():
        yield async_session

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as client:
        yield client


@pytest.mark.asyncio
async def test_create_video(client, async_session: AsyncSession):
    video_input = {"storage_path": "test.mp4"}

    response = client.post("/videos", json=video_input)

    assert response.status_code == 201

    video_to_delete = await async_session.execute(
        select(Video).where(Video.id == uuid.UUID(response.json()))
    )
    video = video_to_delete.scalars().one_or_none()
    if video:
        await async_session.delete(video)
        await async_session.commit()


@pytest.mark.asyncio
async def test_create_video_not_found(client):
    video_input = {"storage_path": "test1.mp4"}

    response = client.post("/videos", json=video_input)

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_video_invalid_format(client):
    video_input = {"storage_path": "test1.mp5"}

    response = client.post("/videos", json=video_input)

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_get_videos_paths(client):
    response = client.get("/videos/paths")
    assert response.status_code == 200
    assert response.json() == ["..\\resources\\fake\\path1.mp4"]


@pytest.mark.asyncio
async def test_get_video_path(client):
    video_id = "00000000-0000-0000-0000-000000000001"
    response = client.get(f"/videos/{video_id}/paths")
    assert response.status_code == 200
    assert response.json() == "..\\resources\\fake\\path1.mp4"


@pytest.mark.asyncio
async def test_get_video_frames(client):
    video_id = "00000000-0000-0000-0000-000000000001"
    response = client.get(f"/videos/{video_id}/frames/paths")

    assert response.status_code == 200
    assert response.json() == [f"..\\resources\\fake\\frame{i}.jpg" for i in range(1, 6)]


@pytest.mark.asyncio
async def test_get_video_frame(client):
    video_id = "00000000-0000-0000-0000-000000000001"
    frame_index = 1
    response = client.get(f"/videos/{video_id}/frames/{frame_index}/paths")

    assert response.status_code == 200
    assert response.json() == f"..\\resources\\fake\\frame{frame_index}.jpg"


@pytest.mark.asyncio
async def test_download_video(client):
    video_id = "00000000-0000-0000-0000-000000000001"
    response = client.get(f"/videos/{video_id}")

    assert response.status_code == 200
    assert response.headers["content-disposition"] == 'attachment; filename="path1.mp4"'


@pytest.mark.asyncio
async def test_download_tagged_frames(client):
    video_id = "00000000-0000-0000-0000-000000000001"
    response = client.get(f"/videos/{video_id}/frames/tagged")

    assert response.status_code == 200
    assert response.headers["content-disposition"] == "attachment; filename=files.zip"
