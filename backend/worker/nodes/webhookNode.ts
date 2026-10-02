export const executeWebhookNode = async (
    config: any,
    input: any
): Promise<any> => {
    // webhook node just passes trigger data
    //  forward. Input is already the webhook 
    // payload from the trigger
    return {
        headers: input.headers,
        body: input.body,
        query: input.query,
        receivedAt: new Date().toISOString(),
    }
}