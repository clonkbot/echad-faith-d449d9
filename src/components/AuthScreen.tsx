import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err: any) {
      setError(err.message || "Failed to continue as guest.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-blue-50 flex flex-col">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-blue-100/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md relative">
          {/* Main card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-stone-200/50 border border-amber-100/50 p-6 md:p-10 relative overflow-hidden">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiMwMDAiLz48L2c+PC9zdmc+')]" />

            {/* Header */}
            <div className="text-center mb-8 md:mb-10 relative">
              {/* Symbol */}
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 relative">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#D4A574" />
                      <stop offset="50%" stopColor="#C9A961" />
                      <stop offset="100%" stopColor="#8B6914" />
                    </linearGradient>
                    <linearGradient id="crossBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1E3A5F" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Star of David */}
                  <polygon
                    points="50,8 62,32 90,32 68,50 78,78 50,62 22,78 32,50 10,32 38,32"
                    fill="none"
                    stroke="url(#starGold)"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                  />
                  {/* Cross */}
                  <rect x="46" y="28" width="8" height="44" rx="1" fill="url(#crossBlue)" />
                  <rect x="32" y="40" width="36" height="8" rx="1" fill="url(#crossBlue)" />
                </svg>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-stone-800 mb-2 tracking-tight">
                Echad
              </h1>
              <p className="text-stone-500 font-light text-base md:text-lg tracking-wide">
                One Faith • One Family • One God
              </p>
              <p className="mt-2 text-amber-700/70 text-xs md:text-sm font-medium tracking-widest uppercase">
                שְׁמַע יִשְׂרָאֵל
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 ml-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200/80 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200 text-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 ml-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200/80 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200 text-base"
                  placeholder="••••••••"
                />
              </div>

              <input name="flow" type="hidden" value={flow} />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:via-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-200/50 hover:shadow-xl hover:shadow-amber-300/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-base"
              >
                <span className="relative z-10">
                  {isLoading ? "Please wait..." : flow === "signIn" ? "Enter the Sanctuary" : "Join the Family"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
            </form>

            {/* Toggle flow */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
                className="text-stone-500 hover:text-amber-700 transition-colors duration-200 text-sm"
              >
                {flow === "signIn" ? (
                  <>New here? <span className="font-medium underline decoration-amber-300 underline-offset-2">Create an account</span></>
                ) : (
                  <>Already a member? <span className="font-medium underline decoration-amber-300 underline-offset-2">Sign in</span></>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6 md:my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
              <span className="px-4 text-xs text-stone-400 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />
            </div>

            {/* Anonymous */}
            <button
              onClick={handleAnonymous}
              disabled={isLoading}
              className="w-full py-4 bg-stone-100/80 hover:bg-stone-200/80 border border-stone-200/80 text-stone-600 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 text-base"
            >
              Continue as Guest
            </button>

            {/* Scripture */}
            <p className="mt-8 text-center text-stone-400 text-xs md:text-sm italic font-light leading-relaxed px-4">
              "For he himself is our peace, who has made the two groups one"
              <span className="block mt-1 not-italic font-medium text-stone-500">— Ephesians 2:14</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-stone-400 text-xs">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
