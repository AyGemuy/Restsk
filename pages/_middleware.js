// pages/_middleware.js
import connectMongo from '../lib/mongoose';
import Visitor from '../models/Visitor';
import Request from '../models/Request';

export async function middleware(req) {
  await connectMongo();

  const path = req.nextUrl.pathname;

  if (path === '/') {
    // Tambah visitor count jika mengakses homepage
    await Visitor.findOneAndUpdate(
      { _id: 'visitor' },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } else if (path.startsWith('/api/')) {
    // Tambah request count jika mengakses API
    await Request.findOneAndUpdate(
      { _id: 'request' },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  }
}