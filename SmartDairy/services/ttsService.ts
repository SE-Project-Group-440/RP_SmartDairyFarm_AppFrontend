// import { GoogleGenAI, Modality } from "@google/genai";

// const API_KEY = process.env.API_KEY || "";

// export const generateSinhalaTTS = async (text: string): Promise<string | undefined> => {
//   const ai = new GoogleGenAI({ apiKey: API_KEY });

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash-preview-tts",
//     contents: [{ parts: [{ text }] }],
//     config: {
//       responseModalities: [Modality.AUDIO],
//       speechConfig: {
//         voiceConfig: {
//           prebuiltVoiceConfig: { voiceName: "Kore" },
//         },
//       },
//     },
//   });

//   return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
// };
