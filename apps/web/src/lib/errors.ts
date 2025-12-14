import { ZodError } from "zod";

function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function getZodErrorMessage(error: ZodError): string {
  const firstError = error.issues[0];

  if (!firstError) {
    return "Validation error";
  }

  const fieldPath = firstError.path.join(".");
  const message = firstError.message;

  if (fieldPath) {
    const formattedField = formatFieldName(fieldPath);
    return `${formattedField}: ${message}`;
  }

  return message;
}

export function handleApiError(error: unknown, defaultMessage: string): never {
  if (error instanceof ZodError) {
    throw new Error(getZodErrorMessage(error));
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(defaultMessage);
}
