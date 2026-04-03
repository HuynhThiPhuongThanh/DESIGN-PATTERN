const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  director: { type: String },
  cast: [String],
  genre: [String], 
  duration: { type: Number, required: true }, 
  releaseDate: { type: Date, required: true },
  language: { type: String, default: 'Tiếng Việt' },
  

  posterURL: { type: String, required: true }, 
  bannerURL: { type: String },
  trailerURL: { type: String }, 
  

  status: { 
    type: String, 
    enum: ['IS_SHOWING', 'COMING_SOON', 'END_SHOW'], 
    default: 'COMING_SOON' 
  },
  
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);