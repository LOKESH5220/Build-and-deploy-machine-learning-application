# Heart Disease Prediction — README

This repository contains a small Flask backend and a static frontend for a heart disease prediction demo.
This README explains how to run the project locally (development) and with Docker (recommended for parity).

Contents
- `backend/` — Flask app and model file (`app.py`, `model.py`, `heart_svm_pca_model.pkl`, `requirements.txt`).
- `Frontend/` — static site (`index.html`, `script.js`, `style.css`).
- `docker-compose.yml` — Docker Compose configuration to build and run the backend container.
- `backend/Dockerfile` — Dockerfile used by compose to build the backend image.

Requirements
- Windows with PowerShell (instructions use PowerShell). The project also works on macOS/Linux with the equivalent shell commands.
- Python 3.11 (venv is included in `backend/.venv` for the project here).
- Docker Desktop (if using Docker). Docker Compose is used via the `docker-compose.yml` file.

Quick notes
- The backend listens on port 5000. The backend serves the frontend static files at `/` and `/static/<file>` when running in container or when you run the Flask app directly.
- Use `http://127.0.0.1:5000` or `http://localhost:5000` in your browser. Avoid `0.0.0.0` in the browser (some browsers treat it as invalid).

Run locally (development)
1. Open PowerShell and change to the backend folder:

```powershell
Set-Location -LiteralPath 'C:\Users\yashk\Downloads\heart Diesease Prediction\heart Diesease Prediction\backend'
# (Optional) Activate the included venv
. .\.venv\Scripts\Activate.ps1
```

2. Install dependencies (only needed if requirements changed):

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

3. Start the backend (dev Flask server) — binds to 0.0.0.0:5000:

```powershell
.\.venv\Scripts\python.exe app.py
```

4. Open the UI in your browser:

- Backend-served UI (recommended): http://127.0.0.1:5000
- Alternatively, you can serve static frontend files locally (not required if using backend):

```powershell
Set-Location -LiteralPath 'C:\Users\yashk\Downloads\heart Diesease Prediction\heart Diesease Prediction\Frontend'
..\backend\.venv\Scripts\python.exe -m http.server 8000
# Then open http://127.0.0.1:8000
```

5. Test the predict endpoint from PowerShell:

```powershell
$body = @{age=63;sex=1;cp=3;trestbps=145;chol=233;fbs=1;restecg=0;thalach=150;exang=0;oldpeak=2.3;slope=0;ca=0;thal=1} | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:5000/predict' -Method Post -Body $body -ContentType 'application/json' | ConvertTo-Json
```

Docker (recommended)
1. From the project root (where `docker-compose.yml` is located):

```powershell
Set-Location -LiteralPath 'C:\Users\yashk\Downloads\heart Diesease Prediction\heart Diesease Prediction'
docker-compose up --build -d
```

2. Verify the container is running and view logs:

```powershell
docker ps --filter name=heart-predict-backend
docker logs --tail 200 heart-predict-backend
```

3. Open the UI in your browser (served by the backend):

```text
http://127.0.0.1:5000
```

4. Stop and clean up when finished:

```powershell
docker-compose down --rmi local
```

Cleaning and pruning (optional, use with care)
- To remove the image created by Docker Compose explicitly:

```powershell
docker image rm heart-predict-backend:latest
```

- To prune unused images, containers, networks and volumes (this affects your Docker host globally):

```powershell
docker system prune -a --volumes -f
```

Notes and troubleshooting
- If you get `docker` errors like "cannot find the pipe dockerDesktopLinuxEngine" or the Docker daemon is not available, start Docker Desktop and wait for it to report "Docker is running" in the system tray, then retry the compose commands.
- If the backend fails to start due to missing Python packages, ensure you installed the packages into the venv used to run `app.py`.
- If you change the model and want to retrain, run `model.py`:

```powershell
Set-Location -LiteralPath 'C:\Users\yashk\Downloads\heart Diesease Prediction\heart Diesease Prediction\backend'
.\.venv\Scripts\python.exe model.py
```

Project structure (top-level)

```
backend/
  app.py
  model.py
  heart_svm_pca_model.pkl
  requirements.txt
Frontend/
  index.html
  script.js
  style.css
docker-compose.yml
README.md
```

Questions or next steps
- I can add a `/health` endpoint and a Docker HEALTHCHECK for better orchestration.
- I can also add an `nginx` service in `docker-compose.yml` to serve the frontend in production.

If you'd like, I can commit a short `README.md` update with additional details (for example, how to change the backend port via an environment variable). Tell me which extras you want and I'll add them.
