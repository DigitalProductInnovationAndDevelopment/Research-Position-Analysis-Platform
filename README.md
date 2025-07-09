# Research-Position-Analysis-Platform
Prototype to address the challenge of analysing the research position of teams, institutions, and companies

# What the prototype does
SPARK stands for Search Publication Analysis & Research Knowledgebase. It is a web-based tool designed to support research strategy by providing insights into academic publication data. Users can analyze research trends, track institutional output, explore collaboration networks, benchmark performance against competitors, and assess research relevance through funding and patent citations. The data is sourced primarily from OpenAlex, with optional fallback to IEEE Xplore, ACM, and Google Scholar.

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
