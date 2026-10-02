import axios from 'axios';
import { resolveTemplate } from '../../utils/helpers';

export const executeGroqNode = async (
    config: {
        prompt: string;
        model?: string;
        maxTokens?: number;
    },
    input: any
): Promise<any> => {
    if (!config.prompt) {
        throw new Error('Prompt is required for Groq node');
    }

    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    const prompt = resolveTemplate(config.prompt, input);

    const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
            model: config.model || 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: config.maxTokens || 1000,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            }
        }
    );

    const content = response.data.choices[0]?.message?.content;

    return {
        response:content,
        model:response.data.model,
        usage:response.data.usage
    }

}