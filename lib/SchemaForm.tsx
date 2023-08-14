import { PropType, defineComponent } from "vue";
import { Schema, SchemaTypes } from "./types";
import SchemaFormItems from "./SchemaFormItems";
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
  },
  name: "SchemaForm",
  setup(props, { slots, emit, attrs }) {
    return () => {
      return <SchemaFormItems {...props} />;
    };
  },
});
