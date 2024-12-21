import soycanvas from 'soycanvas';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username = 'wudy', avatarUrl = 'https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-girl-with-red-eyes-in-anime-style-backdrop-poster-head-photo-image_49274352.jpg', status = 'offline', level = 2, rank = 1, currentXp = 100, requiredXp = 400, background = 'https://png.pngtree.com/thumb_back/fw800/background/20240911/pngtree-surreal-moonlit-panorama-pc-wallpaper-image_16148136.jpg', borderColor = '#fff' } = req.query;

    if (!username || !avatarUrl) return res.status(400).json({ error: 'Missing required parameters' });

    try {
      const rankImage = await new soycanvas.Rank()
        .setAvatar(avatarUrl)
        .setBackground('image', background)
        .setUsername(username)
        .setBorder(borderColor)
        .setStatus(status)
        .setLevel(level)
        .setRank(rank)
        .setCurrentXp(currentXp)
        .setRequiredXp(requiredXp)
        .build();

      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(rankImage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate rank image' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
