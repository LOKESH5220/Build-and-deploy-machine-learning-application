# Docker deployment (backend + frontend)

This repository includes a Dockerfile for the backend and a docker-compose.yml to build and run the service locally.

Prerequisites
- Docker and Docker Compose installed on your machine.

Build and run
1. From the project root run:

```bash
docker-compose up --build -d
```

2. The backend API will be available at http://localhost:5000
3. The frontend is copied into the container at `/app/frontend`. You can serve the frontend separately (recommended) or use any static server to serve files from the `Frontend` folder locally.

Stopping and cleaning:

```bash
docker-compose down --rmi local
```

Notes
- The Dockerfile runs the Flask app via gunicorn for production. If you need to run in debug mode, modify the `CMD` in `backend/Dockerfile`.
- If you need to include additional build-time system libraries for scikit-learn, add them to the Dockerfile `apt-get install` line.
