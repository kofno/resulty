import Catamorphism from "./Catamorphism";
import Result from "./Result";
declare class Err<E> extends Result<E, any> {
    private error;
    constructor(theError: E);
    getOrElse<A>(defaultValue: A): A;
    map<B>(fn: (_: any) => B): Result<E, B>;
    andThen(fn: (_: any) => Result<E, any>): Result<E, any>;
    orElse<X>(fn: (err: E) => Result<X, any>): Result<X, any>;
    cata<B>(matcher: Catamorphism<E, any, B>): B;
}
declare function err<E>(e: E): Err<E>;
export default Err;
export { err };
