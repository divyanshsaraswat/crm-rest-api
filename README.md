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

| Endpoint             | Method | Auth Middleware | Description                      | Parameters / Body                            |
|----------------------|--------|------------------|----------------------------------|----------------------------------------------|
| `/users/login`       | POST   | None             | User login                        | JSON body: `email`, `password`               |
| `/users/`            | GET    | `userAuth`       | Fetch all users                   | None                                         |
| `/users/:id`         | GET    | `userAuth`       | Fetch a user by ID                | `:id` - UUID of the user                     |
| `/users/insert`      | POST   | `fuseAuth`       | Insert a new user                 | JSON body: `username`, `email`, `password`   |
| `/users/delete/:id`  | GET    | `adminAuth`      | Delete a user by ID               | `:id` - UUID of the user                     |

---
## 📌 API Endpoints (Contacts)

| Endpoint               | Method | Auth Middleware | Description             | Parameters / Body                  |
|------------------------|--------|------------------|-------------------------|------------------------------------|
| `/contacts/`           | GET    | `userAuth`       | Fetch all contacts      | None                               |
| `/contacts/insert`     | POST   | `userAuth`       | Insert a new contact    | JSON body: contact fields          |
| `/contacts/delete/:id` | GET    | `userAuth`       | Delete a contact by ID  | `:id` - UUID of the contact        |

---
## 📌 API Endpoints (Accounts)

| Endpoint               | Method | Auth Middleware | Description             | Parameters / Body                  |
|------------------------|--------|------------------|-------------------------|------------------------------------|
| `/accounts/`           | GET    | `userAuth`       | Fetch all accounts      | None                               |
| `/accounts/insert`     | POST   | `userAuth`       | Insert a new account    | JSON body: account fields          |
| `/accounts/delete/:id` | GET    | `adminAuth`      | Delete an account by ID | `:id` - UUID of the account        |

---
## 📌 API Endpoints (Tasks)

| Endpoint             | Method | Description             |
|----------------------|--------|-------------------------|
| `/tasks/`            | GET    | Fetch all tasks         |
| `/tasks/insert`      | POST   | Insert a new task       |
| `/tasks/delete/:id`  | GET    | Delete a task by ID     |

---
## 📌 API Endpoints (Leads)

| Endpoint             | Method | Description            |
|----------------------|--------|------------------------|
| `/leads/`            | GET    | Fetch all leads        |
| `/leads/insert`      | POST   | Insert a new lead      |
| `/leads/delete/:id`  | GET    | Delete a lead by ID    |

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