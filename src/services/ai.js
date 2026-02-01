const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const URL = 'https://api.openai.com/v1/responses';

/**
 * Sends text to the custom OpenAI endpoint.
 * @param {string} prompt - The full prompt text.
 * @returns {Promise<string>} - The AI's text response.
 */
const callOpenAI = async (prompt) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-5-nano",
                input: prompt,
                store: true
            })
        });

        const data = await response.json();

        if (data.error) {
            console.warn('AI API Error:', data.error);
            throw new Error(data.error.message || 'API Error');
        }

        // Custom API handling based on observed logs: { content: [{type, text}] }
        if (Array.isArray(data.content)) {
            const textItem = data.content.find(item => item.text);
            if (textItem) return textItem.text;
        }

        // Custom API handling based on observed logs: 
        // { output: [ { type: "reasoning", ... }, { type: "message", content: [{ type: "output_text", text: "..." }] } ] }
        if (Array.isArray(data.output)) {
            // Find the message item
            const messageItem = data.output.find(item => item.type === 'message' && Array.isArray(item.content));

            if (messageItem) {
                // Find the text content inside the message content
                const textContent = messageItem.content.find(c => c.type === 'output_text' && typeof c.text === 'string');
                if (textContent) return textContent.text;
            }

            // Check for direct text property in output items (fallback)
            const textItem = data.output.find(item => typeof item.text === 'string' && item.text.length > 0);
            if (textItem) return textItem.text;

            // Last resort: stringify the last item
            return JSON.stringify(data.output[data.output.length - 1] || data.output);
        }

        return data.choices?.[0]?.message?.content ||
            (typeof data.text === 'string' ? data.text : JSON.stringify(data));

    } catch (error) {
        console.error('Error calling AI:', error);
        throw error;
    }
};

/**
 * Sends text to get a pedagogical question/hint.
 */
export const getPedagogicalFeedback = async (studentText, context) => {
    const { topic, constraint } = context;

    const prompt = `
    You are a pedagogical writing assistant.
    
    CONTEXT:
    - Topic: "${topic}"
    - Task: "${constraint}"
    - Student Text: "${studentText}"
    
    YOUR ROLE:
    - Act as a supportive writing partner.
    - NEVER write the essay for the student.
    - NEVER correct grammar directly.
    - DO NOT ASK QUESTIONS. Make direct observations or give hints as statements.
    
    YOUR GOAL:
    - Read the student's text.
    - Provide a specific hint or observation to help them continue or improve.
    - Example: "You might want to clarify what 'important' means here." or "Try adding an academic verb to strengthen the second sentence."
    
    OUTPUT:
    - A single, short, encouraging statement or hint (max 2 sentences).
  `;

    try {
        return await callOpenAI(prompt);
    } catch (error) {
        return "I'm having a little trouble connecting. Can you read that last sentence to me again?";
    }
};

/**
 * Generates an end-of-session reflection summary.
 */
export const getReflectionAnalysis = async (studentText, interactionLog) => {
    const prompt = `
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
        const textResponse = await callOpenAI(prompt);
        // Sanitize JSON if needed (remove backticks)
        const jsonStr = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Reflection Error:', error);
        return { sentence_count: 0, strength: "Good effort!", improvement: "Keep practicing." };
    }
};
