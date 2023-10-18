import { PropType, defineComponent, provide } from "vue";
import { Schema, SchemaTypes, Theme } from "./types";
import SchemaFormItems from "./SchemaFormItems";
import { SchemaFormContextKey } from "./context";
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
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  name: "SchemaForm",
  setup(props, { slots, emit, attrs }) {
    const context = {
      SchemaFormItems,
      theme: props.theme as Theme, // as Theme 为了让ts知道theme是Theme类型
    };
    provide(SchemaFormContextKey, context);

    return () => {
      return <SchemaFormItems {...props} rootSchema={props.schema} />;
    };
  },
});
