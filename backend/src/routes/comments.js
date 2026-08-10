const express = require("express");
const authentification = require("../middleware/authentification");
const Comment = require("../models/comment");

const router = new express.Router();

router.get("/comments/:locationId", async (req, res) => {
  const locationId = Number(req.params.locationId);

  if (Number.isNaN(locationId)) {
    return res.status(400).send({ error: "locationId invalide" });
  }

  try {
    const comments = await Comment.find({ locationId }).sort({ createdAt: -1 });
    res.send({ locationId, comments });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/comments", authentification, async (req, res) => {
  const locationId = Number(req.body.locationId);
  const content = (req.body.content || "").trim();

  if (Number.isNaN(locationId)) {
    return res.status(400).send({ error: "locationId invalide" });
  }

  if (!content) {
    return res.status(400).send({ error: "Le commentaire ne peut pas être vide." });
  }

  try {
    const comment = new Comment({
      locationId,
      author: req.device.username,
      content
    });

    await comment.save();
    res.status(201).send({ comment });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;