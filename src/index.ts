import { Result } from "./Result.ts";

export type * from './Catamorphism.ts';
export * from './Result.ts';

export function ok<E, A>(value: A): Result<E, A> {
  return Result.ok<E, A>(value);
}

export function err<E, A>(error: E): Result<E, A> {
  return Result.err<E, A>(error);
}
