# Postman Collection Guide

## 📥 Import Instructions

1. Open Postman
2. Click **Import** button (top left)
3. Select the file: `Chiptronix_CRM.postman_collection.json`
4. The collection will be imported with all endpoints organized in folders

## 🔧 Setup Environment Variable

The collection uses a `base_url` variable. To set it up:

1. In Postman, click on the collection name
2. Go to **Variables** tab
3. Set `base_url` to: `http://localhost:8080` (or your server URL)
4. Click **Save**

Alternatively, you can create a Postman Environment:
1. Click **Environments** (left sidebar)
2. Click **+** to create new environment
3. Add variable: `base_url` = `http://localhost:8080`
4. Save and select the environment

## 📋 Collection Structure

The collection is organized into the following folders:

### 1. **Health Check**
- `GET /health` - Check server status

### 2. **Clients**
- `GET /clients` - Get all clients (with search, filter, sort)
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client

### 3. **Technicians**
- `GET /technicians` - Get all technicians
- `POST /technicians` - Create technician
- `PUT /technicians/:id` - Update technician
- `DELETE /technicians/:id` - Delete technician

### 4. **Job Sheets** (Core Feature)
- `GET /jobsheets` - Get all job sheets (advanced filtering)
- `POST /jobsheets` - Create job sheet
- `PUT /jobsheets/:id` - Update job sheet
- `DELETE /jobsheets/:id` - Delete job sheet

### 5. **Trays**
- `GET /trays` - Get all trays
- `GET /trays/:id` - Get tray by ID
- `POST /trays` - Create tray
- `PATCH /trays/:id` - Update tray
- `DELETE /trays/:id` - Delete tray
- `POST /trays/bulk` - Bulk create trays

### 6. **Model Brands**
- `GET /model-brands` - Get all model/brand combinations
- `POST /model-brands` - Create model/brand
- `PUT /model-brands/:id` - Update model/brand
- `DELETE /model-brands/:id` - Delete model/brand

### 7. **Complaints**
- `GET /complaints` - Get all complaint types
- `POST /complaints` - Create complaint type
- `PUT /complaints/:id` - Update complaint type
- `DELETE /complaints/:id` - Delete complaint type

### 8. **Vendors**
- `GET /vendor` - Get all vendors
- `POST /vendor` - Create vendor
- `PUT /vendor/:id` - Update vendor
- `DELETE /vendor/:id` - Delete vendor

### 9. **Sales Persons**
- `GET /sales-person` - Get all sales persons
- `POST /sales-person` - Create sales person
- `PUT /sales-person/:id` - Update sales person
- `DELETE /sales-person/:id` - Delete sales person

## 🚀 Quick Start Testing Flow

### Step 1: Check Server Health
```
GET /health
```

### Step 2: Create Master Data (Required for Job Sheets)

1. **Create a Client:**
   ```
   POST /clients
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "+1234567890",
     "address": "123 Main St",
     "clientType": "Customer"
   }
   ```
   Note the `id` from response (e.g., `1`)

2. **Create a Technician:**
   ```
   POST /technicians
   Body: {
     "name": "Tech Master",
     "email": "tech@chiptronix.com",
     "password": "password123",
     "phone": "+1234567890",
     "dob": "1990-01-15",
     "doj": "2020-01-01"
   }
   ```
   Note the `id` from response (e.g., `1`)

3. **Create a Model/Brand:**
   ```
   POST /model-brands
   Body: {
     "brand": "Dell",
     "model": "Inspiron 15",
     "description": "15.6 inch laptop"
   }
   ```
   Note the `id` from response (e.g., `1`)

4. **Create a Complaint:**
   ```
   POST /complaints
   Body: {
     "description": "Screen not working"
   }
   ```
   Note the `id` from response (e.g., `1`)

5. **Create a Tray:**
   ```
   POST /trays
   Body: {
     "trayNumber": 1,
     "status": "Free"
   }
   ```
   Note the `id` from response (e.g., `1`)

### Step 3: Create a Job Sheet
```
POST /jobsheets
Body: {
  "client": { "id": 1 },
  "serviceType": "Chip level",
  "deviceType": "Laptop",
  "brand": { "id": 1 },
  "color": "Black",
  "serialNumber": "SN123456789",
  "complaint": { "id": 1 },
  "problemsIdentified": "Screen not working",
  "tray": { "id": 1 },
  "receivedFrom": "Customer directly",
  "assignedTo": { "id": 1 },
  "receivedBy": { "id": 1 },
  "estimateAmount": 5000,
  "payment": 2000,
  "status": "Pending"
}
```

### Step 4: Query Job Sheets
```
GET /jobsheets?status=Pending&page=1&limit=10
```

## 📝 Query Parameters Guide

### Common Parameters (Most GET endpoints)
- `search` - Search term (searches relevant fields)
- `sortField` - Field to sort by
- `sortOrder` - `ASC` or `DESC`

### Job Sheets Specific Parameters
- `search` - Searches client name, service type, brand, model, serial number, etc.
- `status` - Filter by: `Pending`, `In Progress`, `Completed`, `Delivered`, `Waiting for Spares`, `Waiting for Customer Reply`
- `client` - Filter by client ID
- `assignedTo` - Filter by technician ID
- `fromDate` - Start date (YYYY-MM-DD)
- `toDate` - End date (YYYY-MM-DD)
- `sortField` - Field to sort by (default: `createdOn`)
- `sortOrder` - `ASC` or `DESC` (default: `DESC`)
- `page` - Page number (default: `1`)
- `limit` - Items per page (default: `10`, use `-1` for all)

## ✅ Expected Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "total": 10  // For list endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

## 🔍 Testing Tips

1. **Use Collection Variables**: Update `:id` values in URL variables before testing
2. **Check Response Status**: All successful requests return `200` or `201` (created)
3. **Error Handling**: Failed requests return `400`, `404`, or `500` with error details
4. **Pagination**: Use `limit=-1` to get all records without pagination
5. **Date Format**: Use `YYYY-MM-DD` format for date filters

## 🎯 Example Test Scenarios

### Scenario 1: Complete Job Sheet Workflow
1. Create client → Get client ID
2. Create technician → Get technician ID
3. Create model/brand → Get model/brand ID
4. Create complaint → Get complaint ID
5. Create tray → Get tray ID
6. Create job sheet using all IDs
7. Update job sheet status to "In Progress"
8. Update job sheet with fix summary
9. Update job sheet status to "Completed"
10. Query job sheets by status

### Scenario 2: Bulk Operations
1. Bulk create trays: `POST /trays/bulk` with `{"totalCount": 100}`
2. Get all trays sorted by tray number
3. Update multiple trays to "Occupied" status

### Scenario 3: Search and Filter
1. Search clients by name: `GET /clients?search=John`
2. Filter job sheets by status: `GET /jobsheets?status=Pending`
3. Filter job sheets by date range: `GET /jobsheets?fromDate=2024-01-01&toDate=2024-12-31`
4. Combine filters: `GET /jobsheets?status=In Progress&client=1&assignedTo=1`

## 🐛 Troubleshooting

### Issue: "Cannot connect to server"
- Check if backend server is running (`npm run dev`)
- Verify `base_url` variable is set correctly
- Check if port 8080 is available

### Issue: "404 Not Found"
- Verify the endpoint path is correct
- Check if the resource ID exists
- Ensure route is registered in `app.ts`

### Issue: "400 Bad Request"
- Check request body format (must be valid JSON)
- Verify required fields are provided
- Check data types match entity definitions

### Issue: "500 Internal Server Error"
- Check server logs for detailed error
- Verify database connection
- Check if related entities exist (for foreign key relationships)

## 📚 Additional Resources

- See `README.md` for API documentation
- Check server logs for detailed error messages
- Review entity definitions in `src/entities/` for field requirements


