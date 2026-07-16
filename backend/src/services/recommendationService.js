/**
 * AI-powered mentor recommendation service using Google Gemini.
 * Falls back to rule-based matching if no API key is set.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const CALL_TYPE_LABELS = {
  RESUME_REVAMP: "Resume Revamp",
  JOB_MARKET_GUIDANCE: "Job Market Guidance",
  MOCK_INTERVIEW: "Mock Interview",
};

const CALL_TYPE_CRITERIA = {
  RESUME_REVAMP: "big tech company experience, senior developer status, tech background",
  JOB_MARKET_GUIDANCE: "good communication skills, broad industry exposure, public company experience",
  MOCK_INTERVIEW: "technical background, same domain as user, strong communication",
};

/**
 * Get mentor recommendations using Gemini AI.
 * @param {object} params
 * @param {string} params.callType - RESUME_REVAMP | JOB_MARKET_GUIDANCE | MOCK_INTERVIEW
 * @param {string} params.userDescription - User's background/goals
 * @param {string[]} params.userTags - User's tags
 * @param {Array<{id, name, tags, description}>} params.mentors - Available mentors
 * @returns {Promise<Array<{mentorId, mentorName, score, reasoning}>>}
 */
export async function getRecommendations({ callType, userDescription, userTags, mentors }) {
  if (!mentors || mentors.length === 0) {
    return [];
  }

  if (GEMINI_API_KEY) {
    try {
      return await geminiRecommend({ callType, userDescription, userTags, mentors });
    } catch (err) {
      console.warn("[recommendationService] Gemini failed, falling back to rule-based:", err.message);
    }
  }

  // Fallback: rule-based scoring
  return ruleBasedRecommend({ callType, userDescription, userTags, mentors });
}

async function geminiRecommend({ callType, userDescription, userTags, mentors }) {
  const callLabel = CALL_TYPE_LABELS[callType] || callType;
  const criteria = CALL_TYPE_CRITERIA[callType] || "";

  const mentorList = mentors
    .map((m, i) => {
      const tags = Array.isArray(m.tags) ? m.tags.join(", ") : String(m.tags || "");
      return `${i + 1}. ID: ${m.id} | Name: ${m.name} | Tags: ${tags} | Bio: ${m.description || "No description"}`;
    })
    .join("\n");

  const prompt = `You are a career mentoring coordinator. Rank the following mentors for a user who needs a "${callLabel}" session.

User Background: ${userDescription || "Not provided"}
User Tags: ${(userTags || []).join(", ") || "None"}
Call Type: ${callLabel}
Ideal mentor criteria for this call type: ${criteria}

Available Mentors:
${mentorList}

Rank ALL mentors from best to worst match. For each mentor provide:
- mentorId (exact ID from the list)
- score (1-10, 10 being perfect match)
- reasoning (1-2 sentences explaining the match)

Respond ONLY with valid JSON array, no markdown, no explanation outside the JSON:
[{"mentorId":"...","score":9,"reasoning":"..."},...]`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Extract JSON from response (handle possible markdown code blocks)
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Could not parse Gemini response as JSON array");

  const ranked = JSON.parse(jsonMatch[0]);

  // Merge mentor names into the result
  return ranked.map((item) => {
    const mentor = mentors.find((m) => m.id === item.mentorId);
    return {
      mentorId: item.mentorId,
      mentorName: mentor?.name || "Unknown",
      score: item.score,
      reasoning: item.reasoning,
    };
  });
}

function ruleBasedRecommend({ callType, mentors }) {
  const WEIGHTS = {
    RESUME_REVAMP: {
      "Big Company": 3,
      "Senior Developer": 3,
      Tech: 2,
      "Good Communication": 1,
    },
    JOB_MARKET_GUIDANCE: {
      "Good Communication": 3,
      "Public Company": 2,
      "Non-tech": 1,
      Ireland: 1,
      India: 1,
    },
    MOCK_INTERVIEW: {
      Tech: 3,
      "Senior Developer": 2,
      "Good Communication": 2,
      "Big Company": 1,
    },
  };

  const weights = WEIGHTS[callType] || {};

  const scored = mentors.map((m) => {
    const tags = Array.isArray(m.tags) ? m.tags : [];
    let score = 0;
    const matched = [];
    for (const tag of tags) {
      if (weights[tag]) {
        score += weights[tag];
        matched.push(tag);
      }
    }
    const normalizedScore = Math.min(10, Math.round((score / 10) * 10) || 3);
    const callLabel = CALL_TYPE_LABELS[callType] || callType;
    const reasoning =
      matched.length > 0
        ? `Matches on: ${matched.join(", ")}. Good fit for ${callLabel}.`
        : `No specific tag match, but available for ${callLabel}.`;
    return {
      mentorId: m.id,
      mentorName: m.name,
      score: normalizedScore,
      reasoning,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
