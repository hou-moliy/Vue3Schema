import { defineComponent } from "vue";

import { FiledPropsDefine } from "../types";
import { useVJSFContext } from "../context";
import { isObject } from "../utils";

export default defineComponent({
  name: "ObjectField",
  props: FiledPropsDefine,
  setup(props) {
    const context = useVJSFContext();
    const handleObjectFieldChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {};
      if (v === undefined) {
        delete value[key];
      } else {
        value[key] = v;
      }
      props.onChange(value);
    };

    return () => {
      const { schema, rootSchema, value } = props;
      const { SchemaFormItems } = context;
      const properties = schema.properties || {};
      const curValue: any = isObject(value) ? value : {};
      return Object.keys(properties).map((k: string, index: number) => (
        <SchemaFormItems
          schema={properties[k]}
          rootSchema={rootSchema}
          value={curValue[k]}
          key={index}
          errorSchema={props.errorSchema[k] || {}}
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ));
    };
  },
});
