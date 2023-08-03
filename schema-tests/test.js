const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const addKeywords = require("ajv-keywords");
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
addFormats(ajv);
addKeywords(ajv);

// 自定义format
ajv.addFormat("isLaLa", (data) => {
  return data === "lala";
});
// 自定义关键字
ajv.addKeyword("range", {});

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
    email: { type: "string", format: "email" },
    name: { type: "string", format: "isLaLa" },
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
  email: "1337312569@qq.com",
  name: "lala",
};

const valid = validate(data);
if (!valid) console.log(validate.errors);
