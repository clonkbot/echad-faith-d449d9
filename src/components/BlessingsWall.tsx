import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface Blessing {
  _id: string;
  userId: string;
  userName: string;
  message: string;
  tradition: "hebrew" | "christian" | "shared";
  likes: number;
  createdAt: number;
}

export function BlessingsWall() {
  const blessings = useQuery(api.blessings.list, {});
  const createBlessing = useMutation(api.blessings.create);
  const likeBlessing = useMutation(api.blessings.like);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [tradition, setTradition] = useState<"shared" | "hebrew" | "christian">("shared");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const traditions = [
    { id: "shared" as const, label: "Shared", icon: "🤝", description: "United blessing" },
    { id: "hebrew" as const, label: "Hebrew", icon: "✡️", description: "Jewish tradition" },
    { id: "christian" as const, label: "Christian", icon: "✝️", description: "Christian tradition" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await createBlessing({
        message: message.trim(),
        tradition,
      });
      setMessage("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to post blessing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: any) => {
    try {
      await likeBlessing({ id });
    } catch (error) {
      console.error("Failed to like blessing:", error);
    }
  };

  // Sample blessings for inspiration
  const sampleBlessings = [
    { tradition: "hebrew", text: "ברוך אתה ה׳ אלוהינו מלך העולם", translation: "Blessed are You, Lord our God, King of the Universe" },
    { tradition: "christian", text: "May the grace of our Lord Jesus Christ be with you", translation: "" },
    { tradition: "shared", text: "The Lord bless you and keep you", translation: "Numbers 6:24" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-800 flex items-center gap-3">
            <span>💫</span> Blessings Wall
            <span className="text-lg text-amber-700/60">ברכות</span>
          </h2>
          <p className="text-stone-600 mt-1">Share blessings and encouragement with the community</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200/50 transition-all duration-300"
        >
          <span>🕊️</span>
          Share a Blessing
        </button>
      </div>

      {/* Blessing Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8 border border-blue-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Tradition
              </label>
              <div className="flex flex-wrap gap-3">
                {traditions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTradition(t.id)}
                    className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                      tradition === t.id
                        ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                        : "bg-stone-50 text-stone-600 border-2 border-transparent hover:bg-stone-100"
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Your Blessing
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share words of blessing, encouragement, or scripture..."
                rows={4}
                className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            {/* Inspiration */}
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-xs text-stone-500 font-medium mb-2">INSPIRATION</p>
              <div className="flex flex-wrap gap-2">
                {sampleBlessings.map((b, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(b.translation || b.text)}
                    className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-600 hover:bg-stone-100 transition-colors"
                  >
                    {b.text.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sharing..." : "Share Blessing"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blessings Grid */}
      {blessings === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-white/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : blessings.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-2xl border border-stone-200/50">
          <span className="text-5xl mb-4 block">💫</span>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">No blessings yet</h3>
          <p className="text-stone-500">Be the first to share a blessing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blessings.map((blessing: Blessing) => {
            const tradInfo = traditions.find((t) => t.id === blessing.tradition);
            const bgGradient =
              blessing.tradition === "hebrew"
                ? "from-amber-50 to-yellow-50"
                : blessing.tradition === "christian"
                ? "from-blue-50 to-indigo-50"
                : "from-stone-50 to-amber-50/30";
            const borderColor =
              blessing.tradition === "hebrew"
                ? "border-amber-200/50"
                : blessing.tradition === "christian"
                ? "border-blue-200/50"
                : "border-stone-200/50";

            return (
              <div
                key={blessing._id}
                className={`bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border ${borderColor} hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tradInfo?.icon}</span>
                      <span className="font-medium text-stone-700">{blessing.userName}</span>
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(blessing.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-stone-700 leading-relaxed mb-4 font-serif text-lg">
                    "{blessing.message}"
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-200/50">
                    <button
                      onClick={() => handleLike(blessing._id)}
                      className="flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors group/like"
                    >
                      <span className="group-hover/like:scale-125 transition-transform">💝</span>
                      <span className="text-sm">{blessing.likes}</span>
                    </button>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      blessing.tradition === "hebrew"
                        ? "bg-amber-100 text-amber-700"
                        : blessing.tradition === "christian"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-stone-100 text-stone-600"
                    }`}>
                      {tradInfo?.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unity Quote */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-white rounded-full" />
        </div>

        <div className="relative text-center">
          <div className="flex justify-center gap-4 mb-6">
            <span className="text-4xl">✡️</span>
            <span className="text-4xl">🤝</span>
            <span className="text-4xl">✝️</span>
          </div>

          <p className="font-serif text-xl md:text-2xl italic mb-4 leading-relaxed">
            "How good and pleasant it is when God's people live together in unity!"
          </p>
          <p className="text-blue-200 font-medium">— Psalm 133:1</p>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm text-blue-200">
              We are one family in the God of Abraham, Isaac, and Jacob.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
