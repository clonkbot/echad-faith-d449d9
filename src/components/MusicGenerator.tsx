import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

interface Music {
  _id: string;
  title: string;
  style: string;
  status: "pending" | "generating" | "completed" | "failed";
  lyrics?: string;
  createdAt: number;
}

export function MusicGenerator() {
  const myMusic = useQuery(api.music.list);
  const createMusic = useMutation(api.music.create);
  const generateMusic = useAction(api.music.generateMusic);

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("worship");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const styles = [
    { id: "worship", label: "Contemporary Worship", icon: "🎸", description: "Modern praise music" },
    { id: "hebrew", label: "Hebrew/Messianic", icon: "✡️", description: "Traditional Jewish melodies" },
    { id: "gospel", label: "Gospel", icon: "🎺", description: "Soulful and uplifting" },
    { id: "hymn", label: "Traditional Hymn", icon: "⛪", description: "Classic church hymns" },
    { id: "psalm", label: "Psalm Setting", icon: "📜", description: "Scripture set to music" },
    { id: "meditative", label: "Meditative", icon: "🕯️", description: "Peaceful and reflective" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const musicId = await createMusic({
        title: title.trim(),
        prompt: prompt.trim(),
        style,
      });

      // Trigger the generation action
      await generateMusic({
        musicId,
        prompt: prompt.trim(),
        style,
      });

      setTitle("");
      setPrompt("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to generate music:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-stone-800 flex items-center gap-3">
            <span>🎵</span> Worship Music Generator
            <span className="text-lg text-amber-700/60">שירה</span>
          </h2>
          <p className="text-stone-600 mt-1">AI-powered sacred music creation with Suno</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-200/50 transition-all duration-300"
        >
          <span>✨</span>
          Create Music
        </button>
      </div>

      {/* Generation Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8 border border-violet-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Song Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Shalom Aleichem', 'How Great Thou Art'"
                className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Music Style
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${
                      style === s.id
                        ? "bg-violet-100 border-2 border-violet-300"
                        : "bg-stone-50 border-2 border-transparent hover:bg-stone-100"
                    }`}
                  >
                    <span className="text-2xl block mb-2">{s.icon}</span>
                    <p className="font-medium text-stone-800 text-sm">{s.label}</p>
                    <p className="text-xs text-stone-500 mt-1">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Theme & Lyrics Inspiration
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the theme, mood, or include specific scripture references...&#10;e.g., 'A joyful song celebrating Psalm 150, praising God with instruments'"
                rows={4}
                className="w-full px-5 py-4 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isGenerating || !title.trim() || !prompt.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <span>🎼</span>
                    Generate Worship Music
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-medium rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-stone-500 text-center">
              Powered by Suno AI music generation
            </p>
          </form>
        </div>
      )}

      {/* My Generated Music */}
      <div>
        <h3 className="font-semibold text-stone-700 mb-4 flex items-center gap-2">
          <span>🎶</span> Your Generated Music
        </h3>

        {myMusic === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : myMusic.length === 0 ? (
          <div className="text-center py-16 bg-white/50 rounded-2xl border border-stone-200/50">
            <span className="text-5xl mb-4 block">🎵</span>
            <h3 className="text-xl font-semibold text-stone-700 mb-2">No music generated yet</h3>
            <p className="text-stone-500">Create your first worship song above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myMusic.map((music: Music) => {
              const styleInfo = styles.find((s) => s.id === music.style);
              return (
                <div
                  key={music._id}
                  className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden border border-stone-200/50 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Album art placeholder */}
                  <div className="h-32 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl opacity-80">{styleInfo?.icon || "🎵"}</span>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {music.status === "completed" && (
                        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <span className="text-2xl ml-1">▶</span>
                        </button>
                      )}
                    </div>
                    {music.status === "generating" && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-center gap-2 text-white">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="text-sm">Generating...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-stone-800 truncate">{music.title}</h4>
                    <p className="text-sm text-stone-500 mt-1">{styleInfo?.label || music.style}</p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        music.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : music.status === "generating"
                          ? "bg-amber-100 text-amber-700"
                          : music.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-stone-100 text-stone-600"
                      }`}>
                        {music.status === "completed" ? "✓ Ready" :
                         music.status === "generating" ? "⏳ Creating" :
                         music.status === "failed" ? "✗ Failed" : "Pending"}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(music.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {music.lyrics && music.status === "completed" && (
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        <p className="text-xs text-stone-600 line-clamp-3 italic">
                          {music.lyrics.split('\n').slice(0, 3).join('\n')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scripture */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 md:p-8 border border-violet-200/30 text-center">
        <p className="font-serif text-lg md:text-xl text-stone-700 italic mb-3">
          "Sing to the LORD a new song; sing to the LORD, all the earth. Sing to the LORD, praise his name; proclaim his salvation day after day."
        </p>
        <p className="text-violet-700/70 font-medium">— Psalm 96:1-2</p>
      </div>
    </div>
  );
}
