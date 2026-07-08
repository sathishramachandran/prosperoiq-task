// types/fernet.d.ts
declare module "fernet" {
  export class Secret {
    constructor(secret: string);
    static generate(): string;
  }

  export class Token {
    constructor(options: {
      secret: Secret;
      token?: string;
      time?: number;
      ttl?: number;
    });

    encode(data: string): string;
    decode(): string;
  }

  const Fernet: {
    Secret: typeof Secret;
    Token: typeof Token;
  };

  export default Fernet;
}