import axios from "axios";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed. Use GET." });
    }

    const { prompt = "Hello", model = "gpt-4o-mini" } = req.query;

    const validModels = ["gpt-3.5-turbo", "gpt-3.5-turbo-0125", "gpt-4o-mini", "gpt-4o"];
    if (!validModels.includes(model)) {
        return res.status(400).json({ error: `Invalid model! Choose one of: ${validModels.join(", ")}` });
    }

    const payload = {
        messages: [{ role: "user", content: prompt }],
        model,
    };

    try {
        const response = await axios.post(
            "https://mpzxsmlptc4kfw5qw2h6nat6iu0hvxiw.lambda-url.us-east-2.on.aws/process",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Postify/1.0.0",
                },
            }
        );

        return res.status(200).json({ result: response.data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
