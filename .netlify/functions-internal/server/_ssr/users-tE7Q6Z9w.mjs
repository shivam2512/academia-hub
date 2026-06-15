import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DA6CM0I_.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, b as booleanType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
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
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
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
const createUser_createServerFn_handler = createServerRpc({
  id: "2ffd6b62225054eb509d5ccb287595818e28137470cffce2c16d81d4c63114ce",
  name: "createUser",
  filename: "src/actions/users.ts"
}, (opts) => createUser.__executeServer(opts));
const createUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => createUserSchema.parse(data)).handler(createUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: callerRoles,
    error: roleErr
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if (roleErr) throw new Error(roleErr.message);
  const isSuper = (callerRoles ?? []).some((r) => r.role === "superadmin");
  if (!isSuper) throw new Error("Only superadmins can create users");
  const {
    data: created,
    error: createErr
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name
    }
  });
  if (createErr || !created.user) throw new Error(createErr?.message ?? "Failed to create user");
  const newUserId = created.user.id;
  if (!created.user.email_confirmed_at) {
    await supabaseAdmin.auth.admin.updateUserById(newUserId, {
      email_confirm: true
    });
  }
  await supabaseAdmin.from("profiles").upsert({
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
    eligible_for_pp: data.eligible_for_pp
  }, {
    onConflict: "id"
  });
  if (data.role !== "student") {
    await supabaseAdmin.from("user_roles").delete().eq("user_id", newUserId);
    const {
      error: rErr
    } = await supabaseAdmin.from("user_roles").insert({
      user_id: newUserId,
      role: data.role
    });
    if (rErr) throw new Error(rErr.message);
  }
  return {
    id: newUserId,
    email: data.email
  };
});
const deleteUser_createServerFn_handler = createServerRpc({
  id: "685549eb02bf20ba8c36a1608a4462af7fc321f692b60c0797bf593d226ea35d",
  name: "deleteUser",
  filename: "src/actions/users.ts"
}, (opts) => deleteUser.__executeServer(opts));
const deleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((uid) => stringType().uuid().parse(uid)).handler(deleteUser_createServerFn_handler, async ({
  data: targetUserId,
  context
}) => {
  const {
    userId: callerId
  } = context;
  if (callerId === targetUserId) {
    throw new Error("You cannot delete yourself");
  }
  const {
    data: callerRoles,
    error: roleErr
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", callerId);
  if (roleErr) throw new Error(roleErr.message);
  const isSuper = (callerRoles ?? []).some((r) => r.role === "superadmin");
  if (!isSuper) throw new Error("Only superadmins can delete users");
  const {
    error: deleteErr
  } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
  if (deleteErr) throw new Error(deleteErr.message);
  return {
    success: true
  };
});
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
const updateUser_createServerFn_handler = createServerRpc({
  id: "f17cab7f15ce4f0fb79feb40a24b1484baa6635c1277a1b68ff98868a5ef7e04",
  name: "updateUser",
  filename: "src/actions/users.ts"
}, (opts) => updateUser.__executeServer(opts));
const updateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((data) => updateUserSchema.parse(data)).handler(updateUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: callerRoles,
    error: roleErr
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if (roleErr) throw new Error(roleErr.message);
  const isAdmin = (callerRoles ?? []).some((r) => ["admin", "superadmin"].includes(r.role));
  if (!isAdmin) throw new Error("Only admins can update users");
  const {
    error: profileErr
  } = await supabaseAdmin.from("profiles").update({
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
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.id);
  if (profileErr) throw new Error(profileErr.message);
  const {
    error: deleteRoleErr
  } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.id);
  if (deleteRoleErr) throw new Error(deleteRoleErr.message);
  const {
    error: insertRoleErr
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: data.id,
    role: data.role
  });
  if (insertRoleErr) throw new Error(insertRoleErr.message);
  return {
    success: true
  };
});
export {
  createUser_createServerFn_handler,
  deleteUser_createServerFn_handler,
  updateUser_createServerFn_handler
};
