import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { text } = req.query;
  if (!text) return res.status(400).json({ error: 'Parameter "text" diperlukan' });

  try {
    const url = `https://siputzx-bart.hf.space/?q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('Query processing complete!');
    
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).end(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Error processing query:', error);
    return res.status(500).json({ error: 'Gagal memproses permintaan' });
  }
}
