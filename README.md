# 📊 CRM REST API

This is a RESTful API built for managing a CRM (Customer Relationship Management) system. It provides endpoints to manage users, with capabilities to insert, fetch, and delete users, and includes a utility route for custom command checks.

---

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **MSSQL**
- **mssql** npm package

---

## 📁 Project Structure

```
/controllers      -> Route handler logic (e.g., userController.js)
/routes           -> Express route definitions (e.g., userRoutes.js)
/db               -> SQL configuration and connection pool
index.js          -> Entry point
```

---

## 📌 API Endpoints (Users)

| Endpoint             | Method | Description                      | Parameters / Body                   |
|----------------------|--------|----------------------------------|-------------------------------------|
| `/users/`            | GET    | Fetch all users                  | None                                |
| `/users/:id`         | GET    | Fetch a user by ID               | `:id` - UUID of the user            |
| `/users/insert`      | POST   | Insert a new user                | JSON body: `username`, `email`, `password` |
| `/users/delete/:id`  | GET    | Delete a user by ID              | `:id` - UUID of the user            |
| `/users/checkcmd`    | POST   | Utility route for DB commands    | Depends on your controller logic    |

---

## 🧪 Example Request: Insert User

```http
POST /users/insert
Content-Type: application/json

{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "securepassword"
}
```

---

## 🔐 Notes

- Ensure your MSSQL database is running and connection details are set in `/db/sqlConfig.js`.
- `id` fields are assumed to be `UNIQUEIDENTIFIER` type in SQL Server.
- Foreign keys and constraints should be established in the database schema.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the server
node index.js
```

---

## 🧑‍💻 Author

**Divyansh Saraswat**  
[Github Link]('github.com/divyanshsaraswat')

---

## 📝 License

This project is licensed under the MIT License.