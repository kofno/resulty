import Catamorphism from './Catamorphism';

/**
 * A Result represents a computation that may succeed or fail. Ok<T> represents
 * a successful computation, while Err<E> represents a failure.
 */
abstract class Result<E, A> {
  /**
   * Returns the value from a successful result. For an error, returns the
   * result of evaluating the fn
   */
  public abstract getOrElse(fn: () => A): A;

  /**
   * Returns the value from a successful result. Returns the defaultValue if
   * the result was a failure.
   */
  public abstract getOrElseValue(defaultValue: A): A;

  /**
   * Returns a new result after applying fn to the value stored in a successful
   * result. If the result was a failure, then the Err result is simply
   * returned.
   */
  public abstract map<B>(fn: (_: A) => B): Result<E, B>;

  /**
   * Returns a new result after applying fn to the error value. successful
   * results are returned unchanged.
   */
  public abstract mapError<X>(fn: (_: E) => X): Result<X, A>;

  /**
   * Chains together two computations that return results. If the result is a
   * success, then the second computation is run. Otherwise, the Err is
   * returned.
   */
  public abstract andThen<B>(fn: (_: A) => Result<E, B>): Result<E, B>;

  /**
   * Runs an alternative computation in the case that the first computation
   * resulted in an Err.
   */
  public abstract orElse<X>(fn: (_: E) => Result<X, A>): Result<X, A>;

  /**
   * Folds over types; a switch/case for success or failure.
   */
  public abstract cata<B>(matcher: Catamorphism<E, A, B>): B;

  /**
   * Apply the value of a successful result to a function result. If this
   * result is an Err, nothing happens. If this result is NOT a function,
   * a TypeError is raised.
   */
  public abstract ap<B, C>(result: Result<E, B>): Result<E, C>;
}

export default Result;
