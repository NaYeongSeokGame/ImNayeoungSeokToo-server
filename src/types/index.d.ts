declare global {
  namespace Express {
    interface Request {
      uuid?: string;
    }
  }
}

export {};
