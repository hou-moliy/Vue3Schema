/**
 * 分组
 * 布局组件
 * 基础组件
 * 是否组件
 * 单选组件
 * 文件上传
 * 时间日期
 */
export default {
  list: [
    {
      name: "布局组件",
      components: [
        {
          name: "ObjectField",
          type: "layout",
          schema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "ArrayField",
          type: "layout",
          schema: {
            type: "array",
            items: {},
          },
        },
      ],
    },
    {
      name: "基础组件",
      components: [
        {
          name: "StringField",
          schema: {
            type: "string",
          },
        },
        {
          name: "NumberField",
          schema: {
            type: "number",
          },
        },
        // {
        //   name: "BooleanField",
        //   schema: {
        //     type: "boolean",
        //   },
        // },
      ],
    },
    {
      name: "是否组件",
      components: [],
    },
    {
      name: "单选组件",
      components: [],
    },
    {
      name: "文件上传",
      components: [],
    },
    {
      name: "时间日期",
      components: [],
    },
  ],
};
