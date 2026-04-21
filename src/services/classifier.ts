import { groq } from './groq';
import { SYSTEM_PROMPT } from '../prompts/system';
import { ClassificationResult } from '../models';

export interface ClassificationResponse extends ClassificationResult {
  promptTokens: number;
  completionTokens: number;
}

export async function classifyTicket(message: string): Promise<ClassificationResponse> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message },
    ],
    temperature: 0.0,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from model');
  }

  return {
    ...JSON.parse(content) as ClassificationResult,
    promptTokens: response.usage?.prompt_tokens || 0,
    completionTokens: response.usage?.completion_tokens || 0,
  };
}