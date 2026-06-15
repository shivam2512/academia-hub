import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { A as Avatar, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BsTkSNkg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as Lock, i as Search, S as Shield, X } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const ALL_ROLES = ["superadmin", "admin", "teacher", "student"];
function RolesPage() {
  const {
    hasRole,
    user
  } = useAuth();
  const [users, setUsers] = reactExports.useState([]);
  const [roles, setRoles] = reactExports.useState({});
  const [search, setSearch] = reactExports.useState("");
  const load = async () => {
    const [u, r] = await Promise.all([supabase.from("profiles").select("*").order("created_at", {
      ascending: false
    }), supabase.from("user_roles").select("user_id, role")]);
    setUsers(u.data ?? []);
    const rmap = {};
    (r.data ?? []).forEach((x) => {
      (rmap[x.user_id] ||= []).push(x.role);
    });
    setRoles(rmap);
  };
  reactExports.useEffect(() => {
    if (hasRole("superadmin")) load();
  }, [hasRole]);
  if (!hasRole("superadmin")) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-10 w-10 mx-auto text-muted-foreground/50 mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Superadmins only." })
  ] }) });
  const addRole = async (uid, role) => {
    const {
      error
    } = await supabase.from("user_roles").insert({
      user_id: uid,
      role
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Role added");
      load();
    }
  };
  const removeRole = async (uid, role) => {
    if (uid === user?.id && role === "superadmin") {
      toast.error("You can't remove your own superadmin role");
      return;
    }
    const {
      error
    } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    if (error) toast.error(error.message);
    else {
      toast.success("Role removed");
      load();
    }
  };
  const filteredUsers = users.filter((u) => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Roles & Permissions", description: "Assign roles. Only superadmins can manage roles." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted/30 border-b flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or email...", className: "pl-9 bg-background", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-10 w-10 mx-auto mb-2 opacity-40" }),
        search ? `No results for "${search}"` : "No users found."
      ] }) : filteredUsers.map((u) => {
        const userRoles = roles[u.id] || [];
        const available = ALL_ROLES.filter((r) => !userRoles.includes(r));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col sm:flex-row sm:items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-xs", children: (u.full_name || u.email || "U").slice(0, 2).toUpperCase() }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold sm:font-medium truncate", children: u.full_name || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: u.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-wrap items-center justify-end sm:justify-start", children: [
            userRoles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "capitalize gap-1 pr-1 text-[10px] h-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
              " ",
              r,
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeRole(u.id, r), className: "hover:bg-destructive/20 rounded-full p-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
            ] }, r)),
            available.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (v) => addRole(u.id, v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-28 h-6 text-[10px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "+ Role" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: available.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, className: "capitalize text-xs", children: r }, r)) })
            ] })
          ] })
        ] }, u.id);
      }) })
    ] })
  ] });
}
export {
  RolesPage as component
};
