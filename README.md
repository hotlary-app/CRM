# CRM - Customer Relationship Management System

A comprehensive Customer Relationship Management (CRM) system designed to streamline business operations, manage customer interactions, and drive growth through intelligent data organization and automation.

## 📋 Table of Contents

- [Features](#features)
- [Installation Guide](#installation-guide)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Hooks API Reference](#hooks-api-reference)
- [Database Schema](#database-schema)
- [Security Practices](#security-practices)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core CRM Features
- **Contact Management**: Centralized contact database with advanced search and filtering
- **Customer Lifecycle Tracking**: Monitor customer journey from acquisition to retention
- **Sales Pipeline Management**: Visual pipeline representation with customizable stages
- **Activity Tracking**: Log calls, emails, meetings, and custom interactions
- **Task Management**: Create, assign, and track tasks with due dates and priorities
- **Document Management**: Store and organize customer-related documents
- **Reporting & Analytics**: Generate insights with customizable reports and dashboards
- **Mobile Responsive**: Full access from desktop and mobile devices

### Advanced Features
- **Workflow Automation**: Automate repetitive tasks and trigger actions
- **Integration Support**: Connect with email, calendar, and third-party services
- **Role-Based Access Control (RBAC)**: Fine-grained permission management
- **Audit Logging**: Track all system activities for compliance
- **Multi-tenant Support**: Scalable architecture for multiple organizations
- **Real-time Notifications**: Stay updated with instant alerts
- **API-First Design**: RESTful API for custom integrations
- **Extensible Plugin Architecture**: Develop custom extensions and modules

## 🚀 Installation Guide

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn v3.6.0+)
- **Database**: PostgreSQL 12+ or MySQL 8.0+
- **Git**: v2.20.0 or higher
- **Redis**: v6.0+ (for caching and real-time features)

### Step 1: Clone the Repository

```bash
git clone https://github.com/hotlary-app/CRM.git
cd CRM
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration (see [Configuration](#configuration) section).

### Step 4: Database Setup

```bash
# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### Step 5: Build and Start

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Using Docker (optional)
docker-compose up -d
```

### Step 6: Verify Installation

Visit `http://localhost:3000` and verify the application is running.

```bash
# Run tests to verify installation
npm run test
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Application
NODE_ENV=development
APP_NAME=CRM
APP_URL=http://localhost:3000
APP_PORT=3000
APP_SECRET=your-secret-key-here

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_database
DB_USER=crm_user
DB_PASSWORD=secure_password
DB_DIALECT=postgres
# Alternative for MySQL:
# DB_DIALECT=mysql

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRE=30d

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=noreply@crm.example.com
MAIL_FROM_NAME=CRM System

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=crm-uploads

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Session
SESSION_SECRET=your-session-secret
SESSION_TIMEOUT=1800000

# API Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Timezone
TIMEZONE=UTC
```

### Configuration Files

#### `config/database.js`
Database connection configuration supporting multiple dialects.

#### `config/auth.js`
Authentication strategies and JWT settings.

#### `config/mail.js`
Email service configuration.

#### `config/storage.js`
File storage backend configuration (Local, S3, etc.).

### Feature Flags

Enable/disable features via environment variables:

```env
FEATURE_WORKFLOW_AUTOMATION=true
FEATURE_ADVANCED_ANALYTICS=true
FEATURE_API_ACCESS=true
FEATURE_THIRD_PARTY_INTEGRATIONS=true
```

## 📁 Project Structure

```
CRM/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── contacts.controller.js
│   │   │   ├── leads.controller.js
│   │   │   ├── deals.controller.js
│   │   │   ├── activities.controller.js
│   │   │   ├── tasks.controller.js
│   │   │   ├── reports.controller.js
│   │   │   └── users.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── contacts.routes.js
│   │   │   ├── leads.routes.js
│   │   │   ├── deals.routes.js
│   │   │   ├── activities.routes.js
│   │   │   ├── tasks.routes.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── errorHandler.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   ├── rateLimit.middleware.js
│   │   │   └── requestLogger.middleware.js
│   │   └── validators/
│   │       ├── contact.validator.js
│   │       ├── lead.validator.js
│   │       ├── deal.validator.js
│   │       └── auth.validator.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Contact.js
│   │   ├── Lead.js
│   │   ├── Deal.js
│   │   ├── Activity.js
│   │   ├── Task.js
│   │   ├── Organization.js
│   │   ├── Team.js
│   │   └── AuditLog.js
│   ├── services/
│   │   ├── ContactService.js
│   │   ├── LeadService.js
│   │   ├── DealService.js
│   │   ├── ActivityService.js
│   │   ├── TaskService.js
│   │   ├── UserService.js
│   │   ├── EmailService.js
│   │   ├── NotificationService.js
│   │   └── ReportService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useContacts.js
│   │   ├── useLeads.js
│   │   ├── useDeals.js
│   │   ├── useTasks.js
│   │   ├── useNotifications.js
│   │   └── usePermissions.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── errorHandler.js
│   │   ├── validators.js
│   │   ├── encryption.js
│   │   ├── dateHelpers.js
│   │   └── helpers.js
│   ├── migrations/
│   │   ├── 001_create_users_table.js
│   │   ├── 002_create_contacts_table.js
│   │   ├── 003_create_leads_table.js
│   │   └── ...
│   ├── seeds/
│   │   ├── seed-users.js
│   │   ├── seed-contacts.js
│   │   └── seed-data.js
│   ├── config/
│   │   ├── database.js
│   │   ├── auth.js
│   │   ├── mail.js
│   │   ├── storage.js
│   │   └── constants.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   ├── integration/
│   │   ├── api/
│   │   └── hooks/
│   └── fixtures/
│       └── mockData.js
├── docs/
│   ├── API.md
│   ├── HOOKS.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

## 🪝 Hooks API Reference

Hooks provide a way to tap into the CRM's lifecycle events and perform custom actions.

### useAuth

Manage authentication state and user sessions.

```javascript
import { useAuth } from './hooks/useAuth';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout, register } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

**Methods:**
- `login(email, password)` - Authenticate user
- `logout()` - End user session
- `register(userData)` - Create new account
- `refreshToken()` - Refresh authentication token
- `updateProfile(data)` - Update user profile

### useContacts

Manage contact operations and state.

```javascript
import { useContacts } from './hooks/useContacts';

const ContactsPage = () => {
  const {
    contacts,
    loading,
    error,
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts
  } = useContacts();

  const handleCreate = async (contactData) => {
    await createContact(contactData);
  };

  return (
    <div>
      {contacts.map(contact => (
        <div key={contact.id}>{contact.name}</div>
      ))}
    </div>
  );
};
```

**Methods:**
- `getContacts(filters, pagination)` - Fetch contacts with optional filtering
- `createContact(data)` - Create new contact
- `updateContact(id, data)` - Update existing contact
- `deleteContact(id)` - Delete contact
- `searchContacts(query)` - Search contacts by name, email, or phone
- `getContactById(id)` - Fetch single contact details
- `addContactActivity(id, activityData)` - Log activity for contact

### useLeads

Manage leads and lead qualification.

```javascript
import { useLeads } from './hooks/useLeads';

const LeadsPage = () => {
  const {
    leads,
    convertLead,
    scoreLead,
    updateLeadStatus
  } = useLeads();

  const handleConvert = async (leadId) => {
    const contact = await convertLead(leadId);
  };

  return (
    <div>
      {leads.map(lead => (
        <div key={lead.id}>
          {lead.name} - Score: {lead.score}
        </div>
      ))}
    </div>
  );
};
```

**Methods:**
- `getLeads(filters)` - Fetch leads
- `createLead(data)` - Create new lead
- `updateLeadStatus(id, status)` - Update lead status
- `convertLead(id)` - Convert lead to contact
- `scoreLead(id)` - Calculate lead score
- `assignLead(id, userId)` - Assign lead to user

### useDeals

Manage sales deals and pipeline.

```javascript
import { useDeals } from './hooks/useDeals';

const DealsPage = () => {
  const {
    deals,
    createDeal,
    updateDealStage,
    getDealsByStage
  } = useDeals();

  const handleStageChange = async (dealId, newStage) => {
    await updateDealStage(dealId, newStage);
  };

  return (
    <div>
      {deals.map(deal => (
        <div key={deal.id}>
          {deal.title} - ${deal.value}
        </div>
      ))}
    </div>
  );
};
```

**Methods:**
- `getDeals(filters)` - Fetch deals
- `createDeal(data)` - Create new deal
- `updateDealStage(id, stage)` - Move deal to different stage
- `updateDealValue(id, value)` - Update deal amount
- `getDealsByStage(stage)` - Get deals filtered by pipeline stage
- `closeDeal(id, status, notes)` - Close deal (won/lost)

### useTasks

Manage tasks and to-dos.

```javascript
import { useTasks } from './hooks/useTasks';

const TasksPage = () => {
  const {
    tasks,
    createTask,
    completeTask,
    assignTask
  } = useTasks();

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          {task.title} - Due: {task.dueDate}
        </div>
      ))}
    </div>
  );
};
```

**Methods:**
- `getTasks(filters)` - Fetch tasks
- `createTask(data)` - Create new task
- `updateTask(id, data)` - Update task
- `completeTask(id)` - Mark task as complete
- `assignTask(id, userId)` - Assign task to user
- `getMyTasks()` - Get current user's tasks

### useNotifications

Handle notifications and real-time updates.

```javascript
import { useNotifications } from './hooks/useNotifications';

const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications
  } = useNotifications();

  return (
    <div>
      Unread: {unreadCount}
      {notifications.map(notif => (
        <div key={notif.id}>{notif.message}</div>
      ))}
    </div>
  );
};
```

**Methods:**
- `getNotifications()` - Fetch notifications
- `markAsRead(id)` - Mark notification as read
- `clearNotifications()` - Clear all notifications
- `subscribe(eventType, callback)` - Subscribe to real-time events

### usePermissions

Check and manage user permissions.

```javascript
import { usePermissions } from './hooks/usePermissions';

const AdminPanel = () => {
  const { hasPermission, can } = usePermissions();

  return (
    <div>
      {can('manage-users') && <UserManagement />}
      {hasPermission('view-reports') && <ReportsSection />}
    </div>
  );
};
```

**Methods:**
- `hasPermission(permission)` - Check if user has permission
- `can(action)` - Check if user can perform action
- `canAccess(resource)` - Check resource access

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  organization_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);
```

### Contacts Table

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  job_title VARCHAR(100),
  address VARCHAR(500),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  notes TEXT,
  avatar_url VARCHAR(500),
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_contacts_organization_id ON contacts(organization_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE FULL TEXT INDEX idx_contacts_search ON contacts(first_name, last_name, email);
```

### Leads Table

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  source VARCHAR(50),
  status VARCHAR(50) DEFAULT 'new',
  lead_score INTEGER DEFAULT 0,
  converted_contact_id UUID,
  assigned_to UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (converted_contact_id) REFERENCES contacts(id)
);

CREATE INDEX idx_leads_organization_id ON leads(organization_id);
CREATE INDEX idx_leads_status ON leads(status);
```

### Deals Table

```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  contact_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  value DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  stage VARCHAR(50) NOT NULL DEFAULT 'prospecting',
  probability DECIMAL(5, 2) DEFAULT 0,
  expected_close_date DATE,
  owner_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  closed_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE INDEX idx_deals_organization_id ON deals(organization_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_owner_id ON deals(owner_id);
```

### Activities Table

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  contact_id UUID,
  deal_id UUID,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'completed',
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id),
  FOREIGN KEY (deal_id) REFERENCES deals(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_activities_contact_id ON activities(contact_id);
CREATE INDEX idx_activities_deal_id ON activities(deal_id);
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  assigned_to UUID,
  created_by UUID NOT NULL,
  related_contact_id UUID,
  related_deal_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (related_contact_id) REFERENCES contacts(id),
  FOREIGN KEY (related_deal_id) REFERENCES deals(id)
);

CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### Audit Logs Table

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
```

## 🔒 Security Practices

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication with expiration
- **Password Security**: 
  - Minimum 12 characters with complexity requirements
  - bcrypt hashing with salt rounds
  - No password reuse (last 5 passwords)
  - Forced password reset every 90 days
- **Two-Factor Authentication (2FA)**: Optional TOTP/SMS support
- **Session Management**:
  - Secure session tokens in Redis
  - Session timeout after 30 minutes of inactivity
  - Automatic logout on suspicious activity

### Data Protection

- **Encryption**:
  - TLS 1.2+ for all data in transit
  - AES-256 encryption for sensitive data at rest
  - Field-level encryption for PII (Personally Identifiable Information)
- **Data Masking**: Sensitive data masked in logs and exports
- **Backup Security**: Encrypted backups with separate key management

### Access Control

- **Role-Based Access Control (RBAC)**:
  - Admin, Manager, Sales Rep, View-Only roles
  - Custom role creation supported
  - Permission-level granularity
- **Row-Level Security (RLS)**: Users can only access authorized organization data
- **API Rate Limiting**: 100 requests per 15 minutes per user

### Compliance & Audit

- **Audit Logging**: All user actions logged with timestamp and IP
- **GDPR Compliance**: Right to be forgotten, data portability features
- **SOC 2 Ready**: Designed for security compliance
- **Penetration Testing**: Regular security audits recommended
- **Data Residency**: Configurable data storage regions

### Application Security

```javascript
// Input Validation
const validateInput = (data) => {
  return validator.isEmail(data.email) && 
         validator.isMobilePhone(data.phone);
};

// SQL Injection Prevention
// Using parameterized queries
const user = await User.findByEmail(email); // Not: SELECT * FROM users WHERE email = '${email}'

// CSRF Protection
app.use(csrf());

// XSS Prevention
app.use(helmet());

// Dependency Scanning
// Regular npm audit and snyk scanning
```

### Configuration Security

- No sensitive data in source code
- Environment variables for all secrets
- Key rotation every 90 days
- Separate credentials per environment

### Incident Response

- Security contact: security@hotlary-app.com
- Responsible disclosure policy
- Incident response playbook maintained
- Regular security training for team

## 📝 Usage Examples

### Example 1: Creating a Contact

```javascript
import { useContacts } from './hooks/useContacts';

const AddContactForm = () => {
  const { createContact, loading } = useContacts();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newContact = await createContact(formData);
      console.log('Contact created:', newContact);
      // Reset form or redirect
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={formData.first_name}
        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
      />
      {/* More fields */}
      <button type="submit" disabled={loading}>Create Contact</button>
    </form>
  );
};
```

### Example 2: Managing the Sales Pipeline

```javascript
import { useDeals } from './hooks/useDeals';

const SalesPipeline = () => {
  const { getDealsByStage, updateDealStage } = useDeals();
  const [dealsByStage, setDealsByStage] = useState({});

  useEffect(() => {
    const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed'];
    Promise.all(
      stages.map(stage => getDealsByStage(stage))
    ).then(results => {
      const grouped = {};
      stages.forEach((stage, i) => {
        grouped[stage] = results[i];
      });
      setDealsByStage(grouped);
    });
  }, []);

  const handleDragEnd = async (dealId, newStage) => {
    await updateDealStage(dealId, newStage);
  };

  return (
    <div className="pipeline">
      {Object.entries(dealsByStage).map(([stage, deals]) => (
        <div key={stage} className="pipeline-column">
          <h3>{stage}</h3>
          {deals.map(deal => (
            <div key={deal.id} draggable onDragEnd={() => handleDragEnd(deal.id, stage)}>
              {deal.title} - ${deal.value}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### Example 3: Task Assignment and Tracking

```javascript
import { useTasks } from './hooks/useTasks';

const TaskManager = () => {
  const { getTasks, createTask, completeTask, assignTask } = useTasks();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks({ status: 'open', priority: 'high' }).then(setTasks);
  }, []);

  const handleCreateTask = async (taskData) => {
    const newTask = await createTask({
      ...taskData,
      assigned_to: 'user-id'
    });
    setTasks([...tasks, newTask]);
  };

  const handleCompleteTask = async (taskId) => {
    await completeTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <h4>{task.title}</h4>
          <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
          <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
        </div>
      ))}
    </div>
  );
};
```

### Example 4: Activity Logging

```javascript
import { useContacts } from './hooks/useContacts';

const ContactDetail = ({ contactId }) => {
  const { addContactActivity } = useContacts();

  const logCall = async () => {
    await addContactActivity(contactId, {
      type: 'call',
      title: 'Phone Call',
      description: 'Discussed Q1 proposal',
      completed_at: new Date()
    });
  };

  const logEmail = async () => {
    await addContactActivity(contactId, {
      type: 'email',
      title: 'Email Sent',
      description: 'Sent project proposal'
    });
  };

  return (
    <div>
      <button onClick={logCall}>Log Call</button>
      <button onClick={logEmail}>Log Email</button>
    </div>
  );
};
```

### Example 5: Real-time Notifications

```javascript
import { useNotifications } from './hooks/useNotifications';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, subscribe } = useNotifications();

  useEffect(() => {
    // Subscribe to real-time events
    const unsubscribe = subscribe('task-assigned', (notification) => {
      console.log('New task assigned:', notification);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="notification-center">
      <h3>Notifications ({unreadCount})</h3>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          {notif.message}
        </div>
      ))}
    </div>
  );
};
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm run test -- contacts.test.js

# Watch mode
npm run test:watch
```

## 📚 Additional Resources

- [API Documentation](./docs/API.md)
- [Hooks Guide](./docs/HOOKS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Architecture Documentation](./docs/ARCHITECTURE.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 📞 Support & Contact

- **Email**: support@hotlary-app.com
- **Issues**: [GitHub Issues](https://github.com/hotlary-app/CRM/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hotlary-app/CRM/discussions)

---

**Last Updated**: 2026-01-09  
**Version**: 1.0.0  
**Maintainer**: Hotlary App Team
