import { PropType, defineComponent, DefineComponent } from "vue";
import { ErrorSchema } from "./validator";
import { FormatDefinition, SchemaCxt, KeywordDefinition } from "ajv";
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
  default?: any; // 默认值
  properties?: {
    [key: string]: Schema;
  };
  items?: Schema | Schema[] | SchemaRef;
  uniqueItems?: any;
  customValidate?: (data: any, target: any) => void;
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef;
  };
  oneOf?: Schema[];
  anyOf?: Schema[];
  allOf?: Schema[];
  // TODO：uiSchema
  // vjsf?: VueJsonSchemaConfig
  uiSchema?: any;
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
  uiSchema: {
    type: Object as PropType<UISchema>,
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
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
  inline: {
    type: Boolean as PropType<boolean>,
    default: false,
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
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  options: {
    // 任意的属性都可以写这个里面
    type: Object as PropType<{ [key: string]: any }>,
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
export type UISchema = {
  widget?: string | CommonWidgetDefine; // string是为了兼容内置的widget组件名称，CommonWidgetDefine是为了兼容自定义的组件
  properties?: {
    [key: string]: UISchema; // 递归
  };
  items?: UISchema | UISchema[];
} & {
  [key: string]: any;
}; // 表示除了上面我们写的widget,properties,items之外的其他属性都可以写

export interface CustomFormat {
  name: string;
  definition: FormatDefinition<string | number>; // FormatDefinition是ajv中的一个类型,表示一个格式化的定义 https://ajv.js.org/guide/formats.html#custom-formats
  component: CommonWidgetDefine;
}

interface VjsfKeywordDefinition {
  keyword?: string;
  type?: any;
  async?: boolean;
  $data?: boolean;
  errors?: "full" | boolean | undefined;
  metaSchema?: object;
  // schema: false makes validate not to expect schema (ValidateFunction)
  schema?: boolean;
  statements?: boolean;
  dependencies?: Array<string>;
  modifying?: boolean;
  valid?: boolean;
  // one and only one of the following properties should be present
  // 应该存在以下属性中的一个，且仅存在一个，这里用到了联合类型，表示只能是这两种类型中的一种
  macro: (schema: any, parentSchema: object, it: SchemaCxt) => object | boolean;
}
export interface CustomKeyword {
  name: string;
  deinition: VjsfKeywordDefinition;
  transformSchema: (originSchema: Schema) => Schema;
}
