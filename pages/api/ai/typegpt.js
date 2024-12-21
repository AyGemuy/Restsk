// pages/api/chat.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { role, prompt, model, type } = req.query;

        // Validasi input
        if (!role || !prompt || !model || !type) {
            return res.status(400).json({ error: 'Role, prompt, model, and type are required' });
        }

        try {
            let response;

            if (type === '1') {
                // Endpoint pertama
                response = await axios.post(
                    'https://chat.typegpt.net/api/openai/v1/chat/completions',
                    {
                        messages: [
                            { role: role, content: prompt }, // Menggunakan role dan prompt dari query
                        ],
                        stream: true,
                        model: model,
                        temperature: 0.5,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                        top_p: 1
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'accept': 'text/event-stream',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
                            'Referer': 'https://chat.typegpt.net/?utm_source=typegpt/#/chat'
                        },
                        responseType: 'stream'
                    }
                );
            } else if (type === '2') {
                // Endpoint kedua
                response = await axios.post(
                    'https://niansuhai-chat.hf.space/api/openai/v1/chat/completions',
                    {
                        messages: [
                            {
                                role: 'system',
                                content: `You are ChatGPT, a large language model trained by OpenAI.\nKnowledge cutoff: 2023-10\nCurrent model: ${model}\nCurrent time: ${new Date().toString()}\nLatex inline: \\(x^2\\) \nLatex block: $$e=mc^2$$`
                            },
                            { role: role, content: prompt }
                        ],
                        stream: true,
                        model: model,
                        temperature: 0.5,
                        presence_penalty: 0,
                        frequency_penalty: 0,
                        top_p: 1,
                        max_tokens: 4000
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'accept': 'text/event-stream',
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
                            'Referer': 'https://niansuhai-chat.hf.space/#/chat'
                        },
                        responseType: 'stream'
                    }
                );
            } else {
                return res.status(400).json({ error: 'Invalid type parameter. Use 1 or 2.' });
            }

            let fullResponse = '';

            // Mengalirkan data dari API eksternal dan memprosesnya
            response.data.on('data', (chunk) => {
                const chunkString = chunk.toString();
                // Memisahkan setiap bagian data
                const messages = chunkString.split('\n').filter(line => line.startsWith('data: '));

                messages.forEach(message => {
                    const jsonData = message.replace('data: ', '').trim();

                    if (jsonData === '[DONE]') {
                        // Jika kita menerima [DONE], kita bisa mengakhiri pengumpulan data
                        res.status(200).json({ result: fullResponse });
                    } else {
                        try {
                            const parsedData = JSON.parse(jsonData);
                            const content = parsedData.choices[0].delta.content;
                            fullResponse += content; // Mengumpulkan konten
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                });
            });

            response.data.on('end', () => {
                // Jika stream berakhir tanpa [DONE], kirim respons
                if (fullResponse) {
                    res.status(200).json({ response: fullResponse });
                }
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            res.status(error.response ? error.response.status : 500).json({ error: 'Error fetching data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}