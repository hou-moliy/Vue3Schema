export default {
  name: "Simple",
  schema: {
    // 设置展示组件
    description: "A simple form example.",
    type: "number",
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
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed",
  },
};
