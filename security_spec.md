# Security Specification - AI Resume Analyzer

## Data Invariants
1. A user can only view their own resume analyses.
2. Only users with the `admin` role can access platform-wide statistics.
3. Resumes must be valid PDF files (validated at the middleware layer).
4. All AI analysis results are sanitized for JSON before being processed.

## The Dirty Dozen Payloads (Target: Rejection)
1. User attempts to fetch an analysis belonging to another `userId`.
2. User attempts to update their own `role` to `admin` via the `/api/auth/login` endpoint.
3. User uploads a non-PDF file.
4. User sends a massive 100MB string as a job description to attempt a DoS.
5. Unauthenticated user attempts to access `/api/analyses`.
6. User attempts to spoof `firebaseId` in the login request.
7. Admin attempts to delete a user profile that is not theirs (unless they are a super-admin).
8. Client sends an invalid JWT.
9. User attempts to create an analysis with a future `createdAt` timestamp.
10. User sends a script tag `<script>` inside the job description.
11. Attacker attempts to list all users from a standard account.
12. Attacker attempts to inject custom fields into the analysis schema.

## Security Controls
- **JWT Verification**: All protected routes require a valid JWT signed by the server.
- **Firebase Auth**: Identity is bootstrapped through trusted Google authentication.
- **Mongoose Middleware**: Schemas enforce strict type checking and field existence.
- **Multer Filter**: File uploads restricted by MIME type.
- **GROQ Sanitization**: AI output is rigorously parsed and cleaned of markdown wrappers.
