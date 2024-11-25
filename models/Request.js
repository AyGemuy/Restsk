// models/Request.js
import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

export default mongoose.models.Request || mongoose.model('Request', RequestSchema);