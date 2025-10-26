const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { cloudinaryUpload } = require("../services/cloudinaryService");

const userRegister = async (req, res) => {
  const { name, email, phoneNumber, password, gender, age, city } = req.body;
  try {
    const user = await userModel.create({
      name,
      email,
      phoneNumber,
      gender,
      age,
      city,
      password: await bcrypt.hash(password, 10),
    });
    // const { subject, text } = clientRegisterEmail(
    //   client[0].name,
    //   client[0].email,
    //   password
    // );

    if (req.file) {
      const cloudinaryUrl = await cloudinaryUpload(
        `public/users/${user._id}/profile-picture`,
        req.file
      );
      user.profilePicture = cloudinaryUrl;
      await user.save();
    }

    res.status(201).send({
      message: `User created successfully`,
      userId: user._id,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", gender } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // case-insensitive search
    }

    if (gender) {
      filter.gender = gender;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      userModel
        .find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      userModel.countDocuments(filter),
    ]);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// GET /users/stats
// GET /users/stats?view=day
// GET /users/stats?view=week
// GET /users/stats?view=month
const getUserStats = async (req, res) => {
  try {
    const { view = "day" } = req.query;

    let startDate, endDate;

    // End = current time
    endDate = new Date();

    if (view === "day") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // today start
    } else if (view === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // last 7 days
      startDate.setHours(0, 0, 0, 0);
    } else if (view === "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1); // last 30 days
      startDate.setHours(0, 0, 0, 0);
    } else {
      return res.status(400).json({ message: "Invalid view parameter" });
    }

    const [totalUsers, rangeUsers, maleCount, femaleCount] = await Promise.all([
      userModel.countDocuments(), // all time total
      userModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      }), // filtered range
      userModel.countDocuments({
        gender: "male",
        createdAt: { $gte: startDate, $lte: endDate },
      }),
      userModel.countDocuments({
        gender: "female",
        createdAt: { $gte: startDate, $lte: endDate },
      }),
    ]);

    res.status(200).json({
      view,
      startDate,
      endDate,
      totalUsers,
      rangeUsers,
      maleCount,
      femaleCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// DELETE /users/:id
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      userId: id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  userRegister,
  getUsers,
   getUserStats,
  getUserById,
  deleteUserById,
 
};
