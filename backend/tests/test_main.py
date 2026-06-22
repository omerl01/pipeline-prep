import pytest
from app import models

def test_submit_question(client):
    # 1. Test question submission (defaulting to pending/unapproved)
    payload = {
        "topic": "k8s",
        "question_text": "What is a Pod?",
        "answer_text": "A Pod is the smallest deployable unit in Kubernetes."
    }
    response = client.post("/questions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["topic"] == "k8s"
    assert data["question_text"] == "What is a Pod?"
    assert data["answer_text"] == "A Pod is the smallest deployable unit in Kubernetes."
    assert data["is_approved"] is False


def test_get_approved_questions(client, db_session):
    # 1. Get questions when none are approved (should return empty list)
    response = client.get("/questions")
    assert response.status_code == 200
    assert response.json() == []

    # 2. Add an approved question directly to the database
    approved_q = models.Question(
        topic="aws",
        question_text="What is S3?",
        answer_text="Simple Storage Service.",
        is_approved=True
    )
    db_session.add(approved_q)
    db_session.commit()

    # Add an unapproved question as well
    unapproved_q = models.Question(
        topic="aws",
        question_text="What is EC2?",
        answer_text="Elastic Compute Cloud.",
        is_approved=False
    )
    db_session.add(unapproved_q)
    db_session.commit()

    # 3. Fetch questions (should return only the approved one)
    response = client.get("/questions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["question_text"] == "What is S3?"
    assert data[0]["is_approved"] is True

    # 4. Fetch questions with topic filtering
    response = client.get("/questions?topic=aws")
    assert response.status_code == 200
    assert len(response.json()) == 1

    # Filter with non-matching topic
    response = client.get("/questions?topic=k8s")
    assert response.status_code == 200
    assert len(response.json()) == 0


def test_admin_login(client):
    # 1. Login with invalid credentials
    login_payload = {"username": "admin", "password": "wrong_password"}
    response = client.post("/admin/login", json=login_payload)
    assert response.status_code == 401
    assert "detail" in response.json()

    # 2. Login with valid credentials (mocked via env variables in client fixture)
    login_payload = {"username": "test_admin", "password": "test_password"}
    response = client.post("/admin/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert len(data["token"]) > 0


def test_admin_flow_approve_and_reject(client, db_session):
    # 1. Insert a pending question
    pending_q = models.Question(
        topic="linux",
        question_text="What is inode?",
        answer_text="Index node represents a filesystem object.",
        is_approved=False
    )
    db_session.add(pending_q)
    db_session.commit()
    q_id = pending_q.id

    # 2. Get token
    login_payload = {"username": "test_admin", "password": "test_password"}
    login_response = client.post("/admin/login", json=login_payload)
    token = login_response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 3. Access pending list without authorization header
    response = client.get("/admin/pending")
    assert response.status_code == 401

    # Access pending list with correct authorization header
    response = client.get("/admin/pending", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == q_id
    assert data[0]["question_text"] == "What is inode?"

    # 4. Approve the question
    response = client.put(f"/admin/questions/{q_id}/approve", headers=headers)
    assert response.status_code == 200
    assert response.json()["is_approved"] is True

    # Public route should return it now
    response = client.get("/questions")
    assert len(response.json()) == 1
    assert response.json()[0]["id"] == q_id

    # Pending list should be empty
    response = client.get("/admin/pending", headers=headers)
    assert len(response.json()) == 0

    # 5. Reject/Delete the question
    response = client.delete(f"/admin/questions/{q_id}/reject", headers=headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Question successfully rejected and deleted"

    # Public route should be empty again
    response = client.get("/questions")
    assert len(response.json()) == 0
