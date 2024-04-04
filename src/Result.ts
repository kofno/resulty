import { Catamorphism } from './Catamorphism.ts';

interface Err<E> {
  kind: 'err';
  error: E;
}

interface Ok<A> {
  kind: 'ok';
  value: A;
}

/**
 * A Result represents a computation that may succeed or fail. Ok<T> represents
 * a successful computation, while Err<E> represents a failure.
 */
export class Result<E, A> {
  /**
   * Construct a successful result
   * @param value a value to wrap in Ok
   * @returns a new Result with the value wrapped in Ok
   */
  public static ok<E, A>(value: A): Result<E, A> {
    return new Result<E, A>({ kind: 'ok', value });
  }

  /**
   * Construct a failed result
   * @param error a value to wrap in Err
   * @returns a new Result with the value wrapped in Err
   */
  public static err<E, A>(error: E): Result<E, A> {
    return new Result<E, A>({ kind: 'err', error });
  }

  /**
   * Returns the value from a successful result. For an error, returns the
   * result of evaluating the fn
   */
  public getOrElse(fn: () => A): A {
    switch (this.state.kind) {
      case 'ok':
        return this.state.value;
      case 'err':
        return fn();
    }
  }

  /**
   * Returns the value from a successful result. Returns the defaultValue if
   * the result was a failure.
   */
  public getOrElseValue(defaultValue: A): A {
    switch (this.state.kind) {
      case 'ok':
        return this.state.value;
      case 'err':
        return defaultValue;
    }
  }

  /**
   * Returns a new result after applying fn to the value stored in a successful
   * result. If the result was a failure, then the Err result is simply
   * returned.
   */
  public map<B>(fn: (_: A) => B): Result<E, B> {
    switch (this.state.kind) {
      case 'ok':
        return Result.ok<E, B>(fn(this.state.value));
      case 'err':
        return Result.err<E, B>(this.state.error);
    }
  }

  /**
   * An alias for `map`
   */
  public and<B>(fn: (_: A) => B): Result<E, B> {
    return this.map(fn);
  }

  /**
   * Returns a new result after applying fn to the error value. successful
   * results are returned unchanged.
   */
  public mapError<X>(fn: (_: E) => X): Result<X, A> {
    switch (this.state.kind) {
      case 'ok':
        return Result.ok<X, A>(this.state.value);
      case 'err':
        return Result.err<X, A>(fn(this.state.error));
    }
  }

  /**
   * Chains together two computations that return results. If the result is a
   * success, then the second computation is run. Otherwise, the Err is
   * returned.
   */
  public andThen<B>(fn: (_: A) => Result<E, B>): Result<E, B> {
    switch (this.state.kind) {
      case 'ok':
        return fn(this.state.value);
      case 'err':
        return Result.err<E, B>(this.state.error);
    }
  }

  /**
   * Runs an alternative computation in the case that the first computation
   * resulted in an Err.
   */
  public orElse<X>(fn: (_: E) => Result<X, A>): Result<X, A> {
    switch (this.state.kind) {
      case 'ok':
        return Result.ok<X, A>(this.state.value);
      case 'err':
        return fn(this.state.error);
    }
  }

  /**
   * Folds over types; a switch/case for success or failure.
   */
  public cata<B>(matcher: Catamorphism<E, A, B>): B {
    switch (this.state.kind) {
      case 'ok':
        return matcher.Ok(this.state.value);
      case 'err':
        return matcher.Err(this.state.error);
    }
  }

  /**
   * Encapsulates a common pattern of needing to build up an Object from
   * a series of Result values. This is often solved by nesting `andThen` calls
   * and then completing the chain with a call to `ok`.
   *
   * This feature was inspired (and the code lifted from) this article:
   * https://medium.com/@dhruvrajvanshi/simulating-haskells-do-notation-in-typescript-e48a9501751c
   *
   * Wrapped values are converted to an Object using the Object constructor
   * before assigning. Primitives won't fail at runtime, but results may
   * be unexpected.
   */
  public assign<K extends string, B>(
    k: K,
    other: Result<E, B> | ((a: A) => Result<E, B>)
  ): Result<E, A & { [k in K]: B }> {
    const state = this.state;
    switch (state.kind) {
      case 'ok': {
        const result = typeof other === 'function' ? other(state.value) : other;
        return result.map<A & { [k in K]: B }>(b => ({
          ...Object(state.value),
          [k.toString()]: b,
        }));
      }
      case 'err':
        return Result.err<E, A & { [k in K]: B }>(state.error);
    }
  }

  /**
   * Inject a side-effectual operation into a chain of Result computations.
   *
   * The primary use case for `do` is to perform logging in the middle of a flow
   * of Results.
   *
   * The side effect only runs when there isn't an error (Ok).
   *
   * The value will (should) remain unchanged during the `do` operation.
   *
   *    ok({})
   *      .assign('foo', ok(42))
   *      .assign('bar', ok('hello'))
   *      .do(scope => console.log('Scope: ', JSON.stringify(scope)))
   *      .map(doSomethingElse)
   *
   */
  public do(fn: (a: A) => void): Result<E, A> {
    switch (this.state.kind) {
      case 'ok':
        fn(this.state.value);
        return this;
      case 'err':
        return this;
    }
  }

  /**
   * Inject a side-effectual operation into a chain of Result computations.
   *
   * The side effect only runs when there is an error (Err).
   *
   * The value will remain unchanged during the `elseDo` operation.
   *
   *    ok({})
   *      .assign('foo', ok(42))
   *      .assign('bar', err('hello'))
   *      .elseDo(scope => console.log('Scope: ', JSON.stringify(scope)))
   *      .map(doSomethingElse)
   *
   */
  public elseDo(fn: (err: E) => void): Result<E, A> {
    switch (this.state.kind) {
      case 'ok':
        return this;
      case 'err':
        fn(this.state.error);
        return this;
    }
  }

  private constructor(private state: Err<E> | Ok<A>) {}
}

