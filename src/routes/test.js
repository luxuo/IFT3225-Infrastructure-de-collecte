const express = require("express");
const router = new express.Router();


// READ
router.get("/test", async (req, res) => {
    return res.status(200)
});

module.exports = router