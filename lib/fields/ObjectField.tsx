import { defineComponent, inject } from "vue";

import { FiledPropsDefine } from "../types";
import { SchemaFormContextKey } from "../context";
import { isObject } from "../utils";

const TypeHelperComponent = defineComponent({
  props: FiledPropsDefine,
});

type SchemaItemDefine = typeof TypeHelperComponent;
export default defineComponent({
  name: "ObjectField",
  props: FiledPropsDefine,
  setup(props) {
    const context: { SchemaFormItems: SchemaItemDefine } | undefined =
      inject(SchemaFormContextKey);
    if (!context) {
      throw Error("SchemaForm should be used");
    }

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
          onChange={(v: any) => handleObjectFieldChange(k, v)}
        />
      ));
    };
  },
});
