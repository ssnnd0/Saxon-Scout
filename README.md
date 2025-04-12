# Team 611 Saxons 

### Key Implementation Decisions

1. **Frontend Architecture**:
   - React.js with functional components and hooks for UI management
   - React Router for navigation between different sections
   - Context API for state management
   - Service workers for PWA capabilities
   - Tailwind CSS for responsive design with a dark grey theme
   - Form validation using Formik and Yup

2. **Backend Architecture**:
   - Node.js with Express.js for API endpoints
   - JWT for authentication
   - File-based storage using Node's fs module
   - Bcrypt for password hashing
   - Winston for error logging
   - Express-rate-limit for API rate limiting

3. **Data Storage**:
   - User data stored in separate text files
   - Match data stored in JSON-formatted text files
   - Configuration data stored in JSON files
   - Daily backup functionality with file rotation

4. **PWA Features**:
   - Offline functionality for data collection during competitions
   - Installable on mobile devices and laptops
   - Background sync for data when connectivity returns

5. **Security Measures**:
   - JWT-based authentication
   - Password hashing with bcrypt
   - Input sanitization to prevent injection attacks
   - Rate limiting to prevent brute force attacks
   - Role-based access control

### Open Source Libraries

- **Frontend**:
  - React.js - Core UI library
  - React Router - Navigation
  - Formik/Yup - Form handling and validation
  - Chart.js - Data visualization
  - Workbox - PWA service worker management
  - Axios - HTTP client

- **Backend**:
  - Express.js - Web server framework
  - jsonwebtoken - JWT implementation
  - bcrypt - Password hashing
  - winston - Logging
  - express-rate-limit - Rate limiting
  - multer - File upload handling
  - csv-parser/csv-writer - CSV data processing

## Data structures and interfaces

The system will use several key data structures and interfaces to manage the information flow. These are designed to be modular and maintainable while supporting the required functionality.

See the class diagram in `saxon_scouting_class_diagram.mermaid` for a detailed view of the data structures and their relationships.

## Program call flow

The system consists of multiple interactions between different components. The sequence diagram in `saxon_scouting_sequence_diagram.mermaid` illustrates the main program call flows for various scenarios.

## File Structure

```
saxon-scouting/
â”œâ”€â”€ client/                  # Frontend React application
â”‚   â”œâ”€â”€ public/
â”‚   â”‚   â”œâ”€â”€ manifest.json    # PWA manifest
â”‚   â”‚   â”œâ”€â”€ service-worker.js
â”‚   â”‚   â”œâ”€â”€ icons/          # PWA icons
â”‚   â”‚   â””â”€â”€ index.html
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ components/     # React components
â”‚   â”‚   â”‚   â”œâ”€â”€ auth/
â”‚   â”‚   â”‚   â”œâ”€â”€ forms/
â”‚   â”‚   â”‚   â”œâ”€â”€ dashboard/
â”‚   â”‚   â”‚   â”œâ”€â”€ admin/
â”‚   â”‚   â”‚   â””â”€â”€ common/
â”‚   â”‚   â”œâ”€â”€ context/        # React context providers
â”‚   â”‚   â”œâ”€â”€ services/       # API services
â”‚   â”‚   â”œâ”€â”€ utils/          # Utility functions
â”‚   â”‚   â”œâ”€â”€ assets/         # Static assets & stylesheets
â”‚   â”‚   â”‚   â””â”€â”€ css/
â”‚   â”‚   â”œâ”€â”€ App.js
â”‚   â”‚   â””â”€â”€ index.js
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ server/                  # Backend Node.js application
â”‚   â”œâ”€â”€ controllers/         # Business logic controllers
â”‚   â”œâ”€â”€ middleware/          # Express middleware
â”‚   â”œâ”€â”€ models/              # Data models
â”‚   â”œâ”€â”€ routes/              # API routes
â”‚   â”œâ”€â”€ services/            # Business logic services
â”‚   â”œâ”€â”€ utils/               # Utility functions
â”‚   â”œâ”€â”€ data/                # Data storage directory
â”‚   â”‚   â”œâ”€â”€ users/
â”‚   â”‚   â”œâ”€â”€ matches/
â”‚   â”‚   â”œâ”€â”€ teams/
â”‚   â”‚   â”œâ”€â”€ seasons/
â”‚   â”‚   â”œâ”€â”€ logs/
â”‚   â”‚   â””â”€â”€ backups/
â”‚   â”œâ”€â”€ index.js             # Main entry point
â”‚   â”œâ”€â”€ package.json
â”‚   â””â”€â”€ README.md
â”œâ”€â”€ docs/                    # Documentation
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

## Installation and Setup Instructions

A text file named `SETUP.txt` will be included with the application to provide administrators with clear instructions on how to set up and deploy the system. This file will include:

```
SAXON SCOUTING SYSTEM - SETUP INSTRUCTIONS

1. Server Setup:
   - Install Node.js (v16 or higher) and npm
   - Navigate to the server directory
   - Run 'npm install' to install dependencies
   - Configure .env file with your secret key
   - Run 'npm start' to start the server

2. Client Setup:
   - Navigate to the client directory
   - Run 'npm install' to install dependencies
   - Run 'npm start' for development or 'npm run build' for production
   - For production, deploy the build folder to your web server

3. PWA Installation:
   - Access the application in Chrome/Safari/Firefox
   - Look for 'Install' button or similar prompt in address bar
   - Follow browser instructions to install as PWA

4. File Uploads:
   - Upload team list: Place a text file named 'teams.txt' in /server/data/teams/
     Format: One team per line with team_number,team_name
   - Initial season config: Place 'season_config.json' in /server/data/seasons/
   - Initial user accounts: Place 'admin.txt' in /server/data/users/
     Format: username,password,role (e.g., admin,password123,admin)

5. First-time Login:
   - Default admin credentials: admin / saxon611
   - IMPORTANT: Change default password immediately after first login

6. Backup Considerations:
   - Automatic backups stored in /server/data/backups/
   - Manual backup available from Admin Portal
   - Restore from backup: Place backup file in /server/data/backups/ and use Admin Portal

For additional help or troubleshooting, see the documentation in the /docs folder.
```

## Anything UNCLEAR

1. **Robot Starting Location Format**: While the requirement mentions tracking robot starting locations, the specific format or visualization needed isn't specified. We've designed the system to store this as coordinates that can be represented on a field diagram, but specific field layouts may vary by season.

2. **Data Retention Policy**: The requirements don't specify how long data should be retained or if there should be automatic cleanup of old data. We've implemented a backup system, but a defined retention policy would be beneficial.

3. **Connectivity Requirements**: The system is designed to work offline, but it's unclear if there's any requirement for synchronization between multiple devices at a competition. Currently, our design assumes a central server that devices sync with when online.

4. **User Roles**: Beyond the admin/scout distinction, there might be other roles needed (e.g., team lead, read-only access). The system can be extended to support additional roles if required.

5. **Integration with External Systems**: The requirements don't mention if this system needs to integrate with any external APIs or data sources (like The Blue Alliance for team/event data). The architecture can support such integrations if needed.

## Implementation Plan

1. **Phase 1 - Core Infrastructure**
   - Set up project structure and development environment
   - Implement basic server with file-based storage
   - Create authentication system with JWT
   - Develop PWA foundation

2. **Phase 2 - User Portal Features**
   - Create login interface
   - Implement match scouting form system
   - Build team performance dashboard
   - Develop offline data collection support

3. **Phase 3 - Admin Portal**
   - Build season configuration UI
   - Implement user management features
   - Create data management tools
   - Add report generation

4. **Phase 4 - Refinement**
   - Enhance error logging and monitoring
   - Improve UI/UX with responsive design
   - Optimize offline performance
   - Complete documentation

5. **Phase 5 - Testing & Deployment**
   - Conduct security testing
   - Perform usability testing
   - Optimize for performance
   - Prepare deployment package
