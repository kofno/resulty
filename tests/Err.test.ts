import * as test from "tape";
import { err, ok } from "./../src/index";

test("Err.getOrElse", t => {
  const result = err("foo");
  t.equal("bar", result.getOrElse("bar"));
  t.end();
});

test("Err.map", t => {
  const result = err("foo");
  t.equal("bar", result.map(s => s.toUpperCase()).getOrElse("bar"));
  t.end();
});

test("Err.andThen", t => {
  const result = err("foo").andThen(v => err(v.toUpperCase()));
  t.equal("bar", result.getOrElse("bar"));
  t.end();
});

test("Err.orElse", t => {
  const result = err("foo").orElse(e => ok(e.toUpperCase()));
  t.equal("FOO", result.getOrElse(""));
  t.end();
});

test("Err.cata", t => {
  const result = err("foo").cata({
    Err: err => err,
    Ok: v => v,
  });
  t.equals("foo", result);
  t.end();
});

test("Err.mapError", t => {
  err("foo").mapError(m => m.toUpperCase()).cata({
    Err: err => t.equal("FOO", err),
    Ok: v => t.fail("should not have passed"),
  });
  t.end();
});
