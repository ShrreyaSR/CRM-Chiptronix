# Chiptronix CRM Backend

A robust Node.js/Express backend for managing laptop repair operations.

## 🚀 Features

- RESTful API with TypeScript
- PostgreSQL database with TypeORM
- Comprehensive error handling
- Request logging
- Environment-based configuration
- Health check endpoint

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=crm_db
PORT=8080
NODE_ENV=development
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=false
```

4. Start the server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── config/          # Configuration files (database, environment)
├── controllers/     # Request handlers
├── entities/        # TypeORM entities (database models)
├── middleware/      # Express middleware (error handling, logging)
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic layer
└── utils/           # Utility functions (logger, etc.)
```

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health status

### Clients
- `GET /clients` - Get all clients (with search, filter, sort)
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### Technicians
- `GET /technicians` - Get all technicians
- `POST /technicians` - Create technician
- `PUT /technicians/:id` - Update technician
- `DELETE /technicians/:id` - Delete technician

### Job Sheets
- `GET /jobsheets` - Get all job sheets (with advanced filtering)
- `POST /jobsheets` - Create job sheet
- `PUT /jobsheets/:id` - Update job sheet
- `DELETE /jobsheets/:id` - Delete job sheet

### Master Data
- **Trays**: `GET /trays`, `POST /trays`, `PATCH /trays/:id`, `DELETE /trays/:id`, `POST /trays/bulk`
- **Model/Brands**: `GET /model-brands`, `POST /model-brands`, `PUT /model-brands/:id`, `DELETE /model-brands/:id`
- **Complaints**: `GET /complaints`, `POST /complaints`, `PUT /complaints/:id`, `DELETE /complaints/:id`
- **Vendors**: `GET /vendor`, `POST /vendor`, `PUT /vendor/:id`, `DELETE /vendor/:id`
- **Sales Persons**: `GET /sales-person`, `POST /sales-person`, `PUT /sales-person/:id`, `DELETE /sales-person/:id`

## 🔍 Query Parameters

Most GET endpoints support:
- `search` - Search term (searches relevant fields)
- `sortField` - Field to sort by
- `sortOrder` - `ASC` or `DESC`
- `page` - Page number (for paginated endpoints)
- `limit` - Items per page

Job Sheets endpoint additionally supports:
- `status` - Filter by status
- `client` - Filter by client ID
- `assignedTo` - Filter by technician ID
- `fromDate` - Start date (YYYY-MM-DD)
- `toDate` - End date (YYYY-MM-DD)

## 🛡️ Error Handling

All errors are handled consistently:
- **404**: Resource not found
- **400**: Bad request (validation errors)
- **500**: Internal server error

Error response format:
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "stack": "..." // Only in development
  }
}
```

## 📝 Logging

The application logs:
- All HTTP requests (method, path, status, duration)
- Database operations
- Errors with stack traces
- Important business events (create, update, delete)

Log format: `[TIMESTAMP] [LEVEL] MESSAGE {metadata}`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `DB_DATABASE` | Database name | `crm_db` |
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment | `development` |
| `TYPEORM_SYNCHRONIZE` | Auto-sync schema | `true` |
| `TYPEORM_LOGGING` | Enable SQL logging | `false` |

⚠️ **Warning**: Set `TYPEORM_SYNCHRONIZE=false` in production!

## 🐛 Recent Improvements

1. ✅ Fixed search query bugs (empty search now returns all results)
2. ✅ Added environment variable support
3. ✅ Implemented comprehensive logging system
4. ✅ Added error handling middleware
5. ✅ Added request logging middleware
6. ✅ Completed TrayService CRUD operations
7. ✅ Added health check endpoint
8. ✅ Standardized error responses
9. ✅ Added proper error handling in all services
10. ✅ Improved code organization

## 📦 Dependencies

- **express** - Web framework
- **typeorm** - ORM for PostgreSQL
- **pg** - PostgreSQL driver
- **cors** - CORS middleware
- **dotenv** - Environment variable management

## 🚨 Important Notes

1. **Database Synchronization**: `TYPEORM_SYNCHRONIZE=true` auto-creates/updates tables. Use migrations in production.

2. **Security**: 
   - Add authentication/authorization
   - Validate all inputs
   - Use HTTPS in production
   - Sanitize user inputs

3. **Performance**:
   - Add database indexes for frequently queried fields
   - Implement caching for read-heavy operations
   - Consider pagination for large datasets

## 📄 License

ISC

