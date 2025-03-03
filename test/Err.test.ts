import { strict as assert } from 'assert';
import { err, ok } from '../src/index';

function fail(message: string): never {
  throw new Error(message);
}

describe('Err', () => {
  it('Err.getOrElse', () => {
    const result = err<string, string>('foo');
    assert.equal(result.getOrElse(() => 'bar'), 'bar');
  });

  it('Err.map', () => {
    const result = err<string, string>('foo');
    assert.equal(result.map((s: string) => s.toUpperCase()).getOrElseValue('bar'), 'bar');
  });

  it('Err.andThen', () => {
    const result = err<string, string>('foo').andThen((v: string) => err(v.toUpperCase()));
    assert.equal(result.getOrElseValue('bar'), 'bar');
  });

  it('Err.orElse', () => {
    const result = err<string, string>('foo').orElse((e: string) => ok(e.toUpperCase()));
    assert.equal(result.getOrElseValue(''), 'FOO');
  });

  it('Err.cata', () => {
    const result = err('foo').cata({
      Err: (err) => err,
      Ok: (v) => v,
    });
    assert.equal(result, 'foo');
  });

  it('Err.mapError', () => {
    err('foo')
      .mapError((m: string) => m.toUpperCase())
      .cata({
        Err: (err: string) => assert.equal(err, 'FOO'),
        Ok: () => fail('should not have passed'),
      });
  });

  it('Err.assign', () => {
    ok({})
      .assign('x', ok(42))
      .assign('y', () => err('ooops!'))
      .cata({
        Err: (m) => assert.ok(true, `Failed as expected: ${m}`),
        Ok: (v) => fail(`Should have failed: ${JSON.stringify(v)}`),
      });
  });

  it('Err.do', () => {
    err('oops!')
      .do((v) => fail(`Should NOT run side effect: ${v}`))
      .cata({
        Err: (m) => assert.ok(true, `Should be an error: ${m}`),
        Ok: (v) => fail(`Should not succeeded: ${JSON.stringify(v)}`),
      });
  });

  it('Err.elseDo', () => {
    err('oops!')
      .elseDo((v) => assert.ok(true, `Error side effect ran: ${v}`))
      .cata({
        Err: (m) => assert.ok(true, `Should be an error: ${m}`),
        Ok: (v) => fail(`Should not succeed: ${JSON.stringify(v)}`),
      });
  });

  it ('Err.isOk', () => {
    const result = err('foo');
    assert.equal(result.isOk(), false);
  }
  );
  it ('Err.isErr', () => {
    const result = err('foo');
    assert.equal(result.isErr(), true);
    if (result.isErr()) {
      assert.equal(result.state.error, 'foo');
    }
  }
  );
});
