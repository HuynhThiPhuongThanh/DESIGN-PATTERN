const Showtime = require("../models/Showtime");
const Movie = require("../models/Movie");

exports.getAllShowtimes = async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate("movie", "title posterURL duration")
      .sort({ date: 1, startTime: 1 });
    res.status(200).json({ success: true, data: showtimes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate("movie");

    if (!showtime) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy suất chiếu" });
    }

    res.status(200).json({ success: true, data: showtime });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "ID không hợp lệ hoặc lỗi hệ thống" });
  }
};
exports.createShowtime = async (req, res) => {
  try {
    let { movie, startTime, cinemaRoom, price, format, totalSeats } = req.body;
    const movieInfo = await Movie.findById(movie);
    if (!movieInfo)
      return res.status(404).json({ message: "Không tìm thấy phim" });
    let dateStr, timeStr;
    if (startTime.includes("T")) {
      [dateStr, timeStr] = startTime.split("T");
      timeStr = timeStr.slice(0, 5);
    } else {
      return res
        .status(400)
        .json({ message: "Định dạng thời gian phải là YYYY-MM-DDTHH:mm" });
    }


    const [h, m] = timeStr.split(":").map(Number);
    const duration = movieInfo.duration || 120;
    const totalMinutes = h * 60 + m + duration;
    const endTime = `${Math.floor(totalMinutes / 60) % 24}:${(totalMinutes % 60).toString().padStart(2, "0")}`;

    const rows = ["A", "B", "C", "D"];
    const seatsPerRow = 10;
    const limit = 40;
    const generatedSeats = [];

    for (let i = 0; i < limit; i++) {
      const rIdx = Math.floor(i / seatsPerRow);
      const rowName = rows[rIdx] || "Z";
      const seatNo = (i % seatsPerRow) + 1;

      generatedSeats.push({
        row: rowName,
        number: seatNo,
        seatNumber: `${rowName}${seatNo}`,
        type: "NORMAL",
        isBooked: false,
      });
    }

    const newShowtime = await Showtime.create({
      movie,
      date: dateStr,
      startTime: timeStr,
      endTime,
      cinemaRoom,
      price,
      format,
      seats: generatedSeats,
    });

    res.status(201).json({ success: true, data: newShowtime });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getShowtimesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng cung cấp ngày" });

    const showtimes = await Showtime.find({ date: date })
      .populate("movie")
      .sort({ startTime: 1 });

    res.status(200).json({ success: true, data: showtimes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteShowtime = async (req, res) => {
  try {
    const deleted = await Showtime.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy suất để xóa" });
    res
      .status(200)
      .json({ success: true, message: "Đã xóa suất chiếu thành công" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
