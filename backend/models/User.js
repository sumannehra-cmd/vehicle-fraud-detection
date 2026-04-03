const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naam zaroori hai'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email zaroori hai'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password zaroori hai'],
    minlength: [6, 'Password kam se kam 6 characters ka hona chahiye'],
    select: false,  // password by default nahi aayega queries mein
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'investigator'],
    default: 'user',
  },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });  // createdAt aur updatedAt auto set hoga

// Save karne se pehle password hash karo
userSchema.pre('save', async function (next) {
  // Agar password change nahi hua toh skip karo
  if (!this.isModified('password')) return next();
  // 12 rounds ka hash banao
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password check karne ka method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);