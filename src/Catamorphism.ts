export interface Catamorphism<E, A, B> {
  Err: (_: E) => B;
  Ok: (_: A) => B;
}
