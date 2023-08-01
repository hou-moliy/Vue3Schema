const Ajv = require("ajv");
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const schema = {
  type: "object",
  properties: {
    foo: { type: "integer" },
    age: { type: "number", minimum: 2 },
    pets: {
      type: "array",
      items: { type: "string" },
    },
    isWorker: { type: "boolean" },
  },
  required: ["foo"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

const data = {
  foo: 1,
  age: 2,
  pets: ["mini", "mimi"],
  isWorker: true,
};

const valid = validate(data);
if (!valid) console.log(validate.errors);
