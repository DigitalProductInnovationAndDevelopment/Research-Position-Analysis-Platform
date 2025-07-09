# Backend - Research-Position-Analysis-Platform

This is the backend service for the Research-Position-Analysis-Platform. It is built with Node.js and Express.

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation

```
npm install
```

### Running the Server

```
npm start
```
The server will start on [http://localhost:4000](http://localhost:4000) by default (or the port set in your `.env` file).

## API Endpoints

The backend exposes several REST API endpoints. Main routes are located in the `routes/` directory:
- `/autocomplete` - Autocomplete suggestions for authors, institutions, etc.
- `/institutions` - Institution-related data
- `/publications` - Publication data and search
- `/topics` - Research topics and analytics

For detailed API usage, see the route files in `routes/`.

## Testing

To run backend tests:

```
npm test
```

## Development Notes
- Main entry: `server.js`
- Tests: `_test_/`
- Environment variables can be set in a `.env` file if needed.

---

For further questions, contact the backend maintainers.
