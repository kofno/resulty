import Catamorphism from "./Catamorphism";
declare abstract class Result<E, A> {
    abstract getOrElse(defaultValue: A): A;
    abstract map<B>(fn: (_: A) => B): Result<E, B>;
    abstract andThen<B>(fn: (_: A) => Result<E, B>): Result<E, B>;
    abstract orElse<X>(fn: (_: E) => Result<X, A>): Result<X, A>;
    abstract cata<B>(matcher: Catamorphism<E, A, B>): B;
}
export default Result;
