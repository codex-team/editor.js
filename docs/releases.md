# Branches, versions and releases — complete guideline

## Branches

The project has two main branches: `master` and `next`.

Branch `master` contains the latest stable version of the editor.
The latest version published to NPM available by default or by the tag `latest`.

Branch `next` used for development the next (release candidate) version of the editor.
It may contain bug fixes, improvements or features. This version is available in NPM by `next` tag.

## Versions

We use [semantic versioning](https://semver.org) as a main guide for naming updates.

`<major>.<minor>.<patch>`

You need to bump the part of version according the changes:

- `patch` — for bug fixes, docs updates, code style fixes and other changes which do not affect the result project bundle
- `minor` — for new features with no backward compatibility problems.
- `major` — for breaking changes without backward compatibility with the api of the previous version of the project.

Pre-release versions may contain additional `-rc.*` suffix.

## Release publishing

There is an [action](.github/workflows/publish.yml) that fired on a new release publishing on GitHub.

After update merging, when a new package version is ready to be published,
create a [new release](https://github.com/codex-team/editor.js/releases/new) with the correct version tag.

Use target version changelog as a description.

![](https://capella.pics/57267bab-f2f0-411b-a9d1-69abee6abab5.jpg)

Then you can publish the release and wait for package publishing via action.

This package version will be published to NPM with default `latest` tag.

### Release candidate publishing

If you want to publish release candidate version, use suffix `-rc.*` for package version in package.json file and git tag.

This package version will be published to NPM with `next` tag.

Stable version: `2.19.0`
Release candidate: `2.19.1-rc.0`, `2.19.1-rc.1`, ...
Next version: `2.19.1`

Do not forget to mark this release as a pre-release!

![](https://capella.pics/796de9eb-bbe0-485c-bc8f-9a4cb76641b7.jpg)

## Example pipeline

Let's imagine that package version is `2.19.0` and you want to add some bug fixes and publish an update as `2.19.1`.

1. Merge a single update or a few pulls with fixes to the default branch `next`.
2. Bump the version up to `2.19.1-rc.0` in the package.json. For the rest rc updates you should bump version number in suffix (to `2.19.1-rc.1` etc).
3. Create a new release on the releases page with tag `v2.19.1-rc.0` and mark "This is pre-release" checkbox.
[Action](.github/workflows/publish.yml) will automatically push the package to NPM with tag `next`.
4. When you ready to publish a release, remove suffix from version name, push changes and create a new release with tag `v2.19.1`.
Same action will publish a new package as `latest` update.
5. Merge branch `next` to `master` and celebrate the release. You're rock!
