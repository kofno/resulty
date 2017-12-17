import * as test from 'tape';
import { err, ok } from './../src/index';

test('Ok.getOrElse', t => {
  const result = ok<string, string>('foo');
  t.equal('foo', result.getOrElse(() => 'bar'));
  t.end();
});

test('OK.map', t => {
  const result = ok<string, string>('foo');
  t.equal('FOO', result.map(s => s.toUpperCase()).getOrElse(() => ''));
  t.end();
});

test('OK.andThen', t => {
  const result = ok<string, string>('foo').andThen(v => ok(v.toUpperCase()));
  t.equal('FOO', result.getOrElseValue(''));
  t.end();
});

test('OK.orElse', t => {
  const result = ok<string, string>('foo').orElse(err => ok(err));
  t.equal('foo', result.getOrElseValue(''));
  t.end();
});

test('Ok.cata', t => {
  const result = ok('foo').cata({
    Err: err => err,
    Ok: v => v,
  });
  t.equals('foo', result);
  t.end();
});

test('Ok.mapError', t => {
  ok<string, string>('foo').mapError(m => m.toUpperCase()).cata({
    Err: err => t.fail('should have passed'),
    Ok: v => t.pass('Worked!'),
  });

  t.end();
});

test('Ok.ap', t => {
  const fn = (a: string) => (b: number) => ({ a, b });

  ok(fn).ap(ok('hi')).ap(ok(42)).cata({
    Err: m => t.fail(`Should have passed: ${m}`),
    Ok: v => t.pass(`Worked!: ${JSON.stringify(v)}`),
  });

  ok(fn).ap(ok('hi')).ap(err('oops!')).cata({
    Err: m => t.pass(`ap failed: ${m}`),
    Ok: v => t.fail(`should have failed: ${v}`),
  });

  t.end();
});
