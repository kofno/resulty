import Catamorphism from './Catamorphism';
import Result from './Result';

class Ok<Err, A> extends Result<Err, A> {
  constructor(private value: A) {
    super();
  }

  public getOrElse(fn: () => A): A {
    return this.value;
  }

  public getOrElseValue(_: A): A {
    return this.value;
  }

  public map<B>(fn: (a: A) => B): Result<Err, B> {
    return new Ok(fn(this.value));
  }

  public mapError<X>(fn: (e: Err) => X): Result<X, A> {
    return new Ok<X, A>(this.value);
  }

  public andThen<B>(fn: (a: A) => Result<Err, B>): Result<Err, B> {
    return fn(this.value);
  }

  public orElse(fn: (_: any) => Result<any, A>): Result<any, A> {
    return this as Result<any, A>;
  }

  public cata<B>(matcher: Catamorphism<Err, A, B>): B {
    return matcher.Ok(this.value);
  }

  public ap<B, C>(result: Result<Err, B>): Result<Err, C> {
    if (typeof this.value !== 'function') {
      throw new TypeError(`'ap' can only be applied to functions: ${JSON.stringify(this.value)}`);
    }

    return result.map(this.value);
  }

  public assign<K extends string, B>(
    k: K,
    other: Result<Err, B> | ((a: A) => Result<Err, B>)
  ): Result<Err, A & { [k in K]: B }> {
    const result = other instanceof Result ? other : other(this.value);
    return result.map<A & { [k in K]: B }>(b => ({
      ...Object(this.value),
      [k.toString()]: b,
    }));
  }
}

/**
 * A convenience function for create a new Ok.
 */
const ok = <Err, T>(v: T): Result<Err, T> => new Ok(v);

export default Ok;
export { ok };
