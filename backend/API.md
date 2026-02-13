# Kurokami Backend API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "username": "sathya",
    "email": "sathya@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "60d0fe4f5311236168a109ca",
    "username": "sathya",
    "email": "sathya@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "sathya@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK` (Returns same object as Register)

---

## Users

### Get User Profile
- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "...",
    "username": "sathya",
    "email": "sathya@example.com",
    "bio": "",
    "avatar": "...",
    "favoriteAnime": []
  }
  ```

### Update User Profile
- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Body** (All fields optional):
  ```json
  {
    "username": "sathya_updated",
    "email": "newemail@example.com",
    "password": "newpassword",
    "bio": "I love anime",
    "avatar": "http://cloudinary.com/...",
    "favoriteAnime": ["Naruto", "One Piece"]
  }
  ```
- **Success Response**: `200 OK` (Returns updated user object)

---

## Posts

### Create Post
- **URL**: `/posts`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "content": "This is my first post! #anime",
    "image": "http://cloudinary.com/...",
    "animeTags": ["Naruto", "Bleach"]
  }
  ```
- **Success Response**: `201 Created`

### Get Feed (All Posts)
- **URL**: `/posts`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK` (Array of posts)

### Like / Unlike Post
- **URL**: `/posts/:id/like`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK` (Returns array of user IDs who liked the post)

### Delete Post
- **URL**: `/posts/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Owner or Admin)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK` `{"message": "Post removed"}`

---

## Comments

### Add Comment
- **URL**: `/posts/:id/comments`
- **Method**: `POST`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "content": "Awesome post!"
  }
  ```
- **Success Response**: `201 Created`

### Get Comments for Post
- **URL**: `/posts/:id/comments`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: `200 OK` (Array of comments)

### Delete Comment
- **URL**: `/comments/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Owner only)
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK` `{"message": "Comment removed"}`

---

## Upload (Cloudinary)

### Upload Image
- **URL**: `/upload`
- **Method**: `POST`
- **Auth Required**: No (Currently Open, usually protected in production)
- **Body**: `form-data`
  - Key: `image` (Type: File)
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Image uploaded successfully",
    "imageUrl": "https://res.cloudinary.com/..."
  }
  ```
