import { PropType, defineComponent } from "vue";
import { Schema, SchemaTypes } from "./types";
import StringField from "./fields/StringField";
import NumberField from "./fields/NumberField";
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
  name: "SchemaFormItems",
  setup(props, { slots, emit, attrs }) {
    return () => {
      const { schema } = props;
      // TODO: 如果type没有指定，我们需要猜测这个type
      const type = schema?.type;
      let Component: any;
      switch (type) {
        case SchemaTypes.STRING:
          Component = StringField;
          break;
        case SchemaTypes.NUMBER:
          Component = NumberField;
      }
      return <Component {...props} />;
    };
  },
});
