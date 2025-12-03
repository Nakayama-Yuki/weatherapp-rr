---
description: 'React Router v7 Framework mode development guidelines for full-stack React applications with SSR'
applyTo: '**'
---

# React Router v7 Framework Development

Guidelines for building full-stack React applications using React Router v7 in Framework mode with server-side rendering.

## Project Context

- **React Router v7** (Framework mode with SSR)
- **React 19+**
- **TypeScript 5.x**
- **Vite** as build tool
- **Packages**: `react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve`

## Core Principles

- **Server-first data loading**: Use `loader` and `action` for server-side data operations
- **Type-safe routing**: Import generated types from `./+types/{route}`
- **Progressive enhancement**: Forms work without JavaScript using native form submission
- **Colocation**: Keep route-specific logic within route modules

## Routing Configuration

### Route Definition (`app/routes.ts`)

```typescript
import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),                    // "/" - index route
  route("about", "routes/about.tsx"),          // "/about"
  route("users/:id", "routes/user.tsx"),       // "/users/123" - dynamic segment
  route("files/*", "routes/files.tsx"),        // "/files/a/b/c" - splat route
  route("docs/:lang?", "routes/docs.tsx"),     // "/docs" or "/docs/ja" - optional segment
  
  // Layout route (does not add URL segment)
  layout("routes/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
  
  // Prefix routes
  ...prefix("api", [
    route("users", "routes/api/users.tsx"),
  ]),
] satisfies RouteConfig;
```

### Dynamic Segments

| Pattern | Example URL | Params |
|---------|-------------|--------|
| `:id` | `/users/123` | `{ id: "123" }` |
| `:id?` | `/docs` or `/docs/ja` | `{ id: undefined }` or `{ id: "ja" }` |
| `*` (splat) | `/files/a/b/c` | `{ "*": "a/b/c" }` |

## Route Module Exports

### Required Export

```typescript
// Default export - Route component
export default function RouteName({ loaderData }: Route.ComponentProps) {
  return <div>{/* UI */}</div>;
}
```

### Data Exports

```typescript
import type { Route } from "./+types/route-name";

// Server-side data loading (runs on server)
export async function loader({ params, request }: Route.LoaderArgs) {
  const data = await fetchData(params.id);
  return { data };
}

// Server-side data mutation (runs on server)
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  await saveData(formData);
  return { success: true };
}

// Client-side data loading (runs in browser)
export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  return { ...serverData, clientData: "value" };
}

// Client-side data mutation (runs in browser)
export async function clientAction({ serverAction }: Route.ClientActionArgs) {
  const result = await serverAction();
  return result;
}
```

### Document Head Exports

```typescript
// Meta tags for SEO
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: "Page Title" },
    { name: "description", content: "Page description" },
  ];
}

// Link elements (stylesheets, preload, etc.)
export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: "/styles.css" },
  { rel: "preload", href: "/font.woff2", as: "font", type: "font/woff2" },
];

// HTTP headers
export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return {
    "Cache-Control": "max-age=3600",
  };
}
```

### Error & Loading Exports

```typescript
import { isRouteErrorResponse } from "react-router";

// Error boundary for route errors
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return <div>{error.status}: {error.statusText}</div>;
  }
  return <div>Something went wrong</div>;
}

// Fallback during hydration (clientLoader)
export function HydrateFallback() {
  return <div>Loading...</div>;
}

// Control revalidation behavior
export function shouldRevalidate({ currentUrl, nextUrl }: Route.ShouldRevalidateArgs) {
  return currentUrl.pathname !== nextUrl.pathname;
}
```

## Type Safety

### Import Generated Types

Always import route-specific types from the auto-generated `+types` directory:

```typescript
import type { Route } from "./+types/route-name";

// Use typed arguments
export async function loader({ params, request }: Route.LoaderArgs) {
  // params.id is typed based on route definition
}

export async function action({ request }: Route.ActionArgs) {
  // request is fully typed
}

export default function Component({ loaderData, actionData }: Route.ComponentProps) {
  // loaderData and actionData are typed based on loader/action return types
}

export function meta({ data }: Route.MetaArgs) {
  // data is typed based on loader return
}
```

### Define Explicit Result Types

```typescript
type ActionResult = 
  | { success: true; data: DataType }
  | { error: string };

export async function action({ request }: Route.ActionArgs): Promise<ActionResult> {
  // ...
}
```

## Data Patterns

### useFetcher Pattern (Non-navigation Mutations)

Use `useFetcher` for form submissions that should not trigger navigation:

```typescript
import { useFetcher } from "react-router";

export default function Component() {
  const fetcher = useFetcher<ActionResult>();
  const isLoading = fetcher.state !== "idle";
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form method="post">
      <input name="field" disabled={isLoading} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
      
      {fetcher.data?.error && <p className="error">{fetcher.data.error}</p>}
    </fetcher.Form>
  );
}
```

### Form Pattern (Navigation Mutations)

Use `Form` when submission should navigate:

```typescript
import { Form, useNavigation } from "react-router";

export default function Component() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" action="/target-route">
      <input name="field" />
      <button type="submit" disabled={isSubmitting}>Submit</button>
    </Form>
  );
}
```

### Optimistic UI

```typescript
const fetcher = useFetcher<ActionResult>();

// Use submitted form data for optimistic updates
const optimisticValue = fetcher.formData?.get("field") ?? currentValue;
```

### loader vs action

| Use Case | Export | HTTP Method |
|----------|--------|-------------|
| Read data | `loader` | GET |
| Create/Update/Delete | `action` | POST, PUT, DELETE |

## Configuration

### react-router.config.ts

```typescript
import type { Config } from "@react-router/dev/config";

export default {
  // Enable/disable server-side rendering
  ssr: true,
  
  // Prerender specific routes at build time
  async prerender() {
    return ["/", "/about", "/contact"];
  },
  
  // Base path for the app
  basename: "/",
  
  // Build directory
  buildDirectory: "build",
  
  // Server bundles configuration
  serverBundles: ({ branch }) => {
    // Return bundle ID based on route branch
  },
} satisfies Config;
```

### vite.config.ts

```typescript
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
});
```

## Root Module (`app/root.tsx`)

```typescript
import type { Route } from "./+types/root";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

// Global links
export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico" },
];

// Document layout (wraps all routes)
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Root component
export default function App() {
  return <Outlet />;
}

// Global error boundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div>
      <h1>Application Error</h1>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
    </div>
  );
}
```

## Common Patterns

### Server-only Code

Environment variables and server-only code in `loader`/`action`:

```typescript
export async function loader() {
  // Safe: runs only on server
  const apiKey = process.env.API_KEY;
  const data = await fetch(`https://api.example.com?key=${apiKey}`);
  return { data: await data.json() };
}
```

### Throwing Responses

```typescript
import { data } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const item = await getItem(params.id);
  
  if (!item) {
    throw data({ message: "Not found" }, { status: 404 });
  }
  
  return { item };
}
```

### Redirects

```typescript
import { redirect } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  await saveData(request);
  return redirect("/success");
}

export async function loader() {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }
  return { user };
}
```

### Headers and Cookies

```typescript
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  return data(
    { success: true },
    {
      headers: {
        "Set-Cookie": "session=abc123; HttpOnly; Secure",
      },
    }
  );
}
```

## Validation

```bash
# Type generation and checking
pnpm typecheck    # react-router typegen && tsc

# Development server
pnpm dev          # react-router dev

# Production build
pnpm build        # react-router build

# Start production server
pnpm start        # react-router-serve ./build/server/index.js
```

## References

- [React Router v7 Documentation](https://reactrouter.com/)
- [Framework Mode](https://reactrouter.com/start/framework)
- [Route Module](https://reactrouter.com/start/framework/route-module)
- [Data Loading](https://reactrouter.com/start/framework/data-loading)
- [Actions](https://reactrouter.com/start/framework/actions)
- [Type Safety](https://reactrouter.com/explanation/type-safety)
