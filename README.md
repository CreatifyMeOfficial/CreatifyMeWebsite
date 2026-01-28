## CreatifyMe Monorepo

The `/packages` directory contains the main applications and shared code for the **CreatifyMe** project. It is organized as a small monorepo with separate packages for the backend API, web frontend, mobile client, and shared utilities.

- **`packages/api/`**: Node.js/Express backend that powers the CreatifyMe platform (authentication, content management, test logic, etc.).  
  - For setup, environment variables, and API details, see the `packages/api/README.MD` inside this folder.

- **`packages/web/`**: Web frontend (SPA) for CreatifyMe, built with modern web tooling.  
  - For local development, build commands, and deployment notes, see the `packages/web/README.md` inside this folder.

- **`packages/mobile/`**: (Planned / WIP) Mobile client for CreatifyMe.  
  - Refer to this folder’s own documentation when available.

- **`packages/shared/`**: Shared logic, types, or utilities that can be reused across `api`, `web`, and `mobile`.

### Development Workflow (High Level)

1. **Install dependencies** at the root of `/packages` (or within each package as needed) using your preferred package manager.  
2. **Run the backend** from the `api` folder and the **frontend** from the `web` folder.  
   - You can start both together from the root by running `npm start`, which will launch both the API and web app concurrently (if your root `package.json` is configured with a start script for this purpose).
3. Use the individual package READMEs for detailed instructions, scripts, and environment configuration.

This top-level README is intentionally high level. For any specific behavior, commands, or implementation notes, please consult the README in the corresponding subfolder (`api`, `web`, `mobile`, or `shared`).


