## SPARK – Research Position Analysis Platform
SPARK is a web-based research analytics platform developed at the Technical University of Munich in collaboration with Siemens and Fortiss. It helps identify emerging trends, potential collaborators, and innovation signals within the global research landscape.

## Live Demo
Access the live platform here:
https://research-position-analysis-platform.onrender.com

## Key Features
- Unified keyword-based search across OpenAlex data
- Interactive collaboration graph showing co-authorship networks
- Global map of publication activity by country
- Benchmarking of Siemens vs peer institutions
- Publication trends over time with filtering by author, org, or topic
- Clean and responsive UI with dark mode

##  Tech Stack
- Frontend: React.js, Shadcn UI
- Backend: Node.js, Express
- Data Source: OpenAlex API
- Deployment: Hosted on Render

## Known Limitations
- No user authentication
- Benchmarking is limited to Siemens and selected peers
- OpenAlex API has a daily rate limit (100,000 requests)
- Patent and funding data only partially integrated
- UI is in prototype stage

## Usage

This project consists of a backend (Node.js/Express) and a frontend (React). To operate the prototype, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Install Dependencies

Open a terminal in the project root and run:

```
cd backend
npm install
cd ../frontend
npm install
```

### 2. Start the Backend Server

In the `backend` directory, run:

```
npm start
```
The backend server will start (default: http://localhost:4000).

### 3. Start the Frontend

In a new terminal, go to the `frontend` directory and run:

```
npm start
```
The frontend will start (default: http://localhost:3000) and connect to the backend.

### 4. Access the Application

Open your browser and go to [http://localhost:3000](http://localhost:3000) to use the platform.

---

## Additional Information

- For backend API details and endpoints, see `backend/README.md`.
- For frontend development and build instructions, see `frontend/README.md`.

---

For any issues, please refer to the respective README files in `backend` and `frontend` folders or contact the maintainers.
For questions or feedback, reach out via the course Discord or contact us through internal channels at TUM.
