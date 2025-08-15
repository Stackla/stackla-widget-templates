export class InvalidMediaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InvalidMediaError"
  }
}
