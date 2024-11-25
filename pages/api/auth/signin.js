// pages/api/auth/signin.js
import connectMongo from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    const { email, password } = req.query;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validasi password dalam bentuk plaintext
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token or set session here (optional)
    res.status(200).json({ message: 'Sign in successful' });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}