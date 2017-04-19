import Catamorphism from "./Catamorphism";
import Result from "./Result";
declare class Ok<A> extends Result<any, A> {
    private value;
    constructor(theValue: A);
    getOrElse(_: A): A;
    map<B>(fn: (a: A) => B): Result<any, B>;
    andThen<B>(fn: (a: A) => Ok<B>): Result<any, B>;
    orElse(fn: (_: any) => Result<any, A>): Result<any, A>;
    cata<B>(matcher: Catamorphism<any, A, B>): B;
}
declare function ok<T>(v: T): Ok<T>;
export default Ok;
export { ok };
