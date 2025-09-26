import axios from 'axios';

// Build a prompt for the Gemini model using recent sleep stats
export function buildWellnessPrompt(logs, analysisSummary) {
  const lines = logs.slice(0, 7).map((l) => {
    const start = new Date(l.sleepStart).toISOString();
    const end = new Date(l.sleepEnd).toISOString();
    return `- Start: ${start}, End: ${end}, Mood: ${l.mood}, Caffeine: ${l.caffeine}mg, Disturbances: ${l.disturbances}`;
  });

  const preface = `Analyze the following sleep log data and provide friendly, conversational advice to improve the user’s sleep quality. Suggestions should be science-backed, simple, and motivational. Avoid medical advice. Keep it focused on sleep, mental wellness, and lifestyle.`;

  const stats = `Summary: Avg Duration: ${analysisSummary.averageDurationHours}h, Avg Bed: ${analysisSummary.averageBedTime}, Avg Wake: ${analysisSummary.averageWakeTime}, Efficiency: ${analysisSummary.efficiencyPercent}%, Flags: ${analysisSummary.flags.join(', ')}`;

  return `${preface}\n\n${stats}\n\nRecent logs:\n${lines.join('\n')}`;
}

// Call ivislabs API for wellness advice
export async function getGeminiAdvice(prompt) {
  const apiKey = process.env.GEMINI_API_KEY || 'sk-bf725748416143d88b7ea444d68f0c90';
  
  if (!apiKey) {
    // Fallback for development without API key
    return 'It looks like I cannot reach the AI service right now. Meanwhile, try to keep a consistent bedtime and reduce caffeine after noon. Aim for a dark, cool bedroom and avoid screens 1 hour before bed.';
  }

  // Headers with API key
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  // Define system prompt for wellness advice
  const systemPrompt = "You are a helpful wellness and sleep advisor. Provide friendly, conversational advice to improve the user's sleep quality and overall wellness. Suggestions should be science-backed, simple, and motivational. Avoid medical advice. Keep it focused on sleep, mental wellness, and lifestyle improvements.";

  // Prepare request payload with system and user prompts
  const payload = {
    'model': 'llama3.2-vision:latest',
    'messages': [
      { 'role': 'system', 'content': systemPrompt },
      { 'role': 'user', 'content': prompt },
    ],
    'temperature': 0.7
  };

  try {
    const response = await axios.post('https://chat.ivislabs.in/api/chat/completions', payload, {
      headers,
      timeout: 15000,
    });

    if (response.status === 200) {
      const responseData = response.data;
      let content = responseData?.choices?.[0]?.message?.content || 'No content returned.';
      
      // Clean any tags like <think> using regex
      content = content.replace(/<.*?>/g, '').trim();
      
      return content;
    } else {
      console.error(`API Request Failed. Status Code: ${response.status}`);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return 'It looks like I cannot reach the AI service right now. Meanwhile, try to keep a consistent bedtime and reduce caffeine after noon. Aim for a dark, cool bedroom and avoid screens 1 hour before bed.';
  }
}


