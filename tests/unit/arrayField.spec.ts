import { mount } from "@vue/test-utils";
import {
  NumberField,
  StringField,
  ArrayField,
  SelectionWidget,
} from "../../lib";
import themeDefault from "../../lib/theme-default";
import TestComponent from "./utils/TestComponent";

describe("arrayField", () => {
  it("正常渲染多类型的数组", () => {
    let val: { name: string; age: number }[] = [
      {
        name: "hyz",
        age: 18,
      },
    ];

    const wrapper = mount(TestComponent, {
      props: {
        schema: {
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
        rootSchema: {},
        value: val,
        onChange: (v) => {
          console.log("v", v);
          val = v;
        },
        theme: themeDefault as any,
      },
    });
    const arrField = wrapper.findComponent(ArrayField);
    const strField = wrapper.findComponent(StringField);
    const numField = wrapper.findComponent(NumberField);
    expect(Array.isArray(arrField.props("schema").items)).toBe(true);
    expect(arrField.exists()).toBeTruthy();
    expect(strField.exists()).toBeTruthy();
    expect(numField.exists()).toBeTruthy();
  });
  it("正常渲染单一类型的数组", () => {
    let val: string[] = ["str", "1"];
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: "array",
          items: {
            type: "string",
          },
        },
        rootSchema: {},
        value: val,
        onChange: (v) => {
          console.log("v", v);
          val = v;
        },
        theme: themeDefault as any,
      },
    });
    const arrField = wrapper.findComponent(ArrayField);
    const strField = wrapper.findComponent(StringField); // findComponent返回第一个匹配的 Vue 组件的
    const strVal = wrapper.findAllComponents(StringField); // findAllComponents为所有匹配的 Vue 组件返回一个数组
    expect(arrField.exists()).toBeTruthy();
    expect(strField.exists()).toBeTruthy();
    expect(Array.isArray(arrField.props("schema").items)).toBe(false);
    expect(strVal.length).toBe(2);
    arrField.props("onChange")(["3"]);
    expect(val.length).toBe(1);
    expect(val[0]).toBe("3");
  });
  it("正常渲染选择类型的数组（有可选值）", () => {
    let val: string[] = ["a"];
    const wrapper = mount(TestComponent, {
      props: {
        schema: {
          type: "array",
          items: {
            type: "string",
            enum: ["a", "b", "c"],
          },
        },
        rootSchema: {},
        value: val,
        onChange: (v) => {
          console.log("v", v);
          val = v;
        },
        theme: themeDefault as any,
      },
    });
    const arrField = wrapper.findComponent(ArrayField);
    const selectField = wrapper.findComponent(SelectionWidget); // findComponent返回第一个匹配的 Vue 组件的
    expect(arrField.exists()).toBeTruthy();
    expect(selectField.exists()).toBeTruthy();
    arrField.props("onChange")(["c"]);
    expect(val[0]).toBe("c");
  });
});
