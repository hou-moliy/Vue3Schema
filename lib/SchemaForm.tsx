import {
  PropType,
  defineComponent,
  provide,
  watch,
  Ref,
  shallowRef,
  watchEffect,
} from "vue";
import { Schema } from "./types";
import SchemaFormItems from "./SchemaFormItems";
import { SchemaFormContextKey } from "./context";
import Ajv, { Options } from "ajv";
import { validatorFormData, ErrorSchema } from "./validator";
interface ContextRef {
  doValidate: () => {
    errors: any[];
    valid: boolean;
  };
}
const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers: true, // ajv6.0, 用这个来设置错误的dataPath的格式
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
  },
  name: "SchemaForm",
  setup(props) {
    const context = {
      SchemaFormItems,
    };
    provide(SchemaFormContextKey, context);
    // 用来存储ajv实例的
    const vaildatorRef: Ref<Ajv> = shallowRef() as any;
    // 用来存储错误信息
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({});
    watchEffect(() => {
      vaildatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      });
    });
    watch(
      () => props.contextRef,
      () => {
        console.log("contextRef change");
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              // const valid = vaildatorRef.value.validate(
              //   props.schema,
              //   props.value,
              // );
              // return {
              //   errors: vaildatorRef.value.errors || [],
              //   valid,
              // };
              const result = validatorFormData(
                vaildatorRef.value,
                props.value,
                props.schema,
                props.local,
              );
              errorSchemaRef.value = result.errorSchema;
              return result;
            },
          };
        }
      },
      {
        immediate: true,
      },
    );

    return () => {
      return (
        <SchemaFormItems
          {...props}
          rootSchema={props.schema}
          errorSchema={errorSchemaRef.value || {}}
        />
      );
    };
  },
});
