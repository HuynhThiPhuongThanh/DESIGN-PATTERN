const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Tiêu đề tin tức là bắt buộc'], 
    trim: true 
  },
  slug: { 
    type: String, 
    unique: true 
  }, 
  summary: { 
    type: String, 
    required: [true, 'Tóm tắt ngắn gọn là bắt buộc'] 
  },
  content: { 
    type: String, 
    required: [true, 'Nội dung chi tiết là bắt buộc'] 
  },
  category: { 
    type: String, 
    enum: ['PROMOTION', 'CINE_NEWS', 'EVENT'], 
    default: 'CINE_NEWS' 
  },
  imageURL: { 
    type: String, 
    required: [true, 'Ảnh đại diện tin tức là bắt buộc'] 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, 
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


newsSchema.pre('save', function(next) {
  if (this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  next();
});

module.exports = mongoose.model('News', newsSchema);