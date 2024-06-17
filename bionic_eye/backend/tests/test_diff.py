import uuid
from pathlib import Path
from unittest.mock import patch

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from bionic_eye.backend.db import get_db

# Create an in-memory SQLite database for testing
from bionic_eye.backend.main import app

DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(DATABASE_URL, echo=True)
TestingSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


@pytest_asyncio.fixture(scope="module")
async def async_session() -> AsyncSession:
    async with TestingSessionLocal() as session:
        yield session


@pytest_asyncio.fixture(scope="module")
async def client(async_session):
    def _get_test_db():
        yield async_session

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as client:
        yield client


class MockVideoRepository:
    async def createVideo(self, video):
        video.id = uuid.uuid4()
        return video

    async def getVideosPaths(self):
        return [Path("/resources/fake/path1.mp4"), Path("/resources/fake/path2.mp4")]

    async def getVideoPath(self, video_id: uuid.UUID):
        if video_id == uuid.UUID("00000000-0000-0000-0000-000000000001"):
            return Path("../resources/fake/path1.mp4")
        raise NoResultFound

    async def getVideoFrames(self, video_id: uuid.UUID):
        if video_id == uuid.UUID("00000000-0000-0000-0000-000000000001"):
            return [Path(f"/resources/fake/frame{i}.png") for i in range(1, 6)]
        return []

    async def getVideoFrame(self, video_id: uuid.UUID, frame_index: int):
        if video_id == uuid.UUID("00000000-0000-0000-0000-000000000001"):
            return Path(f"/resources/fake/frame{frame_index}.png")
        raise NoResultFound

    async def getFramesPathsWithThreat(self, video_id: uuid.UUID):
        if video_id == uuid.UUID("00000000-0000-0000-0000-000000000001"):
            return [Path(f"../resources/fake/frame{i}.jpg") for i in range(1, 6)]
        return []


@pytest.mark.asyncio
async def test_create_video(client):
    video_input = {"storage_path": "test.mp4"}

    response = client.post("/videos", json=video_input)

    assert response.status_code == 201


@pytest.mark.asyncio
async def test_get_video_path(client):
    video_id = "00000000-0000-0000-0000-000000000001"

    with patch("bionic_eye.backend.services.video_service.VideoRepository", return_value=MockVideoRepository()):
        response = client.get(f"/videos/{video_id}/path")

    assert response.status_code == 200
    assert response.json() == "..\\resources\\fake\\path1.mp4"


@pytest.mark.asyncio
async def test_get_videos_paths(client):
    with patch("bionic_eye.backend.services.video_service.VideoRepository", return_value=MockVideoRepository()):
        response = client.get("/videos/paths")

    assert response.status_code == 200
    assert response.json() == ["\\resources\\fake\\path1.mp4", "\\resources\\fake\\path2.mp4"]


@pytest.mark.asyncio
async def test_get_video_frames_paths(client):
    video_id = "00000000-0000-0000-0000-000000000001"

    with patch("bionic_eye.backend.services.video_service.VideoRepository", return_value=MockVideoRepository()):
        response = client.get(f"videos/{video_id}/frames/paths")

    assert response.status_code == 200
    assert response.json() == [f"\\resources\\fake\\frame{i}.png" for i in range(1, 6)]


@pytest.mark.asyncio
async def test_get_video_frame_path(client):
    video_id = "00000000-0000-0000-0000-000000000001"
    frame_index = 2

    with patch("bionic_eye.backend.services.video_service.VideoRepository", return_value=MockVideoRepository()):
        response = client.get(f"/videos/{video_id}/frames/{frame_index}/paths")

    assert response.status_code == 200
    assert response.json() == "\\resources\\fake\\frame2.png"


@pytest.mark.asyncio
async def test_download_video(client):
    video_id = "00000000-0000-0000-0000-000000000001"

    with patch("bionic_eye.backend.services.video_service.VideoRepository", return_value=MockVideoRepository()):
        response = client.get(f"/videos/{video_id}")

    assert response.status_code == 200
    assert response.headers["content-disposition"] == 'attachment; filename="path1.mp4"'


@pytest.mark.asyncio
async def test_download_tagged_frames(client):
    video_id = "00000000-0000-0000-0000-000000000001"

    with patch("bionic_eye.backend.services.video_service.VideoRepository", return_value=MockVideoRepository()):
        response = client.get(f"/videos/{video_id}/frames/tagged")

    assert response.status_code == 200
    assert response.headers["content-disposition"] == "attachment; filename=files.zip"
