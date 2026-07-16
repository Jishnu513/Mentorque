import { useState, useEffect } from "react";
import AvailabilityDashboard from "../components/AvailabilityDashboard";
import { useAuth } from "../context/AuthContext";
import * as userApi from "../api/user";

const CALL_TYPES = [
  { id: "RESUME_REVAMP", label: "Resume Revamp" },
  { id: "JOB_MARKET_GUIDANCE", label: "Job Market Guidance" },
  { id: "MOCK_INTERVIEW", label: "Mock Interview" },
];

const AVAILABLE_TAGS = [
  "Tech",
  "Non-tech",
  "Good Communication",
  "Asks a lot of questions",
];

export default function UserAvailability() {
  const { user, refreshUser } = useAuth();
  
  const [callType, setCallType] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userApi.getProfile();
        setCallType(profile.callType || "");
        setDescription(profile.description || "");
        setTags(profile.tags || []);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleTagToggle = (tag) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSaveRequirements = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      await userApi.updateRequirements({ callType, description, tags });
      await refreshUser(); // Update context
      setMessage({ text: "Requirements saved successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setMessage({ text: err.message || "Failed to save requirements", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Requirements Panel */}
      <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-slate-800 bg-navy-950/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            My Call Requirements
          </h2>
          {message.text && (
            <span className={`text-sm px-3 py-1 rounded-full ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message.text}
            </span>
          )}
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center p-8 text-slate-400">Loading requirements...</div>
          ) : (
            <div className="space-y-6">
              
              {/* Call Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">What kind of session are you looking for?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {CALL_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCallType(type.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                        callType === type.id 
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]" 
                          : "bg-navy-950 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800"
                      }`}
                    >
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tell us about your background and goals</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. I am a frontend developer with 2 years of experience looking to target FAANG companies..."
                  className="w-full px-4 py-3 bg-navy-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select relevant tags to help us match you</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                          isSelected 
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" 
                            : "bg-navy-950 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {isSelected && <span className="mr-1.5 opacity-70">✓</span>}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSaveRequirements}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Requirements"
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Availability Grid */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-4 px-1">My Availability Schedule</h2>
        <AvailabilityDashboard role="USER" />
      </div>
    </div>
  );
}
