import * as test from "tape";
import { ok } from "./../src/index";

test("Ok.getOrElse", t => {
  const result = ok("foo");
  t.equal("foo", result.getOrElse("bar"));
  t.end();
});

test("OK.map", t => {
  const result = ok("foo");
  t.equal("FOO", result.map(s => s.toUpperCase()).getOrElse(""));
  t.end();
});

test("OK.andThen", t => {
  const result = ok("foo").andThen(v => ok(v.toUpperCase()));
  t.equal("FOO", result.getOrElse(""));
  t.end();
});

test("OK.orElse", t => {
  const result = ok("foo").orElse(err => ok(err));
  t.equal("foo", result.getOrElse(""));
  t.end();
});

test("Ok.cata", t => {
  const result = ok("foo").cata({
    Err: err => err,
    Ok: v => v,
  });
  t.equals("foo", result);
  t.end();
});

test("Ok.mapError", t => {
  ok("foo").mapError(m => m.toUpperCase()).cata({
    Err: err => t.fail("should have passed"),
    Ok: v => t.pass("Worked!"),
  });

  t.end();
});
