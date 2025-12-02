# TechVault - Minikube Deployment Fix Guide

## 🔍 Issue Identified

You're using **Minikube** instead of Docker Desktop Kubernetes. Minikube runs in its own VM and cannot access Docker Desktop's local images.

## ✅ Solution Applied

### Step 1: Load Image into Minikube
```powershell
minikube image load techvault:latest
```
✅ **Status:** Completed - Image loaded into Minikube

### Step 2: Delete Old Pods
```powershell
kubectl delete pod --all -n techvault
```
✅ **Status:** Completed - Pods recreated with loaded image

### Step 3: Get Minikube Service URL
```powershell
minikube service techvault-service -n techvault --url
```
This will give you the actual URL to access your application in Minikube.

## 🚀 Access Your Application

### For Minikube (IMPORTANT!)
You **cannot** use `http://localhost:30081` with Minikube!

Instead, use one of these methods:

**Method 1: Get the URL (Recommended)**
```powershell
minikube service techvault-service -n techvault --url
```
This will return something like: `http://192.168.49.2:30081`
Use that URL in your browser!

**Method 2: Open in Browser Automatically**
```powershell
minikube service techvault-service -n techvault
```
This automatically opens the browser to the correct URL.

## 📊 Verify Deployment

```powershell
# Check pods are running
kubectl get pods -n techvault

# Expected output:
# NAME                                    READY   STATUS    RESTARTS   AGE
# mongo-deployment-xxxxx                  1/1     Running   0          2m
# techvault-deployment-xxxxx              1/1     Running   0          2m

# Check services
kubectl get svc -n techvault

# Get Minikube IP
minikube ip
```

## 🔧 Minikube vs Docker Desktop

### Docker Desktop Kubernetes
- Uses: `http://localhost:30081`
- Image access: Automatic (same Docker engine)
- Setup: Enable in Docker Desktop settings

### Minikube
-Uses: `http://<minikube-ip>:30081`
- Image access: Must load images: `minikube image load <image>`
- Setup: Separate VM/container

## 📝 Commands for Minikube

### Load Image
```powershell
# Always do this after building new image
docker build -t techvault:latest .
minikube image load techvault:latest
kubectl rollout restart deployment/techvault-deployment -n techvault
```

### Access Service
```powershell
# Get URL
minikube service techvault-service -n techvault --url

# Or open browser
minikube service techvault-service -n techvault
```

### Check Status
```powershell
# Minikube status
minikube status

# Get IP
minikube ip

# SSH into Minikube
minikube ssh

# View loaded images in Minikube
minikube ssh docker images
```

## ✨ Quick Fix If Pods Still Not Starting

```powershell
# 1. Verify image is in Minikube
minikube ssh
docker images | grep techvault
exit

# 2. If not there, reload it
minikube image load techvault:latest

# 3. Restart deployment
kubectl rollout restart deployment -n techvault

# 4. Watch pods start
kubectl get pods -n techvault -w
```

## 🎯 Final Steps

1. **Wait for pods** to be in "Running" status (1-2 minutes)
2. **Get the URL**: `minikube service techvault-service -n techvault --url`
3. **Open browser** to that URL (NOT localhost!)
4. **Login** with admin/admin123
5. **Take screenshots** for your report

## 📸 Minikube-Specific Screenshots

1. `minikube status` - Show cluster is running
2. `minikube ip` - Show cluster IP
3. `minikube ssh docker images` - Show techvault image loaded
4. `kubectl get all -n techvault` - Show all resources
5. `minikube service techvault-service -n techvault --url` - Show access URL
6. Browser with application at Minikube IP

---

**Key Takeaway:** With Minikube, always use `minikube service` command to get the correct URL! Don't use localhost!
