import axios from 'axios';
import { resolveTemplate } from '../../utils/helpers';

export const executeMcpNode = async (
    config: {
        serverUrl: string;
        toolName: string;
        params: Record<string, any>;
    },
    input: any
): Promise<any> => {

    if (!config.serverUrl) {
        throw new Error('Server URL is required for MCP node');
    }
    if (!config.toolName) {
        throw new Error('Tool name is required for MCP node');
    }

    const resolvedParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(config.params || {})) {
        resolvedParams[key] = typeof value === 'string' ? resolveTemplate(value, input) : value;
    }

    const response = await axios.post(
        `${config.serverUrl}/tools/${config.toolName}`,
        { params: resolvedParams },
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );

    return response.data;
}