'''
  ██████  ▄▄▄      ▒██   ██▒ ▒█████   ███▄    █      ██████  ▄████▄   ▒█████   █    ██ ▄▄▄█████▓
▒██    ▒ ▒████▄    ▒▒ █ █ ▒░▒██▒  ██▒ ██ ▀█   █    ▒██    ▒ ▒██▀ ▀█  ▒██▒  ██▒ ██  ▓██▒▓  ██▒ ▓▒
░ ▓██▄   ▒██  ▀█▄  ░░  █   ░▒██░  ██▒▓██  ▀█ ██▒   ░ ▓██▄   ▒▓█    ▄ ▒██░  ██▒▓██  ▒██░▒ ▓██░ ▒░
  ▒   ██▒░██▄▄▄▄██  ░ █ █ ▒ ▒██   ██░▓██▒  ▐▌██▒     ▒   ██▒▒▓▓▄ ▄██▒▒██   ██░▓▓█  ░██░░ ▓██▓ ░
▒██████▒▒ ▓█   ▓██▒▒██▒ ▒██▒░ ████▓▒░▒██░   ▓██░   ▒██████▒▒▒ ▓███▀ ░░ ████▓▒░▒▒█████▓   ▒██▒ ░
▒ ▒▓▒ ▒ ░ ▒▒   ▓▒█░▒▒ ░ ░▓ ░░ ▒░▒░▒░ ░ ▒░   ▒ ▒    ▒ ▒▓▒ ▒ ░░ ░▒ ▒  ░░ ▒░▒░▒░ ░▒▓▒ ▒ ▒   ▒ ░░
░ ░▒  ░ ░  ▒   ▒▒ ░░░   ░▒ ░  ░ ▒ ▒░ ░ ░░   ░ ▒░   ░ ░▒  ░ ░  ░  ▒     ░ ▒ ▒░ ░░▒░ ░ ░     ░
░  ░  ░    ░   ▒    ░    ░  ░ ░ ░ ▒     ░   ░ ░    ░  ░  ░  ░        ░ ░ ░ ▒   ░░░ ░ ░   ░
      ░        ░  ░ ░    ░      ░ ░           ░          ░  ░ ░          ░ ░     ░
                                                            ░
'''
                                                            
This guide explains how to set up and run Saxon Scout with a real API server.

## Project Overview

Saxon Scout is a scouting application for FIRST Robotics Competition teams. It allows teams to collect, analyze, and visualize match data to help with competition strategy.

## API Setup Requirements

The application requires a backend API server with the following endpoints:

- `/teams` - Get a list of all teams
- `/teamData/:teamNumber` - Get information about a specific team
- `/teamPerformanceData` - Get performance data for all teams
- `/scoutingEntries` - Get/post scouting entries
- `/currentSeason` - Get current season information

## Installation and Setup

### Prerequisites

- Node.js (v14 or later)
- npm or pnpm
- A running API server

### Installation

Install project dependencies:

```bash
pnpm install
```

### Configuration

Create a `.env` file in the root directory with:

```
# Team number for the application
VITE_TEAM_NUMBER=611

# API URL (required)
VITE_API_URL=http://your-api-server.com/api
```

**Note:** The `VITE_API_URL` must point to your actual API server.

### Running the Application

Start the React application:

```bash
pnpm dev
```

The application will run at `http://localhost:5173` and will use the API server specified in the `.env` file.

### Building for Production

```bash
pnpm build
```

The build artifacts will be in the `dist` directory.

## API Requirements

Your API server must provide the following endpoints:

### GET `/teams`

Returns a list of all teams.

Example response:
```json
[
  {
    "number": 254,
    "name": "The Cheesy Poofs",
    "location": "San Jose, California, USA",
    "rookieYear": 1999
  }
]
```

### GET `/teamData/:teamNumber`

Returns information about a specific team.

Example response:
```json
{
  "team_number": 865,
  "nickname": "Warp 7",
  "name": "Compass Automation & West Chicago Community High School",
  "city": "West Chicago",
  "state_prov": "Illinois",
  "country": "USA",
  "rookie_year": 2001,
  "website": "https://warp7.org",
  "motto": "Engineered to win, designed to inspire",
  "key": "frc611",
  "home_championship": { "2020": "Detroit" },
  "achievements": [
    "Regional Winners - Midwest Regional (2019)",
    "Innovation in Control Award (2018)",
    "Engineering Excellence Award (2017)",
    "Regional Finalists - Chicago Regional (2016)",
    "World Championship Qualification (2015, 2018, 2019)"
  ]
}
```

### GET `/teamPerformanceData`

Returns performance data for all teams.

Example response:
```json
[
  { "team": "Team 254", "autoPoints": 25, "teleopPoints": 45, "endgamePoints": 15 },
  { "team": "Team 1114", "autoPoints": 20, "teleopPoints": 40, "endgamePoints": 20 },
  { "team": "Team 118", "autoPoints": 22, "teleopPoints": 38, "endgamePoints": 18 },
  { "team": "Team 2056", "autoPoints": 18, "teleopPoints": 42, "endgamePoints": 16 },
  { "team": "Team 33", "autoPoints": 15, "teleopPoints": 35, "endgamePoints": 25 },
  { "team": "Team 611", "autoPoints": 28, "teleopPoints": 48, "endgamePoints": 12 }
]
```

### GET `/scoutingEntries`

Returns all scouting entries.

Example response:
```json
[
  {
    "id": "entry1",
    "teamNumber": "611",
    "matchNumber": "Q23",
    "timestamp": "2023-03-15T14:22:00Z",
    "synced": true
  },
  {
    "id": "entry2",
    "teamNumber": "254",
    "matchNumber": "Q17",
    "timestamp": "2023-03-15T13:45:00Z",
    "synced": true
  }
]
```

### POST `/scoutingEntries`

Creates a new scouting entry.

Example request:
```json
{
  "teamNumber": "1114",
  "matchNumber": "Q19",
  "synced": false
}
```

### GET `/currentSeason`

Returns information about the current season.

Example response:
```json
{
  "name": "2023-2024 Season",
  "startDate": "2023-09-01",
  "endDate": "2024-04-30",
  "isActive": true
}
```

## Using the API in Components

Components can use the API service as follows:

```jsx
import apiService from '../services/apiService';

// In a React component
const [teamData, setTeamData] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await apiService.getTeamData('611');
      setTeamData(data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  fetchData();
}, []);
```

## Error Handling

The API service throws errors with descriptive messages if API requests fail. Make sure to properly handle these errors in your components using try/catch blocks.

## Extending the API

To add new API endpoints:

1. Update your backend server to provide the new endpoint
2. Add a new method to the `apiService.js` file to interact with the endpoint
3. Use the new method in your components

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
