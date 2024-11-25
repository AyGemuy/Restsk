// pages/api/auth/signup.js
import connectMongo from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    const { email, password } = req.query;

    // Ambil alamat IP pengguna
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Cek apakah pengguna sudah ada berdasarkan email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'User  already exists with this email' });
    }

    // Cek apakah pengguna sudah ada berdasarkan alamat IP
    const existingUserByIP = await User.findOne({ ipAddress });
    if (existingUserByIP) {
      return res.status(400).json({ message: 'User  already exists with this IP address' });
    }

    // Simpan pengguna baru dengan alamat IP
    const newUser  = new User({ email, password, ipAddress });

    try {
      await newUser.save();
      res.status(201).json({ message: 'User  created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}