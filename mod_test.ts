import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { ok } from "./mod.ts";

Deno.test("ok", () => {
  ok(1)
    .map((n) => n + 1)
    .andThen((n) => ok(n + 1))
    .do(n => assertEquals(n, 3))
})
