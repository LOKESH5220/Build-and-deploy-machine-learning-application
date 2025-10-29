FROM python:3.11-slim

# Install build deps only if needed for some packages
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential gcc libpq-dev \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only requirements first for better layer caching
COPY backend/requirements.txt /app/backend/requirements.txt

# Install python deps
RUN python -m pip install --upgrade pip setuptools wheel \
	&& pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend code
COPY backend/ /app/backend/

# Copy frontend (optional: served by a static server or behind reverse proxy)
COPY Frontend/ /app/frontend/

WORKDIR /app/backend

EXPOSE 5000

# Use non-root user (create and switch)
RUN useradd -m appuser || true
RUN chown -R appuser:appuser /app
USER appuser

# Use gunicorn in production; ensure the Flask app is importable as app:app
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app", "--workers", "2", "--threads", "2", "--timeout", "120"]
