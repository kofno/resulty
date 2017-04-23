import Catamorphism from "./Catamorphism";
import Result from "./Result";

class Err<E> extends Result<E, any> {
  private error: E;
  constructor(theError: E) {
    super();
    this.error = theError;
  }

  public getOrElse<A>(defaultValue: A): A {
    return defaultValue;
  }

  public map<B>(fn: (_: any) => B): Result<E, B> {
    return this as Result<E, B>;
  }

  public mapError<X>(fn: (err: E) => X): Result<X, any> {
    return new Err(fn(this.error));
  }

  public andThen(fn: (_: any) => Result<E, any>): Result<E, any> {
    return this as Result<E, any>;
  }

  public orElse<X>(fn: (err: E) => Result<X, any>): Result<X, any> {
    return fn(this.error);
  }

  public cata<B>(matcher: Catamorphism<E, any, B>): B {
    return matcher.Err(this.error);
  }
}

/**
 * A convenience function for creating a new Err.
 */
function err<E>(e: E) { return new Err(e); }

export default Err;
export { err };
