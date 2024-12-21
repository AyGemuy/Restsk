import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed. Use GET." });
    }

    const {
        prompt = "Hello",
        model = "blackbox",
        token = "00f37b34-a166-4efb-bce5-1312d87f2f94",
        role = "user",
        id = "00f37b34-a166-4efb-bce5-1312d87f2f94",
    } = req.query;

    const data = {
        messages: [{ role, content: prompt, id }],
        id,
        previewToken: null,
        userId: null,
        codeModelMode: true,
        agentMode: {},
        trendingAgentMode: {},
        isMicMode: false,
        userSystemPrompt: null,
        maxTokens: parseInt(token, 10),
        playgroundTopP: null,
        playgroundTemperature: null,
        isChromeExt: false,
        githubToken: "",
        clickedAnswer2: false,
        clickedAnswer3: false,
        clickedForceWebSearch: false,
        visitFromDelta: false,
        mobileClient: false,
        userSelectedModel: model,
        validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
        imageGenerationMode: false,
        webSearchModePrompt: false,
        deepSearchMode: false,
    };

    try {
        const response = await axios.post("https://api.blackbox.ai/api/chat", data, {
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
                Referer: `https://www.blackbox.ai/chat/${id}`,
            },
        });

        return res.status(200).json({ result: response.data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
