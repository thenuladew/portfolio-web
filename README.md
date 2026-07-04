# 🌐 Thenula Dewanmith — Cybersecurity Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-circle&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-circle&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=flat-circle&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-circle&logo=typescript)](https://www.typescriptlang.org/)
[![Security](https://img.shields.io/badge/Security-SHA--256_%26_Rate_Limiting-cyan?style=flat-circle&logo=shields.io)](https://github.com/thenuladew/portfolio-website)

A premium, highly interactive portfolio application custom-built for an aspiring security engineer. Built on a modern tech stack utilizing **Next.js 16**, **React 19**, and **Tailwind CSS v4**, this application incorporates high-fidelity canvas animations, glassmorphism, custom cursor interactions, and a secured CV download gate.

---

## ✨ Key Features

### 1. 🔒 Recruiter Access Gate (Secure CV Download)
To prevent unauthorized downloads of personal details, the portfolio features an authentication-gated resume download modal.
* **Server-Side Verification**: Passwords entered by visitors are hashed client-side/server-side using SHA-256 and compared against the environment hash. No plain-text passcodes are ever exposed in client code.
* **IP-Keyed Rate Limiting**: Features an in-memory client IP rate limiter. If a client attempts to brute-force the passcode, they are restricted to **5 attempts**, after which they are locked out for **15 minutes**.
* **Secure Streaming**: The file is kept outside the public static directory (`/private`) and streamed directly as a binary buffer response with secure security headers (`X-Content-Type-Options: nosniff`, `Cache-Control: no-store`).

### 2. 🌌 Immersive Interactive Visuals
* **3D Cyber Globe**: A custom, lightweight HTML5 Canvas-based 3D globe visualization animating global connections, telemetry data, and network attacks.
* **Physics-Based Network Topology**: An interactive, dynamic node network where packets traverse visual routes, reacting to mouse proximity and window resizing.
* **Cyberpunk Aesthetic**: Sleek glassmorphism overlays (`backdrop-filter`), background dot-grids, neon ambient glows, and a responsive custom SVG cursor that transitions seamlessly into a pointer state when hovering over interactive elements.

### 3. 📱 Optimized Responsive Sections
* **01 — Profile / About**: SLIIT Cybersecurity undergraduate background, core principles, and professional values.
* **02 — Skill Matrix**: Tabulated competencies across Cybersecurity, Programming Languages, Systems, and developer tools.
* **03 — Selected Projects**: Showcases machine learning work (e.g. SMS Spam Classifier) with exact performance metrics (97.2% Accuracy) and GitHub repositories.
* **04 — Writing / Blog**: Technical writeups in progress (DNS Poisoning, SQL Injection, Spring Security).
* **05 — Contact**: Links to LinkedIn, Email, and GitHub.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Library**: [React 19](https://react.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Code Quality**: ESLint + TypeScript
* **State & Logic**: React hooks (`useState`, `useEffect`, `useRef`, `useCallback`)

---

## 📂 Project Architecture

```filepath
portfolio-app/
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
│   │   ├── CustomCursor.tsx     # Custom SVG cursor positioning component
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
The rate limiter stores attempts inside an in-memory Map structure keyed by the user's remote IP address.
```typescript
interface AttemptRecord {
  count: number;
  lockUntil?: number; // epoch ms
}
const store = new Map<string, AttemptRecord>();
```
When a request arrives at `/api/cv`, the application retrieves the IP (resolving headers in order: `x-forwarded-for`, `x-real-ip`). If the IP is blocked, it returns a `429 Too Many Requests` response containing the remaining lock duration in a `Retry-After` header.

### Secure File Download Stream (`src/app/api/cv/route.ts`)
The resume is never stored in `public/`. Instead, it is placed in the project root's `private/` directory. Once password authentication is successful, the file is read and streamed securely:
```typescript
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
```

---

## 🚀 Getting Started

### 📋 Prerequisites
* Node.js v20.x or higher
* npm or yarn

### 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/thenuladew/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of the project:
   ```env
   CV_PASSWORD_HASH=your_sha256_passcode_hash
   ```

4. **Generating the Passcode Hash:**
   You can easily hash your desired access code (e.g., `MYPASSCODE`) into a SHA-256 hex string using Node.js:
   ```bash
   node -e "console.log(require('crypto').createHash('sha256').update('MYPASSCODE').digest('hex'))"
   ```
   Copy the generated hash and set it as the value of `CV_PASSWORD_HASH`.

5. **Place your Resume PDF:**
   Ensure your resume PDF is named `Thenula_s_Resume.pdf` and placed inside the `/private` folder in the project root.

6. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 🤝 Connect

* **Email**: [thenulive@outlook.com](mailto:thenulive@outlook.com)
* **LinkedIn**: [linkedin.com/in/thenuladew](https://linkedin.com/in/thenuladew)
* **GitHub**: [github.com/thenuladew](https://github.com/thenuladew)
* **Education**: BSc (Hons) IT — Specializing in Cybersecurity, Sri Lanka Institute of Information Technology (SLIIT)
