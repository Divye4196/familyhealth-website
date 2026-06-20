import Link from 'next/link';

export default function LandingPage() {
  const features = [
    { icon: '📊', title: 'BP & sugar tracking', desc: 'Log readings with instant normal/danger alerts', bg: '#E6F1FB', color: '#185FA5' },
    { icon: '💊', title: 'Medicines', desc: 'Track prescriptions, doses and refill dates', bg: '#E1F5EE', color: '#0F6E56' },
    { icon: '🩺', title: 'Doctor visits', desc: 'Save doctor notes and next appointment dates', bg: '#EEEDFE', color: '#534AB7' },
    { icon: '📅', title: 'Appointments', desc: 'Reminders 7 days, 1 day, and 2 hours before', bg: '#FAEEDA', color: '#854F0B' },
    { icon: '⚠️', title: 'Smart alerts', desc: 'Detects sudden BP or sugar spikes instantly', bg: '#FCEBEB', color: '#A32D2D' },
    { icon: '🛡️', title: 'Emergency center', desc: 'Blood group, allergies and emergency contacts', bg: '#FBEAF0', color: '#993556' },
  ];

  const steps = [
    { num: 1, title: 'Register', desc: 'Create your free account in 30 seconds' },
    { num: 2, title: 'Add family', desc: 'Add all family members with their details' },
    { num: 3, title: 'Start tracking', desc: 'Log health data and get instant alerts' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#0C447C] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#E6F1FB] text-sm font-medium">
          <svg width="24" height="24" viewBox="0 0 52 52">
            <path d="M26 46 C26 46 6 34 6 20 C6 13 11 8 18 8 C21.5 8 24.5 9.5 26 12 C27.5 9.5 30.5 8 34 8 C41 8 46 13 46 20 C46 34 26 46 26 46Z" fill="#fff"/>
            <path d="M12 26 Q15 19 19 22 L22 29 L24 21 L27 26 L40 26" stroke="#0C447C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          FamilyHealth+
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="border border-[#85B7EB] text-[#E6F1FB] px-4 py-1.5 rounded-md text-sm hover:bg-white/10 transition">Login</Link>
          <Link href="/register" className="bg-[#1D9E75] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#178a64] transition">Sign up free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#0F6E56] px-6 py-16 flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 max-w-xl">
          <span className="bg-[#1D9E75] text-[#E1F5EE] text-xs px-3 py-1 rounded-full inline-block mb-4">Free forever — unlimited family members</span>
          <h1 className="text-white text-3xl md:text-4xl font-medium leading-snug mb-4">
            Your family's health,<br/>all in one place
          </h1>
          <p className="text-[#9FE1CB] text-base mb-6">
            Track BP, sugar, medicines, doctor visits and more — for every family member, forever. Stop losing prescriptions in drawers and doctor numbers in WhatsApp.
          </p>
          <div className="flex gap-3">
            <Link href="/register" className="bg-white text-[#0F6E56] px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-100 transition">Get started free</Link>
            <a href="#how-it-works" className="border border-[#5DCAA5] text-[#E1F5EE] px-5 py-2.5 rounded-md text-sm hover:bg-white/10 transition">See how it works</a>
          </div>
        </div>
        <div className="flex-1 max-w-sm w-full bg-white/10 border border-white/20 rounded-lg p-5">
          <div className="text-[#9FE1CB] text-xs mb-3">👨‍👩‍👧 Family health overview</div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[#E1F5EE] text-sm">Father — BP</span>
              <span className="text-white text-sm font-medium">138/88 <span className="bg-[#1D9E75] text-[#E1F5EE] text-[10px] px-2 py-0.5 rounded-full ml-1">Monitor</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#E1F5EE] text-sm">Mother — Sugar</span>
              <span className="text-white text-sm font-medium">96 mg <span className="bg-[#1D9E75] text-[#E1F5EE] text-[10px] px-2 py-0.5 rounded-full ml-1">Normal</span></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#E1F5EE] text-sm">Grandfather — BP</span>
              <span className="text-white text-sm font-medium">182/110 <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">Urgent</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50">
        <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Everything your family needs</h2>
        <p className="text-gray-500 text-center mb-10">6 powerful modules, one simple app</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-lg p-5 border border-gray-100">
              <div className="w-10 h-10 rounded-md flex items-center justify-center text-lg mb-3" style={{ backgroundColor: f.bg }}>
                {f.icon}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-16">
        <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">How it works</h2>
        <p className="text-gray-500 text-center mb-10">Get started in 3 simple steps</p>
        <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-10 h-10 rounded-full bg-[#0C447C] text-[#E6F1FB] flex items-center justify-center text-sm font-medium mx-auto mb-3">
                {s.num}
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/register" className="bg-[#0C447C] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#0a3a69] transition inline-block">
            Create your free account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C447C] px-6 py-4 flex items-center justify-between mt-auto">
        <div className="text-[#85B7EB] text-xs flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 52 52">
            <path d="M26 46 C26 46 6 34 6 20 C6 13 11 8 18 8 C21.5 8 24.5 9.5 26 12 C27.5 9.5 30.5 8 34 8 C41 8 46 13 46 20 C46 34 26 46 26 46Z" fill="#85B7EB"/>
          </svg>
          FamilyHealth+ © 2026
        </div>
        <div className="flex gap-4 text-xs">
          <a href="#" className="text-[#85B7EB] hover:text-white">About</a>
          <a href="#" className="text-[#85B7EB] hover:text-white">Privacy</a>
          <a href="#" className="text-[#85B7EB] hover:text-white">Contact</a>
        </div>
      </footer>
    </div>
  );
}