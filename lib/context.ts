import { CommonFieldType, Theme } from "./types";
import { inject } from "vue";
export const SchemaFormContextKey = Symbol();

export function useVJSFContext() {
  const context: { SchemaFormItems: CommonFieldType } | undefined =
    inject(SchemaFormContextKey);
  if (!context) {
    throw Error("SchemaForm should be used");
  }
  return context;
}
