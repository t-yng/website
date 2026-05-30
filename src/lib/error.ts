export class NotFoundPostError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundPostError";
  }
}
