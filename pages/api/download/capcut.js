import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Hanya metode GET yang diizinkan." });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Parameter 'url' diperlukan." });
  }

  try {
    // Mendapatkan token dari URL
    const { request } = await axios.get(url);
    const responseUrl = request.res.responseUrl;
    const tokenMatch = responseUrl.match(/\d+/);

    if (!tokenMatch) {
      throw new Error("Token tidak ditemukan di URL.");
    }

    const token = tokenMatch[0];

    // Menggunakan token untuk mendapatkan data unduhan
    const { data, request: downloadRequest } = await axios({
      url: `https://ssscap.net/api/download/${token}`,
      method: "GET",
      headers: {
        Cookie: "sign=2cbe441f7f5f4bdb8e99907172f65a42; device-time=1685437999515",
      },
    });

    // Mengirim respons dengan data unduhan
    res.status(200).json({
      success: true,
      data,
      downloadUrl: downloadRequest.res.responseUrl,
    });
  } catch (error) {
    res.status(500).json({ error: `Terjadi kesalahan: ${error.message}` });
  }
}
