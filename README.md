# sanity-plugin-publish-timestamps

Shows absolute **first published** and **last published** timestamps as badges in the Studio document footer, and hides the built-in relative line ("Published 4 minutes ago").

Badges follow the Studio locale. Bundles ship for `en-US` and `nb-NO`.

![First published and Published badges in the document footer](./screenshot.png)

## Install

```sh
npm install sanity-plugin-publish-timestamps
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
  firstPublishedField: 'firstPublishedAt', // string | false, default 'firstPublishedAt'
  format: {dateStyle: 'short', timeStyle: 'medium'}, // Intl.DateTimeFormatOptions
  hideRelativeStatus: true, // hide the built-in relative footer line
})
```

## First published needs a field

Sanity keeps no first-publish timestamp. The published document's `_createdAt` is copied from the draft, so it reflects when the draft was created, not when it went live. The plugin reads `firstPublishedField` from the published document (falling back to the draft), so the field has to be set by your publish action.

Minimal wrapper around the built-in publish action:

```ts
import {type DocumentActionComponent, useDocumentOperation} from 'sanity'

export function withPublishTimestamps(Action: DocumentActionComponent): DocumentActionComponent {
  const Wrapped: DocumentActionComponent = (props) => {
    const {patch} = useDocumentOperation(props.id, props.type)
    const inner = Action(props)
    if (!inner) return null
    return {
      ...inner,
      onHandle: () => {
        const now = new Date().toISOString()
        // setIfMissing keeps the first publish time across republishes
        patch.execute([{setIfMissing: {firstPublishedAt: now}}, {set: {lastPublishedAt: now}}])
        inner.onHandle?.()
      },
    }
  }
  Wrapped.action = Action.action
  return Wrapped
}
```

Add `firstPublishedAt` (and optionally `lastPublishedAt`) as hidden or read-only `datetime` fields on the document types.
