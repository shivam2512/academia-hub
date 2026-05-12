import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

interface ReceiptData {
  studentName: string;
  studentEmail: string;
  totalFee: number;
  paidAmount: number;
  paymentDate: string;
  status: string;
}

export const generateReceipt = (data: ReceiptData) => {
  try {
    const doc = new jsPDF();
    const { studentName, studentEmail, totalFee, paidAmount, paymentDate, status } = data;
    const pendingAmount = totalFee - paidAmount;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(76, 81, 191); // Indigo
    doc.text("DBS INSTITUTE", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Official Payment Receipt", 105, 28, { align: "center" });
    
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    // Student Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Billed To:", 20, 50);
    doc.setFont("helvetica", "bold");
    doc.text(studentName, 20, 57);
    doc.setFont("helvetica", "normal");
    doc.text(studentEmail, 20, 63);

    // Receipt Meta
    doc.text("Receipt Date:", 140, 50);
    doc.text(paymentDate, 140, 57);
    doc.text("Status:", 140, 63);
    doc.setTextColor(status === "fully_paid" ? 16 : 245, status === "fully_paid" ? 185 : 158, status === "fully_paid" ? 129 : 11);
    doc.text(status.replace("_", " ").toUpperCase(), 140, 69);
    doc.setTextColor(0);

    // Table
    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Amount']],
      body: [
        ['Course Fee (Total)', `INR ${totalFee.toLocaleString()}`],
        ['Total Amount Paid', `INR ${paidAmount.toLocaleString()}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [76, 81, 191] },
      columnStyles: { 1: { halign: 'right' } }
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Balance Due: INR ${pendingAmount.toLocaleString()}`, 190, finalY, { align: "right" });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Thank you for choosing DBS Institute for your learning journey.", 105, 280, { align: "center" });
    doc.text("This is a computer-generated receipt and does not require a signature.", 105, 285, { align: "center" });

    doc.save(`Receipt_${studentName.replace(/\s+/g, '_')}_${paymentDate.replace(/\//g, '-')}.pdf`);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    toast.error("Failed to generate receipt. Please try again.");
  }
};
