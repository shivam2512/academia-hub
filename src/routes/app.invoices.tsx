import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, CreditCard, History, Plus, Trash2, Save, IndianRupee, Download } from "lucide-react";
import { toast } from "sonner";
import { generateReceipt } from "@/lib/receipt";

export const Route = createFileRoute("/app/invoices")({ component: InvoicesPage });

type Invoice = {
  id: string;
  user_id: string;
  total_fee: number;
  paid_amount: number;
  emi_opted: boolean;
  emi_details: any[];
  status: string;
  updated_at: string;
};

type Student = {
  id: string;
  full_name: string | null;
  email: string | null;
  invoice?: Invoice;
};

function InvoicesPage() {
  const { isAdmin } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [busy, setBusy] = useState(false);

  // Form State
  const [totalFee, setTotalFee] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [emiOpted, setEmiOpted] = useState(false);
  const [emis, setEmis] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("self");
  const [bajajDownPayment, setBajajDownPayment] = useState(0);
  const [bajajLanNo, setBajajLanNo] = useState("");
  const [selfPaymentType, setSelfPaymentType] = useState("upi");
  const [merchantPaymentType, setMerchantPaymentType] = useState("");

  const load = async () => {
    setLoading(true);
    // Fetch students
    const { data: profs } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
    // Fetch invoices
    const { data: invs } = await supabase.from("student_invoices").select("*");
    
    const invMap: Record<string, Invoice | any> = {};
    (invs ?? []).forEach(i => { invMap[i.user_id] = i; });

    const merged = (profs ?? []).map(p => ({
      ...p,
      invoice: invMap[p.id]
    }));

    setStudents(merged);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEditor = (s: Student | any) => {
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
    setEmis([...emis, { date: new Date().toISOString().split("T")[0], amount: 0, status: "pending" }]);
  };

  const removeEmi = (idx: number) => {
    setEmis(emis.filter((_, i) => i !== idx));
  };

  const updateEmi = (idx: number, field: string, val: any) => {
    const next = [...emis];
    next[idx] = { ...next[idx], [field]: val };
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

    const { error } = await supabase.from("student_invoices").upsert(payload, { onConflict: "user_id" });

    setBusy(false);
    if (error) { toast.error(error.message); return; }
    
    toast.success("Invoice updated");
    setEditingStudent(null);
    load();
  };

  const filtered = students.filter(s => 
    s.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title="Student Invoices"
        description="Manage course fees, payments and EMI schedules."
      />

      <Card className="mb-6 shadow-card overflow-hidden">
        <div className="p-4 bg-muted/30 border-b flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-9 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium text-right">Total Fee</th>
                <th className="px-4 py-3 font-medium text-right">Paid</th>
                <th className="px-4 py-3 font-medium text-right">Pending</th>
                <th className="px-4 py-3 font-medium text-center">EMI</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">Loading invoice data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No students found.</td></tr>
              ) : filtered.map(s => {
                const pending = (s.invoice?.total_fee ?? 0) - (s.invoice?.paid_amount ?? 0);
                return (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{s.full_name || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">₹{s.invoice?.total_fee?.toLocaleString() ?? "0"}</td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">₹{s.invoice?.paid_amount?.toLocaleString() ?? "0"}</td>
                    <td className="px-4 py-3 text-right font-mono text-destructive">₹{pending.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      {s.invoice?.emi_opted ? <Badge variant="outline" className="border-blue-500 text-blue-600">Yes</Badge> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn(
                        s.invoice?.status === "fully_paid" ? "bg-emerald-500 hover:bg-emerald-600" :
                        s.invoice?.status === "partially_paid" ? "bg-amber-500 hover:bg-amber-600" :
                        "bg-slate-500 hover:bg-slate-600"
                      )}>
                        {s.invoice?.status?.replace("_", " ") ?? "Unpaid"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-primary border-primary hover:bg-primary/5"
                        onClick={() => generateReceipt({
                          studentName: s.full_name || "Student",
                          studentEmail: s.email || "",
                          totalFee: s.invoice?.total_fee ?? 0,
                          paidAmount: s.invoice?.paid_amount ?? 0,
                          paymentDate: new Date().toLocaleDateString(),
                          status: s.invoice?.status ?? "unpaid"
                        })}
                      >
                        <Download className="h-4 w-4 mr-1" /> Receipt
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditor(s)}>Manage</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y">
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading invoice data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No students found.</div>
          ) : filtered.map(s => {
            const pending = (s.invoice?.total_fee ?? 0) - (s.invoice?.paid_amount ?? 0);
            return (
              <div key={s.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-base">{s.full_name || "N/A"}</div>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </div>
                  <Badge className={cn(
                    s.invoice?.status === "fully_paid" ? "bg-emerald-500" :
                    s.invoice?.status === "partially_paid" ? "bg-amber-500" :
                    "bg-slate-500"
                  )}>
                    {s.invoice?.status?.replace("_", " ") ?? "Unpaid"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed">
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">Total Fee</div>
                    <div className="font-mono font-bold text-sm">₹{s.invoice?.total_fee?.toLocaleString() ?? "0"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">Paid</div>
                    <div className="font-mono font-bold text-sm text-emerald-600">₹{s.invoice?.paid_amount?.toLocaleString() ?? "0"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">Pending</div>
                    <div className="font-mono font-bold text-sm text-destructive">₹{pending.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold">EMI</div>
                    <div>{s.invoice?.emi_opted ? <Badge variant="outline" className="h-4 text-[10px] border-blue-500 text-blue-600">Opted</Badge> : <span className="text-xs text-muted-foreground">—</span>}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-primary border-primary"
                    onClick={() => generateReceipt({
                      studentName: s.full_name || "Student",
                      studentEmail: s.email || "",
                      totalFee: s.invoice?.total_fee ?? 0,
                      paidAmount: s.invoice?.paid_amount ?? 0,
                      paymentDate: new Date().toLocaleDateString(),
                      status: s.invoice?.status ?? "unpaid"
                    })}
                  >
                    <Download className="h-4 w-4 mr-2" /> Receipt
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEditor(s)}>Manage</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Dialog open={!!editingStudent} onOpenChange={o => !o && setEditingStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Invoice: {editingStudent?.full_name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Course Fee (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" value={totalFee} onChange={e => setTotalFee(Number(e.target.value))} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount Paid (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" value={paidAmount} onChange={e => setPaidAmount(Number(e.target.value))} className="pl-9" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Payment Method</h3>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bajaj">Bajaj Finance</SelectItem>
                  <SelectItem value="self">Self (Cash/UPI)</SelectItem>
                  <SelectItem value="merchant">Merchant (Cards/Netbanking)</SelectItem>
                </SelectContent>
              </Select>

              {paymentMethod === "bajaj" && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label>Down Payment (₹)</Label>
                    <Input type="number" value={bajajDownPayment} onChange={e => setBajajDownPayment(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bajaj LAN No</Label>
                    <Input value={bajajLanNo} onChange={e => setBajajLanNo(e.target.value)} placeholder="e.g. LAN123456" />
                  </div>
                </div>
              )}

              {paymentMethod === "self" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Payment Type</Label>
                  <Select value={selfPaymentType} onValueChange={setSelfPaymentType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {paymentMethod === "merchant" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>Merchant Details</Label>
                  <Input 
                    value={merchantPaymentType} 
                    onChange={e => setMerchantPaymentType(e.target.value)} 
                    placeholder="e.g. Credit Card, NEFT, RTGS" 
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 border p-3 rounded-lg bg-muted/30">
              <Checkbox id="emi" checked={emiOpted} onCheckedChange={(v) => setEmiOpted(!!v)} />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="emi" className="text-sm font-medium cursor-pointer">Opted for EMI</label>
                <p className="text-xs text-muted-foreground">Enable this to set up a monthly payment schedule.</p>
              </div>
            </div>

            {emiOpted && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">EMI Schedule</h3>
                  <Button size="sm" variant="ghost" onClick={addEmi}><Plus className="h-4 w-4 mr-1" /> Add Installment</Button>
                </div>
                
                <div className="space-y-2">
                  {emis.map((emi, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-card border rounded-lg p-2 shadow-sm animate-in fade-in slide-in-from-top-1">
                      <div className="flex-1">
                        <Input type="date" value={emi.date} onChange={e => updateEmi(idx, "date", e.target.value)} className="h-8 text-xs" />
                      </div>
                      <div className="flex-1 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">₹</span>
                        <Input type="number" value={emi.amount} onChange={e => updateEmi(idx, "amount", Number(e.target.value))} className="h-8 pl-5 text-xs font-mono" />
                      </div>
                      <div className="w-32">
                        <select 
                          value={emi.status} 
                          onChange={e => updateEmi(idx, "status", e.target.value)}
                          className="w-full h-8 bg-background border rounded text-xs px-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeEmi(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  {emis.length === 0 && <p className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-lg">No installments added yet.</p>}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingStudent(null)}>Cancel</Button>
            <Button onClick={save} disabled={busy} className="bg-gradient-primary text-primary-foreground">
              {busy ? "Saving…" : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
