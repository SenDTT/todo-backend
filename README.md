# Todo API (Express + TypeScript + Prisma)

A simple REST API for managing todos using **Express**, **TypeScript**, and **Prisma**.

---

## Prerequisites

- Node.js **>= 18**
- npm (comes with Node.js)
- A database:
  - **MySQL 8.x** (recommended)

---

## Setup

1. **Clone the repository**

   ```bash
   git clone <your-server-repo-url> server
   cd server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create a `.env` file in the project root:

   ```bash
   cp .example.env .env
   ```

   Open .env and update with your real credentials:

4. **Initialize the database**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

---

## Start the Project

Run the development server:

```bash
npm run dev
```

The API will start at:

```
http://localhost:4000
```

---

## Available Endpoints

- `GET /todos` → Get all todos
- `GET /todos/:id` → Get a todo
- `POST /todos` → Create a new todo (title, color)
- `PATCH /todos/:id` → Update a todo (title, color)
- `PATCH /todos/:id/complete` → Completed/uncompleted a todo (completed)
- `DELETE /todos/:id` → Delete a todo

---

## Quick Test

### Get all todos

```bash
curl -i http://localhost:4000/todos
```

### Get a todo

```bash
curl -i http://localhost:4000/todos/1
```

### Add new todo

```bash
curl -i -X POST http://localhost:4000/todos \
 -H "Content-Type: application/json" \
 -d '{"title":"New Todo", "color":"#FF0000"}'
```

### Update todo

```bash
curl -i -X PATCH http://localhost:4000/todos/1 \
 -H "Content-Type: application/json" \
 -d '{"title":"Updated Todo", "color":"#00FF00"}'
```

### Delete todo

```bash
curl -i -X DELETE http://localhost:4000/todos/1
```

### Complete todo

```bash
curl -i -X PATCH http://localhost:4000/todos/2/complete \
 -H "Content-Type: application/json" \
 -d '{"completed":true}'
```
