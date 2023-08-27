import { PropType, defineComponent, computed } from "vue";
import { Schema, SchemaTypes, FiledPropsDefine } from "./types";
import StringField from "./fields/StringField.vue";
import NumberField from "./fields/NumberField.vue";
import ObjectField from "./fields/ObjectField";
import { retrieveSchema } from "./utils";

export default defineComponent({
  props: FiledPropsDefine,
  name: "SchemaFormItems",
  setup(props, { slots, emit, attrs }) {
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props;
      return retrieveSchema(schema, rootSchema, value);
    });
    return () => {
      const { schema } = props;
      const retrievedSchema = retrievedSchemaRef.value;
      // TODO: 如果type没有指定，我们需要猜测这个type
      const type = schema?.type;
      let Component: any;
      switch (type) {
        case SchemaTypes.STRING:
          Component = StringField;
          break;
        case SchemaTypes.NUMBER:
          Component = NumberField;
          break;
        case SchemaTypes.OBJECT:
          Component = ObjectField;
          break;
        default:
          console.warn(`${type} is not supported`);
      }
      return <Component {...props} schema={retrievedSchema} />;
    };
  },
});
