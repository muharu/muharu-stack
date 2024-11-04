import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

// Based on TRPC_ERROR_CODES_BY_KEY by TRPC - if you want to see, uncomment the code import below
// import { type TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/unstable-core-do-not-import";
// See: https://github.com/trpc/trpc/issues/5484
const TRPC_ERROR_HTTP_STATUS_CODES = {
  PARSE_ERROR: 400,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_SUPPORTED: 405,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
} as const;

type TRPCHttpStatusCodeErrorString = keyof typeof TRPC_ERROR_HTTP_STATUS_CODES;
type TRPCHttpStatusCodeErrorNumber =
  (typeof TRPC_ERROR_HTTP_STATUS_CODES)[TRPCHttpStatusCodeErrorString];

interface HandledError {
  code: TRPCHttpStatusCodeErrorString;
  httpStatus: TRPCHttpStatusCodeErrorNumber;
  message: string;
}

export function handleTRPCClientError(error: unknown): HandledError {
  if (error instanceof TRPCClientError) {
    const code = error.data.code as TRPCHttpStatusCodeErrorString;
    const httpStatus = error.data.httpStatus as TRPCHttpStatusCodeErrorNumber;
    const message = (error.data.message as string | undefined) ?? error.message;
    return { code, httpStatus, message };
  }

  return {
    code: "INTERNAL_SERVER_ERROR",
    httpStatus: convertHttpStatusStringToNumber("INTERNAL_SERVER_ERROR"),
    message: "Something went wrong",
  };
}

export function handleTRPCServerError(error: unknown): HandledError {
  if (error instanceof TRPCError) {
    const code = error.code;
    const httpStatus = convertHttpStatusStringToNumber(code);
    return {
      code,
      httpStatus,
      message: error.message,
    };
  }

  return {
    code: "INTERNAL_SERVER_ERROR",
    httpStatus: convertHttpStatusStringToNumber("INTERNAL_SERVER_ERROR"),
    message: "Something went wrong",
  };
}

export function handleTRPCError(error: unknown): HandledError {
  if (error instanceof TRPCClientError) {
    return handleTRPCClientError(error);
  }

  if (error instanceof TRPCError) {
    return handleTRPCServerError(error);
  }

  return {
    code: "INTERNAL_SERVER_ERROR",
    httpStatus: convertHttpStatusStringToNumber("INTERNAL_SERVER_ERROR"),
    message: "Something went wrong",
  };
}

function convertHttpStatusStringToNumber(
  httpStatusCodeString: TRPCHttpStatusCodeErrorString,
): TRPCHttpStatusCodeErrorNumber {
  return TRPC_ERROR_HTTP_STATUS_CODES[httpStatusCodeString];
}
