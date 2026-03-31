# <Project Name>
Short description of what this app does.

## Stack
React 19, Vite, TypeScript, Tailwind CSS v4, shadcn/ui, React Router, hosted on Subterranean with serverless backend functions supported in /api routes.

## Architecture
- This is a client-side rendered SPA with React Router for navigation
- Pages live in `src/pages/` — each page is a default-exported React component
- To add a new page: create `src/pages/MyPage.tsx`, then add a `<Route>` in `App.tsx`
- Use `<Link to="/path">` from react-router-dom for navigation (not `<a href>`)
- The `vercel.json` rewrite ensures direct URL access works in production
[data models, component structure, key patterns]

## Decisions
[significant choices and their reasoning]

## Style
UI/UX guidelines defined in DESIGN.md. Read before building. If user did not establish one yet, then use DESIGN_TEMPLATE.md as a default.
