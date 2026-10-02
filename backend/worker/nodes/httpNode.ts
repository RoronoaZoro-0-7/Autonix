import axios from 'axios';
import { resolveTemplate } from '../../utils/helpers';

export const executeHttpNode = async (
    config: {
        url: string;
        method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        headers?: Record<string, string>;
        body?: any;
    },
    input: any
): Promise<any> => {
    if (!config.url) {
        throw new Error('URL is required for HTTP node');
    }
    if (!config.method) {
        throw new Error('HTTP method is required for HTTP node');
    }

    const url = resolveTemplate(config.url, input);
    const response = await axios({
        method: config.method,
        url,
        headers: config.headers,
        data: config.body ? resolveTemplate(JSON.stringify(config.body), input) : undefined
    });

    return {
        status: response.status,
        data: response.data,
        headers: response.headers,
    };
}