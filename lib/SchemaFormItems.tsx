import { defineComponent, computed } from "vue";
import { SchemaTypes, FiledPropsDefine } from "./types";
import StringField from "./fields/StringField";
import NumberField from "./fields/NumberField";
import ObjectField from "./fields/ObjectField";
import ArrayField from "./fields/ArrayField";
import { retrieveSchema } from "./utils";
import { useVJSFContext } from "./context";

export default defineComponent({
  props: FiledPropsDefine,
  name: "SchemaFormItems",
  setup(props, { slots, emit, attrs }) {
    const formContext = useVJSFContext();
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props;
      // return retrieveSchema(schema, rootSchema, value);
      return formContext.transformSchemaRef.value(
        retrieveSchema(schema, rootSchema, value),
      );
    });
    return () => {
      const { schema, errorSchema } = props;
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
        case SchemaTypes.ARRAY:
          Component = ArrayField;
          break;
        default:
          console.warn(`${type} is not supported`);
      }

      return (
        <Component
          {...props}
          schema={retrievedSchema}
          errorSchema={errorSchema}
        />
      );
    };
  },
});
