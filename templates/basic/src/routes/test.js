const { Router } = require("@desaubv/quik");
const { Status, Validator, ValidationException, Types } = require("@desaubv/quik/http");
const router = Router();

router.get((req, res) => {
    res
        .status(Status.OK)
        .send("Test");
});

router.post((req, res) => {
    function ageValidator(value) {
        if (value < 0) throw new ValidationException("Age must be greater os equial than 0");
        return value;
    }

    const body = Validator.body(req.body, {
        "name": {
            type: [Types.Null, Types.String],
            required: true
        },
        "age": {
            type: Types.Int,
            required: true,
            validator: ageValidator
        },
        "status": {
            type: Types.Array(Types.Int, Types.Boolean).canBeEmpty(),
            required: true
        },
        "user": {
            type: Types.Struct({
                "name": {
                    type: [Types.Null, Types.String],
                    required: true
                },
                "age": {
                    type: Types.Int,
                    required: true,
                    validator: ageValidator
                }
            }),
            required: true
        }
    });

    res.json(body);
});

module.exports = router;