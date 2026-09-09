# pharity-marketing

**This repository is a publishing target, not a source of truth. Do not edit it directly.**

It exists only because GitHub Pages cannot serve from a private repository on a Free
organization plan. `PharityHQ/pharity` is private, so the built marketing site is mirrored
here, into a public repository, purely so Pages can host it at <https://pharity.com>.

## Where the source actually lives

`marketing/` in the private **PharityHQ/pharity** repository. That is the only place the
site is edited. Changes there go through the same CI as the application: typecheck, lint,
the full test suite, and a design ratchet with frozen budgets. None of that runs here.

Any commit made directly to this repository will be silently overwritten the next time the
site is published, and it will have bypassed every check.

## How to change the site

1. Edit `marketing/` in `PharityHQ/pharity`.
2. Open a pull request there and let CI pass.
3. Re-publish the contents of `marketing/` to the root of this repository's default branch.

## Files that exist only here

Two files are added at publish time and have no counterpart in `marketing/`:

- **`CNAME`** — contains `pharity.com`. GitHub Pages reads it to bind the custom domain and
  to issue the TLS certificate. Deleting it drops the site back to the `github.io` URL and
  invalidates the certificate.
- **`.nojekyll`** — an empty file that disables Jekyll processing. Without it, Pages runs
  the tree through Jekyll, which silently ignores any file or directory whose name begins
  with an underscore. Keep it even if nothing is currently underscore-prefixed; it costs
  nothing and the failure mode it prevents is a missing asset with no error anywhere.

## What this site is

Static HTML, CSS and images. No build step, no framework, no server. Every page is a
complete document that renders with JavaScript disabled; the scripts add reveal animations
and rewrite form endpoints, and are not required for content or for submitting a form.

Forms post to the Pharity application at a different origin, not to this host. Sign-in is a
link into the application — no credentials are ever collected by this site.
