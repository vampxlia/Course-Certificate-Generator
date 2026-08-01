Certificate Course Generator

> A web application designed to automate the generation, signing using .pk12 certificates, and email distribution of course completion certificates, featuring role-based access control (RBAC).

---

## Features

- **Automated Generation:** Dynamic PDF and document generation for course completion certificates using customized templates.
- **Digital Signatures:** Cryptographic document signing to verify authenticity and prevent tampering.
- **Automated Delivery:** Email dispatch module with delivery status tracking.
- **Granular Security & RBAC:** Fine-grained authorization implemented via **Casbin** for role-based access control.
- **Institutional Integration:** Connects with external/institutional academic databases for automated student data verification.

---

## Tech Stack & Architecture

- **Runtime Environment:** Node.js (v18+)
- **Language:** TypeScript
- **Database Systems:** MySQL (Local Authentication DB & Dockerized Academic System DB)
- **Authorization Engine:** Casbin (RBAC)

---

## Prerequisites

Ensure you have the following installed on your machine before running the application:

- **Node.js** (v18 or higher) and **npm**
- **MySQL** server (or compatible database management system)
- **Docker** and **Docker Desktop** (with Docker Compose)

---

## Getting Started & Setup Instructions

Follow these step-by-step instructions to set up and execute the application locally:

### 1. Database Configuration

#### 1.1 Local Authentication Database (`autenticacao-db`)
1. Open your MySQL client or database management tool.
2. Navigate to the `DataBase/auth-db` directory.
3. Execute the SQL scripts in the following order:
   1. `AuthDatabaseSetup.sql` (Creates schema and tables)
   2. `AuthDatabasePopulateMockData.sql` (Populates initial mock data)

#### 1.2 Simulated Academic System Database (`sistema-academico-db`)
1. Open a terminal and navigate to the simulated database folder:
   ```bash
   cd DataBase/academic-system-db
   ```
2. Spin up the containerized database using Docker Compose:
   ```bash
   docker compose up -d
   ```
If you wish to use your own database for student data, you need to implement the `ICourseDAO` and `IStudentDAO` in accordance to it, present in the `WebApp/src/dao/interfaces` directory.

---

### 2. Environment Variables Setup

Create a `.env` file in the `WebApp/src` directory (`WebApp/src/.env`) with the following required configuration variables:

```env
# Authentication Database Configuration (Local MySQL)
AUTH_DB_HOST='localhost'
AUTH_DB_NAME='SysAuth'
AUTH_DB_USER='<your-local-sql-user>'
AUTH_DB_PASSWORD='<your-local-sql-password>'

# Institutional Academic System Database Configuration (Dockerized)
INST_DB_HOST='localhost'
INST_DB_NAME='sistemaacademico'
INST_DB_USER='admin'
INST_DB_PASSWORD='password123'

# Environment Setting
NODE_ENV='local'
```

---

### 3. Dependency Installation & Server Launch

1. Navigate to the main web app directory:
   ```bash
   cd WebApp
   ```
2. Install the necessary project dependencies:
   ```bash
   npm install
   ```
3. Start the local server using `ts-node`:
   ```bash
   npx ts-node src/app.ts
   ```

---

### 4. Accessing the Application

Once the server has started successfully, open your web browser and navigate to:

**[http://localhost:3000](http://localhost:3000)**

The following test users are provided in the mock authentication database:

**User** - Email: `user@example.com`, Password: `admin123`

**Admin** - Email: `admin@example.com`, Password: `admin123`




