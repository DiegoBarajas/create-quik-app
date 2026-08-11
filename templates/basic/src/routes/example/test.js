const { Router } = require("@desaubv/quik");
const router = Router();

router.get((req, res) => {
    res.send("TESTS");
})

module.exports = router;