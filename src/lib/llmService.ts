import OpenAI from "openai";

export default class LLMService {
    apiKey: string;
    apiUrl: string;
    model: string;
    provider: string;
    systemPrompt: string;

    constructor({
        apiKey,
        apiUrl,
        model,
        provider,
        systemPrompt,
    }: {
        apiKey?: string;
        apiUrl?: string;
        model?: string;
        provider?: string;
        systemPrompt?: string;
    } = {}) {
        this.apiKey = apiKey || import.meta.env.API_KEY;
        this.apiUrl = apiUrl || import.meta.env.API_URL;
        this.model = model || import.meta.env.MODEL;
        this.provider = provider || import.meta.env.LLM_PROVIDER;
        this.systemPrompt = systemPrompt || "You are a helpful assistant.";
    }

    get client(): OpenAI {
        if (this.provider === "openai") {
            return new OpenAI({
                apiKey: this.apiKey,
            });
        }
        return new OpenAI({
            apiKey: this.apiKey,
            baseURL: this.apiUrl,
        });
    }

    async chatCompletion(userPrompt: string): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: this.model || "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: this.systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
        });
        return response.choices[0]?.message.content || "";
    }
}