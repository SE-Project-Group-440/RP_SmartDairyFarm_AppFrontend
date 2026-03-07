import { Language } from "../Store/language.store";

// Care instruction translations matching your exact backend text
const careInstructionTranslations: Record<Language, Record<string, string>> = {
  english: {
    // FMD Immediate Actions
    "isolate the infected animal immediately": "Isolate the infected animal immediately",
    "stop animal movement in and out of the farm": "Stop animal movement in and out of the farm", 
    "disinfect feeding and watering areas": "Disinfect feeding and watering areas",
    "inform a veterinary officer urgently": "Inform a veterinary officer urgently",
    
    // FMD Care & Treatment
    "provide soft, easy-to-eat feed (due to mouth sores)": "Provide soft, easy-to-eat feed (due to mouth sores)",
    "give plenty of clean water": "Give plenty of clean water",
    "apply antiseptic mouth wash (as prescribed by vet)": "Apply antiseptic mouth wash (as prescribed by vet)",
    "clean foot lesions with mild disinfectant": "Clean foot lesions with mild disinfectant",
    "use anti-inflammatory medication (only under vet guidance)": "Use anti-inflammatory medication (only under vet guidance)",
    
    // FMD Monitoring
    "body temperature": "Body temperature",
    "drooling or mouth ulcers": "Drooling or mouth ulcers",
    "lameness or hoof damage": "Lameness or hoof damage",
    "reduced milk production": "Reduced milk production",
    
    // FMD Prevention
    "vaccinate healthy cattle": "Vaccinate healthy cattle",
    "disinfect equipment daily": "Disinfect equipment daily",
    "limit visitor access": "Limit visitor access",
    "use footbaths at entry points": "Use footbaths at entry points",
    
    // LSD Immediate Actions
    "isolate infected cattle immediately": "Isolate infected cattle immediately",
    "control mosquitoes and biting insects": "Control mosquitoes and biting insects",
    "inform veterinary authorities": "Inform veterinary authorities",
    "avoid sharing equipment between animals": "Avoid sharing equipment between animals",
    
    // LSD Care & Treatment
    "clean skin nodules with antiseptic": "Clean skin nodules with antiseptic",
    "apply topical antibiotic cream to prevent secondary infection": "Apply topical antibiotic cream to prevent secondary infection",
    "provide anti-inflammatory medication (vet prescribed)": "Provide anti-inflammatory medication (vet prescribed)",
    "maintain high-quality nutrition": "Maintain high-quality nutrition",
    "ensure hydration": "Ensure hydration",
    
    // LSD Vector Control
    "spray insect repellents": "Spray insect repellents",
    "remove stagnant water": "Remove stagnant water",
    "keep cattle housing clean and dry": "Keep cattle housing clean and dry",
    
    // LSD Monitoring
    "fever": "Fever",
    "skin nodules spreading": "Skin nodules spreading",
    "swollen lymph nodes": "Swollen lymph nodes",
    "decreased milk yield": "Decreased milk yield",
    "signs of secondary bacterial infection": "Signs of secondary bacterial infection"
  },
  
  sinhala: {
    // FMD Immediate Actions
    "isolate the infected animal immediately": "රෝගී සතාගේ වහාම වෙන්කර තබන්න",
    "stop animal movement in and out of the farm": "ගොවිපලට සහ ගොවිපලෙන් සතුන් ගමනාගමනය නවත්වන්න",
    "disinfect feeding and watering areas": "ආහාර සහ ජල ප්‍රදේශ විෂබීජනාශක කරන්න",
    "inform a veterinary officer urgently": "පශු වේද්‍ය නිලධාරියා ඉක්මනින් දන්වන්න",
    
    // FMD Care & Treatment
    "provide soft, easy-to-eat feed (due to mouth sores)": "මුඛ තුවාල නිසා මෘදු, පහසුවෙන් ආහාරයට ගත හැකි ආහාර ලබා දෙන්න",
    "give plenty of clean water": "පිරිසිදු ජලය බොහෝ ප්‍රමාණයක් ලබා දෙන්න",
    "apply antiseptic mouth wash (as prescribed by vet)": "වේද්‍යවරයා නියම කළ පරිදි විෂබීජනාශක මුඛ සේදුම් යොදන්න",
    "clean foot lesions with mild disinfectant": "මෘදු විෂබීජනාශකයකින් පාද තුවාල පිරිසිදු කරන්න",
    "use anti-inflammatory medication (only under vet guidance)": "ප්‍රති-ගිනි අවුර ඖෂධ භාවිතා කරන්න (වේද්‍ය මග පෙන්වීම යටතේ පමණි)",
    
    // FMD Monitoring
    "body temperature": "ශරීර උෂ්ණත්වය",
    "drooling or mouth ulcers": "කෙළ ගැලීම හෝ මුඛ තුවාල",
    "lameness or hoof damage": "කිම්බන් වීම හෝ කුර වලට හානි",
    "reduced milk production": "අඩු කිරි නිෂ්පාදනය",
    
    // FMD Prevention
    "vaccinate healthy cattle": "සතුන්ට එන්නත් කරන්න",
    "disinfect equipment daily": "දෙනෙක උපකරණ විෂබීජනාශක කරන්න",
    "limit visitor access": "නරීක්ෂක ප්‍රවේශය සීමා කරන්න",
    "use footbaths at entry points": "ප්‍රවේශ ස්ථානවල පාද ස්නානාගාර භාවිතා කරන්න",
    
    // LSD Immediate Actions
    "isolate infected cattle immediately": "සතුන්ගේ වහාම වෙන්කර තබන්න",
    "control mosquitoes and biting insects": "මදුරුවන් සහ කටන කෘමීන් පාලනය කරන්න",
    "inform veterinary authorities": "පශු වේද්‍ය බලධාරීන්ට දන්වන්න",
    "avoid sharing equipment between animals": "සතුන් අතර උපකරණ බෙදා ගැනීම වළක්වන්න",
    
    // LSD Care & Treatment  
    "clean skin nodules with antiseptic": "විෂබීජනාශකයකින් සම ගැටිති පිරිසිදු කරන්න",
    "apply topical antibiotic cream to prevent secondary infection": "ද්විතීයික ආසාදන වැළැක්වීමට මතුපිට ප්‍රතිජීවක ක්‍රීම් යොදන්න",
    "provide anti-inflammatory medication (vet prescribed)": "ප්‍රති-ගිනි අවුර ඖෂධ ලබා දෙන්න (වේද්‍ය නියමයට)",
    "maintain high-quality nutrition": "උසස් තත්ත්වයේ පෝෂණය පවත්වන්න",
    "ensure hydration": "ජලය සහතික කරන්න",
    
    // LSD Vector Control
    "spray insect repellents": "කෘමි විකර්ෂක ඉසින්න",
    "remove stagnant water": "රැඳී තිබෙන ජලය ඉවත් කරන්න",
    "keep cattle housing clean and dry": "ගව නිවාස පිරිසිදු හා වියළි තබා ගන්න",
    
    // LSD Monitoring
    "fever": "උණ",
    "skin nodules spreading": "සම ගැටිති පැතිරීම",
    "swollen lymph nodes": "ඉදිමුණු වසා ගැටිති",
    "decreased milk yield": "අඩු කිරි ප්‍රමාණය",
    "signs of secondary bacterial infection": "ද්විතීයික බැක්ටීරියා ආසාදනයේ සලකුණු"
  },
  
  tamil: {
    // FMD Immediate Actions
    "isolate the infected animal immediately": "நோயுற்ற விலங்கை உடனடியாக தனிமைப்படுத்தவும்",
    "stop animal movement in and out of the farm": "பண்ணைக்கு உள்ளும் வெளியும் விலங்கு நடமாட்டத்தை நிறுத்தவும்",
    "disinfect feeding and watering areas": "உணவு மற்றும் நீர்ப் பகுதிகளை கிருமி நாசினி செய்யவும்",
    "inform a veterinary officer urgently": "கால்நடை மருத்துவ அலுவலரை அவசரமாக தெரிவிக்கவும்",
    
    // FMD Care & Treatment
    "provide soft, easy-to-eat feed (due to mouth sores)": "வாய் புண்கள் காரணமாக மென்மையான, எளிதில் உண்ணக்கூடிய உணவு கொடுக்கவும்",
    "give plenty of clean water": "நிறைய சுத்தமான தண்ணீர் கொடுக்கவும்",
    "apply antiseptic mouth wash (as prescribed by vet)": "கால்நடை மருத்துவர் பரிந்துரைத்தபடி கிருமி நாசினி வாய் கழுவி பயன்படுத்தவும்",
    "clean foot lesions with mild disinfectant": "மிதமான கிருமி நாசினியால் கால் புண்களை சுத்தம் செய்யவும்",
    "use anti-inflammatory medication (only under vet guidance)": "அழற்சி எதிர்ப்பு மருந்து பயன்படுத்தவும் (மருத்துவ வழிகாட்டலின் கீழ் மட்டுமே)",
    
    // FMD Monitoring
    "body temperature": "உடல் வெப்பநிலை",
    "drooling or mouth ulcers": "எச்சில் சொட்டுதல் அல்லது வாய் புண்கள்",
    "lameness or hoof damage": "நொண்டித்தனம் அல்லது குளம்பு சேதம்",
    "reduced milk production": "குறைந்த பால் உற்பத்தி",
    
    // FMD Prevention
    "vaccinate healthy cattle": "ஆரோக்கியமான கால்நடைகளுக்கு தடுப்பூசி போடவும்",
    "disinfect equipment daily": "தினமும் உபகரணங்களை கிருமி நாசினி செய்யவும்",
    "limit visitor access": "பார்வையாளர் அணுகலை கட்டுப்படுத்தவும்",
    "use footbaths at entry points": "நுழைவு புள்ளிகளில் கால் குளியல் பயன்படுத்தவும்",
    
    // LSD Immediate Actions
    "isolate infected cattle immediately": "நோயுற்ற கால்நடைகளை உடனடியாக தனிமைப்படுத்தவும்",
    "control mosquitoes and biting insects": "கொசுக்கள் மற்றும் கடிக்கும் பூச்சிகளை கட்டுப்படுத்தவும்",
    "inform veterinary authorities": "கால்நடை மருத்துவ அதிகாரிகளுக்கு தெரிவிக்கவும்",
    "avoid sharing equipment between animals": "விலங்குகளிடையே உபகரணங்களை பகிர்ந்து கொள்வதை தவிர்க்கவும்",
    
    // LSD Care & Treatment
    "clean skin nodules with antiseptic": "கிருமி நாசினியால் தோல் கணுக்களை சுத்தம் செய்யவும்",
    "apply topical antibiotic cream to prevent secondary infection": "இரண்டாம் நிலை தொற்றுநோயை தடுக்க மேற்பூச்சு நுண்ணுயிர் எதிர்ப்பு கிரீம் பயன்படுत்தவும்",
    "provide anti-inflammatory medication (vet prescribed)": "அழற்சி எதிர்ப்பு மருந்து வழங்கவும் (மருத்துவர் பரிந்துரை)",
    "maintain high-quality nutrition": "உயர்தர ஊட்டச்சத்தை பராமரிக்கவும்",
    "ensure hydration": "நீர்ச்சத்து உறுதி செய்யவும்",
    
    // LSD Vector Control
    "spray insect repellents": "பூச்சி விரட்டிகளை தெளிக்கவும்",
    "remove stagnant water": "தேங்கி நிற்கும் தண்ணீரை அகற்றவும்",
    "keep cattle housing clean and dry": "கால்நடை வீட்டை சுத்தமாகவும் உலர்ந்ததாகவும் வைத்திருக்கவும்",
    
    // LSD Monitoring
    "fever": "காய்ச்சல்",
    "skin nodules spreading": "தோல் கணுக்கள் பரவுதல்", 
    "swollen lymph nodes": "வீங்கிய நிணநீர் கணுக்கள்",
    "decreased milk yield": "குறைந்த பால் உற்பத்தி",
    "signs of secondary bacterial infection": "இரண்டாம் நிலை பாக்டீரியா தொற்றுநோயின் அறிகுறிகள்"
  }
};

/**
 * Translates care instruction content to the specified language
 * @param text - The text to translate
 * @param language - The target language
 * @returns Translated text or original if no translation found
 */
export const translateCareInstruction = (text: string, language: Language): string => {
  if (language === "english") return text;
  
  const translations = careInstructionTranslations[language];
  if (!translations) return text;
  
  // Clean the input text
  const lowerText = text.toLowerCase().trim();
  
  // Try exact match first
  if (translations[lowerText]) {
    return translations[lowerText];
  }
  
  // Try partial matching for common phrases
  for (const [key, value] of Object.entries(translations)) {
    if (lowerText.includes(key) || key.includes(lowerText)) {
      return value;
    }
  }
  
  console.log(`Translation not found for: "${text}" in language: ${language}`);
  return text; // Return original if no translation found
};

/**
 * Translates an array of care instructions
 * @param instructions - Array of instruction strings
 * @param language - The target language  
 * @returns Array of translated instructions
 */
export const translateInstructionArray = (instructions: string[], language: Language): string[] => {
  return instructions.map(instruction => translateCareInstruction(instruction, language));
};

/**
 * Adds a new translation mapping (useful for extending translations dynamically)
 * @param english - English text
 * @param sinhala - Sinhala translation
 * @param tamil - Tamil translation
 */
export const addTranslation = (english: string, sinhala: string, tamil: string) => {
  careInstructionTranslations.english[english.toLowerCase()] = english;
  careInstructionTranslations.sinhala[english.toLowerCase()] = sinhala;
  careInstructionTranslations.tamil[english.toLowerCase()] = tamil;
};

export default { 
  translateCareInstruction, 
  translateInstructionArray, 
  addTranslation 
};
