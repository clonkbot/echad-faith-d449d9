export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Star of David + Cross combined symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 animate-pulse">
              {/* Star of David */}
              <polygon
                points="50,10 61,35 90,35 67,52 78,80 50,65 22,80 33,52 10,35 39,35"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="2"
              />
              {/* Cross in center */}
              <rect x="47" y="30" width="6" height="40" fill="url(#blueGradient)" />
              <rect x="35" y="42" width="30" height="6" fill="url(#blueGradient)" />
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4A574" />
                  <stop offset="100%" stopColor="#8B6914" />
                </linearGradient>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1E3A5F" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute inset-0 border-4 border-amber-200/50 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <p className="font-serif text-xl text-stone-600 tracking-wide">Preparing your sanctuary...</p>
        <p className="mt-2 text-stone-400 font-light italic">"Be still and know that I am God"</p>
      </div>
    </div>
  );
}
