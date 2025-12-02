# TechVault - Quick Deployment Commands

## 🚀 Quick Start - Docker

```powershell
# 1. Build image
docker build -t techvault:latest .

# 2. Run container (make sure MongoDB is running)
docker run -d -p 5000:5000 `
  -e MONGODB_URI=mongodb://host.docker.internal:27017/techvault `
  -e NODE_ENV=production `
  --name techvault-app `
  techvault:latest

# 3. Check status
docker ps

# 4. View logs
docker logs -f techvault-app

# 5. Test
curl http://localhost:5000/api/health
```

## ☸️ Quick Start - Kubernetes

```powershell
# 0. FIRST: Start Kubernetes in Docker Desktop!
# Docker Desktop → Settings → Kubernetes → Enable Kubernetes

# 1. Verify cluster is running
kubectl cluster-info
kubectl get nodes

# 2. Deploy all resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# 3. Wait for pods to be ready (may take 1-2 minutes)
kubectl get pods -n techvault -w

# 4. Check all resources
kubectl get all -n techvault

# 5. Access application
# Open browser: http://localhost:30080
```

## 🔍 Common Issues & Fixes

### If Kubernetes won't connect:
```powershell
# Make sure Docker Desktop is running
# Enable Kubernetes: Docker Desktop → Settings → Kubernetes → Enable
# Wait for "Kubernetes is running" status
```

### If pods won't start:
```powershell
# Check pod status
kubectl describe pod -n techvault <pod-name>

# View logs
kubectl logs -n techvault <pod-name>

# Common fix: Delete and recreate
kubectl delete -f k8s/deployment.yaml
kubectl apply -f k8s/deployment.yaml
```

### If image not found:
```powershell
# Make sure image is built locally
docker images | findstr techvault

# If missing, build it:
docker build -t techvault:latest .
```

## 📊 Verify Everything Works

```powershell
# Docker verification
docker ps                                    # Container running
docker logs techvault-app                    # No errors
curl http://localhost:5000/api/health        # Returns OK

# Kubernetes verification  
kubectl get pods -n techvault                # All running
kubectl get svc -n techvault                 # Services created
curl http://localhost:30080/api/health       # Returns OK
```

## 🧹 Cleanup Commands

```powershell
# Stop Docker container
docker stop techvault-app
docker rm techvault-app

# Delete Kubernetes resources
kubectl delete namespace techvault

# Remove Docker image (optional)
docker rmi techvault:latest
```

## 📸 Screenshots Needed for Report

1. `docker build -t techvault:latest .` (success output)
2. `docker images` (showing techvault image)
3. `docker ps` (container running)
4. `kubectl get all -n techvault` (all resources)
5. `kubectl get pods -n techvault` (pods running)
6. Browser at http://localhost:30080 (app working)
7. Analytics dashboard with charts
8. Asset with QR code displayed
