# KUROKAMI - Anime Social Platform

Kurokami is a full-stack social media application designed for anime enthusiasts. It allows users to share posts, interact with the community, and build their warrior profile.

## 🚀 Features

-   **Authentication**: Secure User Registration and Login using JWT.
-   **User Profiles**: customizable profiles with avatars, bio, and favorite anime list.
-   **Feed**: Real-time feed of posts from all users.
-   **Explore**: Discover new users and trending content.
-   **Posts**: Create posts with text and images (Cloudinary integration).
-   **Interactions**: Like posts and comment on them.
-   **Responsive Design**: A sleek, anime-themed UI built with React and Vite.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, React Router, Axios, CSS3.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (Mongoose ODM).
-   **Authentication**: JSON Web Tokens (JWT), bcryptjs.
-   **Image Storage**: Cloudinary.

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
-   [Git](https://git-scm.com/)

## ⚙️ Installation & Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/sathya46official-cmd/KUROKAMI-.git
    cd KUROKAMI-
    ```

2.  **Backend Setup**
    Navigate to the `backend` folder and install dependencies:
    ```bash
    cd backend
    npm install
    ```

3.  **Frontend Setup**
    Navigate to the `frontend` folder and install dependencies:
    ```bash
    cd ../frontend
    npm install
    ```

## 🔑 Environment Variables

Create a `.env` file in the **`backend`** directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

*Note: Replace `your_...` with your actual credentials.*

## 🏃‍♂️ Running the Application

You need to run both the Backend and Frontend servers concurrently.

1.  **Start Backend Server**
    ```bash
    cd backend
    npm run dev
    ```
    *The server will run on `http://localhost:5000`*

2.  **Start Frontend Server** (Open a new terminal)
    ```bash
    cd frontend
    npm run dev
    ```
    *The app will be accessible at `http://localhost:5173`*

## 📚 API Documentation

Detailed API documentation is available in `backend/API.md`.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a Pull Request.

---
*Built with ❤️ by the Kurokami Team*
