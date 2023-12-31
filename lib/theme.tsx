import {
  defineComponent,
  PropType,
  computed,
  provide,
  inject,
  ComputedRef,
  ref,
  ExtractPropTypes, // ?
  shallowRef,
} from "vue";
import {
  Theme,
  SelectionWidgetNames,
  CommonWidgetNames,
  CommonWidgetDefine,
  FiledPropsDefine,
} from "./types";
import { isObject } from "./utils";
import { useVJSFContext } from "./context";
// Symbol是一个唯一值 用来标识这个provide的key
// 也就是说这个key是唯一的 不能重复
const THEME_PROVIDER_KEY = Symbol();
const ThemeProvider = defineComponent({
  name: "ThemeProvider",
  props: {
    theme: {
      type: Object as PropType<Theme>,
      // PropType表示这个类型是一个Prop类型 也就是说这个theme是一个对象 且必须是Theme类型
      // 也就是说必须包含widgets和layouts
      required: true,
    },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme);
    provide(THEME_PROVIDER_KEY, context); // provide的第一个参数是一个唯一的key 第二个参数是一个值
    return () => (slots.default ? slots.default() : null);
  },
});
// 通过这个函数来获取theme
export const getWidget = <T extends SelectionWidgetNames | CommonWidgetNames>(
  name: T,
  props?: ExtractPropTypes<typeof FiledPropsDefine>,
) => {
  // inject注入，返回的是一个计算属性的值，类型是ComputedRef的Theme类型
  const context: ComputedRef<Theme> | undefined =
    inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY);
  if (!context) {
    throw new Error("error:vjs theme required");
  }
  const formContext = useVJSFContext();
  if (props) {
    const { uiSchema, schema } = props;
    if (uiSchema?.widget && isObject(uiSchema.widget)) {
      return shallowRef(uiSchema.widget as CommonWidgetDefine);
    }
    if (schema.format) {
      // 查看format数组中是否有schem中format字段值对应的这个自定义format组件
      if (formContext.formatMapRef.value[schema.format]) {
        return shallowRef(formContext.formatMapRef.value[schema.format]);
      }
    }
  }

  // 这里的widgetRef是一个计算属性，这样做的目的是为了让widgetRef的值是响应式的，
  // 这样当theme改变的时候，widgetRef的值也会改变，这样就可以实现动态的改变theme
  // 页面上的组件也会随之改变
  const widgetRef = computed(() => {
    return context.value.widgets[name];
  });
  return widgetRef;
};
export default ThemeProvider;
