FROM python:3.12-slim-bullseye

# Set the working directory
WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy application files except .venv
COPY . /app

# Create or update the virtual environment and install dependencies
RUN uv sync --frozen --no-cache --no-dev

# Ensure the virtual environment binaries are on the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Expose the application port
EXPOSE 8000

# Run the application
CMD ["fastapi", "run", "app/main.py", "--port", "8000"]
