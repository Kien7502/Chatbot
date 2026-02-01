const API_KEY = 'AIzaSyCWqGI6Ps3x7bz1m7B674JFs8UlAyFIc20';
const URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Sends text to Gemini to get a pedagogical question/hint.
 * @param {string} studentText - The current text written by the student.
 * @param {object} context - { topic, constraint, recentMessages }
 * @returns {Promise<string>} - The AI's response (a question or hint).
 */
export const getPedagogicalFeedback = async (studentText, context) => {
    const { topic, constraint } = context;

    const systemPrompt = `
    You are a pedagogical writing assistant for a B1-B2 Academic Writing student.
    
    CONTEXT:
    - Topic: "${topic}"
    - Task: "${constraint}"
    - Student Text: "${studentText}"
    
    YOUR ROLE:
    - You act as a "Writing Partner", NOT a "Writing Machine".
    - NEVER write the essay for the student.
    - NEVER correct grammar directly.
    - NEVER provide new ideas or model answers.
    
    YOUR GOAL:
    - Read the student's text.
    - If the student is stuck or asks for help, provide a SCAFFOLDING QUESTION.
    - Example Scaffolding: "What exactly do you mean by 'important' here?", "Can you strengthen this sentence by adding one academic verb?", "This sentence has two ideas. Which one is your main claim?"
    
    OUTPUT:
    - A single, short, encouraging question or specific hint (max 2 sentences).
  `;

    try {
        const response = await fetch(`${URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.warn('Gemini API Error:', data.error);
            return "I'm having a little trouble thinking right now. Can you try rephrasing that?";
        }

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.warn('Gemini Unexpected Response:', data);
            return "I see what you wrote. What is the main point you want to make?";
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini:', error);
        return "I'm having trouble connecting right now. Try rereading your last sentence to see if it's clear.";
    }
};

/**
 * Generates an end-of-session reflection summary.
 */
export const getReflectionAnalysis = async (studentText, interactionLog) => {
    const systemPrompt = `
      Analyze this short writing session.
  
      Student Text: "${studentText}"
      Interaction Count: ${interactionLog.length}
  
      Provide a "Metalinguistic Analysis" (NOT corrections).
      1. Count sentences.
      2. Identify 1 strong academic word used (if any).
      3. Identify 1 area for improvement (e.g., "Sentence 2 is very long").
      
      Format the output as JSON: { "sentence_count": number, "strength": string, "improvement": string }
    `;

    try {
        const response = await fetch(`${URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const data = await response.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        return JSON.parse(textResponse);
    } catch (error) {
        console.error('Error getting reflection:', error);
        return { sentence_count: 0, strength: "Good effort!", improvement: "Keep practicing." };
    }
};
