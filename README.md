<div align="center">

# 🔗 TraceLink Frontend

### Modern React Frontend for the TraceLink Platform

A responsive and scalable frontend application for the TraceLink URL shortening and analytics ecosystem, built with React, Vite, and modern frontend tooling.

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![AWS](https://img.shields.io/badge/AWS-Cloud_Ready-FF9900?style=flat-square&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com/)

[Overview](#overview) · [Features](#features) · [Tech-Stack](#tech-stack) · [Getting-Started](#getting-started)

</div>

---

## Overview

TraceLink Frontend is the client-side application for the TraceLink platform, providing users with a fast, responsive, and intuitive interface for URL shortening, analytics visualization, authentication, and developer API management.

The frontend communicates with the TraceLink backend through secure REST APIs and is designed for scalable cloud deployment using modern frontend DevOps practices.

---

## Features

### Authentication & User Experience

- Secure JWT-based authentication
- Login and registration flows
- Protected routes and session persistence
- Responsive layouts for desktop and mobile

---

### URL Management

- Create shortened URLs instantly
- Custom aliases support
- Copy-to-clipboard functionality
- QR code generation and downloads

---

### Analytics Dashboard

- Real-time click analytics
- Traffic trend visualization
- Device and browser insights
- Referrer tracking dashboards

---

### Developer Platform UI

- API key generation and management
- Secure API key masking
- Developer dashboard for API usage

---

## Tech Stack

| Category | Technology |
|----------|-------------|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router DOM |
| HTTP Client | Axios |
| State Management | React Context API |
| Animations | Framer Motion |
| Charts & Analytics | Recharts |
| Notifications | React Hot Toast |
| Forms | React Hook Form |
| Styling | CSS / Modern Responsive UI |

---

## Project Structure

```text
src/
├── components/       # Reusable UI components
├── pages/            # Application pages
├── context/          # Global state/context providers
├── services/         # API service layer
├── hooks/            # Custom React hooks
├── utils/            # Utility helpers
└── assets/           # Static assets

public/               # Static public files
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

---

### Installation

Clone the repository:

```bash
git clone https://github.com/BenGJ10/tracelink-frontend.git
cd tracelink-frontend
```

Install dependencies:

```bash
npm install
```

---

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

### Run Development Server

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## License

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Built with ⚡ using React & Vite</sub>
</div>