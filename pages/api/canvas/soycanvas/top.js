import soycanvas from 'soycanvas';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { topData = [], background = 'https://png.pngtree.com/thumb_back/fw800/background/20240911/pngtree-surreal-moonlit-panorama-pc-wallpaper-image_16148136.jpg', opacity = 0.6, scoreMessage = 'Message:', abbreviateNumber = false, colors = {} } = req.query;

    const usersData = topData.length ? JSON.parse(topData) : [
      { top: 1, avatar: "https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-girl-with-red-eyes-in-anime-style-backdrop-poster-head-photo-image_49274352.jpg", tag: "Beş#0005", score: 5555 },
      { top: 2, avatar: "https://png.pngtree.com/thumb_back/fw800/background/20230117/pngtree-girl-with-red-eyes-in-anime-style-backdrop-poster-head-photo-image_49274352.jpg", tag: "Lulushu#1337", score: 1337 },
    ];

    try {
      const topImage = await new soycanvas.Top()
        .setOpacity(opacity)
        .setScoreMessage(scoreMessage)
        .setAbbreviateNumber(abbreviateNumber)
        .setBackground('image', background)
        .setColors(colors)
        .setUsersData(usersData)
        .build();

      res.setHeader('Content-Type', 'image/png');
      res.status(200).send(topImage);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate top image' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}