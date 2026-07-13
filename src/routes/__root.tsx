import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "../lib/auth";
import { ThemeProvider } from "../lib/theme";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center hero-bg px-4">
      <div className="max-w-md text-center animate-fade-in">
        <h1 className="text-8xl font-bold gradient-text font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">This route doesn't exist in BizPilot AI.</p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-white glow-primary hover:brightness-110 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-white glow-primary hover:brightness-110 transition"
          >
            Try again
          </button>
          <a href="/dashboard" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BizPilot AI — Smart Business Analytics & Decision Intelligence" },
      { name: "description", content: "Premium AI business intelligence platform for revenue, sales, customers, inventory, marketing, and forecasting." },
      { name: "author", content: "BizPilot AI" },
      { property: "og:title", content: "BizPilot AI — Smart Business Analytics & Decision Intelligence" },
      { property: "og:description", content: "Premium AI business intelligence platform for revenue, sales, customers, inventory, marketing, and forecasting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BizPilot AI — Smart Business Analytics & Decision Intelligence" },
      { name: "twitter:description", content: "Premium AI business intelligence platform for revenue, sales, customers, inventory, marketing, and forecasting." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1b38d7f4-7940-46a9-8973-02ca603586da/id-preview-dea3c8f3--33726af7-d45b-444f-a7bd-6d25da32bc40.lovable.app-1783320074761.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1b38d7f4-7940-46a9-8973-02ca603586da/id-preview-dea3c8f3--33726af7-d45b-444f-a7bd-6d25da32bc40.lovable.app-1783320074761.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
