const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const cookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: 'lax',
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, collegeId, department } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({
      name,
      email,
      password,
      role: role === 'organizer' ? 'organizer' : 'student',
      collegeId,
      department,
    });

    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);
    res.status(200).json({ success: true, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out' });
};

exports.me = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};
