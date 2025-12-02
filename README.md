# TechVault - IT Asset Management System

A modern MERN Stack application for managing IT assets with complete DevOps pipeline integration.

## 🎯 Project Overview

TechVault is a comprehensive IT Asset Management system built as a DevOps course project. It demonstrates the complete CI/CD pipeline from development to Kubernetes deployment.

### Features

- **Admin Module**: Add, delete, and manage IT assets (Laptops, Monitors, Licenses)
- **Employee Module**: View available assets and their status
- **Role-based Authentication**: JWT-based secure login system
- **Modern UI**: Clean, responsive design with Bootstrap styling
- **RESTful API**: Express.js backend with MongoDB database
- **DevOps Ready**: Docker containerization and Kubernetes deployment

## 📁 Project Structure

```
TechVault/
├── backend/
│   ├── models/
│   │   ├── Asset.js
│   │   └── User.js
│   ├── routes/
│   │   ├── assets.js
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── EmployeeDashboard.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── k8s/
│   ├── namespace.yaml
│   ├── deployment.yaml
│   └── service.yaml
├── Dockerfile
├── Jenkinsfile
└── README.md
```

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection URI)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### Demo Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Employee Account:**
- Username: `employee`
- Password: `emp123`

**Note:** You'll need to register these users first via the API or create them manually in MongoDB.

## 🐳 Docker Setup

### Build Docker Image

```bash
docker build -t techvault:latest .
```

### Run Docker Container

```bash
docker run -p 5000:5000 -e MONGODB_URI=mongodb://host.docker.internal:27017/techvault techvault:latest
```

Access the application at `http://localhost:5000`

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy application and MongoDB
kubectl apply -f k8s/deployment.yaml

# Create service
kubectl apply -f k8s/service.yaml

# Check deployment status
kubectl get pods -n techvault
kubectl get svc -n techvault
```

### Access Application

The application will be available on any cluster node at port `30080`:

```
http://<node-ip>:30080
```

For minikube:
```bash
minikube service techvault-service -n techvault
```

## 🔧 Jenkins CI/CD Pipeline

The project includes a `Jenkinsfile` with the following stages:

1. **Checkout**: Clone the repository
2. **Build Docker Image**: Build and tag container image
3. **Push to Registry**: (Optional) Push to Docker registry
4. **Deploy to Kubernetes**: Apply K8s manifests and verify deployment

### Setup Jenkins Pipeline

1. Create a new Pipeline job in Jenkins
2. Configure the repository URL
3. Set the script path to `Jenkinsfile`
4. Run the pipeline

## 🛠️ Technology Stack

**Frontend:**
- React.js 18
- React Router Dom
- Axios
- Bootstrap 5

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs

**DevOps:**
- Docker (Multi-stage build)
- Kubernetes
- Jenkins

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Add new asset (Admin only)
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset (Admin only)

### Health Check
- `GET /api/health` - Check API status

## 🔐 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/techvault
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 📝 Notes for DevOps Lab

This project follows standard DevOps practices:

- **Multi-stage Dockerfile**: Optimized for production with separate build stages
- **Kubernetes Manifests**: Production-ready configurations with health checks
- **Jenkins Pipeline**: Automated CI/CD workflow
- **Environment Configuration**: Externalized configuration for different environments
- **Resource Limits**: Defined CPU and memory limits in K8s deployment
- **Service Discovery**: Internal and external service access patterns

## 🤝 Contributing

This is a course project. Feel free to fork and modify for your own learning purposes.

## 📄 License

ISC

---

**Built with ❤️ for DevOps Course Project**
