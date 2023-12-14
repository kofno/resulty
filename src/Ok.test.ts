import { AssertionError, assert, assertEquals, assertObjectMatch } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { ok } from './index.ts';

function fail(message: string): never {
  throw new AssertionError(message);
}

function pass(_msg: string): void {
  assert(true);
}

Deno.test('Ok.getOrElse', () => {
  const result = ok<string, string>('foo');
  assertEquals(
    'foo',
    result.getOrElse(() => 'bar')
  );
});

Deno.test('OK.map', () => {
  const result = ok<string, string>('foo');
  assertEquals(
    'FOO',
    result.map(s => s.toUpperCase()).getOrElse(() => '')
  );
});

Deno.test('OK.andThen', () => {
  const result = ok<string, string>('foo').andThen(v => ok(v.toUpperCase()));
  assertEquals('FOO', result.getOrElseValue(''));
});

Deno.test('OK.orElse', () => {
  const result = ok<string, string>('foo').orElse(err => ok(err));
  assertEquals('foo', result.getOrElseValue(''));
});

Deno.test('Ok.cata', () => {
  const result = ok('foo').cata({
    Err: err => err,
    Ok: v => v,
  });
  assertEquals('foo', result);
});

Deno.test('Ok.mapError', () => {
  ok<string, string>('foo')
    .mapError(m => m.toUpperCase())
    .cata({
      Err: () => fail('should have passed'),
      Ok: () => pass('Worked!'),
    });
});

Deno.test('Ok.assign', () => {
  ok({})
    .assign('x', ok(42))
    .assign('y', v => ok(String(v.x + 8)))
    .cata({
      Err: m => fail(`Should have succeeded: ${m}`),
      Ok: v => assertObjectMatch(v, { x: 42, y: '50' }),
    });
});

Deno.test('Ok.do', () => {
  ok({})
    .assign('x', ok(42))
    .do(scope => pass(`'do' should run: ${JSON.stringify(scope)}`))
    .cata({
      Err: m => fail(`Should have succeeded: ${m}`),
      Ok: v => assertObjectMatch(v, { x: 42 }),
    });
});

Deno.test('Ok.elseDo', () => {
  ok({ x: 42 })
    .elseDo(err => fail(`Error side effect should not run: ${err}`))
    .cata({
      Err: m => fail(`Should have succeeded: ${m}`),
      Ok: v => assertObjectMatch(v, { x: 42 }),
    });
});
