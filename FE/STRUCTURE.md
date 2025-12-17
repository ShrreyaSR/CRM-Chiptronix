# Frontend Structure Organization

## 📁 Current Structure

```
FE/src/
├── api/                          # API Collection (organized)
│   ├── index.ts                 # Main API exports
│   ├── config.ts                # API configuration
│   ├── client.ts                # Axios client with interceptors
│   ├── types.ts                 # TypeScript types
│   └── resources/               # Individual API modules
│       ├── client.api.ts
│       ├── technician.api.ts
│       ├── jobSheet.api.ts
│       ├── tray.api.ts
│       ├── modelBrand.api.ts
│       ├── complaint.api.ts
│       ├── vendor.api.ts
│       ├── salesPerson.api.ts
│       └── health.api.ts
│
├── components/                   # React Components
│   ├── JobSheetManagement/      # Job Sheet Module
│   │   ├── JobSheet.tsx         # Job Sheet List/View
│   │   ├── AddJobSheet.tsx      # Add Job Sheet Form
│   │   ├── JobSheetAddition.tsx
│   │   └── Helpers.tsx
│   │
│   ├── TechnicianManagement/    # Technician Module
│   │   ├── Technician.tsx       # Technician Details Component
│   │   └── TechnicianManagement.tsx  # Wrapper with Tabs (Details & Management)
│   │
│   ├── ClientManagement/        # Client Module
│   │   ├── Client.tsx           # Client Details Component
│   │   └── ClientManagement.tsx # Wrapper with Tabs (Details & Management)
│   │
│   ├── SalesPersonManagement/   # Sales Person Module (NEW)
│   │   ├── SalesPerson.tsx      # Sales Person Details Component
│   │   └── SalesPersonManagement.tsx  # Wrapper with Tabs (Details & Management)
│   │
│   ├── MasterData/              # Master Data Module
│   │   ├── MasterData.tsx       # Main wrapper with tabs
│   │   ├── Trays.tsx            # Tray Management
│   │   ├── ModelsBrands.tsx     # Model & Brand Management
│   │   └── Complaints.tsx       # Complaint Types Management
│   │
│   ├── ui/                      # Reusable UI Components (shadcn/ui)
│   ├── MainLayout.tsx           # Main layout with sidebar
│   ├── LoginPage.tsx            # Login page
│   ├── AdminDashboard.tsx       # (Legacy - can be removed)
│   ├── JobSheetBill.tsx         # Job sheet bill component
│   └── SerialNumberBarcode.tsx  # Barcode component
│
├── routes/
│   └── AppRoutes.tsx            # Route definitions
│
├── dtos/
│   └── index.ts                 # TypeScript DTOs/interfaces
│
└── styles/
    └── globals.css              # Global styles
```

## 🗺️ Navigation Structure

The application follows this navigation hierarchy:

1. **Job Sheet** (`/jobsheet`)
   - List and manage all job sheets
   - View job sheet details
   - Filter, search, and sort job sheets

2. **Add Job Sheet** (`/add-jobsheet`)
   - Create new job sheet
   - Form for entering job sheet details

3. **Technicians** (`/technician`)
   - **Details Tab**: View technician list
   - **Management Tab**: Add/Edit/Delete technicians

4. **Clients** (`/client`)
   - **Details Tab**: View client list
   - **Management Tab**: Add/Edit/Delete clients

5. **Master Data** (`/master-data`)
   - **Tray Tab**: Manage storage trays
   - **Models & Brands Tab**: Manage device models and brands
   - **Complaint Types Tab**: Manage complaint types

6. **Sales Person** (`/sales-person`) ✨ NEW
   - **Details Tab**: View sales person list
   - **Management Tab**: Add/Edit/Delete sales persons

## 🔄 Route Mapping

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `JobSheet` | Default route - Job Sheet list |
| `/jobsheet` | `JobSheet` | Job Sheet list/view |
| `/add-jobsheet` | `AddJobSheet` | Add new job sheet form |
| `/technician` | `TechnicianManagement` | Technician module with tabs |
| `/client` | `ClientManagement` | Client module with tabs |
| `/master-data` | `MasterData` | Master data module with tabs |
| `/sales-person` | `SalesPersonManagement` | Sales person module with tabs |

## 📝 Component Organization Pattern

### Pattern 1: Standalone Components
- **JobSheet**: Single component for listing/viewing
- **AddJobSheet**: Single component for creating

### Pattern 2: Tabbed Management Components
- **TechnicianManagement**: Wrapper with tabs
  - `Technician.tsx` - Details/List component
- **ClientManagement**: Wrapper with tabs
  - `Client.tsx` - Details/List component
- **SalesPersonManagement**: Wrapper with tabs
  - `SalesPerson.tsx` - Details/List component

### Pattern 3: Master Data (Multi-tab)
- **MasterData**: Wrapper with 3 tabs
  - `Trays.tsx` - Tray management
  - `ModelsBrands.tsx` - Model/Brand management
  - `Complaints.tsx` - Complaint type management

## ✅ Completed Organization

- ✅ Created SalesPersonManagement component structure
- ✅ Updated routes to match navigation structure
- ✅ Updated MainLayout navigation menu
- ✅ Fixed import paths (MainLayout typo)
- ✅ Organized API collection
- ✅ All components follow consistent patterns

## 🎯 Next Steps (File-wise Changes)

1. **Refactor JobSheet component**
   - Remove prop drilling (clients, employees, etc.)
   - Fetch data internally using API

2. **Refactor AddJobSheet component**
   - Remove prop dependencies
   - Use API to fetch required data
   - Improve form validation

3. **Standardize component patterns**
   - Ensure all management components follow same structure
   - Consistent error handling
   - Consistent loading states

4. **Improve TypeScript types**
   - Remove `any` types
   - Add proper interfaces
   - Better type safety

5. **Add error boundaries**
   - Wrap routes in error boundaries
   - Better error handling

6. **Optimize imports**
   - Use path aliases consistently
   - Remove unused imports

