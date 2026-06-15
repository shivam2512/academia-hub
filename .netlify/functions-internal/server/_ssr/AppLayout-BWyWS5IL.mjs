import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as useLocation, L as Link, d as useNavigate, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { c as cn, u as useAuth, s as supabase } from "./router-Dwu1zVAe.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { R as Root, T as Trigger, P as Portal, C as Content, a as Close, O as Overlay, b as Title, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { r as LayoutDashboard, F as FileText, V as Video, b as Calendar, M as MessageSquare, G as GraduationCap, s as Menu, X, d as BookOpen, U as Users, S as Shield, t as CircleUser, u as LogOut } from "../_libs/lucide-react.mjs";
const Sheet = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, roles: ["superadmin", "admin", "teacher", "student"] },
  { to: "/app/batches", label: "Batches", icon: BookOpen, roles: ["superadmin", "admin", "teacher", "student"] },
  { to: "/app/users", label: "Users", icon: Users, roles: ["superadmin", "admin"] },
  { to: "/app/invoices", label: "Invoices", icon: FileText, roles: ["superadmin", "admin"] },
  { to: "/app/roles", label: "Roles", icon: Shield, roles: ["superadmin"] },
  { to: "/app/profile", label: "Profile", icon: CircleUser, roles: ["superadmin", "admin", "teacher", "student"] }
];
function AppLayout() {
  const { user, roles, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = reactExports.useState(false);
  const [avatarUrl, setAvatarUrl] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (user) {
      supabase.from("profiles").select("avatar_url").eq("id", user.id).single().then(({ data }) => {
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      });
    }
  }, [user]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-subtle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  if (!user) {
    if (typeof window !== "undefined") navigate({ to: "/auth" });
    return null;
  }
  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();
  const primaryRole = roles[0] ?? "student";
  const SidebarContent = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 border-b border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app", className: "flex items-center gap-2", onClick: () => setOpen(false), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-lg leading-tight", children: "DBS IT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-sidebar-foreground/60", children: "Learning Hub" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 p-3 space-y-1", children: NAV.filter((n) => n.roles.some((r) => roles.includes(r))).map((item) => {
      const Icon = item.icon;
      const active = location.pathname === item.to || item.to !== "/app" && location.pathname.startsWith(item.to);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: item.to,
          onClick: () => setOpen(false),
          className: cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" : "hover:bg-sidebar-accent text-sidebar-foreground/80"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
            " ",
            item.label
          ]
        },
        item.to
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-sidebar-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/profile", className: "flex items-center gap-3 flex-1 min-w-0", onClick: () => setOpen(false), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-9 w-9", children: [
          avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl, className: "object-cover" }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-xs font-bold", children: initials })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium truncate", children: user.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 mt-0.5 capitalize", children: primaryRole })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => {
        signOut();
        navigate({ to: "/" });
      }, className: "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }) })
    ] }) })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col lg:flex-row bg-gradient-subtle", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "lg:hidden h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "h-4 w-4 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "DBS IT" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-6 w-6" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "left", className: "p-0 w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex w-64 flex-col border-r border-sidebar-border sticky top-0 h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-x-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
  ] });
}
const BatchSubNav = ({ batchId }) => {
  const location = useLocation();
  const items = [
    { to: `/app/batches/${batchId}`, label: "Overview", icon: LayoutDashboard, exact: true },
    { to: `/app/batches/${batchId}/notes`, label: "Notes", icon: FileText },
    { to: `/app/batches/${batchId}/videos`, label: "Recordings", icon: Video },
    { to: `/app/batches/${batchId}/live`, label: "Live Classes", icon: Calendar },
    { to: `/app/batches/${batchId}/chat`, label: "Chat", icon: MessageSquare }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b bg-card sticky top-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 px-6 overflow-x-auto", children: items.map((it) => {
    const active = it.exact ? location.pathname === it.to : location.pathname.startsWith(it.to);
    const Icon = it.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: it.to, className: cn(
      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
      active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
    ), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      " ",
      it.label
    ] }, it.to);
  }) }) });
};
export {
  AppLayout as A,
  BatchSubNav as B
};
