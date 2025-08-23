# Inventory Management System

A modern, microservices-based inventory management system built with Spring Boot, Node.js, and Express. The system provides a clean, professional web interface for managing supplies with real-time updates and service discovery.

## 🏗️ Architecture

The system consists of the following microservices:

- **Registry Service** (Eureka) - Service discovery and registration
- **Producer Resource** - Handles adding supplies to inventory
- **Consumer Resource** - Handles consuming/removing supplies from inventory
- **Frontend Service** - Modern web interface built with Express.js and EJS
- **API Gateway** - Routes requests between services

## 🚀 Features

- **Modern UI**: Clean, responsive design with professional styling
- **Real-time Operations**: Add and consume supplies with instant feedback
- **Service Discovery**: Automatic service registration and discovery via Eureka
- **Error Handling**: Comprehensive error handling with user-friendly notifications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Visual feedback during operations

## 🛠️ Technology Stack

### Backend Services (Java/Spring Boot)
- Spring Boot 2.x
- Spring Cloud Netflix Eureka
- MongoDB
- Maven

### Frontend Service (Node.js)
- Express.js
- EJS templating engine
- Eureka JS Client
- Axios for HTTP requests

### UI/UX
- Modern CSS with gradients and animations
- Font Awesome icons
- Responsive grid layout
- Professional color scheme

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Java 11 or higher**
- **Node.js 14 or higher**
- **MongoDB** (running locally or accessible)
- **Maven** (for Java services)

## 🚀 Quick Start

### Option 1: Using the Start Script (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend_project
   ```

2. **Make the start script executable**:
   ```bash
   chmod +x start_project.sh
   ```

3. **Run the start script**:
   ```bash
   ./start_project.sh
   ```

This will start all services in separate terminal windows.

### Option 2: Manual Start

1. **Start the Registry Service**:
   ```bash
   cd registry
   ./mvnw spring-boot:run
   ```

2. **Start the Producer Resource Service**:
   ```bash
   cd producer_resource
   ./mvnw spring-boot:run
   ```

3. **Start the Consumer Resource Service**:
   ```bash
   cd consumer_resource
   ./mvnw spring-boot:run
   ```

4. **Start the Frontend Service**:
   ```bash
   cd frontend-service
   npm install
   npm start
   ```

## 🌐 Accessing the Application

Once all services are running, you can access the application at:

- **Frontend Interface**: http://localhost:3000
- **Eureka Dashboard**: http://localhost:8761
- **Producer Service**: http://localhost:8080
- **Consumer Service**: http://localhost:8081

## 📱 Using the Application

### Adding Supplies
1. Navigate to the "Add Supply" section
2. Enter the supply name (e.g., "Laptop", "Paper", "Pens")
3. Enter the quantity
4. Click "Add Supply"

### Consuming Supplies
1. Navigate to the "Consume Supply" section
2. Enter the supply name you want to consume
3. Enter the quantity to consume
4. Click "Consume Supply"

### Features
- **Real-time Feedback**: Success/error notifications appear instantly
- **Form Validation**: Input validation with helpful error messages
- **Loading States**: Visual feedback during operations
- **Auto-reset**: Forms clear automatically after successful operations

## 🔧 Configuration

### Database Configuration
The Java services use MongoDB. Update the connection settings in:
- `producer_resource/src/main/resources/application.properties`
- `consumer_resource/src/main/resources/application.properties`

### Service Ports
Default ports can be modified in the respective `application.properties` files:
- Registry: 8761
- Producer: 8080
- Consumer: 8081
- Frontend: 3000

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Check if ports 8761, 8080, 8081, or 3000 are already occupied
   - Kill existing processes or change ports in configuration

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check connection strings in application.properties

3. **Service Discovery Issues**
   - Ensure Registry service starts first
   - Check Eureka dashboard at http://localhost:8761

4. **Frontend Not Loading**
   - Check if Node.js dependencies are installed: `npm install`
   - Verify the frontend service is running on port 3000

### Logs
Check the console output of each service for detailed error messages and debugging information.

## 📁 Project Structure

```
backend_project/
├── registry/                 # Eureka service registry
├── producer_resource/        # Supply producer service
├── consumer_resource/        # Supply consumer service
├── frontend-service/         # Web interface
│   ├── public/              # Static assets (CSS, JS)
│   ├── views/               # EJS templates
│   ├── routes/              # Express routes
│   └── services/            # Service communication
├── api-gateway/             # API gateway service
└── start_project.sh         # Startup script
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section
2. Review the logs for error messages
3. Create an issue with detailed information about the problem

---

**Happy Inventory Managing! 📦**
