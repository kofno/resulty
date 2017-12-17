import * as test from 'tape';
import { err, ok } from './../src/index';

test('Err.getOrElse', t => {
  const result = err<string, string>('foo');
  t.equal('bar', result.getOrElse(() => 'bar'));
  t.end();
});

test('Err.map', t => {
  const result = err<string, string>('foo');
  t.equal('bar', result.map(s => s.toUpperCase()).getOrElseValue('bar'));
  t.end();
});

test('Err.andThen', t => {
  const result = err<string, string>('foo').andThen(v => err(v.toUpperCase()));
  t.equal('bar', result.getOrElseValue('bar'));
  t.end();
});

test('Err.orElse', t => {
  const result = err<string, string>('foo').orElse(e => ok(e.toUpperCase()));
  t.equal('FOO', result.getOrElseValue(''));
  t.end();
});

test('Err.cata', t => {
  const result = err('foo').cata({
    Err: err => err,
    Ok: v => v,
  });
  t.equals('foo', result);
  t.end();
});

test('Err.mapError', t => {
  err('foo').mapError(m => m.toUpperCase()).cata({
    Err: err => t.equal('FOO', err),
    Ok: v => t.fail('should not have passed'),
  });
  t.end();
});

test('Err.ap', t => {
  const fn = (a: string) => (b: number) => ({ a, b });

  err('oops!').ap(ok('hi')).ap(ok(42)).cata({
    Err: m => t.pass(`Failed as expected: ${m}`),
    Ok: v => t.fail(`Should have failed: ${JSON.stringify(v)}`),
  });

  t.end();
});
