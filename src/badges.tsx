import {
  type DocumentBadgeComponent,
  type DocumentBadgeProps,
  useDateTimeFormat,
  type UseDateTimeFormatOptions,
  useTranslation,
} from 'sanity'

import {NAMESPACE} from './i18n'

export const DEFAULT_FORMAT: UseDateTimeFormatOptions = {
  dateStyle: 'short',
  timeStyle: 'medium',
}

function useFormattedDate(value: string | undefined, format: UseDateTimeFormatOptions) {
  const fmt = useDateTimeFormat(format)
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : fmt.format(date)
}

export function createLastPublishedBadge(format: UseDateTimeFormatOptions): DocumentBadgeComponent {
  const LastPublishedBadge: DocumentBadgeComponent = ({published}: DocumentBadgeProps) => {
    const {t} = useTranslation(NAMESPACE)
    const date = useFormattedDate(published?._updatedAt, format)
    if (!date) return null
    return {label: t('badge.last-published', {date}), title: t('badge.last-published.title')}
  }
  LastPublishedBadge.displayName = 'LastPublishedBadge'
  return LastPublishedBadge
}

export function createFirstPublishedBadge(
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
