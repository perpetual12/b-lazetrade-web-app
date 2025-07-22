const crypto = require('crypto');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.cjs');
const sendEmail = require('../utils/email.cjs');
const { getWelcomeEmailTemplate, getVerificationEmailTemplate } = require('../utils/welcomeTemplate.js');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    user = new User({
      fullName: username, // Or a separate fullName field if you add it to the form
      email,
      username,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    // Send verification email in the background (fire and forget)
    (async () => {
      const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
      const logoUrl = `${req.protocol}://${req.get('host')}/logo.png`;
      const emailHtml = getVerificationEmailTemplate(user.fullName, verificationUrl, logoUrl);
      try {
        await sendEmail({
          to: user.email,
          subject: 'Verify Your BlazeTrade Account',
          html: emailHtml,
        });
      } catch (err) {
        console.error('Error sending verification email in background:', err);
        // In a real app, you would add this failed job to a queue for retrying
      }
    })();

    res.status(201).json({ 
      msg: 'Registration successful! Please check your email to verify your account.' 
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).send('Server error');
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    console.log('Verification attempt with token:', req.params.token);
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user by token first, without checking expiration
    const user = await User.findOne({ emailVerificationToken: hashedToken });

    if (!user) {
      console.log('Verification Failed: Token not found in database.');
      return res.status(400).json({ msg: 'Invalid verification link.' });
    }

    // Now check if the token has expired
    if (user.emailVerificationTokenExpires < Date.now()) {
      console.log('Verification Failed: Token has expired.');
      return res.status(400).json({ msg: 'Expired verification link. Please request a new one.' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    console.log('Verification successful for user:', user.email);
    res.json({ msg: 'Email verification successful. You can now log in.' });
  } catch (err) {
    console.error('Verification Process Error:', err);
    res.status(500).send('Server error during verification');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: 'Please verify your email address before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).send('Server error');
  }
};