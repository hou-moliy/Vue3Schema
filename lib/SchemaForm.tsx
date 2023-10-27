import {
  PropType,
  defineComponent,
  provide,
  watch,
  Ref,
  shallowRef,
  watchEffect,
} from "vue";
import { Schema, Theme } from "./types";
import SchemaFormItems from "./SchemaFormItems";
import { SchemaFormContextKey } from "./context";
import Ajv, { Options } from "ajv";
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
  },
  name: "SchemaForm",
  setup(props, { slots, emit, attrs }) {
    const context = {
      SchemaFormItems,
    };
    provide(SchemaFormContextKey, context);
    const vaildatorRef: Ref<Ajv> = shallowRef() as any;
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
              const valid = vaildatorRef.value.validate(
                props.schema,
                props.value,
              );
              return {
                errors: vaildatorRef.value.errors || [],
                valid,
              };
            },
          };
        }
      },
      {
        immediate: true,
      },
    );

    return () => {
      return <SchemaFormItems {...props} rootSchema={props.schema} />;
    };
  },
});
