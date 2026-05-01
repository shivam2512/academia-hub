import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, Video, Calendar, MessageSquare, Shield, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Coach LMS — Run Your Coaching Institute Online" },
      { name: "description", content: "Batches, notes, video recordings, live Zoom/Meet classes, and WhatsApp-style batch chat — everything your coaching institute needs in one platform." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Coach LMS</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/auth"><Button className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">Get started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.85_0.18_310/.4),transparent_50%)]" />
        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-sm text-white mb-6">
            <Sparkles className="h-3.5 w-3.5" /> The complete coaching platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.05]">
            Run your coaching institute, <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">all in one place</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl mx-auto">
            Batches, notes, video recordings, live classes via Zoom & Google Meet, and a WhatsApp-style chat for every batch — built for teachers and students.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/auth"><Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-elegant text-base px-8">Start free</Button></Link>
            <a href="#features"><Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 text-base px-8">See features</Button></a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Everything coaching needs</h2>
          <p className="mt-4 text-muted-foreground text-lg">Designed for superadmins, admins, teachers and students.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "Batches & Subjects", desc: "Organize students into batches by subject, course, or year." },
            { icon: Users, title: "Roles & Permissions", desc: "Superadmin, admin, teacher, student — each with the right access." },
            { icon: Video, title: "Video Recordings", desc: "Share YouTube/Vimeo recordings with batches in seconds." },
            { icon: Calendar, title: "Live Zoom & Meet", desc: "Schedule live classes — students join with one click." },
            { icon: MessageSquare, title: "Batch Chat", desc: "WhatsApp-style realtime chat with replies, media & reactions." },
            { icon: Shield, title: "Secure by Design", desc: "Row-level security ensures students only see their batches." },
          ].map(f => (
            <div key={f.title} className="group p-6 rounded-2xl bg-card border shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-hero p-12 md:p-16 text-center shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,oklch(0.85_0.18_310/.3),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to modernize your institute?</h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">The first user to sign up becomes the superadmin and can invite the rest of the team.</p>
            <Link to="/auth" className="inline-block mt-8">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8">Create your account</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Coach LMS · Built for educators
      </footer>
    </div>
  );
}
