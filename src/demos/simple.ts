export default {
  name: "Simple",
  schema: {
    // 设置展示组件
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        default: "Chuck",
      },
      lastName: {
        type: "string",
      },
      telephone: {
        type: "string",
        minLength: 10,
      },
      staticArray: {
        type: "array",
        items: [
          {
            type: "string",
          },
          {
            type: "number",
          },
        ],
      },
      singleTypeArray: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            age: {
              type: "number",
            },
          },
        },
      },
      multipleArray: {
        type: "array",
        items: {
          type: "string",
          enum: ["a", "b", "c"],
        },
      },
    },
  },
  uiSchema: {
    // 样式
    title: "A registration form",
    properties: {
      firstName: {
        title: "First name",
      },
      lastName: {
        title: "Last name",
      },
      telephone: {
        title: "Telephone",
      },
    },
  },
  default: {
    // 默认值
    firstName: "Chuck",
    lastName: "Norris",
    telephone: "123",
    staticArray: ["staticArray", 2],
    singleTypeArray: [
      {
        name: "Chuck singleTypeArray",
        age: 75,
      },
    ],
    multipleArray: ["b"],
  },
};
