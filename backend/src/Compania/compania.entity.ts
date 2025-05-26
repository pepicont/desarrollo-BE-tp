import { randomUUID } from 'crypto';

export class Compania {
  constructor(
    public nombre: string,
    public detalle: string,
    public id = crypto.randomUUID()
  ) {}
}