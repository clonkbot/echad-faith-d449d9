import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface Music {
  _id: string;
  title: string;
  style: string;
}

export function Devotional() {
  const devotional = useQuery(api.devotionals.getToday);
  const recentMusic = useQuery(api.music.getRecent, { limit: 3 });

  // Default devotional content
  const defaultDevotional = {
    title: "United in Covenant Love",
    scripture: "For he himself is our peace, who has made the two groups one and has destroyed the barrier, the dividing wall of hostility.",
    scriptureReference: "Ephesians 2:14",
    reflection: "Today, we celebrate the beautiful unity between Jewish and Christian believers. We share the same God of Abraham, Isaac, and Jacob. We treasure the same Scriptures. We await the same Messiah. Though our traditions may differ, our hearts beat as one in worship of the Holy One of Israel.",
  };

  const content = devotional || defaultDevotional;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-amber-100/80 via-white to-blue-100/80 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-amber-200/30">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative p-6 md:p-10 lg:p-12">
          {/* Date */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur rounded-full text-sm text-stone-600 mb-6">
            <span>📅</span>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-stone-800 mb-4 md:mb-6">
            {content.title}
          </h2>

          {/* Scripture */}
          <blockquote className="relative pl-4 md:pl-6 border-l-4 border-amber-400 mb-6 md:mb-8">
            <p className="font-serif text-lg md:text-xl text-stone-700 italic leading-relaxed">
              "{content.scripture}"
            </p>
            <cite className="block mt-3 text-amber-700 font-medium not-italic">
              — {content.scriptureReference}
            </cite>
          </blockquote>

          {/* Reflection */}
          <div className="bg-white/50 backdrop-blur rounded-xl md:rounded-2xl p-5 md:p-8">
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Today's Reflection
            </h3>
            <p className="text-stone-700 leading-relaxed text-base md:text-lg">
              {content.reflection}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon="🙏"
          title="Prayer Requests"
          description="Join the community in prayer"
          gradient="from-rose-100 to-rose-50"
          borderColor="border-rose-200"
        />
        <QuickActionCard
          icon="🎵"
          title="Generate Worship"
          description="AI-powered sacred music"
          gradient="from-violet-100 to-violet-50"
          borderColor="border-violet-200"
        />
        <QuickActionCard
          icon="✨"
          title="Spiritual Guidance"
          description="AI reflections & insights"
          gradient="from-amber-100 to-amber-50"
          borderColor="border-amber-200"
        />
        <QuickActionCard
          icon="💫"
          title="Share Blessings"
          description="Encourage one another"
          gradient="from-blue-100 to-blue-50"
          borderColor="border-blue-200"
        />
      </div>

      {/* Scripture of Unity */}
      <div className="bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white relative overflow-hidden">
        {/* Decorative Star of David pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-16 h-16 border border-white transform rotate-45" />
          <div className="absolute bottom-8 right-8 w-24 h-24 border border-white transform rotate-12" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 border border-white transform -rotate-30" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📜</span>
            <h3 className="font-serif text-xl md:text-2xl">The Shema</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-amber-200 text-xl md:text-3xl font-serif mb-2 leading-relaxed">
                שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָֽד
              </p>
              <p className="text-stone-400 text-sm">Deuteronomy 6:4</p>
            </div>
            <div>
              <p className="text-stone-200 text-lg md:text-xl italic leading-relaxed">
                "Hear, O Israel: The LORD our God, the LORD is one."
              </p>
              <p className="text-stone-400 text-sm mt-2">
                The foundational declaration of faith shared by both traditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Community Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Worship Music */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 border border-stone-200/50">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>🎶</span> Recent Worship Music
          </h3>
          {recentMusic === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-stone-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentMusic.length === 0 ? (
            <p className="text-stone-500 text-sm">No worship music generated yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {recentMusic.map((music: Music) => (
                <div
                  key={music._id}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center text-white">
                    ♪
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">{music.title}</p>
                    <p className="text-xs text-stone-500">{music.style}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Blessing */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50">
          <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>✡️</span> Aaronic Blessing
          </h3>
          <div className="space-y-4">
            <p className="text-amber-900/80 font-serif italic leading-relaxed">
              "The LORD bless you and keep you;<br />
              the LORD make his face shine on you and be gracious to you;<br />
              the LORD turn his face toward you and give you peace."
            </p>
            <p className="text-amber-700/70 text-sm font-medium">— Numbers 6:24-26</p>
            <div className="pt-2 border-t border-amber-200/50">
              <p className="text-xs text-amber-700/60 leading-relaxed">
                This ancient blessing, spoken by the priests over Israel, continues to unite believers across traditions in receiving God's favor and shalom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  gradient,
  borderColor,
}: {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  borderColor: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl md:rounded-2xl p-5 md:p-6 border ${borderColor} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
    >
      <span className="text-3xl md:text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <h3 className="font-semibold text-stone-800 mb-1">{title}</h3>
      <p className="text-stone-600 text-sm">{description}</p>
    </div>
  );
}
