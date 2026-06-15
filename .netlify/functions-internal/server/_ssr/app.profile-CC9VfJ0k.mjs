import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { L as Label } from "./label-C3nympTn.mjs";
import { A as Avatar, a as AvatarImage, b as AvatarFallback } from "./avatar-CpU7Xspn.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BsTkSNkg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as LoaderCircle, n as Camera, o as Save } from "../_libs/lucide-react.mjs";
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
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
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
function ProfilePage() {
  const {
    user,
    hasRole,
    isAdmin
  } = useAuth();
  const [profile, setProfile] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);
  async function loadProfile() {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function handleUpdateProfile(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const updates = {
      full_name: fd.get("full_name"),
      mobile_number: fd.get("mobile_number"),
      whatsapp_number: fd.get("whatsapp_number"),
      city: fd.get("city"),
      state: fd.get("state"),
      education_details: fd.get("education_details"),
      designation: fd.get("designation"),
      experience_type: profile.experience_type,
      // Controlled by Select
      current_package: fd.get("current_package"),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      const {
        error
      } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated successfully");
      loadProfile();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }
  async function handlePhotoUpload(e) {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from("avatars").upload(filePath, file);
      if (uploadError) throw uploadError;
      const {
        data: {
          publicUrl
        }
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const {
        error: updateError
      } = await supabase.from("profiles").update({
        avatar_url: publicUrl
      }).eq("id", user?.id);
      if (updateError) throw updateError;
      toast.success("Profile photo updated!");
      loadProfile();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) });
  }
  const initials = (profile?.full_name || user?.email || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "My Profile", description: "View and update your personal information and profile photo." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 flex flex-col items-center shadow-card h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-32 w-32 border-4 border-background shadow-elegant", children: [
            profile?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile.avatar_url, alt: profile.full_name, className: "object-cover" }) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-primary text-primary-foreground text-3xl font-bold", children: initials })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "photo-upload", className: "absolute bottom-0 right-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform", children: [
            uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { id: "photo-upload", type: "file", accept: "image/*", className: "hidden", onChange: handlePhotoUpload, disabled: uploading })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-bold", children: profile?.full_name || "New User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: user?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "capitalize", children: [
          profile?.admission_type || "Standard",
          " Admission"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-6 md:col-span-2 shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleUpdateProfile, className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "full_name", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "full_name", name: "full_name", defaultValue: profile?.full_name, required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email (Read-only)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", value: user?.email || "", disabled: true, className: "bg-muted/50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mobile_number", children: "Mobile Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "mobile_number", name: "mobile_number", defaultValue: profile?.mobile_number, placeholder: "e.g. +91 9876543210" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "whatsapp_number", children: "WhatsApp Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "whatsapp_number", name: "whatsapp_number", defaultValue: profile?.whatsapp_number, placeholder: "e.g. +91 9876543210" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "city", children: "City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "city", name: "city", defaultValue: profile?.city, placeholder: "City" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "state", children: "State" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "state", name: "state", defaultValue: profile?.state, placeholder: "State" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider mb-4", children: "Academic & Career" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "education_details", children: "Education Details" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "education_details", name: "education_details", defaultValue: profile?.education_details, placeholder: "Degree, College, etc." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "designation", children: "Designation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "designation", name: "designation", defaultValue: profile?.designation, placeholder: "Current Job Title" })
            ] }),
            (!hasRole("student") || isAdmin) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Candidate Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: profile?.experience_type || "fresher", onValueChange: (v) => setProfile({
                ...profile,
                experience_type: v
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "fresher", children: "Fresher" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "experienced", children: "Experienced" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "buy_experience", children: "Buy Experience" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "current_package", children: "Current Package" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "current_package", name: "current_package", defaultValue: profile?.current_package, placeholder: "e.g. 5 LPA" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: saving, className: "bg-gradient-primary text-primary-foreground", children: [
          saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
          "Save Changes"
        ] }) })
      ] }) })
    ] })
  ] });
}
function Badge({
  children,
  variant = "default",
  className
}) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`, children });
}
export {
  ProfilePage as component
};
