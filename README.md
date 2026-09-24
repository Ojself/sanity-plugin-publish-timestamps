# sanity-plugin-publish-timestamps

Shows absolute **first published** and **last published** timestamps as badges in the Studio document footer, and hides the built-in relative line ("Published 4 minutes ago").

Badges follow the Studio locale. Bundles ship for `en-US` and `nb-NO`.

![First published and Published badges in the document footer](./screenshot.png)

## Install

Not published to npm. Copy `src/` into your Studio's plugins folder, or install from GitHub:

```sh
npm install github:Ojself/sanity-plugin-publish-timestamps
```

```ts
import {defineConfig} from 'sanity'
import {publishTimestamps} from 'sanity-plugin-publish-timestamps'

export default defineConfig({
  // ...
  plugins: [publishTimestamps()],
})
```

## Options

```ts
publishTimestamps({
  firstPublishedField: 'firstPublished', // string | false, default 'firstPublished'
  format: {dateStyle: 'short', timeStyle: 'medium'}, // Intl.DateTimeFormatOptions
  hideRelativeStatus: true, // hide the built-in relative footer line
})
```

## First published needs a field

Sanity keeps no first-publish timestamp. The published document's `_createdAt` is copied from the draft, so it reflects when the draft was created, not when it went live. The plugin reads `firstPublishedField` (default `firstPublished`) from the published document, falling back to the draft, so something has to write that field.

Use the [First published timestamp function](https://www.sanity.io/recipes/first-published-timestamp-function-7a787908) recipe. It is a Sanity Function on the `create` event, filtered on `!defined(firstPublished)`, that patches `firstPublished` with `setIfMissing`. Functions only fire for published documents, so `create` means first publish, and it covers every publish path: Studio, API, scheduled publishing, releases. Widen the recipe's `_type == 'post'` filter to your own document types and the default field name here matches it.

Add `firstPublished` as a hidden or read-only `datetime` field on those document types.
