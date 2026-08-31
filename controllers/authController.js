import User from '../models/User.js';
import { logAudit } from '../utils/auditLog.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from '../utils/emailService.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

// Token Generator Helper
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new public/student account
// @route   POST /api/auth/register
// @access  Public
// NOTE: role is intentionally never taken from the request body here.
// Every account created through this public endpoint is a 'user'
// (student). Admin and teacher accounts must be created by an existing
// admin through the protected /api/auth/create-staff route.
export const registerUser = async (req, res) => {
  try {
    const { username, name, email, password, phone } = req.body;

    const userIdentifier = (username || name || email || '').trim();

    const userExists = await User.findOne({
      $or: [{ email }, { username: userIdentifier }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists with this email or username' });
    }

    const user = await User.create({
      username: userIdentifier,
      name: name || '',
      email,
      password, // hashed automatically by the User model's pre-save hook
      phone: phone || '',
      role: 'user',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// @desc    Create a staff account (admin or teacher)
// @route   POST /api/auth/create-staff
// @access  Private/Admin only
export const createStaffUser = async (req, res) => {
  try {
    const { username, name, email, password, phone, role } = req.body;

    if (!['admin', 'teacher'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be admin or teacher' });
    }

    const userIdentifier = (username || name || email || '').trim();

    const userExists = await User.findOne({
      $or: [{ email }, { username: userIdentifier }],
    });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists with this email or username' });
    }

    const user = await User.create({
      username: userIdentifier,
      name: name || '',
      email,
      password, // hashed automatically by the User model's pre-save hook
      phone: phone || '',
      role,
    });

    await logAudit(req, 'staff.create', `Created ${role} account for ${email} (${userIdentifier})`);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create staff account' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email/username and password' });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { username: loginIdentifier }],
    }).select('+password');

    // Generic message on every failure path below so we never reveal
    // whether the account exists.
    const invalidMsg = { success: false, message: 'Invalid email or password' };

    if (!user) {
      return res.status(401).json(invalidMsg);
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account temporarily locked due to repeated failed logins. Try again in ${minutesLeft} minute(s).`,
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.loginAttempts = 0;
      }
      await user.save();
      return res.status(401).json(invalidMsg);
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been disabled' });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username || user.email,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        token: generateToken(user._id, user.role),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load profile' });
  }
};

// @desc    Update own profile (name, phone, avatar only — never role or
//          password through this route).
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (phone !== undefined) update.phone = phone;
    if (avatar !== undefined) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Could not update profile' });
  }
};

// @desc    List staff accounts (admins and teachers) for the admin's user
//          management screen.
// @route   GET /api/auth/staff
// @access  Private/Admin
export const getStaffUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'teacher'] } }).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load staff list' });
  }
};

// @desc    Activate or deactivate a staff account
// @route   PUT /api/auth/staff/:id/status
// @access  Private/Admin
export const setStaffActiveStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be true or false' });
    }
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await logAudit(req, 'staff.status', `${isActive ? 'Enabled' : 'Disabled'} account for ${user.email}`);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Could not update account status' });
  }
};

// @desc    Request a password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  // Always respond with the same generic success message whether or not
  // the email exists, so this endpoint can't be used to enumerate
  // registered accounts.
  const genericResponse = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  };

  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return res.status(200).json(genericResponse);
    }

    // Generate a raw token to email the user, but only ever persist its
    // SHA-256 hash — a database read alone can never be used to reset
    // the account.
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Jothi Classical Dancing Academy',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #141414;">
            <h2 style="color: #831843;">Password Reset Request</h2>
            <p>Namaste ${user.name || user.username},</p>
            <p>We received a request to reset your password. Click the link below to choose a new one. This link expires in 30 minutes.</p>
            <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#BE185D;color:#FEF08A;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email — your password will remain unchanged.</p>
            <p style="margin-top:24px;">Regards,<br/>Jothi Classical Dancing Academy</p>
          </div>
        `,
      });
    } catch (mailError) {
      // Roll back the token if we couldn't actually deliver it, so a
      // stale unusable token isn't left sitting on the account.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('[Password Reset Email Error]:', mailError.message);
      return res.status(500).json({ success: false, message: 'Could not send reset email. Please try again later.' });
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    res.status(200).json(genericResponse);
  }
};

// @desc    Reset password using a valid emailed token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired.' });
    }

    user.password = password; // hashed by the pre('save') hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not reset password. Please try again.' });
  }
};
