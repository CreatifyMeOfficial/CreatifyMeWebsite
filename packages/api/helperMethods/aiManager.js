const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

async function summarizePersonality(personality) {
  // Define the blueprint for the AI this schema ensures the response will match the desired result
  const schema = {
    description: "Personality analysis categorized by traits, strengths, and manifestations.",
    type: "object",
    properties: {
      arabicDescription: {
        type: "object",
        properties: {
          keyTraits: { type: "array", items: { type: "string" }, description: "4 points about key traits in Arabic" },
          strengths: { type: "array", items: { type: "string" }, description: "4 points about strengths in Arabic" },
          manifestation: { type: "array", items: { type: "string" }, description: "4 points about manifestation in Arabic" },
          selfDevelopment: { type: "array", items: { type: "string" }, description: "4 points about self development in Arabic" },
          careerRecommendation: { type: "array", items: { type: "string" }, description: "4 points about career recommendation in Arabic" }
        },
        required: ["keyTraits", "strengths", "manifestation", "selfDevelopment", "careerRecommendation"]
      },
      englishDescription: {
        type: "object",
        properties: {
          keyTraits: { type: "array", items: { type: "string" }, description: "4 points about key traits in English" },
          strengths: { type: "array", items: { type: "string" }, description: "4 points about strengths in English" },
          manifestation: { type: "array", items: { type: "string" }, description: "4 points about manifestation in English" },
          selfDevelopment: { type: "array", items: { type: "string" }, description: "4 points about self development in English" },
          careerRecommendation: { type: "array", items: { type: "string" }, description: "4 points about career recommendation in English" }
        },
        required: ["keyTraits", "strengths", "manifestation", "selfDevelopment", "careerRecommendation"]
      }
    },
    required: ["arabicDescription", "englishDescription"]
  };

  // 2. Pass the schema into the model configuration
  const model = genAI.getGenerativeModel({
    model: process.env.AI_MODEL_NAME,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  const result = await model.generateContent(`Analyze this personality test result and provide a concise human-friendly summary: ${personality} Include: 1.Key personality traits. 2.Strengths. 3.How these traits might manifest in work/relationships. return the result as a json object containing arabicDescription and englishDescription ready to be parsed in js`);
  const response = await result.response;

  // This will return a clean string like: {"arabicDescription": "...", "englishDescription": "..."}
  return response.text();
}

module.exports = summarizePersonality;