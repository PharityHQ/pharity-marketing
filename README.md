# pharity-marketing

**This repository is a publishing target, not a source of truth.**

It exists only so GitHub Pages has something public to serve at
[pharity.com](http://pharity.com). Everything here except three files is a
verbatim copy of `marketing/` in the private repository `PharityHQ/pharity`.

## Do not edit this repository directly

Any commit made here that is not also made in `marketing/` upstream **will be
silently overwritten on the next publish**. There is no warning and no merge:
the publish step copies `marketing/` over the top.

If you need to change the site, change `marketing/` in `PharityHQ/pharity` and
publish from there.

## Where the checks live

The tests, the design ratchet, the typecheck and the lint all run in the private
repository. Nothing in this repository is verified by CI. A broken page can be
pushed here and Pages will happily serve it, so the only thing standing between
a mistake and the live site is that the change was made upstream first.

## The three files that live only here

These have no counterpart in `marketing/` and must survive every publish.
Deleting any of them breaks the live site in a way that is not obvious from the
repository contents:

- **`CNAME`** — binds the Pages site to `pharity.com`. Remove it and the custom
  domain unbinds; the site keeps working at `pharityhq.github.io/pharity-marketing`
  while the real domain stops resolving to it.
- **`.nojekyll`** — stops Pages running the tree through Jekyll, which
  **silently ignores any path beginning with an underscore**. Nothing is
  underscore-prefixed today. Keep it anyway: the failure it prevents is a
  missing asset with no error reported anywhere.
- **`README.md`** — this file.

## How to check what is actually live

This is a static site with `.nojekyll`, so Pages serves the committed bytes
unchanged. To confirm the live site matches the source, compare the git blob
hash of a file here against the same file under `marketing/` upstream — a
matching blob SHA is a cryptographic match of content, which is stronger than
fetching and diffing.

Note that `https://` may fail while the certificate is still being issued; the
site is reachable over `http://` in the meantime.
