import { CommonFieldType, CommonWidgetDefine } from "./types";
import { inject, Ref } from "vue";
export const SchemaFormContextKey = Symbol();

export function useVJSFContext() {
  const context:
    | {
        SchemaFormItems: CommonFieldType;
        formatMapRef: Ref<{ [key: string]: CommonWidgetDefine }>;
      }
    | undefined = inject(SchemaFormContextKey);
  if (!context) {
    throw Error("SchemaForm should be used");
  }
  return context;
}
