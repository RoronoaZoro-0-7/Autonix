import axios from 'axios';
import { resolveTemplate } from '../../utils/helpers';

export const executeSlackNode = async (
    config: {
        webhookUrl: string;
        message: string;
        channel?: string;
    },
    input: any
): Promise<any> => {
    
    if (!config.webhookUrl) {
        throw new Error('Webhook URL is required for Slack node');
    }

    if (!config.message) {
        throw new Error('Message is required for Slack node');
    }

    const message = resolveTemplate(config.message, input);

    await axios.post(config.webhookUrl, {
        text: message,
        ...(config.channel && { channel: config.channel })
    });

    return { sent: true, message };
}