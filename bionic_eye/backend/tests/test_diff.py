import uuid
import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from bionic_eye.backend.main import app
from bionic_eye.backend.models.base import Base
from bionic_eye.backend.schemas.video import VideoInput
from bionic_eye.backend.services.video_service import VideoService

DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="module")
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture(scope="function")
async def session(setup_database):
    async with AsyncSessionLocal() as session:
        yield session


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


@pytest.fixture
def fake_video_data():
    return {
        "id": uuid.uuid4(),
        "storage_path": "test.mp4"
    }


@pytest.fixture
def fake_frames_data():
    return [Path(f"frames/frame_{i}.jpg") for i in range(5)]


@pytest.mark.asyncio
async def test_create_video(client, session, fake_video_data):
    video_input = VideoInput(storage_path=fake_video_data["storage_path"])
    response = client.post("/videos/", json=video_input.dict())
    assert response.status_code == 201


@pytest.mark.asyncio
async def test_get_video_path(client, session, fake_video_data):
    video_service = VideoService(session)
    await video_service.addVideo(fake_video_data["storage_path"])

    response = client.get(f"/videos/{fake_video_data['id']}/path")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data == fake_video_data["storage_path"]


@pytest.mark.asyncio
async def test_get_videos_paths(client, session, fake_video_data):
    video_service = VideoService(session)
    await video_service.addVideo(fake_video_data["storage_path"])

    response = client.get("/videos/paths")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) > 0


@pytest.mark.asyncio
async def test_get_frames_paths(client, session, fake_video_data, fake_frames_data):
    video_service = VideoService(session)
    await video_service.addVideo(fake_video_data["storage_path"])

    response = client.get(f"/videos/{fake_video_data['id']}/frames/paths")
    assert response.status_code == 200
    response_data = response.json()
    assert len(response_data) == len(fake_frames_data)


@pytest.mark.asyncio
async def test_get_frame_paths(client, session, fake_video_data, fake_frames_data):
    video_service = VideoService(session)
    await video_service.addVideo(fake_video_data["storage_path"])

    frame_index = 0
    response = client.get(f"/videos/{fake_video_data['id']}/frames/{frame_index}/paths")
    assert response.status_code == 200
    response_data = response.json()
    assert response_data == str(fake_frames_data[frame_index])


@pytest.mark.asyncio
async def test_download_video(client, session, fake_video_data):
    video_service = VideoService(session)
    await video_service.addVideo(fake_video_data["storage_path"])

    response = client.get(f"/videos/{fake_video_data['id']}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/octet-stream"


@pytest.mark.asyncio
async def test_download_tagged_frames(client, session, fake_video_data):
    video_service = VideoService(session)
    await video_service.addVideo(fake_video_data["storage_path"])

    response = client.get(f"/videos/{fake_video_data['id']}/frames/tagged")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/zip"
