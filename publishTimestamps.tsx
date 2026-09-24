// Drop into your plugins folder and add
// `publishTimestamps()` to the workspace plugins list. Requires `sanity` only.
import {
  definePlugin,
  defineLocaleResourceBundle,
  type DocumentBadgeComponent,
  type DocumentBadgeProps,
  type LayoutProps,
  useDateTimeFormat,
  type UseDateTimeFormatOptions,
  useTranslation,
} from 'sanity'

export interface PublishTimestampsOptions {
  /** Document field holding the first-publish timestamp. Set to `false` to skip the badge. Default: `firstPublished` */
  firstPublishedField?: string | false
  /** Intl.DateTimeFormat options, resolved against the Studio locale. Default: short date, medium time */
  format?: UseDateTimeFormatOptions
  /** Hide the built-in relative "Published 4 minutes ago" footer line. Default: `true` */
  hideRelativeStatus?: boolean
}

const NAMESPACE = 'publish-timestamps'

const enUS = defineLocaleResourceBundle({
  locale: 'en-US',
  namespace: NAMESPACE,
  resources: {
    'badge.first-published': 'First published {{date}}',
    'badge.last-published': 'Published {{date}}',
    'badge.first-published.title': 'First time this document was published',
    'badge.last-published.title': 'Most recent publish',
  },
})

const nbNO = defineLocaleResourceBundle({
  locale: 'nb-NO',
  namespace: NAMESPACE,
  resources: {
    'badge.first-published': 'Først publisert {{date}}',
    'badge.last-published': 'Publisert {{date}}',
    'badge.first-published.title': 'Første gang dokumentet ble publisert',
    'badge.last-published.title': 'Siste publisering',
  },
})

const DEFAULT_FORMAT: UseDateTimeFormatOptions = {dateStyle: 'short', timeStyle: 'medium'}

function useFormattedDate(value: string | undefined, format: UseDateTimeFormatOptions) {
  const fmt = useDateTimeFormat(format)
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : fmt.format(date)
}

function createLastPublishedBadge(format: UseDateTimeFormatOptions): DocumentBadgeComponent {
  const LastPublishedBadge: DocumentBadgeComponent = ({published}: DocumentBadgeProps) => {
    const {t} = useTranslation(NAMESPACE)
    const date = useFormattedDate(published?._updatedAt, format)
    if (!date) return null
    return {label: t('badge.last-published', {date}), title: t('badge.last-published.title')}
  }
  LastPublishedBadge.displayName = 'LastPublishedBadge'
  return LastPublishedBadge
}

function createFirstPublishedBadge(
  field: string,
  format: UseDateTimeFormatOptions,
): DocumentBadgeComponent {
  const FirstPublishedBadge: DocumentBadgeComponent = ({published, draft}: DocumentBadgeProps) => {
    const {t} = useTranslation(NAMESPACE)
    // Published wins; the draft is the fallback so the badge survives an unpublish.
    const raw = (published ?? draft)?.[field]
    const date = useFormattedDate(typeof raw === 'string' ? raw : undefined, format)
    if (!date) return null
    return {label: t('badge.first-published', {date}), title: t('badge.first-published.title')}
  }
  FirstPublishedBadge.displayName = 'FirstPublishedBadge'
  return FirstPublishedBadge
}

// The built-in footer line has no config switch, so hide it by test id.
const HIDE_STATUS_CSS = '[data-testid="pane-footer-document-status"]{display:none}'

function HideRelativeStatus(props: LayoutProps) {
  return (
    <>
      <style>{HIDE_STATUS_CSS}</style>
      {props.renderDefault(props)}
    </>
  )
}

export const publishTimestamps = definePlugin<PublishTimestampsOptions | void>((options) => {
  const {
    firstPublishedField = 'firstPublished',
    format = DEFAULT_FORMAT,
    hideRelativeStatus = true,
  } = options ?? {}

  const badges = [
    firstPublishedField ? createFirstPublishedBadge(firstPublishedField, format) : null,
    createLastPublishedBadge(format),
  ].filter((badge) => badge !== null)

  return {
    name: 'publish-timestamps',
    i18n: {bundles: [enUS, nbNO]},
    document: {
      badges: (prev) => [...badges, ...prev],
    },
    studio: hideRelativeStatus ? {components: {layout: HideRelativeStatus}} : undefined,
  }
})
