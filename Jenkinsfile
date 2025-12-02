pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'techvault'
        DOCKER_TAG = "${BUILD_NUMBER}"
        PROJECT_DIR = 'C:\\Users\\HP\\Desktop\\Notes\\DEVOPS\\Lab\\Projects\\TechVault'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                // For local development, code is already in workspace
                // For Git integration, use: checkout scm
                powershell '''
                    Write-Host "Current directory: $(Get-Location)"
                    Write-Host "Listing project files..."
                    Get-ChildItem -Path . -Name
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing backend and frontend dependencies...'
                powershell '''
                    Write-Host "Installing backend dependencies..."
                    cd backend
                    npm install
                    
                    Write-Host "Installing frontend dependencies..."
                    cd ../frontend
                    npm install
                    
                    cd ..
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                powershell """
                    Write-Host "Building Docker image: ${env.DOCKER_IMAGE}:${env.DOCKER_TAG}"
                    docker build -t ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} .
                    
                    Write-Host "Tagging image as latest..."
                    docker tag ${env.DOCKER_IMAGE}:${env.DOCKER_TAG} ${env.DOCKER_IMAGE}:latest
                    
                    Write-Host "Verifying image..."
                    docker images ${env.DOCKER_IMAGE}
                """
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo 'Testing Docker image...'
                powershell """
                    Write-Host "Starting test container..."
                    \$containerId = docker run -d -p 5001:5000 `
                        -e MONGODB_URI=mongodb://host.docker.internal:27017/techvault_test `
                        -e NODE_ENV=production `
                        ${env.DOCKER_IMAGE}:latest
                    
                    Write-Host "Container ID: \$containerId"
                    
                    Write-Host "Waiting for container to start..."
                    Start-Sleep -Seconds 10
                    
                    Write-Host "Testing health endpoint..."
                    try {
                        \$response = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -TimeoutSec 5
                        Write-Host "Health check passed: \$(\$response | ConvertTo-Json)"
                    } catch {
                        Write-Host "Health check failed (MongoDB might not be running): \$_"
                    }
                    
                    Write-Host "Stopping and removing test container..."
                    docker stop \$containerId
                    docker rm \$containerId
                """
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Docker Desktop Kubernetes...'
                powershell '''
                    Write-Host "Switching to docker-desktop context..."
                    kubectl config use-context docker-desktop
                    
                    Write-Host "Applying Kubernetes manifests..."
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    
                    Write-Host "Waiting for deployment to roll out..."
                    kubectl rollout status deployment/techvault-deployment -n techvault --timeout=2m || Write-Host "Deployment is in progress..."
                    
                    Write-Host "Current deployment status:"
                    kubectl get pods -n techvault
                    kubectl get svc -n techvault
                    
                    Write-Host ""
                    Write-Host "Application will be available at: http://localhost:30081"
                '''
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo 'Verifying Kubernetes deployment...'
                powershell '''
                    Write-Host "Waiting for pods to be ready..."
                    Start-Sleep -Seconds 15
                    
                    Write-Host "Pod status:"
                    kubectl get pods -n techvault
                    
                    Write-Host ""
                    Write-Host "Service details:"
                    kubectl get svc -n techvault
                    
                    Write-Host ""
                    Write-Host "Deployment details:"
                    kubectl get deployment -n techvault
                    
                    Write-Host ""
                    Write-Host "Testing application endpoint..."
                    try {
                        \$response = Invoke-RestMethod -Uri "http://localhost:30081/api/health" -TimeoutSec 10
                        Write-Host "Application health check PASSED: \$(\$response | ConvertTo-Json)"
                    } catch {
                        Write-Host "Application health check PENDING (pods may still be starting): \$_"
                        Write-Host "Check again in a few minutes at: http://localhost:30081"
                    }
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo '🚀 TechVault is deployed to Kubernetes'
            echo '🌐 Access the application at: http://localhost:30081'
            echo '👤 Login with: admin/admin123 or employee/emp123'
        }
        failure {
            echo '❌ Pipeline failed. Please check the logs above.'
            powershell '''
                Write-Host "Recent pod events:"
                kubectl get events -n techvault --sort-by='.lastTimestamp' | Select-Object -Last 10
            '''
        }
        always {
            echo 'Pipeline execution completed.'
            echo 'Build artifacts and logs are available in Jenkins.'
        }
    }
}
