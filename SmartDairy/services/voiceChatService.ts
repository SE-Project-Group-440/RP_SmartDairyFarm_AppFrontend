// import { askChat } from "./chatService";
// import { generateSinhalaTTS } from "./ttsService";
// import { playSinhalaAudio } from "../audio/audioPlayer";

// export const chatWithVoice = async (userInput: string) => {
//   // 1️⃣ Get KB-based answer
//   const kbResponse = await askChat(userInput);

//   const answerText =
//     kbResponse.answer ||
//     kbResponse.response ||
//     kbResponse.text;

//   if (!answerText) {
//     throw new Error("No valid answer from KB");
//   }

//   // 2️⃣ Convert to Sinhala speech
//   const base64Audio = await generateSinhalaTTS(answerText);

//   // 3️⃣ Play audio
//   if (base64Audio) {
//     await playSinhalaAudio(base64Audio);
//   }

//   return answerText;
// };
