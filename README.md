# PipelinePrep 🚀

**PipelinePrep** is a full-stack web application designed to help engineers prepare for DevOps and SRE interviews. It provides a clean, interactive interface to explore real-world interview questions across multiple DevOps categories, submit new questions, and manage them through a secure Admin Portal.

---

## 🛠️ Technology Stack

The project is built using a modern, decoupled architecture:

*   **Frontend**: React (Vite) styled with clean modern CSS, featuring responsive layouts, topic-based filtering, interactive flashcard-like question cards, and admin dashboard views.
*   **Backend**: FastAPI (Python 3.10+) utilizing Pydantic for validation, SQLAlchemy as the ORM, and pytest/httpx for integration testing.
*   **Database**: PostgreSQL 15, pre-seeded with hand-picked interview questions.
*   **Containerization**: Docker & Docker Compose for seamless environment reproducibility.

---

## 🗂️ Project Structure

```text
pipeline-prep/
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── database.py     # Database connection & session setup
│   │   ├── main.py         # FastAPI endpoints and admin authentication
│   │   ├── models.py       # SQLAlchemy database models
│   │   └── schemas.py      # Pydantic validation schemas
│   ├── tests/              # Backend unit and integration tests
│   ├── Dockerfile          # Docker setup for FastAPI
│   └── requirements.txt    # Python dependencies
├── frontend/               # Vite + React application
│   ├── src/
│   │   ├── App.jsx         # Main UI logic and components
│   │   ├── App.css         # Styling for the application
│   │   └── main.jsx        # App entry point
│   ├── Dockerfile          # Docker setup using Nginx
│   └── package.json        # Frontend dependencies
├── docker-compose.yml      # Orchestrates Postgres, backend, and frontend
├── init.sql                # Initial schema definition and 27 pre-seeded questions
└── .env                    # Environment configuration (not committed)
```

---

## 📚 Seed Questions & Categories

Upon startup, the PostgreSQL database is populated with **27 curated interview questions** from 9 essential DevOps domains:

1.  **Networking**: Difference between TCP/UDP, three-way handshake, CIDR notation.
2.  **Linux Internals**: Hard vs soft links, inodes, process troubleshooting (`SIGKILL`/`SIGTERM`).
3.  **Kubernetes (K8s)**: Pods vs Deployments, Service discovery via labels, Kubelet role.
4.  **Terraform**: State files (`terraform.tfstate`), `plan` vs `apply`, provisioners vs providers.
5.  **CI/CD**: Continuous Delivery vs Deployment, secrets protection, Runner definitions.
6.  **AWS Cloud**: Regions vs Availability Zones, Public vs Private subnets, IAM policy evaluation.
7.  **Observability**: Three pillars (Metrics, Logs, Traces), Monitoring vs Observability, Prometheus pull model.
8.  **DevSecOps**: SAST vs DAST, Shift Left security principle, container vulnerability scanning.
9.  **Behavioral**: Outage handling, pipeline debugging disputes, task prioritization.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
*   [Docker](https://www.docker.com/products/docker-desktop/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Configuration

Create a `.env` file in the root directory and define the PostgreSQL database credentials using secure placeholder values:

```ini
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_postgres_database
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
```

*(Note: The FastAPI backend automatically reads these environment variables to establish database connections and handle admin authentications.)*

### Running the Application

To spin up all services (Database, Backend, Frontend) in Docker containers, run:

```bash
docker compose up --build
```

Once Docker Compose finishes downloading and building the containers, you can access the application through the following URLs:

*   **Frontend Web Interface**: [http://localhost:8081](http://localhost:8081)
*   **FastAPI Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **PostgreSQL Port**: `5432`

To shut down the application and preserve database volumes:

```bash
docker compose down
```

To clear database volumes and start fresh:

```bash
docker compose down -v
```

---

## 🔑 Admin Portal & Question Moderation

1.  **Submission Flow**: When a user submits a new question via the UI, it is saved in the database with `is_approved = false` so that it doesn't immediately show up in the public feed.
2.  **Admin Login**: Accessing the Admin panel requires credentials defined in `.env` file.
3.  **Authentication**: On login, FastAPI validates the credentials and returns a secure, random bearer token generated dynamically at server startup (`ADMIN_SESSION_TOKEN`).
4.  **Moderation**:
    *   **Approve**: Approving a question toggles `is_approved` to `true`, making it visible to all users.
    *   **Reject**: Rejecting a question deletes the entry from the database permanently.

---

## 🗺️ Roadmap & Future Enhancements

As the project evolves, the following integrations and practices will be implemented:
*   **Infrastructure as Code (IaC)**: Provision and manage cloud resources declaratively using **Terraform**.
*   **Cloud Deployment (AWS)**: Migrate the application from local Docker containers to **AWS** (utilizing services like ECS, RDS, and S3).
*   **CI/CD Pipeline**: Build automated build, test, and deployment pipelines using **GitHub Actions**.
*   **Observability & Monitoring**: Set up application monitoring, metrics, and logs collection using **Prometheus**, **Grafana**, or AWS CloudWatch.

