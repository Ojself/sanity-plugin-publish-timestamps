# Publish timestamps for Sanity Studio

Shows absolute **first published** and **last published** timestamps as badges in the Studio document footer, and hides the built-in relative line ("Published 4 minutes ago").

![First published and Published badges in the document footer](./screenshot.png)

Badges follow the Studio locale. Strings ship for `en-US` and `nb-NO`.

## Install

Copy [`publishTimestamps.tsx`](./publishTimestamps.tsx) into your Studio's plugins folder. It depends on `sanity` only.

```ts
import {defineConfig} from 'sanity'
import {publishTimestamps} from './plugins/publishTimestamps'

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

## How it works

- Two `document.badges` hooks. Last published reads `published._updatedAt`; first published reads the configured field.
- A `studio.components.layout` wrapper injects one CSS rule hiding `[data-testid="pane-footer-document-status"]`. If Sanity renames that test id the relative line comes back, nothing else breaks.
