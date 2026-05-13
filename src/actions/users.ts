import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const createUserSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
  full_name: z.string().trim().min(2).max(100),
  role: z.enum(["superadmin", "admin", "teacher", "student"]),
  mobile_number: z.string().optional(),
  whatsapp_number: z.string().optional(),
  joining_date: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  education_details: z.string().optional(),
  designation: z.string().optional(),
  experience_type: z.string().optional(),
  current_package: z.string().optional(),
  admission_type: z.string().optional(),
  eligible_for_pp: z.boolean().optional(),
});

export const createUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createUserSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Verify caller is superadmin
    const { data: callerRoles, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (roleErr) throw new Error(roleErr.message);
    const isSuper = (callerRoles ?? []).some((r) => r.role === "superadmin");
    if (!isSuper) throw new Error("Only superadmins can create users");

    // Create the auth user (email auto-confirmed)
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (createErr || !created.user) throw new Error(createErr?.message ?? "Failed to create user");

    const newUserId = created.user.id;

    // Belt-and-suspenders: ensure the email is confirmed so the user can sign in immediately
    if (!created.user.email_confirmed_at) {
      await supabaseAdmin.auth.admin.updateUserById(newUserId, { email_confirm: true });
    }

    // Ensure a profile row exists (in case the handle_new_user trigger didn't run)
    await supabaseAdmin.from("profiles").upsert(
      { 
        id: newUserId, 
        email: data.email, 
        full_name: data.full_name,
        mobile_number: data.mobile_number,
        whatsapp_number: data.whatsapp_number,
        joining_date: data.joining_date,
        city: data.city,
        state: data.state,
        education_details: data.education_details,
        designation: data.designation,
        experience_type: data.experience_type,
        current_package: data.current_package,
        admission_type: data.admission_type,
        eligible_for_pp: data.eligible_for_pp,
      },
      { onConflict: "id" }
    );

    // handle_new_user trigger inserts a default 'student' role. Replace if needed.
    if (data.role !== "student") {
      await supabaseAdmin.from("user_roles").delete().eq("user_id", newUserId);
      const { error: rErr } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: newUserId, role: data.role });
      if (rErr) throw new Error(rErr.message);
    }

    return { id: newUserId, email: data.email };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((uid: unknown) => z.string().uuid().parse(uid))
  .handler(async ({ data: targetUserId, context }) => {
    const { userId: callerId } = context;

    if (callerId === targetUserId) {
      throw new Error("You cannot delete yourself");
    }

    // Verify caller is superadmin
    const { data: callerRoles, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId);
    if (roleErr) throw new Error(roleErr.message);
    const isSuper = (callerRoles ?? []).some((r) => r.role === "superadmin");
    if (!isSuper) throw new Error("Only superadmins can delete users");

    // Delete the auth user
    const { error: deleteErr } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    if (deleteErr) throw new Error(deleteErr.message);

    return { success: true };
  });

const updateUserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().trim().min(2).max(100),
  role: z.enum(["superadmin", "admin", "teacher", "student"]),
  mobile_number: z.string().optional().nullable(),
  whatsapp_number: z.string().optional().nullable(),
  joining_date: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  education_details: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  experience_type: z.string().optional().nullable(),
  current_package: z.string().optional().nullable(),
  admission_type: z.string().optional().nullable(),
  eligible_for_pp: z.boolean().optional(),
});

export const updateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => updateUserSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Verify caller is admin or superadmin
    const { data: callerRoles, error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (roleErr) throw new Error(roleErr.message);
    const isAdmin = (callerRoles ?? []).some((r) => ["admin", "superadmin"].includes(r.role));
    if (!isAdmin) throw new Error("Only admins can update users");

    // Update profile
    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.full_name,
        mobile_number: data.mobile_number,
        whatsapp_number: data.whatsapp_number,
        joining_date: data.joining_date,
        city: data.city,
        state: data.state,
        education_details: data.education_details,
        designation: data.designation,
        experience_type: data.experience_type,
        current_package: data.current_package,
        admission_type: data.admission_type,
        eligible_for_pp: data.eligible_for_pp,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (profileErr) throw new Error(profileErr.message);

    // Update role
    const { error: deleteRoleErr } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.id);
    if (deleteRoleErr) throw new Error(deleteRoleErr.message);

    const { error: insertRoleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.id, role: data.role });
    if (insertRoleErr) throw new Error(insertRoleErr.message);

    return { success: true };
  });
