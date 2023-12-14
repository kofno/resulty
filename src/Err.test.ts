
import { AssertionError, assert, assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { err, ok } from './index.ts';

function fail(message: string): never {
  throw new AssertionError(message);
}

function pass(_msg: string): void {
  assert(true);
}

Deno.test('Err.getOrElse', () => {
  const result = err<string, string>('foo');
   assertEquals(
    'bar',
    result.getOrElse(() => 'bar')
  );
});

Deno.test('Err.map', () => {
  const result = err<string, string>('foo');
  assertEquals('bar', result.map(s => s.toUpperCase()).getOrElseValue('bar'));
});

Deno.test('Err.andThen', () => {
  const result = err<string, string>('foo').andThen(v => err(v.toUpperCase()));
  assertEquals('bar', result.getOrElseValue('bar'));
});

Deno.test('Err.orElse', () => {
  const result = err<string, string>('foo').orElse(e => ok(e.toUpperCase()));
  assertEquals('FOO', result.getOrElseValue(''));
});

Deno.test('Err.cata', () => {
  const result = err('foo').cata({
    Err: err => err,
    Ok: v => v,
  });
  assertEquals('foo', result);
});

Deno.test('Err.mapError', () => {
  err('foo')
    .mapError(m => m.toUpperCase())
    .cata({
      Err: err =>  assertEquals('FOO', err),
      Ok: () => fail('should not have passed'),
    });
});

Deno.test('Err.assign', () => {
  ok({})
    .assign('x', ok(42))
    .assign('y', () => err('ooops!'))
    .cata({
      Err: m => pass(`Failed as expected: ${m}`),
      Ok: v => fail(`Should have failed: ${JSON.stringify(v)}`),
    });
});

Deno.test('Err.do', () => {
  err('oops!')
    .do(v => fail(`Should NOT run side effect: ${v}`))
    .cata({
      Err: m => pass(`Should be an error: ${m}`),
      Ok: v => fail(`Should not succeeded: ${JSON.stringify(v)}`),
    });
});

Deno.test('Err.elseDo', () => {
  err('oops!')
    .elseDo(v => pass(`Error side effect ran: ${v}`))
    .cata({
      Err: m => pass(`Should be an error: ${m}`),
      Ok: v => fail(`Should not succeed: ${JSON.stringify(v)}`),
    });
});
