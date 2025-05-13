# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install Git and other necessary tools
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Clone the repository containing the necessary files
RUN git clone https://github.com/Cleisatech/Gcash.git /app

# Set correct permissions for the app directory
RUN chmod -R 777 /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Expose the port the app runs on
EXPOSE 7860

# Define environment variable for Flask
ENV FLASK_APP=backend/app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=7860

# Ensure templates and static folders are in the correct location
RUN mkdir -p /app/backend/templates /app/backend/static

# Run the application
CMD ["flask", "run"]
