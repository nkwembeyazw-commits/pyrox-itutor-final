# Pirox iTutor Sched

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nkwembeyazw-commits/pyrox-itutor-final)

A production-ready full-stack application starter kit featuring React frontend, Cloudflare Workers backend with Hono, and Convex for real-time database, authentication, and file storage. Includes email OTP auth, file upload/download/delete, responsive UI with shadcn/ui and Tailwind CSS, and seamless deployment to Cloudflare.

## Features

- **User Authentication**: Passwordless email OTP login/signup, password reset, anonymous auth.
- **File Management**: Secure per-user file uploads, listing, download URLs, and deletion via Convex Storage.
- **Real-time Data**: Convex queries/mutations for instant sync across clients.
- **Responsive UI**: Modern design with shadcn/ui components, dark/light themes, sidebar layout, and animations.
- **Edge Deployment**: Cloudflare Workers for API routing, Pages for static assets.
- **Type-Safe**: Full TypeScript end-to-end with generated types.
- **Developer Experience**: Hot reload, error reporting, Convex dev tools.
- **Production Ready**: CORS, logging, error boundaries, client error reporting.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router, TanStack Query, shadcn/ui, Tailwind CSS, Lucide icons.
- **Backend**: Cloudflare Workers, Hono, Convex (Database, Auth, Storage).
- **Auth**: Convex Auth with custom email OTP via Andromo SMTP.
- **State/UI**: Zustand, Framer Motion, Sonner toasts.
- **Dev Tools**: Bun, ESLint, TypeScript, Tailwind.

## Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers/Pages enabled
- [Convex Account](https://dashboard.convex.dev/) (free tier sufficient)
- SMTP service credentials (e.g., Andromo SMTP for email OTP)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd pirox-itutorsched-3ncyvzqtu3vxgaivqgwy8
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   Create `.env` files or set in Cloudflare/Convex dashboard:
   ```
   # Client-side (.env.local or Vite env)
   VITE_CONVEX_URL=https://your-project.convex.cloud

   # Convex dashboard (ANDROMO_SMTP_URL and ANDROMO_SMTP_API_KEY)
   ANDROMO_SMTP_URL=https://your-smtp-service.com
   ANDROMO_SMTP_API_KEY=your-api-key
   CONVEX_SITE_URL=https://your-domain.com
   ```

4. **Deploy Convex backend** (one-time):
   ```bash
   bun run backend:deploy
   ```
   Copy the generated `VITE_CONVEX_URL` from Convex dashboard.

## Development

1. **Start dev server** (frontend + backend sync):
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

2. **Type generation** (Workers types):
   ```bash
   bun run cf-typegen
   ```

3. **Lint**:
   ```bash
   bun run lint
   ```

**Hot reload**: Frontend auto-reloads. Backend changes require `bun run backend:deploy` or `npx convex dev`.

## Usage Examples

### File Upload Flow
1. Sign up/login via email OTP.
2. Use `api.files.generateUploadUrl` to get presigned URL.
3. Upload file via `fetch(url, {method: 'PUT', body: file})`.
4. Call `api.files.saveFileMetadata` with file details.
5. List files: `api.files.listFiles`.
6. Get URL: `api.files.getFileUrl({storageId})`.
7. Delete: `api.files.deleteFile({fileId})`.

### Custom Routes
Add API endpoints in `worker/userRoutes.ts` (Hono app).

### Custom Pages
Edit `src/pages/`, use `AppLayout` for sidebar.

## Deployment

1. **Build and deploy**:
   ```bash
   bun run deploy
   ```
   Deploys Workers (backend) + Pages (frontend).

2. **Custom Domain**:
   - Bind domain in Cloudflare Pages dashboard.
   - Update `CONVEX_SITE_URL` in Convex.

3. **Environment Variables**:
   Set `VITE_CONVEX_URL` in Pages > Settings > Environment Variables.
   Set SMTP vars in Convex dashboard.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nkwembeyazw-commits/pyrox-itutor-final)

**Production Notes**:
- Convex handles scaling, auth, storage.
- Workers route `/api/*` to Hono.
- SPA fallback for client-side routing.

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Local dev server |
| `bun run build` | Build + deploy backend |
| `bun run preview` | Preview production build |
| `bun run deploy` | Full deploy to Cloudflare |
| `bun run cf-typegen` | Generate Worker types |
| `bun run backend:deploy` | Deploy Convex only |

## Troubleshooting

- **Auth issues**: Check SMTP env vars in Convex.
- **CORS**: Pre-configured for `/api/*`.
- **Types**: Run `bun run cf-typegen` after Worker changes.
- **Convex sync**: `npx convex dev` for live backend dev.

## Contributing

1. Fork & clone.
2. Install deps: `bun install`.
3. Create feature branch.
4. PR with clear description.

## License

MIT - see [LICENSE](LICENSE) (add if needed).