// Lightweight error type carrying an HTTP-ish status code. Server functions
// throw these; the client surfaces the message via toast.
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const badRequest = (msg: string) => new ApiError(400, msg);
export const unauthorized = (msg = "Not authenticated") => new ApiError(401, msg);
export const forbidden = (msg = "Not authorized") => new ApiError(403, msg);
export const notFound = (msg = "Not found") => new ApiError(404, msg);

// Standard error envelope returned from server functions. Returning (instead of
// throwing) keeps the message + status intact across the RPC boundary so the
// client can surface a useful toast.
export type ErrorResponse = { error: { message: string; status: number } };

export function toErrorResponse(e: unknown): ErrorResponse {
  if (e instanceof ApiError) {
    return { error: { message: e.message, status: e.status } };
  }
  if (e instanceof Error) {
    // Zod validation errors and unexpected errors both land here.
    return { error: { message: e.message, status: 400 } };
  }
  return { error: { message: "Something went wrong", status: 500 } };
}
