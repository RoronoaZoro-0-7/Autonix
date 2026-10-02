import { resolveTemplate } from '../../utils/helpers';

export const executeConditionalNode = async (
    config: {
        condition: string; // eg : input.score > 50
        operator: 'AND' | 'OR';
    },
    input: any
): Promise<{ result: boolean }> => {
    if (!config.condition) {
        throw new Error('Condition is required for Conditional node');
    }

    const condition = resolveTemplate(config.condition, input);

    // safely evaluate the condition
    try {
        const result = Function(`"use strict"; return (${condition})`)();
        return { result: Boolean(result) };
    } catch {
        throw new Error(`Conditional node: invalid condition "${condition}"`);
    }

}