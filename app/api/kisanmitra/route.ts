import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Environment variables validation
const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  MAX_REQUESTS_PER_MINUTE: z.string().default('10'),
  ALLOWED_ORIGINS: z.string().default('*'),
});

const env = envSchema.parse(process.env);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Request validation schema
const requestSchema = z.object({
  message: z.string().min(1).max(1000),
  language: z.enum(['en', 'mr', 'hi', 'bn', 'te', 'ta', 'gu', 'kn']).default('en'),
  context: z.object({
    location: z.string().optional(),
    cropType: z.string().optional(),
    season: z.string().optional(),
  }).optional(),
});

// Security middleware
function validateRequest(req: NextRequest) {
  const origin = req.headers.get('origin');
  const userAgent = req.headers.get('user-agent');
  
  // Basic security checks
  if (!userAgent || userAgent.includes('curl') || userAgent.includes('Postman')) {
    return { valid: false, error: 'Invalid user agent' };
  }
  
  // Rate limiting
  const clientIP = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);
  
  if (clientData && now < clientData.resetTime) {
    if (clientData.count >= parseInt(env.MAX_REQUESTS_PER_MINUTE)) {
      return { valid: false, error: 'Rate limit exceeded' };
    }
    clientData.count++;
  } else {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + 60000 });
  }
  
  return { valid: true, clientIP };
}

// Clean rate limit store periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

// Enhanced system prompts for different languages
const systemPrompts = {
  en: `You are KisanMitra, an expert AI agricultural advisor for Indian farmers. Provide concise, practical farming advice.

CORE CAPABILITIES:
🌱 Crop Management: Selection, planting, care, harvesting
💰 Market Intelligence: Prices, trends, demand-supply
🌦️ Weather & Climate: Forecasts, seasonal planning
🌿 Pest Control: IPM, organic solutions, prevention
🌍 Soil Health: Testing, fertility, sustainable practices
🚜 Technology: Modern techniques, equipment, precision farming
🏛️ Government Support: Schemes, subsidies, loans
📊 Financial Planning: Cost analysis, profit optimization

RESPONSE RULES:
- Keep responses SHORT (max 3 paragraphs)
- Use simple, clear language
- Provide actionable advice
- Show prices in ₹ (Rupees)
- Use Indian measurements (quintal, hectare)
- NEVER add disclaimers or "incomplete information" notes
- Be confident and direct
- Focus on practical solutions

MISSION: Help Indian farmers increase yields, reduce costs, and build profitable farms.`,

  mr: `तुम्ही किसानमित्र आहात, भारतीय शेतकऱ्यांसाठी तज्ञ AI कृषी सल्लागार. संक्षिप्त, व्यावहारिक शेती सल्ला द्या.

मुख्य क्षमता:
🌱 पीक व्यवस्थापन: निवड, लागवड, काळजी, कापणी
💰 बाजार माहिती: किंमती, ट्रेंड, मागणी-पुरवठा
🌦️ हवामान: अंदाज, ऋतुमान नियोजन
🌿 कीड नियंत्रण: एकात्मिक व्यवस्थापन, सेंद्रिय उपाय
🌍 माती आरोग्य: चाचणी, सेंद्रिय शेती
🚜 तंत्रज्ञान: आधुनिक तंत्रे, उपकरणे
🏛️ सरकारी सहाय्य: योजना, सब्सिडी, कर्ज
📊 आर्थिक नियोजन: खर्च विश्लेषण, नफा

प्रतिसाद नियम:
- प्रतिसाद लहान ठेवा (जास्तीत जास्त 3 परिच्छेद)
- सोपी, स्पष्ट भाषा वापरा
- कार्यान्वित सल्ला द्या
- किंमती ₹ मध्ये दाखवा
- भारतीय मापे वापरा
- कधीही अस्वीकरण जोडू नका
- आत्मविश्वासपूर्ण आणि थेट व्हा`,

  hi: `आप किसानमित्र हैं, भारतीय किसानों के लिए विशेषज्ञ AI कृषि सलाहकार। संक्षिप्त, व्यावहारिक खेती सलाह दें।

मुख्य क्षमताएं:
🌱 फसल प्रबंधन: चयन, रोपण, देखभाल, कटाई
💰 बाजार बुद्धिमत्ता: कीमतें, रुझान, मांग-आपूर्ति
🌦️ मौसम: पूर्वानुमान, मौसमी योजना
🌿 कीट नियंत्रण: एकीकृत प्रबंधन, जैविक समाधान
🌍 मिट्टी स्वास्थ्य: परीक्षण, उर्वरता, स्थायी प्रथाएं
🚜 प्रौद्योगिकी: आधुनिक तकनीक, उपकरण
🏛️ सरकारी सहायता: योजनाएं, सब्सिडी, ऋण
📊 वित्तीय योजना: लागत विश्लेषण, लाभ अनुकूलन

प्रतिक्रिया नियम:
- प्रतिक्रियाओं को छोटा रखें (अधिकतम 3 पैराग्राफ)
- सरल, स्पष्ट भाषा का उपयोग करें
- कार्रवाई योग्य सलाह दें
- कीमतों को ₹ में दिखाएं
- भारतीय माप का उपयोग करें
- कभी भी अस्वीकरण न जोड़ें
- आत्मविश्वासपूर्ण और सीधे रहें`,

  bn: `আপনি কিষানমিত্র, ভারতীয় কৃষকদের জন্য বিশেষজ্ঞ AI কৃষি পরামর্শদাতা। সংক্ষিপ্ত, ব্যবহারিক কৃষি পরামর্শ দিন।`,
  te: `మీరు కిసాన్మిత్ర, భారతీయ రైతుల కోసం నిపుణ AI వ్యవసాయ సలహాదారు. సంక్షిప్త, ఆచరణాత్మక వ్యవసాయ సలహా ఇవ్వండి.`,
  ta: `நீங்கள் கிசான்மித்ர, இந்திய விவசாயிகளுக்கான நிபுணத்துவ AI வேளாண் ஆலோசகர். சுருக்கமான, நடைமுறை வேளாண் ஆலோசனையை வழங்குங்கள்.`,
  gu: `તમે કિસાનમિત્ર છો, ભારતીય ખેડૂતો માટે નિષ્ણાત AI કૃષિ સલાહકાર. સંક્ષિપ્ત, વ્યવહારિક કૃષિ સલાહ આપો.`,
  kn: `ನೀವು ಕಿಸಾನ್ಮಿತ್ರ, ಭಾರತೀಯ ರೈತರಿಗೆ ತಜ್ಞ AI ಕೃಷಿ ಸಲಹೆಗಾರ. ಸಂಕ್ಷಿಪ್ತ, ಪ್ರಾಯೋಗಿಕ ಕೃಷಿ ಸಲಹೆ ನೀಡಿ.`,
};

export async function POST(req: NextRequest) {
  try {
    // Security validation
    const securityCheck = validateRequest(req);
    if (!securityCheck.valid) {
      return NextResponse.json(
        { error: securityCheck.error },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = requestSchema.parse(body);

    // Detect if user needs real-time market data
    const message = validatedData.message.toLowerCase();
    const needsRealTimeData = 
      message.includes('cotton') || 
      message.includes('कापूस') || 
      message.includes('कपास') ||
      message.includes('market') || 
      message.includes('mandi') || 
      message.includes('bazaar') ||
      message.includes('price') ||
      message.includes('rate') ||
      message.includes('कीमत') ||
      message.includes('दर') ||
      message.includes('बाजार');

    // Enhanced prompt for real-time data
    let systemPrompt = systemPrompts[validatedData.language];
    
    if (needsRealTimeData) {
      systemPrompt += `

🔍 REAL-TIME MARKET DATA MODE:
User is asking for current market information. Provide:
- Current crop prices and rates
- Market trends and changes
- Government policy updates
- Weather impact on prices
- Demand-supply situation

⚠️ CRITICAL: Keep response SHORT (max 2 paragraphs), NO disclaimers, give confident answers.`;
    }

    // Add context if provided
    if (validatedData.context) {
      const { location, cropType, season } = validatedData.context;
      if (location || cropType || season) {
        systemPrompt += `

📍 CONTEXT: ${location ? `Location: ${location}` : ''}${cropType ? ` | Crop: ${cropType}` : ''}${season ? ` | Season: ${season}` : ''}
Provide location-specific advice when possible.`;
      }
    }

    // Optimize OpenAI request
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: validatedData.message }
      ],
      max_tokens: needsRealTimeData ? 300 : 500, // Shorter for market data
      temperature: needsRealTimeData ? 0.1 : 0.7, // More factual for market data
      presence_penalty: 0.1, // Reduce repetition
      frequency_penalty: 0.1, // Reduce repetition
      top_p: 0.9, // Balanced creativity
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Log successful request (in production, use proper logging service)
    console.log(`KisanMitra API - Success: ${securityCheck.clientIP} - ${validatedData.language}`);

    return NextResponse.json({
      success: true,
      data: {
        response,
        language: validatedData.language,
        dataType: needsRealTimeData ? 'real-time-market' : 'general-advice',
        timestamp: new Date().toISOString(),
        context: validatedData.context || null,
      },
      usage: {
        prompt_tokens: completion.usage?.prompt_tokens,
        completion_tokens: completion.usage?.completion_tokens,
        total_tokens: completion.usage?.total_tokens,
      }
    });

  } catch (error) {
    console.error('KisanMitra API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'KisanMitra API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
} 