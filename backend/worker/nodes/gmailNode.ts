import { sendEmail } from '../../utils/email';
import { resolveTemplate } from '../../utils/helpers';

export const executeGmailNode = async (
    config: {
        to: string;
        subject: string;
        body: string;
    },
    input: any
): Promise<any> => {

    if (!config.to) {
        throw new Error('Recipient email address is required for Gmail node');
    }
    if (!config.subject) {
        throw new Error('Email subject is required for Gmail node');
    }
    if (!config.body) {
        throw new Error('Email body is required for Gmail node');
    }

    const to = resolveTemplate(config.to, input);
    const subject = resolveTemplate(config.subject, input);
    const body = resolveTemplate(config.body, input);

    await sendEmail({ to, subject, html: body });

    return { sent: true, to, subject, body };
}