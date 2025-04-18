# Saxon Scout

A scouting application for FIRST Robotics Competition teams.

## Features

- Team and event search
- Match data collection
- Scouting reports
- Data visualization

## Development Setup

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Saxon-Scout.git
   cd Saxon-Scout
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   VITE_BLUE_ALLIANCE_API_KEY=your_blue_alliance_api_key
   VITE_FRC_EVENT_API_KEY=your_frc_event_api_key
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Troubleshooting

### Lucide Icons Not Loading in Development

This project includes special configuration to handle known issues with Lucide icons in Vite development mode:

1. We use direct imports for icons from the dist directory
2. We've configured Vite to alias the icons path correctly
3. A wrapper component is provided for dynamic icon loading

If you encounter icon loading issues:

- Make sure ad blockers are disabled for localhost
- Try using the import approach shown in `src/IconExample.jsx`
- Use the `LucideIconWrapper` component for dynamic icon loading

### Common Issues

- **White screen in development**: This could be caused by ad blockers blocking the Fingerprint icon. Disable your ad blocker for localhost or avoid using this specific icon.
- **Module loading errors**: Make sure you're using the correct import paths as shown in the examples.

## Building for Production

```bash
pnpm build
```

The build outputs will be in the `dist` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
