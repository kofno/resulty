import Catamorphism from "./Catamorphism";
import Result from "./Result";
declare class Ok<A> extends Result<any, A> {
    private value;
    constructor(theValue: A);
    getOrElse(_: A): A;
    map<B>(fn: (a: A) => B): Result<any, B>;
    mapError<X>(fn: (e: any) => any): Result<any, A>;
    andThen<B>(fn: (a: A) => Ok<B>): Result<any, B>;
    orElse(fn: (_: any) => Result<any, A>): Result<any, A>;
    cata<B>(matcher: Catamorphism<any, A, B>): B;
    ap<B, C>(result: Result<any, B>): Result<any, C>;
}
/**
 * A convenience function for create a new Ok.
 */
declare function ok<T>(v: T): Ok<T>;
export default Ok;
export { ok };
