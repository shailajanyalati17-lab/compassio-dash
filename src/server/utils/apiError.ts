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
