const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginWithFirebase = async (req, res) => {
  try {
    const { email, name, oauthProviderId } = req.body;

    if (!email || !oauthProviderId) {
      return res
        .status(400)
        .json({ error: "Missing email or OAuth provider ID" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, name, oauthProviderId });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    return res.status(200).json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

module.exports = {
  loginWithFirebase,
};
