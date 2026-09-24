import {defineLocaleResourceBundle} from 'sanity'

export const NAMESPACE = 'publish-timestamps'

export const enUS = defineLocaleResourceBundle({
  locale: 'en-US',
  namespace: NAMESPACE,
  resources: {
    'badge.first-published': 'First published {{date}}',
    'badge.last-published': 'Published {{date}}',
    'badge.first-published.title': 'First time this document was published',
    'badge.last-published.title': 'Most recent publish',
  },
})

export const nbNO = defineLocaleResourceBundle({
  locale: 'nb-NO',
  namespace: NAMESPACE,
  resources: {
    'badge.first-published': 'Først publisert {{date}}',
    'badge.last-published': 'Publisert {{date}}',
    'badge.first-published.title': 'Første gang dokumentet ble publisert',
    'badge.last-published.title': 'Siste publisering',
  },
})
