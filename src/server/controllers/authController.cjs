const User = require('../models/User.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/email.cjs');
const getWelcomeEmailTemplate = require('../utils/welcomeTemplate.js');

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

    await user.save();

    // Send welcome email
    try {
      const logoUrl = 'https://i.ibb.co/wYyBf9g/blazetrade-logo.png';
      const contactEmail = 'support@blazetrade.com';
      const emailHtml = getWelcomeEmailTemplate(user.fullName, logoUrl, contactEmail);

      await sendEmail({
        email: user.email,
        subject: 'Welcome to BlazeTrade!',
        html: emailHtml,
        from: `BlazeTrade <${contactEmail}>`
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
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
    console.error('Signup Error:', err);
    res.status(500).send('Server error');
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