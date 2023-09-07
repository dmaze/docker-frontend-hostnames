FROM python:3.11
RUN adduser --system --no-create-home app
WORKDIR /app
COPY pyproject.toml ./
RUN pip install .
COPY app.py ./
USER app
EXPOSE 5000
CMD ["flask", "--app", "app", "run", "--host", "0.0.0.0"]
