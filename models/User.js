// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ipAddress: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User ', UserSchema);