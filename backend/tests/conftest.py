import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.main import app

# Use SQLite in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    # Create database tables for the test session
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session, monkeypatch):
    # Override get_db dependency to use the test database session
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    
    # Safely mock admin credentials using test environment variables
    monkeypatch.setenv("ADMIN_USER", "test_admin")
    monkeypatch.setenv("ADMIN_PASS", "test_password")
    
    # Reload the ADMIN_SESSION_TOKEN or keep using standard auth since verify_admin_token check is token-based
    with TestClient(app) as test_client:
        yield test_client
        
    app.dependency_overrides.clear()
