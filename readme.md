# resulty

A disjunction implementation in TypeScript.

# install

> npm install --save resulty

> yarn add resulty

# usage

    import { ok, err } from 'resulty';

    function parse(s) {
      try {
        return ok(JSON.parse(s));
      }
      catch(e) {
        return err(e.message);
      }
    }

# docs

[API](https://kofno.github.io/resulty)
