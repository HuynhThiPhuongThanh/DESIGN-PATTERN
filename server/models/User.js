const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  username: { 
    type: String, 
    required: [true, 'Vui lòng nhập họ và tên'], 
    trim: true 
  },

  email: { 
    type: String, 
    required: [true, 'Vui lòng nhập email'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Vui lòng nhập mật khẩu'],
    minlength: 6,
    select: false
  },

 phone: { 
    type: String, 
    required: [true, 'Vui lòng nhập số điện thoại'],
    trim: true 
  },

  avatar: { 
    type: String, 
  },
  role: { 
    type: String, 
    enum: ['ADMIN', 'CUSTOMER'], 
    default: 'CUSTOMER' 
  },
  otp: String,
  otpExpires: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return; 

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);