// const express = require('express');
// const User = require('../models/User');
// const authMiddleware = require('../middleware/authMiddleware');
// const router = express.Router();

// // Get user details
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/user/visit
router.post('/visit', async (req, res) => {
  const { userId, name, photo } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Avoid duplicates (optional)
    const alreadyVisited = user.placesVisited.some(
      (place) => place.name === name
    );

    if (!alreadyVisited) {
      user.placesVisited.push({ name, photo });
      user.score+=1000;
      await user.save();
    }

    res.status(200).json({ message: 'Place marked as visited' });
  } catch (err) {
    console.error('Error marking place as visited:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// routes/user.js
router.get("/visited-places/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("placesVisited");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ placesVisited: user.placesVisited });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// routes/user.js or leaderboard.js
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find({})
      .select("email score -_id")
      .sort({ score: -1 });

    res.json({ success: true, users });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



module.exports = router;
