import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, c as cn, s as supabase } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BsTkSNkg.mjs";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-hFrm-Hfv.mjs";
import { C as Checkbox } from "./checkbox-DIYQb6Np.mjs";
import { L as Label } from "./label-C3nympTn.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DA6CM0I_.mjs";
import "../_libs/seroval.mjs";
import { g as Lock, h as Plus, i as Search, U as Users, j as SquarePen, k as UserPlus, l as Trash2 } from "../_libs/lucide-react.mjs";
import { s as stringType, o as objectType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const createUserSchema = objectType({
  email: stringType().trim().email().max(255),
  password: stringType().min(6).max(100),
  full_name: stringType().trim().min(2).max(100),
  role: enumType(["superadmin", "admin", "teacher", "student"]),
  mobile_number: stringType().optional(),
  whatsapp_number: stringType().optional(),
  joining_date: stringType().optional(),
  city: stringType().optional(),
  state: stringType().optional(),
  education_details: stringType().optional(),
  designation: stringType().optional(),
  experience_type: stringType().optional(),
  current_package: stringType().optional(),
  admission_type: stringType().optional(),
  eligible_for_pp: booleanType().optional()
});
const createUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => createUserSchema.parse(data)).handler(createSsrRpc("2ffd6b62225054eb509d5ccb287595818e28137470cffce2c16d81d4c63114ce"));
const deleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((uid) => stringType().uuid().parse(uid)).handler(createSsrRpc("685549eb02bf20ba8c36a1608a4462af7fc321f692b60c0797bf593d226ea35d"));
const updateUserSchema = objectType({
  id: stringType().uuid(),
  full_name: stringType().trim().min(2).max(100),
  role: enumType(["superadmin", "admin", "teacher", "student"]),
  mobile_number: stringType().optional().nullable(),
  whatsapp_number: stringType().optional().nullable(),
  joining_date: stringType().optional().nullable(),
  city: stringType().optional().nullable(),
  state: stringType().optional().nullable(),
  education_details: stringType().optional().nullable(),
  designation: stringType().optional().nullable(),
  experience_type: stringType().optional().nullable(),
  current_package: stringType().optional().nullable(),
  admission_type: stringType().optional().nullable(),
  eligible_for_pp: booleanType().optional()
});
const updateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => updateUserSchema.parse(data)).handler(createSsrRpc("f17cab7f15ce4f0fb79feb40a24b1484baa6635c1277a1b68ff98868a5ef7e04"));
function UsersPage() {
  const {
    isAdmin,
    hasRole
  } = useAuth();
  const isSuperadmin = hasRole("superadmin");
  const [users, setUsers] = reactExports.useState([]);
  const [roles, setRoles] = reactExports.useState({});
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [creating, setCreating] = reactExports.useState(false);
  const [newRole, setNewRole] = reactExports.useState("student");
  const [eligibleForPP, setEligibleForPP] = reactExports.useState(false);
  const [batches, setBatches] = reactExports.useState([]);
  const [memberships, setMemberships] = reactExports.useState({});
  const [invoices, setInvoices] = reactExports.useState({});
  const [assignOpen, setAssignOpen] = reactExports.useState(null);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [editingUser, setEditingUser] = reactExports.useState(null);
  const [updating, setUpdating] = reactExports.useState(false);
  const load = async () => {
    const [u, r, b, m, i] = await Promise.all([supabase.from("profiles").select("*").order("created_at", {
      ascending: false
    }), supabase.from("user_roles").select("user_id, role"), supabase.from("batches").select("id, name"), supabase.from("batch_members").select("user_id, batch_id, role, batches(name)"), supabase.from("student_invoices").select("user_id, status")]);
    setUsers(u.data ?? []);
    const rmap = {};
    (r.data ?? []).forEach((x) => {
      (rmap[x.user_id] ||= []).push(x.role);
    });
    setRoles(rmap);
    setBatches(b.data ?? []);
    const mmap = {};
    (m.data ?? []).forEach((x) => {
      (mmap[x.user_id] ||= []).push(x);
    });
    setMemberships(mmap);
    const imap = {};
    (i.data ?? []).forEach((x) => {
      imap[x.user_id] = x;
    });
    setInvoices(imap);
  };
  reactExports.useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);
  if (!isAdmin) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-12 text-center shadow-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-10 w-10 mx-auto text-muted-foreground/50 mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Admins only." })
  ] }) });
  const assignToBatch = async (userId, batchId, role, checked) => {
    if (checked) {
      const {
        error
      } = await supabase.from("batch_members").insert({
        user_id: userId,
        batch_id: batchId,
        role
      });
      if (error) toast.error(error.message);
      else toast.success("Added");
    } else {
      const {
        error
      } = await supabase.from("batch_members").delete().eq("user_id", userId).eq("batch_id", batchId);
      if (error) toast.error(error.message);
      else toast.success("Removed");
    }
    load();
  };
  const handleDelete = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) return;
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      await deleteUser({
        data: userId,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err?.message ?? "Failed to delete user");
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      password: String(fd.get("password") || ""),
      role: newRole,
      mobile_number: String(fd.get("mobile_number") || "").trim(),
      whatsapp_number: String(fd.get("whatsapp_number") || "").trim(),
      joining_date: String(fd.get("joining_date") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      state: String(fd.get("state") || "").trim(),
      education_details: String(fd.get("education_details") || "").trim(),
      designation: String(fd.get("designation") || "").trim(),
      experience_type: String(fd.get("experience_type") || ""),
      current_package: String(fd.get("current_package") || "").trim(),
      admission_type: String(fd.get("admission_type") || ""),
      eligible_for_pp: eligibleForPP
    };
    if (payload.full_name.length < 2 || !payload.email || payload.password.length < 6) {
      toast.error("Name, valid email, and password (6+ chars) are required");
      return;
    }
    setCreating(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      await createUser({
        data: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      toast.success("User created");
      setCreateOpen(false);
      setNewRole("student");
      setEligibleForPP(false);
      load();
    } catch (err) {
      toast.error(err?.message ?? "Failed to create user");
    } finally {
      setCreating(false);
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      id: editingUser.id,
      full_name: String(fd.get("full_name") || "").trim(),
      role: fd.get("role") || "student",
      mobile_number: String(fd.get("mobile_number") || "").trim(),
      whatsapp_number: String(fd.get("whatsapp_number") || "").trim(),
      joining_date: String(fd.get("joining_date") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      state: String(fd.get("state") || "").trim(),
      education_details: String(fd.get("education_details") || "").trim(),
      designation: String(fd.get("designation") || "").trim(),
      experience_type: String(fd.get("experience_type") || ""),
      current_package: String(fd.get("current_package") || "").trim(),
      admission_type: String(fd.get("admission_type") || ""),
      eligible_for_pp: fd.get("eligible_for_pp") === "true"
    };
    setUpdating(true);
    try {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not signed in");
      await updateUser({
        data: payload,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      toast.success("User updated");
      setEditOpen(false);
      setEditingUser(null);
      load();
    } catch (err) {
      toast.error(err?.message ?? "Failed to update user");
    } finally {
      setUpdating(false);
    }
  };
  const [search, setSearch] = reactExports.useState("");
  const filteredUsers = users.filter((u) => u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Users", description: "All users on the platform.", actions: isSuperadmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "bg-gradient-primary text-primary-foreground hover:opacity-90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
        "Add user"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add a new user" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCreate, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Account Info" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nu-name", children: "Full name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nu-name", name: "full_name", required: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nu-email", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nu-email", name: "email", type: "email", required: true })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nu-password", children: "Temporary password (min 6 chars)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nu-password", name: "password", type: "text", required: true, minLength: 6 })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newRole, onValueChange: (v) => setNewRole(v), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "student", children: "Student" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "teacher", children: "Teacher" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "superadmin", children: "Superadmin" })
                  ] })
                ] })
              ] })
            ] }),
            newRole === "student" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Personal Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mobile No" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "mobile_number", placeholder: "Mobile" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "WhatsApp No" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "whatsapp_number", placeholder: "WhatsApp" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Joining Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "joining_date", type: "date" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "City" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "city", placeholder: "City" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "State" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "state", placeholder: "State" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { id: "pp", checked: eligibleForPP, onCheckedChange: (v) => setEligibleForPP(!!v) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "pp", className: "text-xs font-medium cursor-pointer", children: "Eligible for PP Sessions" })
              ] })
            ] })
          ] }),
          newRole === "student" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Education & Career" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Education Details" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "education_details", placeholder: "Degree, College, etc." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Designation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "designation", placeholder: "Job Title" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Candidate Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "experience_type", defaultValue: "fresher", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fresher", children: "Fresher" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "experienced", children: "Experienced" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "buy_experience", children: "Buy Experience" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Package" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "current_package", placeholder: "e.g. 5 LPA" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Admission Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "admission_type", defaultValue: "inhouse", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inhouse", children: "Inhouse" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reference", children: "Reference" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Share these credentials with the user. They can change their password after signing in." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full md:w-auto bg-gradient-primary text-primary-foreground", disabled: creating, children: creating ? "Creating…" : "Create user" }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editOpen, onOpenChange: setEditOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Edit User: ",
        editingUser?.email
      ] }) }),
      editingUser && /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdate, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Account Info" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Full name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "full_name", defaultValue: editingUser.full_name, required: true })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "role", defaultValue: roles[editingUser.id]?.[0] || "student", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "student", children: "Student" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "teacher", children: "Teacher" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "superadmin", children: "Superadmin" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Personal Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mobile No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "mobile_number", defaultValue: editingUser.mobile_number, placeholder: "Mobile" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "WhatsApp No" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "whatsapp_number", defaultValue: editingUser.whatsapp_number, placeholder: "WhatsApp" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Joining Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "joining_date", type: "date", defaultValue: editingUser.joining_date })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "City" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "city", defaultValue: editingUser.city, placeholder: "City" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "State" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "state", defaultValue: editingUser.state, placeholder: "State" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 pt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "hidden", name: "eligible_for_pp", value: String(editingUser.eligible_for_pp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { id: "edit-pp", defaultChecked: editingUser.eligible_for_pp, onCheckedChange: (v) => setEditingUser({
                ...editingUser,
                eligible_for_pp: !!v
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-pp", className: "text-xs font-medium cursor-pointer", children: "Eligible for PP Sessions" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Education & Career" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Education Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "education_details", defaultValue: editingUser.education_details, placeholder: "Degree, College, etc." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "designation", defaultValue: editingUser.designation, placeholder: "Job Title" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Candidate Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "experience_type", defaultValue: editingUser.experience_type || "fresher", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fresher", children: "Fresher" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "experienced", children: "Experienced" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "buy_experience", children: "Buy Experience" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Package" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { name: "current_package", defaultValue: editingUser.current_package, placeholder: "e.g. 5 LPA" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Admission Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { name: "admission_type", defaultValue: editingUser.admission_type || "inhouse", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inhouse", children: "Inhouse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reference", children: "Reference" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full md:w-auto bg-gradient-primary text-primary-foreground", disabled: updating, children: updating ? "Updating…" : "Update user" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted/30 border-b flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search users by name or email...", className: "pl-9 bg-background", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y", children: filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 mx-auto mb-2 opacity-40" }),
        search ? `No results for "${search}"` : "No users yet."
      ] }) : filteredUsers.map((u) => {
        const userRoles = roles[u.id] || [];
        const userMemberships = memberships[u.id] || [];
        const isOpen = assignOpen === u.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 flex flex-col sm:flex-row sm:items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { children: [
              u.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: u.avatar_url, className: "object-cover" }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-xs font-bold", children: (u.full_name || u.email || "U").slice(0, 2).toUpperCase() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold sm:font-medium truncate", children: u.full_name || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: u.email }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-1 flex-wrap", children: [
                userRoles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "capitalize text-[10px] h-4", children: r }, r)),
                userMemberships.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] h-4", children: [
                  m.batches?.name,
                  " · ",
                  m.role
                ] }, m.batch_id)),
                userRoles.includes("student") && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("text-[10px] h-4 border-transparent", invoices[u.id]?.status === "fully_paid" ? "bg-emerald-500 hover:bg-emerald-600" : invoices[u.id]?.status === "partially_paid" ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-500 hover:bg-slate-600"), children: invoices[u.id]?.status?.replace("_", " ") ?? "Unpaid" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end sm:justify-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 text-xs", onClick: () => {
              setEditingUser(u);
              setEditOpen(true);
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5 mr-2" }),
              "Edit"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isOpen, onOpenChange: (o) => setAssignOpen(o ? u.id : null), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-8 text-xs flex-1 sm:flex-none", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5 mr-2" }),
                "Batches"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-[95vw] sm:max-w-md", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
                  "Assign ",
                  u.full_name || u.email,
                  " to batches"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 max-h-[60vh] overflow-auto pr-1", children: [
                  batches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No batches yet." }),
                  batches.map((b) => {
                    const m = userMemberships.find((x) => x.batch_id === b.id);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 p-3 rounded-lg border bg-muted/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-sm", children: b.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: m?.role ?? "student", onValueChange: async (newRole2) => {
                          if (m) {
                            await supabase.from("batch_members").update({
                              role: newRole2
                            }).eq("user_id", u.id).eq("batch_id", b.id);
                            load();
                          }
                        }, disabled: !m, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-28 h-7 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "student", children: "Student" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "teacher", children: "Teacher" })
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: m ? "Assigned" : "Not Assigned" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: !!m, onCheckedChange: (c) => assignToBatch(u.id, b.id, m?.role ?? "student", !!c) })
                        ] })
                      ] })
                    ] }, b.id);
                  })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setAssignOpen(null), className: "w-full sm:w-auto", children: "Done" }) })
              ] })
            ] }),
            isSuperadmin && u.id !== useAuth().user?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(u.id, u.email), className: "text-destructive hover:text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }, u.id);
      }) })
    ] })
  ] });
}
export {
  UsersPage as component
};
