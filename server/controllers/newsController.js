const News = require('../models/News');


exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); 
    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    req.body.author = req.user.id; 
    
    const newNews = await News.create(req.body);
    res.status(201).json({
      success: true,
      data: newNews
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tức để cập nhật' });
    }

    res.status(200).json({
      success: true,
      data: updatedNews
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin tức' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};