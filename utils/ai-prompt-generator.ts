import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Options for generating the next prompt
 */
export interface PromptGeneratorOptions {
  chatbotResponse: string;
  initialPrompt: string;
  writingStyle?: string | string[];
  extrasPreference?: string | string[];
  personalityGuide?: string | string[];
  scenarioContext?: string | string[];
  bookingRequirements?: string;
  allowBooking?: boolean;
  banSeatChange?: boolean;
  fallback?: string;
}

// Initialize OpenAI client (can be configured via env)
const getClient = (): OpenAI => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

/**
 * Generate the next customer prompt based on chatbot response
 * Uses OpenAI GPT-4o-mini to simulate realistic customer behavior
 */
export async function generateNextPrompt(options: PromptGeneratorOptions): Promise<string> {
  const {
    chatbotResponse,
    initialPrompt,
    writingStyle,
    extrasPreference,
    personalityGuide,
    scenarioContext,
    bookingRequirements,
  } = options;

  const client = getClient();

  const systemPrompt = `
You are simulating a customer interacting with a booking chatbot.
Follow these rules:
- Writing style: ${writingStyle || 'neutral'}
- Personality: ${personalityGuide || 'friendly and cooperative'}
- Extras preference: ${extrasPreference || 'accept only if useful'}
- Booking requirements: ${bookingRequirements || 'no specific requirements'}
- Scenario context: ${scenarioContext || 'standard booking'}

Generate the next question or statement the customer would say
in order to progress the booking process.
Make sure it flows naturally from the chatbot's last message.
`;

  const userPrompt = `
Previous chatbot reply:
"${chatbotResponse}"

Original initial prompt:
"${initialPrompt}"

Now, respond with the next prompt the customer should say.
Return ONLY the next message, nothing else.

Important rules:
- NEVER use placeholders like [insert …], [your name], [your age], [details], etc.
- ALWAYS generate realistic customer data when details are needed.
- Example:
    Instead of "[Your Name]" → "John Doe"
    Instead of "[Your Age]" → "34"
    Instead of "[Flight details]" → "BA452 arriving at Heathrow (LHR)"
- Keep responses natural, like a real human customer would type.
- Each response should be a single coherent message from the customer.
`;

  try {
    console.log('Generating AI prompt...');
    const startTime = Date.now();
    
    const completion = await Promise.race([
      client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('AI generation timeout after 30s')), 30_000)
      )
    ]);

    const aiResponse = completion.choices[0]?.message?.content?.trim() || '';
    const duration = Date.now() - startTime;
    console.log(`AI prompt generated in ${duration}ms`);
    return aiResponse;
  } catch (error) {
    console.error('Error generating next prompt:', error);
    // Fallback to a generic response
    return options.fallback || 'Yes, please proceed.';
  }
}

export default generateNextPrompt;

