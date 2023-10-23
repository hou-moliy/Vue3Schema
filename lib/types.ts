import { PropType, defineComponent, DefineComponent } from "vue";

export enum SchemaTypes {
  "NUMBER" = "number",
  "INTEGER" = "integer",
  "STRING" = "string",
  "OBJECT" = "object",
  "ARRAY" = "array",
  "BOOLEAN" = "boolean",
}

type SchemaRef = { $ref: string };

// type Schema = any
export interface Schema {
  type?: SchemaTypes | string; // 决定我们如何渲染
  const?: any;
  format?: string;
  title?: string;
  default?: any;
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema | Schema[] | SchemaRef;
  uniqueItems?: any;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  // TODO：uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[];
  enum?: (object | string | number)[]; //  enum支持的类型，对象，字符串，数字 联合类型
  enumNames?: any[];
  enumKeyValue?: any[];
  additionalProperties?: any;
  additionalItems?: Schema;
  minLength?: number;
  maxLength?: number;
  minimun?: number;
  maximum?: number;
  multipleOf?: number;
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
}
// 用于定义组件的props类型
export const FiledPropsDefine = {
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  rootSchema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const; // as const 变成只读

// 定义组件类型
export const TypeHelperComponent = defineComponent({
  props: FiledPropsDefine,
});
// 定义组件类型
export type CommonFieldType = typeof TypeHelperComponent;

// theme相关的定义
// 公共的Widgets的props定义
export const commonWidgetPropsDefine = {
  value: {
    required: true,
  },
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
} as const; // as const 变成只读
//  widget中SelectWidget的props定义
export const selectWidgetPropsDefine = {
  ...commonWidgetPropsDefine,
  options: {
    type: Array as PropType<{ key: string; value: string }[]>,
    required: true,
  },
} as const;
// DefineComponent 和 typeof 的组合 用于定义组件类型
// DefineComponent 和defineComponent的区别是，DefineComponent是一个类型，defineComponent是一个函数
export type SelectionWidgetDefine = DefineComponent<
  typeof selectWidgetPropsDefine
>;
export type CommonWidgetDefine = DefineComponent<
  typeof commonWidgetPropsDefine
>;

export enum SelectionWidgetNames {
  SelectionWidget = "SelectionWidget",
}
export enum CommonWidgetNames {
  TextWidget = "TextWidget",
  NumberWidget = "NumberWidget",
}
export interface Theme {
  widgets: {
    [SelectionWidgetNames.SelectionWidget]: SelectionWidgetDefine;
    [CommonWidgetNames.TextWidget]: CommonWidgetDefine;
    [CommonWidgetNames.NumberWidget]: CommonWidgetDefine;
  };
}
