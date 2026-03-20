import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { PrayerWall } from "./PrayerWall";
import { MusicGenerator } from "./MusicGenerator";
import { AIReflections } from "./AIReflections";
import { BlessingsWall } from "./BlessingsWall";
import { Devotional } from "./Devotional";

type Tab = "home" | "prayer" | "music" | "reflect" | "blessings";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: string; hebrewLabel?: string }[] = [
    { id: "home", label: "Home", icon: "🏠", hebrewLabel: "בית" },
    { id: "prayer", label: "Prayer Wall", icon: "🙏", hebrewLabel: "תפילה" },
    { id: "music", label: "Worship Music", icon: "🎵", hebrewLabel: "שירה" },
    { id: "reflect", label: "AI Reflections", icon: "✨", hebrewLabel: "הגות" },
    { id: "blessings", label: "Blessings", icon: "💫", hebrewLabel: "ברכות" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-amber-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="headerGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4A574" />
                      <stop offset="100%" stopColor="#8B6914" />
                    </linearGradient>
                    <linearGradient id="headerBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A5F" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="50,10 60,30 85,30 66,45 74,70 50,57 26,70 34,45 15,30 40,30"
                    fill="none"
                    stroke="url(#headerGold)"
                    strokeWidth="2"
                  />
                  <rect x="47" y="25" width="6" height="35" fill="url(#headerBlue)" />
                  <rect x="36" y="36" width="28" height="6" fill="url(#headerBlue)" />
                </svg>
              </div>
              <div>
                <h1 className="font-serif text-xl md:text-2xl font-semibold text-stone-800">Echad</h1>
                <p className="text-xs text-amber-700/70 tracking-widest hidden sm:block">אחד</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-amber-100 text-amber-800"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-800"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-all duration-200 hidden sm:block"
              >
                Sign Out
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-stone-200/50">
              <div className="grid grid-cols-2 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 ${
                      activeTab === tab.id
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className="text-xs text-amber-700/60">{tab.hebrewLabel}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => signOut()}
                className="w-full mt-4 px-4 py-3 text-sm text-stone-500 hover:text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-8">
        {activeTab === "home" && <Devotional />}
        {activeTab === "prayer" && <PrayerWall />}
        {activeTab === "music" && <MusicGenerator />}
        {activeTab === "reflect" && <AIReflections />}
        {activeTab === "blessings" && <BlessingsWall />}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center border-t border-stone-200/50 bg-white/30">
        <p className="text-stone-400 text-xs">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
