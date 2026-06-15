import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useAuth, s as supabase } from "./router-Dwu1zVAe.mjs";
import { P as PageHeader } from "./PageHeader-D2RbNmHv.mjs";
import { C as Card } from "./card-DHf5oGKv.mjs";
import { B as Button } from "./button-C8jBQuTb.mjs";
import { I as Input } from "./input-RvXdt_nv.mjs";
import { L as Label } from "./label-C3nympTn.mjs";
import { B as Badge } from "./badge-wOynnn7b.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogFooter } from "./dialog-hFrm-Hfv.mjs";
import { C as Checkbox } from "./checkbox-DIYQb6Np.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BsTkSNkg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
import { a as autoTable } from "../_libs/jspdf-autotable.mjs";
import { i as Search, D as Download, I as IndianRupee, h as Plus, l as Trash2, o as Save } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "fs";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
const generateReceipt = (data) => {
  try {
    const doc = new jspdf_node_minExports.jsPDF();
    const { studentName, studentEmail, totalFee, paidAmount, paymentDate, status, paymentMethod, paymentDetails } = data;
    const pendingAmount = totalFee - paidAmount;
    doc.setFontSize(22);
    doc.setTextColor(76, 81, 191);
    doc.text("DBS INSTITUTE", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Payment Receipt", 105, 28, { align: "center" });
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Billed To:", 20, 50);
    doc.setFont("helvetica", "bold");
    doc.text(studentName, 20, 57);
    doc.setFont("helvetica", "normal");
    doc.text(studentEmail, 20, 63);
    doc.text("Receipt Date:", 140, 50);
    doc.text(paymentDate, 140, 57);
    doc.text("Status:", 140, 63);
    doc.setTextColor(status === "fully_paid" ? 16 : 245, status === "fully_paid" ? 185 : 158, status === "fully_paid" ? 129 : 11);
    doc.text(status.replace("_", " ").toUpperCase(), 140, 69);
    doc.setTextColor(0);
    const tableBody = [
      ["Course Fee (Total)", `INR ${totalFee.toLocaleString()}`],
      ["Total Amount Paid", `INR ${paidAmount.toLocaleString()}`]
    ];
    if (paymentMethod) {
      let methodText = paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1);
      if (paymentDetails) methodText += ` (${paymentDetails})`;
      tableBody.push(["Payment Method", methodText]);
    }
    autoTable(doc, {
      startY: 85,
      head: [["Description", "Amount"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [76, 81, 191] },
      columnStyles: { 1: { halign: "right" } }
    });
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Balance Due: INR ${pendingAmount.toLocaleString()}`, 190, finalY, { align: "right" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Thank you for choosing DBS Institute for your learning journey.", 105, 280, { align: "center" });
    doc.text("This is a computer-generated receipt and does not require a signature.", 105, 285, { align: "center" });
    doc.save(`Receipt_${studentName.replace(/\s+/g, "_")}_${paymentDate.replace(/\//g, "-")}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    toast.error("Failed to generate receipt. Please try again.");
  }
};
function InvoicesPage() {
  const {
    isAdmin
  } = useAuth();
  const [students, setStudents] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [editingStudent, setEditingStudent] = reactExports.useState(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [totalFee, setTotalFee] = reactExports.useState(0);
  const [paidAmount, setPaidAmount] = reactExports.useState(0);
  const [emiOpted, setEmiOpted] = reactExports.useState(false);
  const [emis, setEmis] = reactExports.useState([]);
  const [paymentMethod, setPaymentMethod] = reactExports.useState("self");
  const [bajajDownPayment, setBajajDownPayment] = reactExports.useState(0);
  const [bajajLanNo, setBajajLanNo] = reactExports.useState("");
  const [selfPaymentType, setSelfPaymentType] = reactExports.useState("upi");
  const [merchantPaymentType, setMerchantPaymentType] = reactExports.useState("");
  const load = async () => {
    setLoading(true);
    const {
      data: profs
    } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
    const {
      data: invs
    } = await supabase.from("student_invoices").select("*");
    const invMap = {};
    (invs ?? []).forEach((i) => {
      invMap[i.user_id] = i;
    });
    const merged = (profs ?? []).map((p) => ({
      ...p,
      invoice: invMap[p.id]
    }));
    setStudents(merged);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
  }, []);
  const openEditor = (s) => {
    setEditingStudent(s);
    setTotalFee(s.invoice?.total_fee ?? 0);
    setPaidAmount(s.invoice?.paid_amount ?? 0);
    setEmiOpted(s.invoice?.emi_opted ?? false);
    setEmis(s.invoice?.emi_details ?? []);
    setPaymentMethod(s.invoice?.payment_method ?? "self");
    setBajajDownPayment(s.invoice?.bajaj_down_payment ?? 0);
    setBajajLanNo(s.invoice?.bajaj_lan_no ?? "");
    setSelfPaymentType(s.invoice?.self_payment_type ?? "upi");
    setMerchantPaymentType(s.invoice?.merchant_payment_type ?? "");
  };
  const addEmi = () => {
    setEmis([...emis, {
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      amount: 0,
      status: "pending"
    }]);
  };
  const removeEmi = (idx) => {
    setEmis(emis.filter((_, i) => i !== idx));
  };
  const updateEmi = (idx, field, val) => {
    const next = [...emis];
    next[idx] = {
      ...next[idx],
      [field]: val
    };
    setEmis(next);
  };
  const save = async () => {
    if (!editingStudent) return;
    setBusy(true);
    const pending = totalFee - paidAmount;
    let status = "unpaid";
    if (pending <= 0) status = "fully_paid";
    else if (paidAmount > 0) status = "partially_paid";
    const payload = {
      user_id: editingStudent.id,
      total_fee: totalFee,
      paid_amount: paidAmount,
      emi_opted: emiOpted,
      emi_details: emis,
      status,
      payment_method: paymentMethod,
      bajaj_down_payment: bajajDownPayment,
      bajaj_lan_no: bajajLanNo,
      self_payment_type: selfPaymentType,
      merchant_payment_type: merchantPaymentType
    };
    const {
      error
    } = await supabase.from("student_invoices").upsert(payload, {
      onConflict: "user_id"
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Invoice updated");
    setEditingStudent(null);
    load();
  };
  const filtered = students.filter((s) => s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Student Invoices", description: "Manage course fees, payments and EMI schedules." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6 shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted/30 border-b flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by name or email...", className: "pl-9 bg-background", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/50 text-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Student" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-right", children: "Total Fee" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-right", children: "Paid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-right", children: "Pending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-center", children: "EMI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium text-right", children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-muted-foreground", children: "Loading invoice data..." }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 7, className: "px-4 py-12 text-center text-muted-foreground", children: "No students found." }) }) : filtered.map((s) => {
          const pending = (s.invoice?.total_fee ?? 0) - (s.invoice?.paid_amount ?? 0);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: s.full_name || "N/A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono", children: [
              "₹",
              s.invoice?.total_fee?.toLocaleString() ?? "0"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-emerald-600", children: [
              "₹",
              s.invoice?.paid_amount?.toLocaleString() ?? "0"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right font-mono text-destructive", children: [
              "₹",
              pending.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: s.invoice?.emi_opted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-blue-500 text-blue-600", children: "Yes" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(s.invoice?.status === "fully_paid" ? "bg-emerald-500 hover:bg-emerald-600" : s.invoice?.status === "partially_paid" ? "bg-amber-500 hover:bg-amber-600" : "bg-slate-500 hover:bg-slate-600"), children: s.invoice?.status?.replace("_", " ") ?? "Unpaid" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right flex justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "text-primary border-primary hover:bg-primary/5", onClick: () => generateReceipt({
                studentName: s.full_name || "Student",
                studentEmail: s.email || "",
                totalFee: s.invoice?.total_fee ?? 0,
                paidAmount: s.invoice?.paid_amount ?? 0,
                paymentDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
                status: s.invoice?.status ?? "unpaid"
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-1" }),
                " Receipt"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", onClick: () => openEditor(s), children: "Manage" })
            ] })
          ] }, s.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden divide-y", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-muted-foreground", children: "Loading invoice data..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-muted-foreground", children: "No students found." }) : filtered.map((s) => {
        const pending = (s.invoice?.total_fee ?? 0) - (s.invoice?.paid_amount ?? 0);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-base", children: s.full_name || "N/A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: s.email })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(s.invoice?.status === "fully_paid" ? "bg-emerald-500" : s.invoice?.status === "partially_paid" ? "bg-amber-500" : "bg-slate-500"), children: s.invoice?.status?.replace("_", " ") ?? "Unpaid" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 py-2 border-y border-dashed", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground font-semibold", children: "Total Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-bold text-sm", children: [
                "₹",
                s.invoice?.total_fee?.toLocaleString() ?? "0"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground font-semibold", children: "Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-bold text-sm text-emerald-600", children: [
                "₹",
                s.invoice?.paid_amount?.toLocaleString() ?? "0"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground font-semibold", children: "Pending" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono font-bold text-sm text-destructive", children: [
                "₹",
                pending.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase text-muted-foreground font-semibold", children: "EMI" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: s.invoice?.emi_opted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "h-4 text-[10px] border-blue-500 text-blue-600", children: "Opted" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "flex-1 text-primary border-primary", onClick: () => generateReceipt({
              studentName: s.full_name || "Student",
              studentEmail: s.email || "",
              totalFee: s.invoice?.total_fee ?? 0,
              paidAmount: s.invoice?.paid_amount ?? 0,
              paymentDate: (/* @__PURE__ */ new Date()).toLocaleDateString(),
              status: s.invoice?.status ?? "unpaid"
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
              " Receipt"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "flex-1", onClick: () => openEditor(s), children: "Manage" })
          ] })
        ] }, s.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editingStudent, onOpenChange: (o) => !o && setEditingStudent(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "Manage Invoice: ",
        editingStudent?.full_name
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Total Course Fee (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: totalFee, onChange: (e) => setTotalFee(Number(e.target.value)), className: "pl-9" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount Paid (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: paidAmount, onChange: (e) => setPaidAmount(Number(e.target.value)), className: "pl-9" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-primary uppercase tracking-wider", children: "Payment Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: paymentMethod, onValueChange: setPaymentMethod, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select method" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "bajaj", children: "Bajaj Finance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "self", children: "Self (Cash/UPI)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "merchant", children: "Merchant (Cards/Netbanking)" })
            ] })
          ] }),
          paymentMethod === "bajaj" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Down Payment (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: bajajDownPayment, onChange: (e) => setBajajDownPayment(Number(e.target.value)), className: "pl-9" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bajaj LAN No" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: bajajLanNo, onChange: (e) => setBajajLanNo(e.target.value), placeholder: "e.g. LAN123456" })
            ] })
          ] }),
          paymentMethod === "self" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Payment Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selfPaymentType, onValueChange: setSelfPaymentType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "upi", children: "UPI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "cash", children: "Cash" })
              ] })
            ] })
          ] }),
          paymentMethod === "merchant" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Merchant Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: merchantPaymentType, onValueChange: setMerchantPaymentType, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "credit_card", children: "Credit Card" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "debit_card", children: "Debit Card" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "netbanking", children: "Netbanking" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "neft", children: "NEFT" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "rtgs", children: "RTGS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "upi_merchant", children: "UPI (Merchant)" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 border p-3 rounded-lg bg-muted/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { id: "emi", checked: emiOpted, onCheckedChange: (v) => setEmiOpted(!!v) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5 leading-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "emi", className: "text-sm font-medium cursor-pointer", children: "Opted for EMI" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Enable this to set up a monthly payment schedule." })
          ] })
        ] }),
        emiOpted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "EMI Schedule" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "ghost", onClick: addEmi, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Add Installment"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            emis.map((emi, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center bg-card border rounded-lg p-2 shadow-sm animate-in fade-in slide-in-from-top-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: emi.date, onChange: (e) => updateEmi(idx, "date", e.target.value), className: "h-8 text-xs" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground", children: "₹" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: emi.amount, onChange: (e) => updateEmi(idx, "amount", Number(e.target.value)), className: "h-8 pl-5 text-xs font-mono" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: emi.status, onChange: (e) => updateEmi(idx, "status", e.target.value), className: "w-full h-8 bg-background border rounded text-xs px-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "pending", children: "Pending" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "paid", children: "Paid" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-8 w-8 text-destructive", onClick: () => removeEmi(idx), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] }, idx)),
            emis.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center py-4 text-xs text-muted-foreground border border-dashed rounded-lg", children: "No installments added yet." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setEditingStudent(null), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: save, disabled: busy, className: "bg-gradient-primary text-primary-foreground", children: busy ? "Saving…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-2" }),
          "Save Changes"
        ] }) })
      ] })
    ] }) })
  ] });
}
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
export {
  InvoicesPage as component
};
