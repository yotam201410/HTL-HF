import pytest
from fastapi.testclient import TestClient

from bionic_eye.backend.main import app

# Create a TestClient instance
client = TestClient(app)


@pytest.fixture(scope="module")
def setup():
    print("Setting up tests...")  # Optional setup steps


def test_successful_video_upload():
    video_input = {"storage_path": "C:\\Users\\yotam\\Downloads\\TelAviv_15_06_34_12_06_00.mp4"}
    response = client.post("/videos", json=video_input)
    assert response.status_code == 201


def test_invalid_video_upload():
    video_input = {"storage_path": "C:\\Users\\yotam\\Downloads\\TelAviv_15_06_34_12_06_00.mp5"}
    response = client.post("/videos", json=video_input)
    assert response.status_code == 400


def test_video_doesnt_exist_video_upload():
    video_input = {"storage_path": "C:\\Users\\yotam\\Downloads\\TelAviv_15_06_34_12_06_001.mp4"}
    response = client.post("/videos", json=video_input)
    assert response.status_code == 404


def test_retrieve_all_video_paths():
    response = client.get("/videos/paths")
    assert response.status_code == 200


def test_retrieve_specific_video_path():
    video_id = "38ff5db3-f2df-4c67-af2f-03f2260a966d"  # Replace with an actual video ID from your setup
    response = client.get(f"/videos/{video_id}/path")
    assert response.status_code == 200


def test_retrieve_all_frame_paths_of_video():
    video_id = "38ff5db3-f2df-4c67-af2f-03f2260a966d"  # Replace with an actual video ID from your setup
    response = client.get(f"/videos/{video_id}/frames/paths")
    assert response.status_code == 200


def test_retrieve_specific_frame_path_of_video():
    video_id = "38ff5db3-f2df-4c67-af2f-03f2260a966d"  # Replace with an actual video ID from your setup
    frame_index = 1  # Replace with an actual frame index from your setup
    response = client.get(f"/videos/{video_id}/frames/{frame_index}/paths")
    assert response.status_code == 200


def test_download_video_from_os():
    video_id = "38ff5db3-f2df-4c67-af2f-03f2260a966d"  # Replace with an actual video ID from your setup
    response = client.get(f"/videos/{video_id}")
    assert response.status_code == 200


def test_download_all_threat_frames():
    video_id = "38ff5db3-f2df-4c67-af2f-03f2260a966d"  # Replace with an actual video ID from your setup
    response = client.get(f"/videos/{video_id}/frames/tagged")
    assert response.status_code == 200
