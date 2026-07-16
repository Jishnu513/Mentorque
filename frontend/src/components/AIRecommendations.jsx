import { useState, useEffect } from "react";
import * as adminApi from "../api/admin";

export default function AIRecommendations({ selectedUserId, onSelectMentor }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!selectedUserId) {
      setRecommendations([]);
      setUserProfile(null);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // First get user profile to show context
        const profile = await adminApi.getUserRequirements(selectedUserId);
        setUserProfile(profile);

        if (!profile.callType) {
          setError("User has not set a call type preference yet. Cannot recommend mentors.");
          setLoading(false);
          return;
        }

        // Then get recommendations
        const res = await adminApi.getRecommendations({
          userId: selectedUserId,
          callType: profile.callType
        });
        setRecommendations(res.recommendations || []);
      } catch (err) {
        setError(err.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedUserId]);

  if (!selectedUserId) return null;

  return (
    <div className="bg-navy-900 border border-purple-500/30 rounded-2xl overflow-hidden mt-6 mb-6 shadow-[0_0_15px_rgba(168,85,247,0.15)] relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
      
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          AI Mentor Recommendations
        </h3>
        
        {userProfile && (
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">
              Needs: <span className="font-semibold text-white">{userProfile.callType?.replace(/_/g, ' ') || 'Unknown'}</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex items-center gap-3 text-purple-400 font-medium">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            Analyzing profiles and matching with Gemini AI...
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
            {error}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-slate-400 text-sm">No recommendations available.</div>
        ) : (
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div 
                key={rec.mentorId} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-base">
                      {index + 1}. {rec.mentorName}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      rec.score >= 8 ? 'bg-emerald-500/20 text-emerald-400' :
                      rec.score >= 5 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      Score: {rec.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {rec.reasoning}
                  </p>
                </div>
                <button
                  onClick={() => onSelectMentor(rec.mentorId)}
                  className="shrink-0 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors shadow-lg shadow-purple-500/20"
                >
                  Select Mentor
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
