const Movie = require('../models/Movie');

exports.getAllMovies = async (req, res) => {
    try {
        const { status, genre } = req.query;
        let query = {};
        if (status) query.status = status;
        if (genre) query.genre = { $in: [genre] };

        const movies = await Movie.find(query).sort({ releaseDate: -1 });
        
        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        
        if (!movie) {
            return res.status(404).json({ success: false, message: "Không tìm thấy phim này" });
        }

        res.status(200).json({ success: true, data: movie });
    } catch (err) {
        res.status(400).json({ success: false, error: "ID phim không hợp lệ" });
    }
};

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        
        res.status(201).json({
            success: true,
            message: "Thêm phim mới thành công",
            data: movie
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};


exports.updateMovie = async (req, res) => {
    try {
        const updates = req.body;

        const movie = await Movie.findByIdAndUpdate(
            req.params.id, 
            updates, 
            {
                new: true,
                runValidators: true
            }
        );

        if (!movie) return res.status(404).json({ success: false, message: "Không tìm thấy phim" });

        res.status(200).json({ success: true, data: movie });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ message: "Không tìm thấy phim" });
        
        res.status(200).json({ success: true, message: "Đã xóa phim thành công" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};