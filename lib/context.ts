import { CommonFieldType, CommonWidgetDefine, Schema } from "./types";
import { inject, Ref } from "vue";
export const SchemaFormContextKey = Symbol();

export function useVJSFContext() {
  const context:
    | {
        SchemaFormItems: CommonFieldType;
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>;
        transformSchemaRef: Ref<(schema: Schema) => Schema>;
      }
    | undefined = inject(SchemaFormContextKey);
  if (!context) {
    throw Error("SchemaForm should be used");
  }
  return context;
}
