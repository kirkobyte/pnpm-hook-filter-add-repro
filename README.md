# pnpm-hook-filter-add-repro

Minimal reproduction for a pnpm 12.22.0 bug. A `filter` set by a `.pnpmfile.mjs` `updateConfig` hook is honored by `pnpm install`, but `pnpm add` and `pnpm update` ignore it when no `--filter` is given on the command line. In a git sparse checkout where `packages/other` is not on disk, those commands rewrite `pnpm-lock.yaml` and drop the `packages/other` importer and its catalog entry and packages.

The committed `pnpm-lock.yaml` was generated with all three packages on disk.

## Reproduce

```sh
git sparse-checkout set packages/app packages/third   # packages/other is not on disk

pnpm install --lockfile-only
git diff --stat pnpm-lock.yaml                        # no changes

cd packages/app
pnpm add ms@2.1.3
git diff pnpm-lock.yaml                               # importer packages/other removed
```

With the filter passed on the command line instead, the importer is kept:

```sh
cd ../.. && git checkout -- pnpm-lock.yaml packages/app
cd packages/app
pnpm add ms@2.1.3 --filter .
git diff pnpm-lock.yaml                               # only ms added
```
