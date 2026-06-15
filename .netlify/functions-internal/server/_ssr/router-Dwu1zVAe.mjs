import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as createRouter, u as useRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { P as Portal, C as Content2, a as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://crqtzvuzdefyarpqkunm.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycXR6dnV6ZGVmeWFycHFrdW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzI5MTgsImV4cCI6MjA5MzMwODkxOH0.Rcn7UU-r7g-lC_bA1B_S5ujzYAfGy8cND5PbQxsdBN0";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
let currentSubscription = null;
const currentSessionId = Math.random().toString(36).substring(2, 15);
async function registerSession(userId, onLogout) {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }
  const { error } = await supabase.from("active_sessions").upsert({
    user_id: userId,
    session_id: currentSessionId,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (error) {
    console.error("Failed to register session:", error);
    return;
  }
  currentSubscription = supabase.channel("active_session_check").on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "active_sessions",
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      const newSessionId = payload.new.session_id;
      if (newSessionId !== currentSessionId) {
        toast.error("You have been logged in on another device. Logging out here.");
        onLogout();
      }
    }
  ).subscribe();
}
function cleanupSessionGuard() {
  if (currentSubscription) {
    currentSubscription.unsubscribe();
    currentSubscription = null;
  }
}
const Ctx = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [roles, setRoles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const fetchRoles = async (uid) => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role));
  };
  reactExports.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => {
          fetchRoles(s.user.id);
          registerSession(s.user.id, () => supabase.auth.signOut());
        }, 0);
      } else {
        setRoles([]);
        cleanupSessionGuard();
      }
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchRoles(s.user.id).finally(() => {
          setLoading(false);
          registerSession(s.user.id, () => supabase.auth.signOut());
        });
      } else {
        setLoading(false);
      }
    });
    return () => {
      subscription.unsubscribe();
      cleanupSessionGuard();
    };
  }, []);
  const value = {
    user,
    session,
    roles,
    loading,
    signOut: async () => {
      cleanupSessionGuard();
      await supabase.auth.signOut();
    },
    refreshRoles: async () => {
      if (user) await fetchRoles(user.id);
    },
    hasRole: (r) => roles.includes(r),
    hasAnyRole: (rs) => rs.some((r) => roles.includes(r)),
    isAdmin: roles.includes("admin") || roles.includes("superadmin")
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function useAuth() {
  const v = reactExports.useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const TooltipProvider = Provider;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
function initAntiInspect() {
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "F12") {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      return;
    }
  });
  const debuggerLoop = () => {
    debugger;
  };
  setInterval(debuggerLoop, 2e3);
  console.clear();
  console.log(
    "%c⚠️ Stop!",
    "color: red; font-size: 40px; font-weight: bold;"
  );
  console.log(
    "%cThis browser feature is intended for developers. If someone told you to copy-paste something here, it is a scam.",
    "font-size: 16px;"
  );
}
const appCss = "/assets/styles-BMZ92ucB.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-subtle px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90", children: "Go home" })
  ] }) });
}
const Route$f = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DBS IT — Switch to IT in 3 Months" },
      { name: "description", content: "Switch your career from NON IT to IT with industry ready courses within 3 months at DBS IT." },
      { property: "og:title", content: "DBS IT — Modern Learning Platform" },
      { property: "og:description", content: "Run your coaching institute end-to-end with batches, notes, videos, live classes and chat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  reactExports.useEffect(() => {
    initAntiInspect();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TooltipProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) });
}
const $$splitComponentImporter$e = () => import("./auth-B52M-M8-.mjs");
const Route$e = createFileRoute("/auth")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./app-COryjI_s.mjs");
const Route$d = createFileRoute("/app")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./index-Bf4dZ_hc.mjs");
const Route$c = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  head: () => ({
    meta: [{
      title: "DBS IT — Switch to IT in 3 Months"
    }, {
      name: "description",
      content: "Switch your career from NON IT to IT with industry ready courses within 3 months at DBS IT."
    }]
  })
});
const $$splitComponentImporter$b = () => import("./app.index-CtakOr0F.mjs");
const Route$b = createFileRoute("/app/")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./app.users-uXYVOR4T.mjs");
const Route$a = createFileRoute("/app/users")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.roles-B5HpPLqu.mjs");
const Route$9 = createFileRoute("/app/roles")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.profile-CC9VfJ0k.mjs");
const Route$8 = createFileRoute("/app/profile")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.invoices-Ds5P7Yhp.mjs");
const Route$7 = createFileRoute("/app/invoices")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.batches.index-evljk3FD.mjs");
const Route$6 = createFileRoute("/app/batches/")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.batches._batchId-Cjxem2lZ.mjs");
const Route$5 = createFileRoute("/app/batches/$batchId")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./app.batches._batchId.index-J40XT9RB.mjs");
const Route$4 = createFileRoute("/app/batches/$batchId/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.batches._batchId.videos-Caz0LNnA.mjs");
const Route$3 = createFileRoute("/app/batches/$batchId/videos")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./app.batches._batchId.notes-CSJL9xBZ.mjs");
const Route$2 = createFileRoute("/app/batches/$batchId/notes")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.batches._batchId.live-Drx_2p5i.mjs");
const Route$1 = createFileRoute("/app/batches/$batchId/live")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.batches._batchId.chat-ujTQuwRJ.mjs");
const Route = createFileRoute("/app/batches/$batchId/chat")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const AuthRoute = Route$e.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$f
});
const AppRoute = Route$d.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$f
});
const IndexRoute = Route$c.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$f
});
const AppIndexRoute = Route$b.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const AppUsersRoute = Route$a.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AppRoute
});
const AppRolesRoute = Route$9.update({
  id: "/roles",
  path: "/roles",
  getParentRoute: () => AppRoute
});
const AppProfileRoute = Route$8.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => AppRoute
});
const AppInvoicesRoute = Route$7.update({
  id: "/invoices",
  path: "/invoices",
  getParentRoute: () => AppRoute
});
const AppBatchesIndexRoute = Route$6.update({
  id: "/batches/",
  path: "/batches/",
  getParentRoute: () => AppRoute
});
const AppBatchesBatchIdRoute = Route$5.update({
  id: "/batches/$batchId",
  path: "/batches/$batchId",
  getParentRoute: () => AppRoute
});
const AppBatchesBatchIdIndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppBatchesBatchIdRoute
});
const AppBatchesBatchIdVideosRoute = Route$3.update({
  id: "/videos",
  path: "/videos",
  getParentRoute: () => AppBatchesBatchIdRoute
});
const AppBatchesBatchIdNotesRoute = Route$2.update({
  id: "/notes",
  path: "/notes",
  getParentRoute: () => AppBatchesBatchIdRoute
});
const AppBatchesBatchIdLiveRoute = Route$1.update({
  id: "/live",
  path: "/live",
  getParentRoute: () => AppBatchesBatchIdRoute
});
const AppBatchesBatchIdChatRoute = Route.update({
  id: "/chat",
  path: "/chat",
  getParentRoute: () => AppBatchesBatchIdRoute
});
const AppBatchesBatchIdRouteChildren = {
  AppBatchesBatchIdChatRoute,
  AppBatchesBatchIdLiveRoute,
  AppBatchesBatchIdNotesRoute,
  AppBatchesBatchIdVideosRoute,
  AppBatchesBatchIdIndexRoute
};
const AppBatchesBatchIdRouteWithChildren = AppBatchesBatchIdRoute._addFileChildren(AppBatchesBatchIdRouteChildren);
const AppRouteChildren = {
  AppInvoicesRoute,
  AppProfileRoute,
  AppRolesRoute,
  AppUsersRoute,
  AppIndexRoute,
  AppBatchesBatchIdRoute: AppBatchesBatchIdRouteWithChildren,
  AppBatchesIndexRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren,
  AuthRoute
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
function DefaultErrorComponent({ error, reset }) {
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        className: "h-8 w-8 text-destructive",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
        strokeWidth: 2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "An unexpected error occurred. Please try again." }),
    false,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  cn as c,
  router as r,
  supabase as s,
  useAuth as u
};
