# TechVault - Docker & Kubernetes Deployment Report

## 📋 Executive Summary

This document provides step-by-step instructions and verification steps for deploying TechVault using Docker and Kubernetes.

---

## 🐳 Docker Deployment

### Prerequisites
- Docker Desktop installed and running
- Docker version 20.10+ recommended

### Step 1: Verify Docker Installation

```powershell
docker --version
docker ps
```

**Expected Output:**
```
Docker version 24.0.x, build xxxxx
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```

### Step 2: Build Docker Image

```powershell
# Navigate to project directory
cd C:\Users\HP\Desktop\Notes\DEVOPS\Lab\Projects\TechVault

# Build the image
docker build -t techvault:latest .
```

**Build Process:**
- Stage 1: Builds React frontend (production build)
- Stage 2: Copies frontend build to backend, installs dependencies
- Final image: ~500MB (optimized multi-stage build)

### Step 3: Verify Image Creation

```powershell
docker images | findstr techvault
```

**Expected Output:**
```
techvault    latest    abc123def456    2 minutes ago    485MB
```

### Step 4: Run Container Locally

```powershell
# Run with local MongoDB
docker run -d -p 5000:5000 `
  -e MONGODB_URI=mongodb://host.docker.internal:27017/techvault `
  -e NODE_ENV=production `
  --name techvault-app `
  techvault:latest
```

### Step 5: Verify Container is Running

```powershell
docker ps
```

**Expected Output:**
```
CONTAINER ID   IMAGE              COMMAND           STATUS         PORTS
abc123def456   techvault:latest   "node server.js"  Up 10 seconds  0.0.0.0:5000->5000/tcp
```

### Step 6: Test Application

```powershell
# Test health endpoint
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "TechVault API is running",
  "timestamp": "2025-12-02T..."
}
```

### Step 7: View Container Logs

```powershell
docker logs techvault-app
```

**Expected Logs:**
```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
📊 Environment: production
```

### Docker Commands Reference

```powershell
# Stop container
docker stop techvault-app

# Start container
docker start techvault-app

# Remove container
docker rm -f techvault-app

# View logs
docker logs -f techvault-app

# Execute command in container
docker exec -it techvault-app sh
```

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Docker Desktop with Kubernetes enabled
- kubectl installed and configured

### Step 1: Start Kubernetes Cluster

**For Docker Desktop:**
1. Open Docker Desktop
2. Settings → Kubernetes
3. Enable Kubernetes → Apply & Restart
4. Wait for "Kubernetes is running" status

**For Minikube:**
```powershell
minikube start
```

### Step 2: Verify Kubernetes is Running

```powershell
kubectl version
kubectl cluster-info
kubectl get nodes
```

**Expected Output:**
```
Client Version: v1.34.1
Server Version: v1.28.2
Kubernetes control plane is running at https://...

NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   10d   v1.28.2
```

### Step 3: Create Namespace

```powershell
kubectl apply -f k8s/namespace.yaml
```

**Verify:**
```powershell
kubectl get namespaces | findstr techvault
```

**Expected Output:**
```
techvault   Active   10s
```

### Step 4: Deploy MongoDB

```powershell
kubectl apply -f k8s/deployment.yaml
```

This creates:
- MongoDB deployment (1 replica)
- MongoDB service (ClusterIP)
- TechVault app deployment (1 replica)

### Step 5: Verify Deployments

```powershell
kubectl get deployments -n techvault
```

**Expected Output:**
```
NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
mongo-deployment       1/1     1            1           30s
techvault-deployment   1/1     1            1           30s
```

### Step 6: Check Pods Status

```powershell
kubectl get pods -n techvault
```

**Expected Output:**
```
NAME                                    READY   STATUS    RESTARTS   AGE
mongo-deployment-xxxxx                  1/1     Running   0          1m
techvault-deployment-xxxxx              1/1     Running   0          1m
```

**If pods are not ready, check logs:**
```powershell
kubectl logs -n techvault deployment/techvault-deployment
```

### Step 7: Create Service

```powershell
kubectl apply -f k8s/service.yaml
```

**Verify:**
```powershell
kubectl get services -n techvault
```

**Expected Output:**
```
NAME                 TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
techvault-service    NodePort   10.96.xxx.xxx   <none>        5000:30080/TCP   20s
mongo-service        ClusterIP  10.96.xxx.xxx   <none>        27017/TCP        1m
```

### Step 8: Access Application

**For Docker Desktop Kubernetes:**
```
http://localhost:30080
```

**For Minikube:**
```powershell
minikube service techvault-service -n techvault
```

### Step 9: Verify Application is Working

```powershell
# Test health endpoint
curl http://localhost:30080/api/health

# Get all resources in namespace
kubectl get all -n techvault
```

### Kubernetes Commands Reference

```powershell
# View all resources
kubectl get all -n techvault

# Describe a pod
kubectl describe pod <pod-name> -n techvault

# View pod logs
kubectl logs -f <pod-name> -n techvault

# Execute command in pod
kubectl exec -it <pod-name> -n techvault -- sh

# Scale deployment
kubectl scale deployment techvault-deployment --replicas=3 -n techvault

# Delete all resources
kubectl delete namespace techvault

# Restart deployment
kubectl rollout restart deployment/techvault-deployment -n techvault
```

---

## 🔍 Troubleshooting Guide

### Issue: Kubernetes Connection Error

**Error:**
```
Unable to connect to the server: dial tcp 127.0.0.1:49830: connectex
```

**Solution:**
1. Check Docker Desktop is running
2. Enable Kubernetes in Docker Desktop settings
3. Wait for "Kubernetes is running" indicator
4. Restart Docker Desktop if needed

### Issue: Image Pull Error

**Error:**
```
ErrImagePull or ImagePullBackOff
```

**Solution:**
```powershell
# For Docker Desktop, load the image
docker build -t techvault:latest .

# Update deployment to use local image
# In k8s/deployment.yaml, set imagePullPolicy: IfNotPresent
```

### Issue: Pods in CrashLoopBackOff

**Solution:**
```powershell
# Check logs
kubectl logs <pod-name> -n techvault

# Check pod events
kubectl describe pod <pod-name> -n techvault

# Common causes:
# - MongoDB not ready (wait for it to start)
# - Environment variables missing
# - Port conflicts
```

### Issue: Service Not Accessible

**Solution:**
```powershell
# Check service
kubectl get svc -n techvault

# Port forward for testing
kubectl port-forward -n techvault service/techvault-service 8080:5000

# Access at http://localhost:8080
```

---

## 📊 Deployment Verification Checklist

### Docker Deployment ✓

- [ ] Docker Desktop installed and running
- [ ] Image built successfully (`docker images`)
- [ ] Container running (`docker ps`)
- [ ] Application accessible at http://localhost:5000
- [ ] Health endpoint returns 200 OK
- [ ] Logs show successful MongoDB connection

### Kubernetes Deployment ✓

- [ ] Kubernetes cluster running (`kubectl cluster-info`)
- [ ] Namespace created (`kubectl get ns`)
- [ ] MongoDB deployment ready (1/1)
- [ ] TechVault deployment ready (1/1)
- [ ] Services created (NodePort + ClusterIP)
- [ ] Pods running without errors
- [ ] Application accessible at http://localhost:30080
- [ ] Can login and view assets

---

## 📝 Resource Specifications

### Docker Image
- **Name:** techvault:latest
- **Size:** ~485MB
- **Build Type:** Multi-stage
- **Base Image:** node:18-alpine
- **Exposed Port:** 5000

### Kubernetes Resources

#### Namespace
- **Name:** techvault
- **Labels:** name=techvault, environment=production

#### TechVault Deployment
- **Replicas:** 1
- **Image:** techvault:latest
- **Port:** 5000
- **Resources:**
  - Requests: 250m CPU, 256Mi RAM
  - Limits: 500m CPU, 512Mi RAM
- **Probes:**
  - Liveness: /api/health (30s delay)
  - Readiness: /api/health (10s delay)

#### MongoDB Deployment
- **Replicas:** 1
- **Image:** mongo:6.0
- **Port:** 27017
- **Resources:**
  - Requests: 250m CPU, 256Mi RAM
  - Limits: 500m CPU, 512Mi RAM

#### Services
1. **techvault-service**
   - Type: NodePort
   - Port: 5000
   - NodePort: 30080

2. **mongo-service**
   - Type: ClusterIP
   - Port: 27017

---

## 🎯 Next Steps

1. **Build Docker image** and verify it works locally
2. **Start Kubernetes cluster** (Docker Desktop or Minikube)
3. **Deploy to Kubernetes** using provided manifests
4. **Verify deployment** using checklist above
5. **Test application** functionality
6. **Take screenshots** for documentation
7. **Configure Jenkins** for CI/CD pipeline

---

## 📸 Screenshots to Capture

For your project report, capture:

1. Docker build output
2. `docker ps` showing running container
3. `docker images` showing techvault image
4. `kubectl get all -n techvault`
5. `kubectl get pods -n techvault` with STATUS Running
6. Application running at http://localhost:30080
7. Admin dashboard with assets
8. Analytics dashboard with charts
9. Jenkins pipeline execution (if configured)

---

**Generated:** 2025-12-02  
**Project:** TechVault IT Asset Management  
**Course:** DevOps Final Year Project
