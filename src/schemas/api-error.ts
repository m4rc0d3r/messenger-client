export class APIError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = APIError.name;
    this.code = code;
  }
}
