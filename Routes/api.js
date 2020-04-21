const express = require("express");
const router = express.Router();

router.post("/register", (req, res) => {
    res.json({
        name: {
            firstname: lastname,
        },
        school: {
            school,
        },
        programme: {
            programme,
        },
        email: {
            email,
        },
    });

    console.log(req.body);
});

module.exports = router;