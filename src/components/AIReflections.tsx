import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface Reflection {
  _id: string;
  prompt: string;
  response: string;
  category: string;
  createdAt: number;
}

export function AIReflections() {
  const reflections = useQuery(api.ai.getReflections);
  const generateReflection = useAction(api.ai.generateReflection);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReflection, setCurrentReflection] = useState<string | null>(null);

  const categories = [
    {
      id: "scripture",
      label: "Scripture Study",
      icon: "📖",
      description: "Deep dive into biblical passages",
      prompt: "Please provide a spiritual reflection connecting Jewish and Christian understanding of Scripture",
    },
    {
      id: "prayer",
      label: "Prayer Guide",
      icon: "🙏",
      description: "Guided prayer and meditation",
      prompt: "Create a prayer that honors both Jewish and Christian traditions",
    },
    {
      id: "meditation",
      label: "Meditation",
      icon: "🕯️",
      description: "Contemplative reflection",
      prompt: "Guide me through a meditation on God's presence",
    },
    {
      id: "blessing",
      label: "Daily Blessing",
      icon: "✨",
      description: "Words of encouragement",
      prompt: "Share a blessing that unites Jewish and Christian believers",
    },
  ];

  const handleGenerate = async (category: string, prompt: string) => {
    setIsGenerating(true);
    setSelectedCategory(category);
    setCurrentReflection(null);

    try {
      const result = await generateReflection({ prompt, category });
      setCurrentReflection(result.response);
    } catch (error) {
      console.error("Failed to generate reflection:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleGenerate("custom", customPrompt);
    setCustomPrompt("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-800 flex items-center gap-3">
          <span>✨</span> AI Spiritual Reflections
          <span className="text-lg text-amber-700/60">הגות</span>
        </h2>
        <p className="text-stone-600 mt-1">Powered by Claude AI for thoughtful spiritual guidance</p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleGenerate(cat.id, cat.prompt)}
            disabled={isGenerating}
            className={`p-6 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden ${
              selectedCategory === cat.id && isGenerating
                ? "bg-amber-100 border-2 border-amber-300"
                : "bg-white/80 border-2 border-stone-200/50 hover:border-amber-300 hover:shadow-lg"
            } disabled:opacity-70`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/0 to-amber-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-4xl block mb-3 relative z-10 group-hover:scale-110 transition-transform duration-300">
              {cat.icon}
            </span>
            <h3 className="font-semibold text-stone-800 relative z-10">{cat.label}</h3>
            <p className="text-sm text-stone-500 mt-1 relative z-10">{cat.description}</p>

            {selectedCategory === cat.id && isGenerating && (
              <div className="absolute bottom-2 right-2">
                <div className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Prompt */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-stone-200/50">
        <h3 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span>💭</span> Ask a Custom Question
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Ask about Scripture, prayer, faith, or spiritual guidance..."
            className="flex-1 px-5 py-3 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isGenerating || !customPrompt.trim()}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          >
            <span>✨</span>
            Generate
          </button>
        </form>
      </div>

      {/* Current Reflection */}
      {(currentReflection || isGenerating) && (
        <div className="bg-gradient-to-br from-amber-50 via-white to-blue-50 rounded-2xl p-6 md:p-8 border border-amber-200/30 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">
              {categories.find((c) => c.id === selectedCategory)?.icon || "✨"}
            </span>
            <h3 className="font-serif text-xl font-semibold text-stone-800">
              {categories.find((c) => c.id === selectedCategory)?.label || "Reflection"}
            </h3>
          </div>

          {isGenerating ? (
            <div className="flex items-center gap-3 py-8">
              <div className="w-6 h-6 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin" />
              <span className="text-stone-600">Reflecting with Claude AI...</span>
            </div>
          ) : (
            <div className="prose prose-stone max-w-none">
              {currentReflection?.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-stone-700 leading-relaxed mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previous Reflections */}
      <div>
        <h3 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span>📚</span> Your Previous Reflections
        </h3>

        {reflections === undefined ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : reflections.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-2xl border border-stone-200/50">
            <span className="text-4xl mb-4 block">📖</span>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">No reflections yet</h3>
            <p className="text-stone-500 text-sm">Choose a category above to generate your first reflection</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection: Reflection) => {
              const cat = categories.find((c) => c.id === reflection.category);
              return (
                <div
                  key={reflection._id}
                  className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-stone-200/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat?.icon || "✨"}</span>
                      <span className="font-medium text-stone-800">
                        {cat?.label || reflection.category}
                      </span>
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(reflection.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-stone-500 mb-3 italic">"{reflection.prompt}"</p>

                  <p className="text-stone-700 leading-relaxed line-clamp-4">
                    {reflection.response}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scripture */}
      <div className="bg-gradient-to-r from-amber-50 to-stone-50 rounded-2xl p-6 md:p-8 border border-amber-200/30 text-center">
        <p className="font-serif text-lg md:text-xl text-stone-700 italic mb-3">
          "For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart."
        </p>
        <p className="text-amber-700/70 font-medium">— Hebrews 4:12</p>
      </div>
    </div>
  );
}
