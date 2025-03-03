import { ok } from '../src/index';

function fail(message: string): never {
  throw new Error(message);
}

describe('Ok', () => {
  it('Ok.getOrElse', () => {
    const result = ok<string, string>('foo');
    expect(result.getOrElse(() => 'bar')).toEqual('foo');
  });

  it('Ok.map', () => {
    const result = ok<string, string>('foo');
    expect(result.map((s) => s.toUpperCase()).getOrElse(() => '')).toEqual(
      'FOO',
    );
  });

  it('Ok.andThen', () => {
    const result = ok<string, string>('foo').andThen((v) =>
      ok(v.toUpperCase()),
    );
    expect(result.getOrElseValue('')).toEqual('FOO');
  });

  it('Ok.orElse', () => {
    const result = ok<string, string>('foo').orElse((err) => ok(err));
    expect(result.getOrElseValue('')).toEqual('foo');
  });

  it('Ok.cata', () => {
    const result = ok('foo').cata({
      Err: (err) => err,
      Ok: (v) => v,
    });
    expect(result).toEqual('foo');
  });

  it('Ok.mapError', () => {
    ok<string, string>('foo')
      .mapError((m) => m.toUpperCase())
      .cata({
        Err: () => fail('should have passed'),
        Ok: () => expect(true).toBeTruthy(),
      });
  });

  it('Ok.assign', () => {
    ok({})
      .assign('x', ok(42))
      .assign('y', (v) => ok(String(v.x + 8)))
      .cata({
        Err: (m) => fail(`Should have succeeded: ${m}`),
        Ok: (v) => expect(v).toEqual({ x: 42, y: '50' }),
      });
  });

  it('Ok.do', () => {
    ok({})
      .assign('x', ok(42))
      .do((scope) => expect(true).toBeTruthy())
      .cata({
        Err: (m) => fail(`Should have succeeded: ${m}`),
        Ok: (v) => expect(v).toEqual({ x: 42 }),
      });
  });

  it('Ok.elseDo', () => {
    ok({ x: 42 })
      .elseDo((err) => fail(`Error side effect should not run: ${err}`))
      .cata({
        Err: (m) => fail(`Should have succeeded: ${m}`),
        Ok: (v) => expect(v).toEqual({ x: 42 }),
      });
  });

  it('Ok.isOk', () => {
    const result = ok<string, string>('foo');
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.state.value).toEqual('foo');
    }
  });
  it('Ok.isErr', () => {
    const result = ok<string, string>('foo');
    expect(result.isErr()).toBeFalsy();
  });
});
