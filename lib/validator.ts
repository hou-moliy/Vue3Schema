import Ajv, { ErrorObject } from "ajv";
import i18n from "ajv-i18n";
import { Schema } from "./types";
import toPath from "lodash/toPath";

interface TransformedErrorObject {
  name: string;
  property: string;
  message: string | undefined;
  params: any;
  schemaPath: string;
}

interface ErrorSchemaObject {
  [level: string]: ErrorSchema;
}

export type ErrorSchema = ErrorSchemaObject & {
  __errors: string[];
};
function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length < 1) return {};

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = toPath(property); // /obj/a -> [obj, a]
    let parent = errorSchema;

    // If the property is at the root (.level1) then toPath creates
    // an empty array element at the first index. Remove it.
    if (path.length > 0 && path[0] === "") {
      path.splice(0, 1);
    }

    // {
    //   obj: {
    //     a: {}
    //   }
    // } // /obj/a
    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        (parent as any)[segment] = {};
      }
      parent = parent[segment];
    }

    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a property named __errors
      // to avoid name collision with a possible sub schema field named
      // "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message || "");
    } else {
      if (message) {
        parent.__errors = [message];
      }
    }
    return errorSchema;
  }, {} as ErrorSchema);
}

function transformErros(
  errors: ErrorObject[] | null | undefined,
): TransformedErrorObject[] {
  if (errors === null || errors === undefined) return [];
  return errors.map(
    ({ message, instancePath, keyword, params, schemaPath }) => {
      const property = `${instancePath}`;
      return {
        name: keyword,
        property,
        message,
        params,
        schemaPath,
      };
    },
  );
}

export function validatorFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
  locale = "zh",
) {
  let validationError = null;
  try {
    validator.validate(schema, formData);
  } catch (e) {
    validationError = e;
  }
  (i18n as any)[locale](validator.errors);
  let errors = transformErros(validator.errors);
  if (validationError) {
    errors = [
      ...errors,
      {
        message: (validationError as any).message,
      } as TransformedErrorObject,
    ];
  }
  const errorSchema = toErrorSchema(errors);
  return {
    errors,
    errorSchema,
    valid: errors.length === 0,
  };
}
