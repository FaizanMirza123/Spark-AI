# SparkAI — Home Services Platform

Live: **[aispark.duckdns.org](http://aispark.duckdns.org)**

---

## Sample Credentials

| Role     | Email                    | Password      |
|----------|--------------------------|---------------|
| Admin    | admin@sparkai.com        | Admin123!     |
| Provider | provider1@sparkai.com    | Provider1!    |
| Provider | provider2@sparkai.com    | Provider2!    |
| Customer | sarah@example.com        | Customer1!    |
| Customer | mike@example.com         | Customer2!    |

---

## Run Locally

**Prerequisites:** Node.js 18+, MySQL

### 1. Clone & install

```bash
git clone https://github.com/FaizanMirza123/Spark-AI
cd Spark-AI
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in DB credentials
npm install
npm run dev            # runs on port 4000
```

`.env` values needed:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sparkai
DB_USER=root
DB_PASS=yourpassword
JWT_SECRET=anysecret
```

The database seeds automatically on first run.

### 3. Frontend

```bash
cd aispark
npm install
npm run dev            # runs on port 3000
```

Open [http://localhost:3000](http://localhost:3000)

> Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
