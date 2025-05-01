const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST /api/quiz/submit-score/:userId
router.post("/submit-score/:userId", async (req, res) => {
  const { userId } = req.params;
  const { scoreChange } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false });

    user.score = (user.score || 0) + scoreChange;
    await user.save();

    res.json({ success: true, updatedScore: user.score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
