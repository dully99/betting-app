# SmartBet API — Spring Boot Backend

REST API backend for the SmartBet Predictions mobile app.

## Tech Stack
- Java 17
- Spring Boot 3.2.5
- Spring Data JPA
- MySQL 8+
- Lombok

## Setup

### 1. Create MySQL database
```sql
CREATE DATABASE smartbet_db;
```

### 2. Configure credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Run the app
```bash
mvn spring-boot:run
```
The server starts on **http://localhost:8080**. Tables are auto-created and seed data is inserted on first run.

---

## API Endpoints

### Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predictions/free` | Get all free predictions |
| GET | `/api/predictions/vip` | Get all VIP predictions |
| GET | `/api/predictions/results` | Get past results (WON/LOST) |
| GET | `/api/predictions/{id}` | Get prediction by ID |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |

### Subscription Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscription-plans` | Get all plans |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Initiate a payment |
| POST | `/api/payments/verify` | Verify a payment |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/predictions` | Create prediction |
| PUT | `/api/admin/predictions/{id}` | Update prediction |
| DELETE | `/api/admin/predictions/{id}` | Delete prediction |

---

## Sample Request Bodies

### POST /api/payments/initiate
```json
{
  "phoneNumber": "+255712345678",
  "planId": 2,
  "paymentMethod": "MPESA"
}
```

### POST /api/payments/verify
```json
{
  "transactionReference": "MPE-ABC123DEF456"
}
```

### POST /api/admin/predictions
```json
{
  "homeTeam": "Manchester City",
  "awayTeam": "Arsenal",
  "league": "Premier League",
  "country": "England",
  "matchTime": "2026-06-12T20:45:00",
  "prediction": "Both Teams to Score",
  "odds": 1.75,
  "confidence": 82,
  "categoryId": 1,
  "isVip": false,
  "analysis": "Both sides have excellent scoring form.",
  "status": "PENDING"
}
```

---

## Sample API Response
```json
{
  "success": true,
  "message": "Free predictions fetched successfully",
  "data": [...],
  "timestamp": "2026-06-11T17:00:00"
}
```
