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

  const { fullName, email, username, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      fullName,
      email,
      username,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Send welcome email
    try {
      const logoUrl = 'https://i.ibb.co/wYyBf9g/blazetrade-logo.png'; // A publicly accessible URL for your logo
      const contactEmail = 'support@blazetrade.com';

      const emailHtml = getWelcomeEmailTemplate(fullName, logoUrl, contactEmail);

      await sendEmail({
        email: user.email,
        subject: 'Welcome to BlazeTrade!',
        html: emailHtml,
        from: `BlazeTrade <${contactEmail}>`
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // We don't block the registration process if email fails
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
    console.error(err.message);
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
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
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
    console.error(err.message);
    res.status(500).send('Server error');
  }
};