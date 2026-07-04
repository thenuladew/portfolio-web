# 🌐 Thenula Dewanmith — Cybersecurity Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-circle&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-circle&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-circle&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-circle&logo=typescript)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-SHA--256_%26_Rate_Limiting-cyan?style=flat-circle&logo=shields.io)](https://github.com/thenuladew/portfolio-web)

A polished, interactive portfolio built for an aspiring security engineer. This project showcases modern frontend techniques together with security-minded server routes for gated CV access.

---

## ✨ Key Features

### 1. 🔒 Recruiter Access Gate (Secure CV Download)
- Password-protected resume download modal to prevent unauthorized access to personal details.
- Server-side verification using a SHA-256 hash stored in an environment variable; the application never stores or logs plain-text passcodes.
- IP-keyed rate limiting: after a configurable number of failed attempts (default: 5), the client IP is temporarily blocked to deter brute-force attacks.
- Secure streaming: the resume is kept outside the public static directory (`/private`) and streamed with safe headers to force download and prevent MIME sniffing.

### 2. 🌌 Immersive Interactive Visuals
- 3D Cyber Globe: lightweight Canvas-based globe animation visualizing connections and telemetry.
- Physics-based Network Topology: interactive node network that reacts to user input and resizing.
- Cyberpunk Aesthetic: glassmorphism overlays, neon glows, and a responsive custom SVG cursor.

### 3. 📱 Responsive Content Sections
- About / Profile
- Skill Matrix (security, languages, systems, tools)
- Selected Projects (with performance metrics where applicable)
- Writing / Blog (technical writeups in progress)
- Contact (email, LinkedIn, GitHub)

---

## 🛠️ Technology Stack

- Framework: Next.js 16 (App Router)
- Library: React 19
- Styling: Tailwind CSS v4 with PostCSS
- Animations: Framer Motion
- Icons: Lucide React
- Language: TypeScript
- Tooling: ESLint, TypeScript types

---

## 📂 Project Structure

```
portfolio-web/
├── private/
│   └── Thenula_s_Resume.pdf     # Gated resume file (outside public assets)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── cv/
│   │   │       └── route.ts     # POST API handler for secure CV download
│   │   ├── globals.css          # Tailwind CSS v4 directives & custom utilities
│   │   ├── layout.tsx           # Global layout & HTML/Meta header configuration
│   │   └── page.tsx             # Main layout rendering sections
│   ├── components/
│   │   ├── sections/            # Core content sections
│   │   │   ├── About.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Skills.tsx
│   │   ├── CVModal.tsx          # Recruiter access modal UI with shake/timer effects
│   │   ├── CustomCursor.tsx     # Custom SVG cursor component
│   │   ├── CyberGlobe.tsx       # Canvas 3D globe animation logic
│   │   ├── NetworkTopology.tsx  # Dynamic particle connection visualizer
│   │   ├── Navbar.tsx           # Fixed glassmorphic navigation header
│   │   └── Footer.tsx           # Layout footer
│   └── utils/
│       └── security.ts          # Server-side IP rate limiter implementation
├── .env.local                   # Environment configurations (Git-ignored)
├── next.config.ts               # Next.js configurations
└── tailwind.config.js           # Tailwind integrations
```

---

## 🛡️ Security Implementation Details

### Rate Limiting Logic (`src/utils/security.ts`)
The rate limiter stores attempts in an in-memory Map keyed by the client's remote IP address:

```typescript
interface AttemptRecord {
  count: number;
  lockUntil?: number; // epoch ms
}
const store = new Map<string, AttemptRecord>();
```

On each request to the CV API, the server resolves the client's IP from headers (e.g. `x-forwarded-for`, `x-real-ip`) and checks `store`. If the count exceeds the configured limit, the API returns `429 Too Many Requests`. The limiter is intentionally simple (in-memory) and is suitable for single-instance deployments; for multi-instance or production scale, use a shared store (Redis) or a managed rate-limiting service.

### Secure File Download Stream (`src/app/api/cv/route.ts`)
The resume is not served from `public/`. After successful authentication, the file is read from the `private/` folder and returned as a binary response with secure headers:

```typescript
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
  // authentication & rate-limiting checks happen here

  const cvPath = join(process.cwd(), 'private', 'Thenula_s_Resume.pdf');
  const cvBuffer = await readFile(cvPath);

  return new NextResponse(cvBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Thenula_Dewanmith_CV.pdf"',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js v20.x or higher
- npm or yarn

### 🔧 Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/thenuladew/portfolio-web.git
cd portfolio-web
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables (create `.env.local`):

```env
CV_PASSWORD_HASH=your_sha256_passcode_hash
```

4. Generate the passcode hash (example):

```bash
node -e "console.log(require('crypto').createHash('sha256').update('MYPASSCODE').digest('hex'))"
```

5. Place your resume PDF in the `private/` folder as `Thenula_s_Resume.pdf`.

6. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 to view the site.

---

## 🤝 Connect

- Email: thenulive@outlook.com
- LinkedIn: https://linkedin.com/in/thenuladew
- GitHub: https://github.com/thenuladew
- Education: BSc (Hons) IT — Cybersecurity, Sri Lanka Institute of Information Technology (SLIIT)
