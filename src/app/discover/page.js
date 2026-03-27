"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, X } from "lucide-react";

const EMOTIONS = [
  { id: "love", icon: "🌹", label: "Love", color: "pink" },
  { id: "joy", icon: "☀️", label: "Joy", color: "yellow" },
  { id: "gratitude", icon: "🌿", label: "Gratitude", color: "green" },
  { id: "surprise", icon: "💎", label: "Surprise", color: "blue", highlight: true },
  { id: "comfort", icon: "🍑", label: "Comfort", color: "orange" },
  { id: "creative", icon: "🎨", label: "Creative", color: "purple" },
];

const OCCASIONS = ["🎂 Birthday", "💍 Anniversary", "🎓 Graduation", "💼 Promotion", "🎄 Holiday", "💝 Just Because"];
const PERSONALITIES = ["Introvert", "Adventurous", "Minimalist", "Extrovert"];
const RELATIONSHIPS = ["Girlfriend", "Boyfriend", "Mom", "Dad", "Friend", "Boss"];

export default function DiscoverPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [selectedEmotion, setSelectedEmotion] = useState("surprise");
  const [relationship, setRelationship] = useState("Girlfriend");
  const [interests, setInterests] = useState(["Art", "Music"]);
  const [newInterest, setNewInterest] = useState("");
  const [personality, setPersonality] = useState("Adventurous");
  const [occasion, setOccasion] = useState("💍 Anniversary");
  const [budget, setBudget] = useState(2000);
  const [context, setContext] = useState("");

  const handleAddInterest = (e) => {
    if (e.key === "Enter" && newInterest.trim()) {
      e.preventDefault();
      if (!interests.includes(newInterest.trim())) {
        setInterests([...interests, newInterest.trim()]);
      }
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (item) => {
    setInterests(interests.filter(i => i !== item));
  };

  const handleFindGift = async () => {
    setLoading(true);
    try {
      const payload = {
        description: `Loves ${interests.join(", ")}. Personality: ${personality}. Additional context: ${context}`,
        occasion: occasion.replace(/[^A-Za-z ]/g, "").trim(),
        budget: Number(budget),
        relationship,
        emotions: selectedEmotion
      };
      
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("giftResults", JSON.stringify(data));
        router.push("/results");
      } else if (res.status === 401) {
        alert("Please log in to generate gift suggestions.");
        router.push("/login");
      } else {
        alert("Sorry, we couldn't generate suggestions right now. Please try again later.");
        router.push("/results");
      }
    } catch (e) {
      console.error(e);
      router.push("/results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 px-4">
      <header className="md:hidden text-center mb-6">
        <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Find a Gift ✨</h1>
        <p className="text-on-surface-variant text-sm mt-1">Let's find something magical together.</p>
      </header>

      {/* Emotion Picker */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-headline font-bold text-on-surface px-2">How should it feel?</h2>
          <span className="text-primary text-xs font-bold uppercase tracking-wider">Step 1 of 4</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EMOTIONS.map((emo) => {
            const isSelected = selectedEmotion === emo.id;
            return (
              <button 
                key={emo.id}
                onClick={() => setSelectedEmotion(emo.id)}
                className={`flex flex-col items-center justify-center p-6 rounded-xl hover:shadow-lg transition-all border group active:scale-95 ring-2 ring-offset-2 
                  ${isSelected ? "ring-primary shadow-[0_0_20px_rgba(99,14,212,0.15)] bg-white" : "ring-transparent bg-surface-container-highest border-transparent hover:ring-outline-variant"}
                `}
              >
                <span className="text-4xl mb-2">{emo.icon}</span>
                <span className={`font-headline font-semibold ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>{emo.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recipient Details */}
      <section className="bg-surface-container-low p-6 rounded-lg space-y-6">
        <h2 className="text-lg font-headline font-bold text-on-surface">Who is this for?</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Relationship</label>
            <div className="relative group">
              <select 
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-surface-container-lowest border-none rounded-full py-4 px-6 appearance-none focus:ring-2 focus:ring-primary shadow-sm text-on-surface"
              >
                {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Interests</label>
            <div className="flex flex-wrap gap-2 p-3 bg-surface-container-lowest rounded-xl shadow-sm">
              {interests.map(interest => (
                <span key={interest} className="bg-primary-fixed text-on-primary-fixed-variant px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                  {interest} 
                  <button onClick={() => handleRemoveInterest(interest)} className="text-on-primary-fixed-variant hover:text-error"><X className="w-3 h-3"/></button>
                </span>
              ))}
              <input 
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={handleAddInterest}
                className="bg-transparent border-none focus:ring-0 text-sm py-1.5 px-2 flex-1 min-w-[100px] outline-none" 
                placeholder="Add more... (press Enter)" 
                type="text"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant ml-1">Personality</label>
            <div className="flex flex-wrap gap-2">
              {PERSONALITIES.map(p => (
                <button 
                  key={p}
                  onClick={() => setPersonality(p)}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${personality === p ? "bg-primary-container text-on-primary-container font-semibold shadow-md" : "bg-surface-container-highest text-on-surface-variant hover:bg-primary-fixed hover:text-primary"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Occasion */}
      <section className="space-y-4">
        <h2 className="text-lg font-headline font-bold text-on-surface px-2">The Occasion</h2>
        <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4">
          {OCCASIONS.map(occ => (
            <button 
              key={occ}
              onClick={() => setOccasion(occ)}
              className={`flex-none px-6 py-3 rounded-full font-medium whitespace-nowrap active:scale-95 transition-all ${occasion === occ ? "bg-primary-container text-on-primary-container font-bold shadow-lg" : "bg-surface-container-lowest border border-outline-variant/15"}`}
            >
              {occ}
            </button>
          ))}
        </div>
      </section>

      {/* Budget & Context */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <div className="bg-surface-container-low p-6 rounded-lg space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-headline font-bold text-on-surface">Budget</h2>
            <span className="text-primary font-bold font-headline text-xl">₹{budget.toLocaleString()}</span>
          </div>
          <div className="relative pt-2">
            <input 
              type="range" 
              min="500" max="50000" step="500"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary" 
            />
            <div className="flex justify-between mt-3 text-xs font-bold text-outline uppercase tracking-tighter">
              <span>₹500</span>
              <span>₹50,000</span>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-lg space-y-3">
          <h2 className="text-lg font-headline font-bold text-on-surface">Context</h2>
          <textarea 
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full h-24 bg-surface-container-lowest border-none rounded-xl p-4 text-sm outline-none placeholder:text-outline focus:ring-2 focus:ring-primary shadow-sm resize-none" 
            placeholder="Add any additional details... (e.g., 'She recently started painting')"
          ></textarea>
        </div>
      </section>

      {/* CTA */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-40">
        <button 
          onClick={handleFindGift}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r flex items-center justify-center gap-2 from-primary to-primary-container text-on-primary font-headline font-bold text-lg rounded-full shadow-[0_12px_32px_-8px_rgba(99,14,212,0.4)] active:scale-95 transition-all hover:brightness-110 disabled:opacity-70 disabled:active:scale-100"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {loading ? "Curating magic..." : "Find the Perfect Gift"}
        </button>
      </div>
    </div>
  );
}
