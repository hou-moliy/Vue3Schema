import {
  PropType,
  defineComponent,
  provide,
  watch,
  Ref,
  shallowRef,
  watchEffect,
  ref,
  computed,
} from "vue";
import {
  Schema,
  UISchema,
  CustomFormat,
  CommonWidgetDefine,
  CustomKeyword,
} from "./types";
import SchemaFormItems from "./SchemaFormItems";
import { SchemaFormContextKey } from "./context";
import Ajv, { Options } from "ajv";
import { validatorFormData, ErrorSchema } from "./validator";
import { createUseStyles } from "vue-jss"; // 引入开源项目，用js写css
const useStyles = createUseStyles({
  // 写样式，字段就相当于class名
  inline: {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    margin: "0 auto",
    gap: "10px",
  },
});

interface ContextRef {
  doValidate: () => Promise<{
    errors: any[];
    valid: boolean;
  }>;
}
const defaultAjvOptions: Options = {
  allErrors: true,
  jsPropertySyntax: true,
};
export default defineComponent({
  props: {
    schema: {
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
    contextRef: {
      type: Object as PropType<Ref<ContextRef | undefined>>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    local: {
      type: String,
      default: "zh",
    },
    customValidate: {
      // 自定义校验函数
      type: Function as PropType<(data: any, errors: any) => void>,
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
    inline: {
      // 是否是行内表单
      type: Boolean,
      default: false,
    },
    customFormats: {
      // 自定义校验规则
      type: [Array, Object] as PropType<CustomFormat[] | CustomFormat>,
    },
    customKeywords: {
      // 自定义关键字
      type: [Array, Object] as PropType<CustomKeyword[] | CustomKeyword>,
    },
  },
  name: "SchemaForm",
  setup(props) {
    const classesRef = useStyles();

    // 用来存储ajv实例的
    const vaildatorRef: Ref<Ajv> = shallowRef() as any;
    // 用来存储错误信息
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({});
    watchEffect(() => {
      vaildatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });
      // 创建ajv实例的时候添加自定义校验规则，让ajv校验
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats];
        customFormats.forEach((format) => {
          // addFormat方法是ajv提供的，用来添加自定义校验规则的
          vaildatorRef.value.addFormat(format.name, format.definition);
        });
      }
      // 添加自定义关键字
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords];
        customKeywords.forEach((keyword) => {
          vaildatorRef.value.addKeyword(keyword.name, keyword.deinition as any);
        });
      }
    });
    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats];
        // 将自定义校验规则转换成map/map的key是name，value是component,
        // reduce是数组的方法，用来将数组转换成其他类型的数据,
        // 第一个参数是回调函数，第二个参数是初始值
        return customFormats.reduce((result, format) => {
          result[format.name] = format.component;
          return result;
        }, {} as { [key: string]: CommonWidgetDefine });
      } else {
        return {};
      }
    });
    // console.log(formatMapRef, "formatMapRef");

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          // 如果有校验的promise 就执行校验
          handleDoValidate();
        }
      },
      {
        deep: true,
      },
    );
    // 用来存储校验的promise
    const validateResolveRef = shallowRef();
    // 用来存储当前的校验的index
    const validateIndex = shallowRef(0);
    const handleDoValidate = async () => {
      console.log("start  validate");
      const index = (validateIndex.value += 1);
      console.log("index", index);
      console.log("validateIndex.value", validateIndex.value);
      const result = await validatorFormData(
        vaildatorRef.value,
        props.value,
        props.schema,
        props.local,
        props.customValidate,
      );
      // 如果不是最后一次校验，就不用处理
      // 为什么validateIndex.value === index?
      // 因为validateIndex.value是响应式的，所以在执行到这里的时候，validateIndex.value可能已经变化了
      // 所以需要判断是否是最后一次校验 也就是validateIndex.value === index
      console.log(
        "validateIndex.value === index",
        validateIndex.value === index,
      );
      if (index !== validateIndex.value) return;
      console.log("result", result);
      console.log("end validate");
      errorSchemaRef.value = result.errorSchema;
      validateResolveRef.value(result);
      validateResolveRef.value = undefined;
    };
    watch(
      () => props.contextRef,
      () => {
        // console.log("contextRef change");
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              return new Promise((resolve) => {
                // 用来存储当前的校验的promise
                validateResolveRef.value = resolve;
                handleDoValidate();
              });
            },
          };
        }
      },
      {
        immediate: true,
      },
    );

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords];
        return (schema: Schema) => {
          let newSchema = schema;
          customKeywords.forEach((keyword) => {
            if ((newSchema as any)[keyword.name]) {
              newSchema = keyword.transformSchema(newSchema);
            }
          });
          return newSchema;
        };
      } else {
        return (schema: Schema) => schema;
      }
    });
    const context = {
      SchemaFormItems,
      formatMapRef,
      transformSchemaRef,
    };

    // 使用provide向下传递组件
    provide(SchemaFormContextKey, context);

    return () => {
      const { schema, value, uiSchema, inline, onChange } = props;
      return (
        <div class={inline ? classesRef.value.inline : ""}>
          <SchemaFormItems
            schema={schema}
            value={value}
            onChange={onChange}
            uiSchema={uiSchema || {}}
            rootSchema={schema}
            errorSchema={errorSchemaRef.value || {}}
            inline={inline}
          />
        </div>
      );
    };
  },
});
