# Wedding Guest List App

A React application for managing wedding guest lists, including household management, guest categorization, and tiered invitations.

## 🚀 [**Live Demo**](https://wedding-guest-list-xi.vercel.app)

> **Note:** This is currently a single-user application. All data is stored locally in your browser and will be lost if you clear browser data or switch devices.

## Features

- Household management with guest counts
- Category-based organization
- Tiered invitation system
- Real-time guest count totals
- Data persistence using localStorage

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd wedding-guest-list
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Testing

### Automated Tests

Run the test suite:
```bash
npm test
```

### Manual Testing

For manual testing procedures and checklists, see [Testing Documentation](docs/TESTING.md).

## Documentation

- [Design Documentation](docs/DESIGN.md)
- [UI Design](docs/UI_DESIGN.md)
- [Development Phases](docs/PHASES.md)
- [Task List](docs/TASKS.md)
- [Testing Guide](docs/TESTING.md)

## Current Limitations

- **No Authentication**: Single-user application, no login system
- **Local Storage Only**: Data stored in browser localStorage, not synced across devices
- **No Real-time Collaboration**: Cannot share guest lists between multiple users
- **No Cloud Backup**: Data loss if browser data is cleared
- **Device Specific**: Data doesn't transfer between different browsers/devices

## Planned Enhancements

See [DEPLOYMENT.md](DEPLOYMENT.md) for future roadmap including:
- User authentication (Auth0/Supabase)
- Cloud database integration
- Multi-user support and collaboration
- Real-time synchronization
- Email invitation features

## Built With

- React
- TypeScript
- Vite
- CSS Modules
- Vitest + React Testing Library
