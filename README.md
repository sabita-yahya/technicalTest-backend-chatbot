# Backend Chatbot API - Technical Test

REST API sederhana untuk chatbot yang dibangun dengan AdonisJS v5 dan PostgreSQL.

## Deskripsi

API ini menerima pertanyaan dari user, mengirimkan ke API chatbot eksternal, menyimpan pertanyaan dan jawaban ke database PostgreSQL, kemudian mengembalikan response ke user.

## Tech Stack

- **Node.js**: v20
- **Framework**: AdonisJS v5
- **Database**: PostgreSQL (via Docker Desktop)
- **ORM**: Lucid ORM

## Fitur

- Kirim pertanyaan ke chatbot
- Simpan conversation dan message ke database
- Get semua conversation
- Get detail conversation beserta messages

## 📦 Prasyarat

Pastikan sistem Anda sudah terinstall:

- [Node.js](https://nodejs.org/) v20 atau lebih tinggi
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) untuk PostgreSQL & Redis
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/sabita-yahya/technicalTest-backend-chatbot.git
cd backend-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Docker untuk PostgreSQL & Redis

Buat file `docker-compose.yml` di root project:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: backend_chatbot_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: backend_chatbot
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend_network

  redis:
    image: redis:7-alpine
    container_name: backend_chatbot_redis
    ports:
      - "6379:6379"
    networks:
      - backend_network

volumes:
  postgres_data:

networks:
  backend_network:
    driver: bridge
```

Jalankan Docker containers:

```bash
docker-compose up -d
```

### 4. Setup Environment Variables

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` sesuai konfigurasi Anda:

```env
PORT=3333
HOST=0.0.0.0
NODE_ENV=development
APP_KEY=YOUR_APP_KEY_HERE
DRIVE_DISK=local
DOMAIN=http://localhost:3333

# Database
DB_CONNECTION=pg
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=postgres
PG_DB_NAME=backend_chatbot

# Redis
REDIS_CONNECTION=local
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# SMTP (opsional, untuk email)
SMTP_HOST=localhost
SMTP_PORT=587
SMTP_USERNAME=<username>
SMTP_PASSWORD=<password>
```

### 5. Generate APP_KEY

```bash
node ace generate:key
```

Copy hasil key tersebut ke `APP_KEY` di file `.env`.

### 6. Jalankan Migrasi Database

```bash
node ace migration:run
```

## ⚙️ Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3333`

### Menghentikan Docker

```bash
docker-compose down
```

## 📚 API Endpoints

### Base URL

```
http://localhost:3333
```

### Chatbot API

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/questions` | Kirim pertanyaan ke chatbot |
| GET | `/conversation` | Get semua conversations |
| GET | `/conversation/:id` | Get conversation by ID |

### Contoh Request

#### 1. Send Question to Chatbot

```bash
POST /questions
Content-Type: application/json

{
  "message": "ada layanan apa di majadigi?",
  "session_id": "12"
}
```

**Catatan**: Backend akan meneruskan request ke API eksternal Jatimprov:
```
POST https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message
```

Response:
```json
{
  "conversation": {
    "id": 1,
    "session_id": "12",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "user_message": {
    "id": 1,
    "conversation_id": 1,
    "sender_type": "user",
    "content": "ada layanan apa di majadigi?",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "bot_message": {
    "id": 2,
    "conversation_id": 1,
    "sender_type": "bot",
    "content": "Majadigi menyediakan berbagai layanan yang dikelompokkan berdasarkan kategori...",
    "created_at": "2024-01-01T00:00:01.000Z"
  }
}
```

#### 2. Get All Conversations

```bash
GET /conversation
```

Response:
```json
[
  {
    "id": 1,
    "session_id": "12",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### 3. Get Conversation by ID

```bash
GET /conversation/1
```

Response:
```json
{
  "id": 1,
  "session_id": "12",
  "created_at": "2024-01-01T00:00:00.000Z",
  "messages": [
    {
      "id": 1,
      "sender_type": "user",
      "content": "ada layanan apa di majadigi?",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "sender_type": "bot",
      "content": "Majadigi menyediakan berbagai layanan yang dikelompokkan berdasarkan kategori...",
      "created_at": "2024-01-01T00:00:01.000Z"
    }
  ]
}
```

## 📝 Notes

- Pastikan Docker Desktop sudah running sebelum menjalankan aplikasi
- File `.env` jangan di-commit ke repository (sudah ada di `.gitignore`)
- API ini akan memanggil API eksternal chatbot untuk mendapatkan response
- Semua pertanyaan dan jawaban disimpan di database PostgreSQL

---

**Happy Coding! 🚀**

=======
# technicalTest-backend-chatbot
>>>>>>> fccdedd0a45ed18208db3a1ac30994f6e20e3c5e
