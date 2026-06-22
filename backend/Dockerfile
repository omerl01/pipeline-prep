FROM python:3.11-slim AS builder

WORKDIR /app

RUN python -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

FROM gcr.io/distroless/python3-debian12

WORKDIR /app

COPY --from=builder /app/venv /app/venv

COPY --from=builder /app /app

ENV PATH="/app/venv/bin:$PATH"
ENV PYTHONPATH="/app/venv/lib/python3.11/site-packages"

USER nonroot

EXPOSE 8000


CMD ["/app/venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]