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
      groupName: "布局组件",
      componentList: [
        {
          title: "ObjectField",
          type: "layout",
          schema: {
            type: "object",
            properties: {},
          },
        },
        {
          title: "ArrayField",
          type: "layout",
          children: [],
          schema: {
            type: "array",
            items: {},
          },
        },
      ],
    },
    {
      groupName: "基础组件",
      componentList: [
        {
          title: "StringField",
          schema: {
            type: "string",
          },
        },
        {
          title: "NumberField",
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
      groupName: "是否组件",
      componentList: [],
    },
    {
      groupName: "单选组件",
      componentList: [],
    },
    {
      groupName: "文件上传",
      componentList: [],
    },
    {
      groupName: "时间日期",
      componentList: [],
    },
  ],
};
