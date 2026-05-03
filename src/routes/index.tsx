import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Code2, Rocket, Briefcase, Calendar, CheckCircle, ChevronRight, Laptop, Award, Video, BookOpen, MessageSquare, Users, Shield } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "DBS — Switch to IT in 3 Months" },
      { name: "description", content: "Switch your career from NON IT to IT with industry ready courses within 3 months at DBS." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary/30">
      {/* Nav */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all duration-300">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">DBS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth"><Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10">Sign in</Button></Link>
            <Link to="/auth"><Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-[0_0_20px_rgba(79,70,229,0.4)] border-0 rounded-full px-6 transition-transform hover:scale-105">Student Portal</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative container mx-auto px-6 text-center">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-300 mb-8 backdrop-blur-sm">
              <Rocket className="h-4 w-4" /> Next cohort starting soon
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
              Switch your career from <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">NON-IT to IT</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              Master industry-ready skills and launch your tech career in just <span className="font-semibold text-white">3 months</span>. No prior coding experience required.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/auth">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-lg px-8 py-6 rounded-full font-semibold transition-transform hover:scale-105 flex items-center gap-2 h-auto">
                  Login to Portal <ChevronRight className="h-5 w-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-800 text-lg px-8 py-6 rounded-full font-medium transition-colors backdrop-blur-sm h-auto">
                  Explore Curriculum
                </Button>
              </a>
            </div>
            
            {/* Stats / Trust indicators */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-y border-white/10 py-8">
              {[
                { label: "Duration", value: "3 Months" },
                { label: "Placement", value: "Assistance" },
                { label: "Curriculum", value: "Industry-Ready" },
                { label: "Format", value: "Live + Recorded" }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative container mx-auto px-6 py-24 z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to succeed</h2>
          <p className="text-slate-400 text-lg md:text-xl">Our intensive program is designed from the ground up to transform beginners into highly capable tech professionals.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Laptop, title: "Zero to Hero", desc: "Tailored for non-IT backgrounds. We start from the absolute basics and build up to advanced concepts." },
            { icon: Briefcase, title: "Industry-Ready", desc: "Learn the exact tech stack and tools that top tech companies are hiring for right now." },
            { icon: Calendar, title: "3-Month Intensive", desc: "A structured, fast-paced curriculum that maximizes learning without wasting your time." },
            { icon: Code2, title: "Hands-on Projects", desc: "Build real-world applications. Graduate with a portfolio that proves your capabilities to employers." },
            { icon: Award, title: "Expert Mentorship", desc: "Learn directly from industry veterans who know exactly what it takes to break into tech." },
            { icon: CheckCircle, title: "Placement Support", desc: "Resume building, mock interviews, and direct referrals to help you land that first IT job." },
          ].map((f) => (
            <div key={f.title} className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform translate-x-4 -translate-y-4 group-hover:scale-110 duration-500">
                <f.icon className="w-32 h-32 text-blue-500" />
              </div>
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-100">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed relative z-10">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LMS Features */}
      <section className="relative container mx-auto px-6 py-24 z-10 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm font-medium text-indigo-300 mb-6 backdrop-blur-sm">
            Powered by DBS LMS
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">A world-class learning platform</h2>
          <p className="text-slate-400 text-lg md:text-xl">Your transition to IT is supported by our state-of-the-art Learning Management System, designed for a seamless educational experience.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Video, title: "Live & Recorded Classes", desc: "Never miss a lecture. Access high-quality recordings of all your classes anytime, anywhere." },
            { icon: BookOpen, title: "Structured Notes & Materials", desc: "All your study materials, assignments, and notes organized neatly by subject and batch." },
            { icon: MessageSquare, title: "Real-time Batch Chat", desc: "Collaborate with peers, ask questions, and get instant help from mentors in dedicated chat rooms." },
            { icon: Users, title: "Community & Networking", desc: "Connect with alumni, industry experts, and fellow learners to build your professional network." },
            { icon: Calendar, title: "Automated Scheduling", desc: "Stay on top of your live Zoom/Meet classes with integrated calendars and reminders." },
            { icon: Shield, title: "Secure & Private", desc: "Your learning progress, test scores, and personal data are kept secure and private." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-slate-100">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-32">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-12 md:p-20 text-center relative overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Access your courses</h2>
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto mb-10 font-light">Login to the student portal to join live classes, access recordings, and view study materials.</p>
            <Link to="/auth" className="inline-block">
              <Button size="lg" className="bg-white text-indigo-950 hover:bg-slate-100 shadow-[0_0_30px_rgba(255,255,255,0.3)] text-lg px-10 py-7 h-auto rounded-full font-bold transition-all hover:scale-105">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-500 bg-slate-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-slate-400" />
            <span className="font-semibold text-slate-300 text-base">DBS</span>
          </div>
          <p>© {new Date().getFullYear()} DBS Institute. Empowering careers.</p>
        </div>
      </footer>
    </div>
  );
}
