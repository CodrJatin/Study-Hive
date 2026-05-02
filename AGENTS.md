
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This project uses Next.js 16 and React 19. APIs, routing behavior, caching, proxy behavior, and request APIs may differ from older Next.js versions.

Before changing Next.js routing, caching, Server Components, Server Actions, `proxy.ts`, `next.config.ts`, or request APIs, read the relevant guide in `node_modules/next/dist/docs/`.
<!-- END:nextjs-agent-rules -->

# StudyHive Agent Rules

You are working in a performance-sensitive full-stack Next.js App Router application. Default to correctness, small diffs, and measurable performance wins.

## Architecture Defaults

- Server Components are the default.
- Do not add `"use client"` unless the file directly needs React state, effects, event handlers, browser APIs, or client-only hooks.
- Keep client boundaries as small as possible.
- Never turn a page, layout, large list, card grid, or mostly-static display component into a Client Component just to host one button, modal, realtime listener, or dropdown.
- Split interactive islands out of server-rendered UI.
- Client Components must not import server-only modules.
- Server-only modules must not be imported into Client Components.

## Next.js 16 Rules

- Use `proxy.ts`, not `middleware.ts`.
- Keep `proxy.ts` narrowly matched. Do not run proxy for static assets, icons, audio, manifest files, image optimizer routes, or API routes unless explicitly required.
- Dynamic route `params` and `searchParams` are async request APIs. Await them.
- `cookies()`, `headers()`, and other request-time APIs are async. Await them.
- Do not rely on outdated Next.js behavior from older versions.

## Data Fetching Rules

- Fetch database data in Server Components, Server Actions, Route Handlers, or server-only data-access modules.
- Use Prisma only on the server.
- Add `import "server-only";` to modules that use Prisma, secrets, filesystem access, `next/headers`, or server Supabase clients.
- Add `import "client-only";` to modules that require browser APIs.
- Use React `cache()` for repeated per-request reads such as current user, Prisma user, hive membership, and shared route data.
- Avoid duplicate existence queries. If the real data query can prove existence, use that query.
- Start independent async work before awaiting it. Use `Promise.all` for independent requests.
- Keep Prisma `select` narrow. Do not use broad `include` unless the full relation is required.
- Add pagination or limits for lists that can grow: materials, announcements, members, tasks, syllabus units/topics, search results.

## Caching And Invalidation

- Do not scatter `revalidatePath()` everywhere by default.
- Prefer explicit cache tags for shared data.
- Use `updateTag()` in Server Actions when the user must see their own write immediately.
- Use `revalidateTag(tag, "max")` for stale-while-revalidate content.
- Keep `revalidatePath()` only for cases where route-level invalidation is clearly required.
- Do not use route group names such as `/(app)` in public path invalidation.

## Server Actions

- Server Actions are for mutations, not high-frequency autocomplete reads.
- Do not trust `userId`, role, ownership, or permission data passed from the client.
- Derive the current user server-side.
- Verify membership and authorization inside every mutation.
- Proxy protection is not a substitute for Server Action authorization.
- Return stable, typed error objects. Avoid throwing user-facing mutation errors unless the route should fail.

## Search And Client Reads

- Do not use Server Actions for every keystroke.
- Use Route Handlers for autocomplete/search reads.
- Client search must debounce and cancel stale requests with `AbortController`.
- Search must enforce a minimum query length and return only the fields required by the UI.
- All search queries must be scoped to the authenticated user’s accessible hives/materials.

## Client Bundle Guardrails

- Client Components must never import `@prisma/client` at runtime.
- If a client file needs enum values, use local string union types or lightweight constants.
- Do not import Prisma-generated runtime code into the browser.
- Avoid shipping non-critical features in the global shell. Lazy-load music players, large modals, and rare workflows.
- Do not load audio metadata or initialize `Audio()` until user intent or an explicit autoplay preference requires it.
- Remove unused dependencies. `next-auth` is banned unless the project intentionally migrates away from Supabase auth.

## Realtime Rules

- Realtime listeners must be tiny client islands.
- Do not make whole lists/grids Client Components just to call `router.refresh()`.
- Every realtime subscription must be filtered as narrowly as the schema allows.
- Avoid unfiltered table subscriptions.
- Do not use unstable objects in hook dependency arrays.
- Avoid random channel names unless there is a proven collision issue.

## Styling And UI Performance

- Do not use dynamic Tailwind class strings like `bg-${color}` unless the values are safelisted or mapped to explicit class names.
- Prefer explicit class maps.
- Use `next/image` for user avatars and remote images when dimensions are known.
- Keep layout stable: define dimensions for avatars, icons, cards, controls, and skeletons.
- Do not add heavy third-party UI libraries without justification.
- Use existing design tokens in `src/app/globals.css`.

## Code Quality

- `npm.cmd run build` must pass.
- `npm.cmd run lint` should pass before considering a task complete.
- Do not ignore React compiler purity warnings.
- Do not call impure functions like `Date.now()` repeatedly during render maps. Compute once and pass down.
- Do not read `ref.current` during render to derive UI state.
- Avoid `any`. Use explicit DTOs, Prisma payload types on the server, or local UI types.
- Remove unused imports and variables.
- Keep changes isolated. Do not combine unrelated refactors in one task.

## Security And Privacy

- Never expose secrets to Client Components.
- Never put server API keys in browser code.
- Supabase browser client may use only public anon keys.
- YouTube API key usage must remain server-only.
- File upload and delete operations must verify ownership or hive permissions server-side.

## Verification Expectations

For performance-sensitive changes, verify with at least:

- `npm.cmd run build`
- `npm.cmd run lint`
- Search generated client chunks when changing client/server boundaries:
  `rg "PrismaClient is unable to run in this browser|@prisma/client|PrismaClientKnownRequestError" .next/static/chunks -n`
- Manual route checks for changed pages.
