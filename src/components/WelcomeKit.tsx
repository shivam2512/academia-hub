import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Copy, Check, Download, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WelcomeKitProps {
  fullName: string;
  email: string;
  password?: string;
  onClose: () => void;
}

export function WelcomeKit({ fullName, email, password, onClose }: WelcomeKitProps) {
  const [copied, setCopied] = useState(false);
  const loginUrl = window.location.origin + "/auth";

  const welcomeMessage = `Hello ${fullName},

Welcome to Coach LMS! Your student account has been created successfully.

Login Details:
🌐 URL: ${loginUrl}
📧 Email: ${email}
🔑 Password: ${password || "[Your existing password]"}

⚠️ Policy: Your account is limited to one device only. Logging in on a new device will automatically log you out from previous ones.

Best Regards,
Institute Administration`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(welcomeMessage);
    setCopied(true);
    toast.success("Welcome message copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
      <Card className="overflow-hidden border-2 border-primary/20 shadow-xl max-w-sm mx-auto">
        {/* Professional Header */}
        <div className="bg-gradient-primary p-6 text-primary-foreground text-center">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">COACH LMS</h2>
          <p className="text-xs opacity-80 uppercase tracking-widest mt-1">Student Welcome Kit</p>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-4 bg-card">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Student Name</p>
            <p className="text-lg font-bold text-foreground">{fullName}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 py-2 border-y border-border/50">
            <div>
              <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Email ID</p>
              <p className="text-sm font-medium">{email}</p>
            </div>
            {password && (
              <div>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Temporary Password</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono font-bold bg-muted px-2 py-0.5 rounded">{password}</code>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/30">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] leading-tight">
                <strong>Policy:</strong> One device per user. Simultaneous login is disabled.
              </p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50 border border-border/50 text-center">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase font-bold tracking-tighter">Login URL</p>
              <p className="text-[11px] font-mono truncate">{loginUrl}</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-muted/30 px-6 py-3 text-[9px] text-center text-muted-foreground border-t">
          Generated on {new Date().toLocaleDateString()}
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <Button 
          onClick={copyToClipboard}
          className="w-full bg-primary hover:opacity-90"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? "Copied" : "Copy Welcome Message"}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.print()}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Print / Save as PDF
        </Button>
        <Button variant="ghost" onClick={onClose} className="w-full text-xs">
          Close
        </Button>
      </div>
    </div>
  );
}
