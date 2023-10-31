import Ajv, { ErrorObject } from "ajv";
import i18n from "ajv-i18n";
import { Schema } from "./types";
import toPath from "lodash/toPath";
import { isObject } from "./utils";

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
  __errors?: string[];
};
function toErrorSchema(errors: TransformedErrorObject[]) {
  if (errors.length < 1) return {};

  return errors.reduce((errorSchema, error) => {
    const { property, message } = error;
    const path = toPath(property); // toPath('obj.a.b') => ['obj', 'a', 'b'] 而/obj/a/b 是不能转换=> ['obj.a.b']
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

export async function validatorFormData(
  validator: Ajv,
  formData: any,
  schema: Schema,
  locale = "zh",
  customValidate?: (data: any, errors: any) => void,
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
  if (!customValidate) {
    return {
      errors,
      errorSchema,
      valid: errors.length === 0,
    };
  }
  /**
   * {
   *    obj: {
   *       a: { b: str }
   *       __errors: []
   *    }
   * }
   *
   * raw.obj.a
   */
  const proxy = createErrorProxy();
  await customValidate(formData, proxy);
  const newErrorSchema = mergeObjects(errorSchema, proxy);
  console.log("newErrorSchema", newErrorSchema);
  return {
    errors,
    errorSchema: newErrorSchema,
    valid: errors.length === 0,
  };
}
// 创建一个代理对象 new Proxy(target, handler)
// 代理对象的行为由handler对象定义, 代理对象的行为会代理到target对象上
function createErrorProxy() {
  const raw = {};
  return new Proxy(raw, {
    get(target, key, reciver) {
      if (key === "addError") {
        // 代理对象调用addError方法
        return (msg: string) => {
          const __errors = Reflect.get(target, "__errors", reciver);
          if (__errors && Array.isArray(__errors)) {
            __errors.push(msg);
          } else {
            (target as any).__errors = [msg];
          }
        };
      }
      // 代理对象调用其他方法
      const res = Reflect.get(target, key, reciver);
      if (res === undefined) {
        const p: any = createErrorProxy();
        (target as any)[key] = p;
        return p;
      }

      return res;
    },
  });
}

export function mergeObjects(obj1: any, obj2: any, concatArrays = false) {
  // Recursively merge deeply nested objects.
  const acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
      right = obj2[key];
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}
