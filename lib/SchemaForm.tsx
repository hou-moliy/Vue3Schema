import { PropType, defineComponent, provide, watch, Ref } from "vue";
import { Schema, Theme } from "./types";
import SchemaFormItems from "./SchemaFormItems";
import { SchemaFormContextKey } from "./context";
interface ContextRef {
  doValidate: () => {
    errors: any[];
    valid: boolean;
  };
}
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
  },
  name: "SchemaForm",
  setup(props, { slots, emit, attrs }) {
    const context = {
      SchemaFormItems,
    };
    provide(SchemaFormContextKey, context);

    watch(
      () => props.contextRef,
      () => {
        console.log("contextRef change");
        if (props.contextRef) {
          props.contextRef.value = {
            doValidate() {
              return {
                errors: [],
                valid: true,
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
