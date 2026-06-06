// User Model - stores registered users with role-based access
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  // Role determines what features the user can access
  role: {
    type: String,
    enum: ['junior', 'senior', 'mentor'],
    default: 'junior',
  },
  department: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    default: '',
  },
}, { timestamps: true });

// Hash password before saving (Mongoose v8: async pre-hooks don't use next())
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare plain password with hashed
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
