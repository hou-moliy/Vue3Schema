import { defineComponent } from "vue";
import { FiledPropsDefine, Schema } from "../types";
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

    const handleMultiTypeChange = (v: any, index: number) => {
      const { value } = props;
      const arr = Array.isArray(value) ? value : [];
      arr[index] = v;
      props.onChange(arr);
    };
    return () => {
      const { schema, rootSchema, value } = props;
      const SchemaFormItems = context.SchemaFormItems;
      const isMultiType = Array.isArray(schema.items);
      if (isMultiType) {
        const items: Schema[] = schema.items as any;
        const arr = Array.isArray(value) ? value : [];
        return items.map((s: Schema, index: number) => {
          console.log(s, "sss");
          return (
            <SchemaFormItems
              schema={s}
              key={index}
              rootSchema={rootSchema}
              value={arr[index]}
              onChange={(v: any) => handleMultiTypeChange(v, index)}
            />
          );
        });
      }
      return <div>here</div>;
    };
  },
});
