import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface Prayer {
  _id: string;
  userName: string;
  request: string;
  category: string;
  prayerCount: number;
  createdAt: number;
}

export function PrayerWall() {
  const prayers = useQuery(api.prayers.list, { limit: 30 });
  const createPrayer = useMutation(api.prayers.create);
  const prayFor = useMutation(api.prayers.pray);

  const [showForm, setShowForm] = useState(false);
  const [request, setRequest] = useState("");
  const [category, setCategory] = useState("general");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: "healing", label: "Healing", icon: "💚", hebrewLabel: "רפואה" },
    { id: "provision", label: "Provision", icon: "🍞", hebrewLabel: "פרנסה" },
    { id: "guidance", label: "Guidance", icon: "🧭", hebrewLabel: "הדרכה" },
    { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦", hebrewLabel: "משפחה" },
    { id: "peace", label: "Peace", icon: "🕊️", hebrewLabel: "שלום" },
    { id: "israel", label: "Israel", icon: "✡️", hebrewLabel: "ישראל" },
    { id: "general", label: "General", icon: "🙏", hebrewLabel: "כללי" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;

    setIsSubmitting(true);
    try {
      await createPrayer({
        request: request.trim(),
        category,
        isAnonymous,
      });
      setRequest("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit prayer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePray = async (id: any) => {
    try {
      await prayFor({ prayerRequestId: id });
    } catch (error) {
      console.error("Failed to record prayer:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-800 flex items-center gap-3">
            <span>🙏</span> Prayer Wall
            <span className="text-lg text-amber-700/60">קיר תפילה</span>
          </h2>
          <p className="text-stone-600 mt-1">Share your prayer requests and pray for one another</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-rose-200/50 transition-all duration-300"
        >
          <span>✝️</span>
          Add Prayer Request
        </button>
      </div>

      {/* Prayer Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8 border border-rose-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      category === cat.id
                        ? "bg-rose-100 text-rose-800 border-2 border-rose-300"
                        : "bg-stone-50 text-stone-600 border-2 border-transparent hover:bg-stone-100"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Your Prayer Request
              </label>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder="Share what's on your heart..."
                rows={4}
                className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-stone-300 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="anonymous" className="text-sm text-stone-600">
                Post anonymously
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !request.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
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

      {/* Prayer Requests */}
      {prayers === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : prayers.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-2xl border border-stone-200/50">
          <span className="text-5xl mb-4 block">🙏</span>
          <h3 className="text-xl font-semibold text-stone-700 mb-2">No prayer requests yet</h3>
          <p className="text-stone-500">Be the first to share a prayer request</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prayers.map((prayer: Prayer) => {
            const cat = categories.find((c) => c.id === prayer.category);
            return (
              <div
                key={prayer._id}
                className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-stone-200/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat?.icon || "🙏"}</span>
                    <div>
                      <p className="font-medium text-stone-800">{prayer.userName}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(prayer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
                    {cat?.label || "General"}
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed mb-4">{prayer.request}</p>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2 text-stone-500 text-sm">
                    <span>💜</span>
                    <span>{prayer.prayerCount} {prayer.prayerCount === 1 ? "person" : "people"} praying</span>
                  </div>
                  <button
                    onClick={() => handlePray(prayer._id)}
                    className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-medium rounded-xl shadow-md shadow-violet-200/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>🙏</span>
                    I'm Praying
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scripture */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-rose-200/30 text-center">
        <p className="font-serif text-lg md:text-xl text-stone-700 italic mb-3">
          "Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective."
        </p>
        <p className="text-rose-700/70 font-medium">— James 5:16</p>
      </div>
    </div>
  );
}
