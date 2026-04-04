/**
 * Authentication Controller
 * Handles user signup, login, and profile management
 */

import User from '../models/User.js';
import { generateJWT } from '../utils/jwt.js';

/**
 * User Registration
 * POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with that email or username'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = generateJWT(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Signup failed'
    });
  }
};

/**
 * User Login
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatched = await user.matchPassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateJWT(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

/**
 * Get User Profile
 * GET /api/auth/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        isPremium: user.isPremium,
        premiumExpiry: user.premiumExpiry,
        totalDownloads: user.totalDownloads,
        totalTokensGenerated: user.totalTokensGenerated,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile'
    });
  }
};

/**
 * Update User Profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        subscription: user.subscription,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

/**
 * Change Password
 * POST /api/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isPasswordMatched = await user.matchPassword(currentPassword);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password'
    });
  }
};

/**
 * Request Email Verification
 * POST /api/auth/request-email-verification
 */
export const requestEmailVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const verificationToken = await user.generateEmailVerificationToken();

    res.status(200).json({
      success: true,
      message: 'Email verification token generated',
      token: verificationToken,
      note: 'In production, this token should be sent via email'
    });
  } catch (error) {
    console.error('Request email verification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to request email verification'
    });
  }
};

/**
 * Verify Email
 * POST /api/auth/verify-email
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findById(req.user._id);
    const isValid = await user.verifyEmailToken(token);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify email'
    });
  }
};

/**
 * Update User Settings
 * PUT /api/auth/settings
 */
export const updateSettings = async (req, res, next) => {
  try {
    const { phone, bio, country, notificationsEnabled, avatarUrl } = req.body;

    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (country !== undefined) updateData.country = country;
    if (notificationsEnabled !== undefined) updateData.notificationsEnabled = notificationsEnabled;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        country: user.country,
        notificationsEnabled: user.notificationsEnabled,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update settings'
    });
  }
};

/**
 * Get Full User Settings
 * GET /api/auth/settings
 */
export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      settings: {
        // Profile Info
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        country: user.country,
        
        // Account Info
        subscription: user.subscription,
        isPremium: user.isPremium,
        premiumExpiry: user.premiumExpiry,
        
        // Activity
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
        
        // Preferences
        notificationsEnabled: user.notificationsEnabled,
        twoFactorEnabled: user.twoFactorEnabled,
        
        // Stats
        totalDownloads: user.totalDownloads,
        totalTokensGenerated: user.totalTokensGenerated
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch settings'
    });
  }
};
