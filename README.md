```
  █████████                                                █████████                                █████
 ███░░░░░███                                              ███░░░░░███                              ░░███
░███    ░░░   ██████   █████ █████  ██████  ████████     ░███    ░░░   ██████   ██████  █████ ████ ███████
░░█████████  ░░░░░███ ░░███ ░░███  ███░░███░░███░░███    ░░█████████  ███░░███ ███░░███░░███ ░███ ░░░███░
 ░░░░░░░░███  ███████  ░░░█████░  ░███ ░███ ░███ ░███     ░░░░░░░░███░███ ░░░ ░███ ░███ ░███ ░███   ░███
 ███    ░███ ███░░███   ███░░░███ ░███ ░███ ░███ ░███     ███    ░███░███  ███░███ ░███ ░███ ░███   ░███ ███
░░█████████ ░░████████ █████ █████░░██████  ████ █████   ░░█████████ ░░██████ ░░██████  ░░████████  ░░█████
 ░░░░░░░░░   ░░░░░░░░ ░░░░░ ░░░░░  ░░░░░░  ░░░░ ░░░░░     ░░░░░░░░░   ░░░░░░   ░░░░░░    ░░░░░░░░    ░░░░░

```
# Saxon Scout - FRC Scouting Application

Saxon Scout is a modern scouting application designed for FIRST Robotics Competition teams. It allows teams to view FRC data from The Blue Alliance (TBA) and collect custom match scouting data locally.

## Features

*   Browse FRC Teams and view detailed information.
*   View FRC Events and Match schedules/results.
*   Basic Match Scouting form to collect performance data.
*   Local storage for scouting entries (data stays on the device).
*   Dashboard to view summarized scouting statistics.
*   Theme switching (Light, Dark, Blue, Grey).
*   Integration with The Blue Alliance (TBA) API v3 and FRC API.

## Setup Requirements

*   Node.js (v16 or later recommended)
*   npm or pnpm (pnpm is recommended)
*   A The Blue Alliance (TBA) API Key (v3)
*   A FRC API Key

## Installation and Setup

### Prerequisites

*   Node.js: [https://nodejs.org/](https://nodejs.org/)
*   pnpm (optional but recommended): `npm install -g pnpm`
*   TBA API Key: Register for an account at [https://www.thebluealliance.com/](https://www.thebluealliance.com/) and create an API key.

### Installation

1.  Clone the repository:
      ```bash
      git clone https://github.com/ssnnd0/Saxon-Scout/.git
      cd Saxon-Scout
    ```
2.  Install project dependencies:
      ```bash
      pnpm install
      ```
    (or `npm install` if you prefer npm)

### Configuration

1.  Create a `.env` file in the root directory of the project.
2.  Add the following content to the `.env` file, replacing the placeholder values:

  ```dotenv
  # Saxon Scout Environment Variables
  VITE_BLUE_ALLIANCE_API_KEY=APIKEY
  VITE_FRC_EVENT_API_KEY=APIKEY
  
  # Team number for the application
  VITE_TEAM_NUMBER=611
  ```

**Security Warning:** The `VITE_TBA_API_KEY` will be embedded in your application's built JavaScript files. This is generally insecure for applications distributed publicly. For internal team use, ensure only trusted individuals have access to the built application or the source code. For wider distribution, implement a backend proxy server to handle TBA API requests securely.

### Running the Application

Start the development server:

  ```bash
  pnpm dev
  ```
The application will typically run at http://localhost:5173 and will use the TBA API key specified in the .env file.

### Building
  ```bash
  pnpm build
  ```
The build artifacts will be in the dist directory. You can serve these files using any static file server.

### Data Storage
FRC Data (Teams, Events, Matches): Fetched live from The Blue Alliance API and FRC API. Requires an internet connection.
Scouting Entries: Saved directly in your browser's Local Storage. This means:
- Data is stored only on the device where it was entered.
- Data is not automatically shared between users or devices.
- Clearing browser data will erase all saved scouting entries.
- Use the Export Data feature (when implemented) to back up your scouting data.
- Data will be exported once connected to internet


## Key Technologies
React
React Router
Tailwind CSS
Vite
The Blue Alliance API v3
FRC API
Chart.js / Recharts (for visualizations)
Lucide Icons
