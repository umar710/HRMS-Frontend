# HRMS Frontend - Human Resource Management System

A modern, responsive Human Resource Management System (HRMS) frontend built with React.js and Tailwind CSS. Provides a complete user interface for managing employees, teams, and tracking organizational activities.

## 🚀 Live Deployment

**Live Application:** [https://hrms-frontend-sand.vercel.app](https://hrms-frontend-sand.vercel.app)

## 🧪 Testing & Demo

### Quick Start for Testing

#### Option 1: Create Your Organisation Account (Recommended for Full Testing)

1. **Visit:** [https://hrms-frontend-sand.vercel.app/register](https://hrms-frontend-sand.vercel.app/register)
2. **Fill in the registration form:**
   ```
   Organisation Name: YourCompanyName
   Your Name: Your Full Name
   Email address: your-email@test.com
   Password: password123
   Confirm Password: password123
   ```
3. **Click "Create Account"**
4. **You'll be automatically logged in and redirected to the dashboard**

#### Option 2: Use Existing Demo Accounts

If you prefer to use pre-configured accounts:

**🏢 TechCorp Solutions**
```
Organisation Name: TechCorp Solutions
Email: admin@techcorp.com
Password: password123
```

### 🔐 Authentication Pages

#### Create Your Organisation Account (`/register`)
- Register your company and create the first admin user
- All fields are required with validation
- Organisation name must be unique
- Email must be unique across all organisations
- Password must be at least 6 characters

#### Sign in to Your Account (`/login`)
- Login with your organisation credentials
- Requires organisation name, email, and password
- Secure JWT token-based authentication
- Automatic redirect to dashboard on success

### 📱 Application Tour

After logging in, explore these features:

#### 🏠 Dashboard (`/`)
- Overview of your organisation
- Employee and team statistics
- Recent activity feed
- Quick access to all features

#### 👥 Employees Management (`/employees`)
- **View Employees**: See all employees with team assignments
- **Add Employee**: Create new employee records
- **Edit Employee**: Update existing employee information
- **Delete Employee**: Remove employees with confirmation
- **Assign to Teams**: Manage team memberships

#### 👨‍👩‍👧‍👦 Teams Management (`/teams`)
- **View Teams**: Card-based team display
- **Create Team**: Establish new teams with descriptions
- **Edit Team**: Modify team information
- **Delete Team**: Remove teams
- **View Members**: See all team members

#### 📊 Audit Logs (`/audit-logs`)
- **Activity Tracking**: Complete history of all actions
- **Filtering**: Filter by action type, resource, and date
- **Statistics**: Action counts and daily activity
- **Pagination**: Navigate through activity history

## 🎯 Complete Test Scenario

### Step-by-Step Testing Guide

#### Phase 1: Account Setup
1. **Register New Organisation**
   - Go to registration page
   - Fill in organisation details
   - Create admin account
   - Verify automatic login

2. **Test Login/Logout**
   - Log out from the application
   - Log back in with your credentials
   - Verify session persistence

#### Phase 2: Employee Management
3. **Add Sample Employees**
   ```
   Employee 1:
   - First Name: John
   - Last Name: Smith
   - Email: john.smith@yourcompany.com
   - Position: Software Engineer
   - Department: Engineering
   - Hire Date: 2024-01-15
   ```

   ```
   Employee 2:
   - First Name: Sarah
   - Last Name: Johnson
   - Email: sarah.johnson@yourcompany.com
   - Position: Product Manager
   - Department: Product
   - Hire Date: 2024-02-01
   ```

4. **Test Employee Operations**
   - Edit an employee's position
   - Assign employees to teams (after creating teams)
   - Delete an employee (with confirmation)

#### Phase 3: Team Management
5. **Create Teams**
   ```
   Team 1:
   - Name: Development Team
   - Description: Software development and engineering
   ```

   ```
   Team 2:
   - Name: Product Team
   - Description: Product management and design
   ```

6. **Assign Employees to Teams**
   - Use the "Assign Teams" button on Employees page
   - Assign multiple employees to each team
   - Verify team member counts update

#### Phase 4: Audit & Reporting
7. **Check Audit Logs**
   - Navigate to Audit Logs page
   - Verify all your actions are recorded
   - Test filtering by different criteria

8. **Review Dashboard**
   - Check updated statistics
   - Verify recent activities list
   - Confirm employee and team counts

### 🐛 Testing Edge Cases

#### Authentication Testing
- ✅ Register with duplicate organisation name (should show error)
- ✅ Register with duplicate email (should show error)
- ✅ Login with invalid credentials (should show error)
- ✅ Access protected routes without login (should redirect to login)

#### Form Validation Testing
- ✅ Employee form with missing required fields
- ✅ Invalid email format in forms
- ✅ Team name uniqueness validation
- ✅ Password confirmation mismatch

#### Data Operations Testing
- ✅ Create employee with existing email (should show error)
- ✅ Delete employee with team assignments
- ✅ Edit team with existing name (should show error)
- ✅ Assign employee to same team multiple times (should show error)

### 📊 Expected Test Results

After completing the test scenario:

#### Dashboard
- ✅ 2 employees shown in total count
- ✅ 2 teams shown in total count
- ✅ Recent activities showing your actions
- ✅ Statistics updating in real-time

#### Employees Page
- ✅ Both employees displayed with correct information
- ✅ Team assignments showing as colored badges
- ✅ All action buttons functional

#### Teams Page
- ✅ Both teams displayed in cards
- ✅ Member counts accurate (1-2 members each)
- ✅ Team descriptions visible
- ✅ Edit/delete functionality working

#### Audit Logs
- ✅ Complete trail of all 10+ actions performed
- ✅ User information for each action
- ✅ Timestamps for all activities
- ✅ Filtering working correctly

### 🎯 Quick Demo for Interviews

**5-Minute Demo Script:**

1. **"Let me show you our HRMS application"** - Open live URL
2. **"First, I'll register a new organisation"** - Demo registration flow
3. **"Now I'll add some sample employees"** - Create 2 employees quickly
4. **"Let me create teams and assign members"** - Team creation & assignment
5. **"Notice the real-time dashboard updates"** - Show statistics
6. **"All activities are automatically logged"** - Demonstrate audit trail
7. **"The app is fully responsive"** - Show mobile view

### 📝 Sample Data for Quick Testing

#### Quick Employee Setup:
```json
[
  {
    "first_name": "Alex",
    "last_name": "Thompson",
    "email": "alex.thompson@test.com",
    "position": "Frontend Developer",
    "department": "Engineering"
  },
  {
    "first_name": "Maria",
    "last_name": "Garcia", 
    "email": "maria.garcia@test.com",
    "position": "UX Designer",
    "department": "Design"
  }
]
```

#### Quick Team Setup:
```json
[
  {
    "name": "Web Development",
    "description": "Frontend and backend web development"
  },
  {
    "name": "Design Team",
    "description": "User experience and interface design"
  }
]
```

## 🛠️ Tech Stack

- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Query (TanStack Query)
- **HTTP Client:** Axios
- **Forms:** React Hook Form
- **UI Components:** Headless UI
- **Icons:** Heroicons
- **Date Handling:** date-fns
- **Deployment:** Vercel

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.js           # Main layout with navigation
│   │   ├── Modal.js            # Reusable modal component
│   │   ├── EmployeeForm.js     # Employee create/edit form
│   │   ├── TeamForm.js         # Team create/edit form
│   │   └── TeamAssignment.js   # Team assignment component
│   ├── pages/
│   │   ├── Login.js            # Sign in to your account
│   │   ├── Register.js         # Create organisation account
│   │   ├── Dashboard.js        # Overview dashboard
│   │   ├── Employees.js        # Employee management
│   │   ├── Teams.js            # Team management
│   │   └── AuditLogs.js        # Activity tracking
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── contexts/
│   │   └── AuthContext.js      # Authentication context
│   └── App.js                  # Main application component
```

## 🚀 Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hrms/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Application runs at** `http://localhost:3000`

## 🔗 Links

- **Live Application:** https://hrms-frontend-sand.vercel.app
- **Backend API:** https://hrms-backend-q8zb.onrender.com
- **Source Code:** [GitHub Repository]

## 📞 Support

For issues or questions during testing:
1. Check browser console for errors
2. Verify all form fields are filled correctly
3. Ensure stable internet connection
4. Try refreshing the page if issues persist

---
