const { Router } = require("@desaubv/quik");
const { Status, Validator, ValidationException } = require("@desaubv/quik/http");
const router = Router();

router.get((req, res) => {
    res
        .status(Status.OK)
        .send("Test");
})

router.post((req, res) => {
    function ageValidator(value) {
        console.log("Entre al validator");
        
        if(value < 0) return undefined;
        return value;
    }    

    const body = Validator.body(req.body, {
        "name": {
            type: String,
            required: true
        },
        "age": {
            type: Number,
            required: false,
            validator: ageValidator
        },
        "lorem": {
            type: [Number],

        }
    })

    res.json(body);
    
})

module.exports = router;