import { defineComponent } from "vue";
import { FiledPropsDefine } from "../types";
import { useVJSFContext } from "../context";

/**
 * {
 *   items: { type: string },
 * }
 *
 * {
 *   items: [
 *    { type: string },
 *    { type: number }
 *   ]
 * }
 *
 * {
 *   items: { type: string, enum: ['1', '2'] }, enum里面是可选值
 * }
 */
export default defineComponent({
  name: "ArrayField",
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext();
    return () => {
      const { schema, rootSchema, value } = props;
      const SchemaFormItems = context.SchemaFormItems;
      // return <div></div>;
    };
  },
});
