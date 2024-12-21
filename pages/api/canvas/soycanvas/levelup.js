import soycanvas from 'soycanvas';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { avatarUrl = 'https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-girl-with-red-eyes-in-anime-style-backdrop-poster-head-photo-image_49274352.jpg', backgroundUrl = 'https://png.pngtree.com/thumb_back/fw800/background/20240911/pngtree-surreal-moonlit-panorama-pc-wallpaper-image_16148136.jpg', username = 'wudy', borderColor = '#000000', avatarBorderColor = '#ff0000', overlayOpacity = 0.7, currentLevel = 55, nextLevel = 56 } = req.query;

    if (!avatarUrl || !backgroundUrl || !username) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const levelUpImage = await new soycanvas.LevelUp()
        .setAvatar(avatarUrl)
        .setBackground('image', backgroundUrl)
        .setUsername(username)
        .setBorder(borderColor)
        .setAvatarBorder(avatarBorderColor)
        .setOverlayOpacity(overlayOpacity)
        .setLevels(currentLevel, nextLevel)
        .build();

      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(levelUpImage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate level-up image' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}