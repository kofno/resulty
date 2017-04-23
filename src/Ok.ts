import Catamorphism from "./Catamorphism";
import Result from "./Result";

class Ok<A> extends Result<any, A> {
  private value: A;
  constructor(theValue: A) {
    super();
    this.value = theValue;
  }

  public getOrElse(_: A): A {
    return this.value;
  }

  public map<B>(fn: (a: A) => B): Result<any, B> {
    return new Ok(fn(this.value));
  }

  public mapError<X>(fn: (e: any) => any): Result<any, A> {
    return this as Result<any, A>;
  }

  public andThen<B>(fn: (a: A) => Ok<B>): Result<any, B> {
    return fn(this.value) as Result<any, B>;
  }

  public orElse(fn: (_: any) => Result<any, A>): Result<any, A> {
    return this as Result<any, A>;
  }

  public cata<B>(matcher: Catamorphism<any, A, B>): B {
    return matcher.Ok(this.value);
  }
}

/**
 * A convenience function for create a new Ok.
 */
function ok<T>(v: T) { return new Ok(v); }

export default Ok;
export { ok };
