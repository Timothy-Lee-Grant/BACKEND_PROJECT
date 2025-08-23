#!/bin/bash

# Define microservice start commands
services=(
  "cd registry && ./mvnw spring-boot:run"
  "cd producer_resource && ./mvnw spring-boot:run"
  "cd consumer_resource && ./mvnw spring-boot:run"
  "cd frontend-service && node app.js"
)

echo "Starting microservices..."

for cmd in "${services[@]}"; do
  osascript <<EOF
tell application "Terminal"
  do script "$cmd"
end tell
EOF
done

echo "All services launched."
