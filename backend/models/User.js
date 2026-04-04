const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, 'Naam zaroori hai'],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, 'Email zaroori hai'],
      unique:    true,
      lowercase: true,
    },
    password: {
      type:      String,
      required:  [true, 'Password zaroori hai'],
      minlength: [6, 'Password 6 characters ka hona chahiye'],
      select:    false,
    },
    role: {
      type:    String,
      enum:    ['user', 'admin', 'investigator'],
      default: 'user',
    },
    phone:    { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Save se pehle password hash karo
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password match karne ka method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);