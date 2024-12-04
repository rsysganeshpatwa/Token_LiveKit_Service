# LiveKit Flutter Video Conference Application

This repository contains a **Flutter-based video conference application** built with Livekit. The application enables real-time video calls with advanced features like customizable backgrounds and Optical Character Recognition (OCR) for document scanning.

## Features
- 📹Real-time video conferencing powered by LiveKit.
- 📄OCR integration for document capture and text extraction.

## Technologies
- **Frontend**: Flutter with the LiveKit Flutter SDK.
- **Backend**:  Node.js API for OCR and video conferencing features.

- **Deployment**: 
  - Frontend: Hosted on AWS S3 with CloudFront for distribution.
  - Backend: Deployed on AWS EC2 with Nginx for reverse proxy.
  **Using script to automates the deployment of a LiveKit-based video conferencing application on an Ubuntu server. It installs essential services like Docker, CoTURN, Redis, and Nginx, clones the project repository, and starts the application using Docker Compose.**

**Repo URL's**
FrontEnd Repo URL: https://github.com/rsysganeshpatwa/Client_Flutter_web_livekit
Backend  Repo URL:  https://github.com/rsysganeshpatwa/Token_LiveKit_Service

## Prerequisites

### 1. Install CoTURN
    CoTURN is a TURN server critical for WebRTC applications, enabling seamless peer-to-peer connectivity for users behind NATs or firewalls.
   - Update the system and install CoTURN:
    sudo apt update && sudo apt upgrade -y
    sudo apt install coturn -y
    - Configure CoTURN:
        sudo nano /etc/turnserver.conf
        - Add or update the following settings:
            external-ip=<aws public ip> # Use local public ip for internal communication
            listening-port=3478
            tls-listening-port=5349
            min-port=49152
            max-port=65535
            lt-cred-mech
            user=key1:108cc770f923cf669912dfed679c73c3
            realm=<aws public ip> # Use localhost for internal communication(local)
            fingerprint
            listening-ip=<aws public ip>  # Use 127.0.0.1 for internal communication
            verbose
            log-file=/var/log/turnserver.log  # Log location (optional)
            syslog
            no-rfc5780
            no-stun-backward-compatibility
            response-origin-only-with-rfc5780
#### 2. AWS Configuration
    sudo apt update
    sudo apt install awscli -y
    aws --version
    ----------------------------------------------------------------------
    aws configure 
    AWS Access Key ID [None] : 
    AWS Secret Access Key [None]: 
    Default region name [None]: eu-north-1
    Default output format [None]: json
    ----------------------------------------------------------------------
    aws sts get-caller-identity

### 3. Automated Dependency Installation:
1. Docker and Docker Compose: For container orchestration and multi-container management.
2. Redis: Used for caching and session management to enhance application performance.
3. Node.js API: Handles Optical Character Recognition (OCR) and video conferencing backend features.
4. Nginx: Acts as a reverse proxy to manage incoming HTTP requests efficiently.
5. Git Integration: Automatically clones the project repository from GitHub to ensure the latest code is fetched.
6. Seamless Deployment: Builds and starts the application containers using Docker Compose for streamlined deployment.
7. Logging: All script activities, including errors and updates, are logged to /var/log/user-data-log.log for easy debugging and monitoring.

## Requirements
1. A server running Ubuntu (local or AWS EC2 instance).
2. Sudo privileges for package installations and service management.
3. SSH access to the server for running the script.

## Setup Process
1. Install Dependencies
`The script installs the following:`
   - Docker: Containerizes and manages the application.
   - Docker Compose: Orchestrates multiple containers.
   - NodeJs: Install npm to andles Optical Character Recognition (OCR) and video conferencing.
   - Redis: Manages caching and session data.
   - Nginx: Acts as a reverse proxy for handling HTTP requests.

#### Deployment Steps
   1. SSH into the instance:
        ssh -i /path/to/key.pem ubuntu@<instance-ip>
    2. Create and run the script:
        nano deploy_livekit.sh
    3. Paste the script content into the file:
        # Redirect all output and errors to a log file
        LOG_FILE="/var/log/user-data-log.log"
        exec > >(tee -a $LOG_FILE) 2>&1

        echo "===== Script Started: $(date) ====="

        # Update packages and install Docker and dependencies
        echo "Updating packages..."
        sudo apt-get update -y

        echo "Installing Docker and dependencies..."
        sudo apt-get install -y docker.io docker-compose git

        # Enable and start Docker service
        echo "Enabling Docker service..."
        sudo systemctl enable docker
        echo "Starting Docker service..."
        sudo systemctl start docker

        # Clone the repository if not already cloned
        REPO_DIR="/home/ubuntu/my-livekit-project"
        if [ ! -d "$REPO_DIR" ]; then
        echo "Cloning repository into $REPO_DIR..."
        sudo git clone https://github.com/rsysganeshpatwa/Token_LiveKit_Service.git "$REPO_DIR"
        else
        echo "Repository already exists."
        fi

        # Navigate to the repository directory
        cd "$REPO_DIR" || { echo "Failed to navigate to $REPO_DIR"; exit 1; }

        # Run Docker Compose with build
        echo "Running Docker Compose with build..."
        sudo docker-compose up --build -d

        echo "===== Script Completed: $(date) ====="
    4. Only for local setup 
        i. need to change volumes section of app of docker-compose.yaml file
    	    /home/<username>/.aws:/root/.aws:ro # Ensure correct mounting of AWS credentials
        ii. need to change volumes section of nginx of docker-compose.yaml file
            - /home/dell/Desktop/s3-sync:/usr/src/app/public:ro # Serve static files
        iii. need to edit nginx.conf file
            location / {
                    root /usr/src/app/public;
                    index index.html;
                    # Prevent redirection cycle; serve index.html only if the requested file does not exist
                    try_files $uri /index.html;
                }
        iv. enter below command for setting front end application to your local system
            aws s3 sync s3://embedded-poc-rsys/ /home/dell/Desktop/s3-sync
            
    5. Make the script executable:
        chmod +x deploy_livekit.sh
    6. Run the script:
        sudo ./deploy_livekit.sh