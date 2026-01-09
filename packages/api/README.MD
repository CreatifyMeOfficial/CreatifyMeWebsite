# CreatifyMe API

Express + MongoDB backend that powers authentication, profile management, comments, personality test flows, admin tooling, tags, and personalities. All routes are mounted under `/api/v1`.

## Features

- Auth with username/email login, secure registration, logout, password change
- **Email verification** with 6-digit codes, expiration, and attempt limits
- Cookie-based JWT session, role-based authorization (user, admin, super_admin)
- Profile image upload (Multer + Cloudinary) — requires verified email
- Comment CRUD with profanity filtering and pagination
- Personality test questions (MBTI + Holland), result calculation and storage
- Admin endpoints for user management and comment moderation
- Tag management and personality tagging with language-aware personality retrieval
- Security middleware: Helmet, CORS, rate limiting, JSON/body parsing, HTTP-only cookies

## Prerequisites

- Node.js 18+ recommended
- MongoDB instance
- npm

## Environment Variables

Create an `.env` file in `packages/api`:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d               # e.g. 1d, 12h
COOKIE_AGE=604800000            # cookie max age in ms

# Cloudinary (used for profile images)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER_NAME=users_images

# CORS
ALLOWED_ORIGIN=http://localhost:5173

# Email (used for verification emails via Brevo)
BREVO_API_KEY=your_brevo_api_key             # Get from https://app.brevo.com
EMAIL_FROM=your_verified_email@example.com   # Must be a verified sender email in Brevo
```

If you have multiple frontends, provide a comma‑separated list (no spaces) in `ALLOWED_ORIGIN`, for example:

```
ALLOWED_ORIGIN=http://localhost:5173,https://creatifyme.com
```

Update `ALLOWED_ORIGIN` in `.env` to match your frontend URL(s). The value is read in `app.js` and passed to the CORS middleware.

## Getting Started

```bash
cd packages/api
npm install
npm start          # runs nodemon app.js
```

The server logs `Server is listening on port: <port>` after connecting to Mongo.

## Authentication & User

- `POST /api/v1/user/signup` — Register with `userName, firstName, lastName, phone, countryKey, email, password, confirmPassword, birthDate`
- `POST /api/v1/user/login` — Login with `emailOrUsername, password`
- `POST /api/v1/user/logout` — Clears auth cookies
- `POST /api/v1/user/send-verification-email` — Send verification code email; auth required, rate limited (1 req/min)
- `POST /api/v1/user/verify-email` — Verify email with `verificationCode` (6-digit); auth required
- `POST /api/v1/user/upload-image` — Upload profile image (multipart `file`); auth + verified email required
- `GET /api/v1/user/get-user` — Get current user; auth required
- `PATCH /api/v1/user/update-user` — Update profile (`userName, firstName, lastName, phone, countryKey, birthDate`); auth + verified email required
- `PATCH /api/v1/user/change-password` — Change password with `oldPassword, newPassword, confirmPassword`; auth required
- `DELETE /api/v1/user/delete-user` — Delete account and resources; auth required

**Email Verification:**
- Verification codes are 6-digit numbers, expire after 10 minutes
- Users have 5 verification attempts before needing to resend
- Some endpoints require verified email (upload-image, update-user)
- Verification codes are sent via HTML email template

Password policy: 10-50 chars, upper/lower/number/symbol, no spaces. Profanity filtering runs on user and comment inputs.

## Comments

- `POST /api/v1/user/comments` — Create comment (`comment`); auth required
- `GET /api/v1/user/comments` — List current user comments; auth required
- `GET /api/v1/comments` — Public list of all comments
- `PATCH /api/v1/user/comments/:id` — Update own comment; auth required
- `DELETE /api/v1/user/comments/:id` — Delete own comment; auth required

Pagination/query options for comment lists: `page`, `limit`, `sort` (default `-createdAt`).

## Admin (requires role `admin` or `super_admin` as noted)

- `GET /api/v1/users` — Paginated users (admin, super_admin)
- `PATCH /api/v1/users/change-role/:id` — Change user role (super_admin only)
- `DELETE /api/v1/comments/delete-comment/:id` — Delete any comment (admin, super_admin)

User list pagination: `page`, `limit` (defaults 1, 10).

## Test Questions & Results

- `GET /api/v1/questions` — List all questions
- `POST /api/v1/questions` — Add question (`questionEn, questionAr, MBTIAttribute, HollandAttribute`); admin/super_admin
- `PATCH /api/v1/questions/:Id` — Update question; admin/super_admin
- `DELETE /api/v1/questions/:Id` — Delete question; admin/super_admin
- `POST /api/v1/questions/calculate` — Submit answers and compute result; auth required  
  Body: `{ answers: [{ questionId, value }] }`
- `GET /api/v1/questions/user-result` — Fetch saved result; auth required

Results compute MBTI type + Holland code, link to a stored personality description, and upsert user results.

## Tags

- `GET /api/v1/tags` — List tags; admin/super_admin
- `POST /api/v1/tags` — Create tag (`tag`); admin/super_admin
- `DELETE /api/v1/tags/:id` — Delete tag and remove references; admin/super_admin

## Personalities

- `GET /api/v1/personalities` — Get personalities with language switch and pagination; admin/super_admin
- `PATCH /api/v1/personalities/add-tag/:id` — Attach tag (`tagId`); admin/super_admin
- `PATCH /api/v1/personalities/remove-tag/:id` — Remove tag (`tagId`); admin/super_admin

Pagination/query options for personalities list: `page`, `limit`, `language` (defaults 1, 10, "en"). Returns `personalities` array with `description` (based on language) and `tags`, plus `personalitiesTotal`.

## Security & Error Handling

- Helmet, CORS, rate limiting (100 req/15m/IP), cookie-based auth
- Standardized errors: BadRequestError (400), UnauthenticatedError (401), UnauthorizedError (403), NotFoundError (404)

## Contributing

1. Fork and create a feature branch.
2. Commit with clear messages.
3. Open a Pull Request.
