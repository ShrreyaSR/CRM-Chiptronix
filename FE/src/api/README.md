# Frontend API Collection

Well-organized, type-safe API client for Chiptronix CRM Frontend.

## 📁 Structure

```
api/
├── index.ts                 # Main entry point - exports all APIs
├── config.ts               # API configuration (base URL, timeout, etc.)
├── types.ts                # TypeScript types for API responses
├── client.ts               # Axios instance with interceptors
├── resources/              # Individual API modules
│   ├── client.api.ts
│   ├── technician.api.ts
│   ├── jobSheet.api.ts
│   ├── tray.api.ts
│   ├── modelBrand.api.ts
│   ├── complaint.api.ts
│   ├── vendor.api.ts
│   ├── salesPerson.api.ts
│   └── health.api.ts
└── README.md               # This file
```

## 🚀 Usage

### Basic Import

```typescript
import { crmApi } from '@/api';

// Get all clients
const response = await crmApi.client.getAll();
const clients = response.data.data;

// Create a client
await crmApi.client.create({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  clientType: "Customer"
});
```

### Individual API Imports

```typescript
import { clientApi, jobSheetApi } from '@/api';

// Use individual APIs
const clients = await clientApi.getAll();
const jobSheets = await jobSheetApi.getAll({ status: "Pending" });
```

### Type-Safe Responses

```typescript
import { crmApi } from '@/api';
import type { ApiResponse, PaginatedResponse } from '@/api';
import type { ClientDto } from '@/dtos';

// TypeScript will infer types automatically
const response = await crmApi.client.getAll();
// response.data is typed as ApiResponse<ClientDto[]>

// For paginated responses
const jobSheets = await crmApi.jobSheet.getAll({ page: 1, limit: 10 });
// jobSheets.data is typed as PaginatedResponse<JobSheetDto>
```

## 📋 Available APIs

### Client API (`crmApi.client`)
- `getAll(params?)` - Get all clients
- `getById(id)` - Get client by ID
- `create(data)` - Create new client
- `update(id, data)` - Update client
- `delete(id)` - Delete client

### Technician API (`crmApi.technician`)
- `getAll(params?)` - Get all technicians
- `getById(id)` - Get technician by ID
- `create(data)` - Create new technician
- `update(id, data)` - Update technician
- `delete(id)` - Delete technician

### Job Sheet API (`crmApi.jobSheet`)
- `getAll(params?)` - Get all job sheets (with advanced filtering)
- `getById(id)` - Get job sheet by ID
- `create(data)` - Create new job sheet
- `update(id, data)` - Update job sheet
- `delete(id)` - Delete job sheet

**Query Parameters:**
```typescript
{
  search?: string;
  status?: string;
  client?: number;
  assignedTo?: number;
  fromDate?: string;  // YYYY-MM-DD
  toDate?: string;    // YYYY-MM-DD
  sortField?: string;
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}
```

### Tray API (`crmApi.tray`)
- `getAll(params?)` - Get all trays
- `getById(id)` - Get tray by ID
- `create(data)` - Create new tray
- `update(id, data)` - Update tray (PATCH)
- `delete(id)` - Delete tray
- `bulkAdd(data)` - Bulk create trays

### Model Brand API (`crmApi.model`)
- `getAll(params?)` - Get all model/brand combinations
- `getById(id)` - Get model/brand by ID
- `create(data)` - Create new model/brand
- `update(id, data)` - Update model/brand
- `delete(id)` - Delete model/brand

### Complaint API (`crmApi.complaint`)
- `getAll(params?)` - Get all complaint types
- `getById(id)` - Get complaint by ID
- `create(data)` - Create new complaint type
- `update(id, data)` - Update complaint type
- `delete(id)` - Delete complaint type

### Vendor API (`crmApi.vendor`)
- `getAll(params?)` - Get all vendors
- `getById(id)` - Get vendor by ID
- `create(data)` - Create new vendor
- `update(id, data)` - Update vendor
- `delete(id)` - Delete vendor

### Sales Person API (`crmApi.salesPerson`)
- `getAll(params?)` - Get all sales persons
- `getById(id)` - Get sales person by ID
- `create(data)` - Create new sales person
- `update(id, data)` - Update sales person
- `delete(id)` - Delete sales person

### Health API (`crmApi.health`)
- `check()` - Check server health status

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

The API base URL defaults to `http://localhost:8080` if not set.

### Custom Configuration

```typescript
import { API_CONFIG } from '@/api';

// Access configuration
console.log(API_CONFIG.baseURL);
console.log(API_CONFIG.timeout);
```

## 🛡️ Error Handling

The API client includes automatic error handling:

1. **Request Interceptor**: Adds auth token if available
2. **Response Interceptor**: 
   - Shows toast notifications for errors
   - Logs errors in development mode
   - Handles network errors gracefully

### Error Response Format

```typescript
{
  success: false,
  error: {
    message: "Error message here"
  }
}
```

### Handling Errors Manually

```typescript
try {
  await crmApi.client.create(data);
} catch (error) {
  // Error is already logged and shown in toast
  // Handle additional logic here if needed
  console.error("Failed to create client:", error);
}
```

## 📝 Examples

### Example 1: Get All Clients with Search

```typescript
const response = await crmApi.client.getAll({
  search: "John",
  sortField: "name",
  sortOrder: "ASC"
});

const clients = response.data.data || [];
```

### Example 2: Create Job Sheet

```typescript
const jobSheet = await crmApi.jobSheet.create({
  client: { id: 1 },
  serviceType: "Chip level",
  deviceType: "Laptop",
  brand: { id: 1 },
  color: "Black",
  serialNumber: "SN123456",
  complaint: { id: 1 },
  tray: { id: 1 },
  receivedBy: { id: 1 },
  status: "Pending"
});
```

### Example 3: Filter Job Sheets by Date Range

```typescript
const jobSheets = await crmApi.jobSheet.getAll({
  fromDate: "2024-01-01",
  toDate: "2024-12-31",
  status: "Completed",
  page: 1,
  limit: 20
});
```

### Example 4: Bulk Create Trays

```typescript
const result = await crmApi.tray.bulkAdd({
  totalCount: 100
});

console.log(result.data.message); // "✅ Added 50 new trays..."
```

## 🔄 Migration from Old API

All components have been migrated to use the new API structure. The old `crmApi.ts` file has been removed.

**Current usage:**
```typescript
import { crmApi } from '@/api';
```

The API structure remains the same, so existing code continues to work.

## ✨ Features

- ✅ **Type-Safe**: Full TypeScript support with proper types
- ✅ **Organized**: Separate files for each resource
- ✅ **Error Handling**: Automatic error handling with toast notifications
- ✅ **Environment Config**: Support for environment variables
- ✅ **Interceptors**: Request/response interceptors for auth and errors
- ✅ **Complete**: All endpoints from backend are available
- ✅ **Documented**: JSDoc comments for all methods
- ✅ **Backward Compatible**: Works with existing code

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/api'"

Make sure your `tsconfig.json` or `vite.config.ts` has the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: API calls fail with CORS error

Check that:
1. Backend server is running
2. CORS is enabled on backend
3. `VITE_API_BASE_URL` matches backend URL

### Issue: No error toasts showing

Make sure `sonner` is properly set up in your app. Check `App.tsx` for `<Toaster />` component.

