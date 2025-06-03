# Wedding Guest List Manager

A simple, client-side web application to manage wedding guest lists, built with React and TypeScript. This app helps organize wedding guests by categories and priority tiers, with the ability to export and import data via CSV files.

## Features

- Organize guests by categories (e.g., family, friends, colleagues)
- Assign priority tiers to guests
- Group guests by households
- Create and save different invitation scenarios
- Export/Import guest lists as CSV files
- All data stored locally in your browser

## Technical Details

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser Local Storage + CSV file support
- **Build Tool**: Vite

## Development

To start development:

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Data Storage

This application stores all data in your browser's local storage. You can:
- Export your guest list to CSV at any time for backup
- Import guest lists from CSV files
- Edit the CSV file in Excel/Google Sheets and re-import

No data is sent to any server - everything stays on your computer. 