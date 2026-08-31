import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    // Role-based access control: admin (full access), teacher (limited
    // classes/students/events access), user (student/public account).
    role: {
      type: String,
      enum: ['admin', 'teacher', 'user'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    // Password reset flow: we store only a SHA-256 hash of the raw token
    // that gets emailed to the user, never the token itself, so a
    // database leak alone can't be used to reset an account.
    resetPasswordToken: {
      type: String,
      select: false,
      default: undefined,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
      default: undefined,
    },
  },
  { timestamps: true }
);

userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Single source of truth for password hashing: any code path that sets
// `password` and calls .save()/.create() gets it hashed here exactly once,
// so callers should never hash the password themselves before this point.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
