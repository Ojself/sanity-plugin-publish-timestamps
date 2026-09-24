import {definePlugin, type UseDateTimeFormatOptions} from 'sanity'

import {createFirstPublishedBadge, createLastPublishedBadge, DEFAULT_FORMAT} from './badges'
import {HideRelativeStatus} from './HideRelativeStatus'
import {enUS, nbNO} from './i18n'

export interface PublishTimestampsOptions {
  /** Document field holding the first-publish timestamp. Set to `false` to skip the badge. Default: `firstPublishedAt` */
  firstPublishedField?: string | false
  /** Intl.DateTimeFormat options, resolved against the Studio locale. Default: short date, medium time */
  format?: UseDateTimeFormatOptions
  /** Hide the built-in relative "Published 4 minutes ago" footer line. Default: `true` */
  hideRelativeStatus?: boolean
}

export const publishTimestamps = definePlugin<PublishTimestampsOptions | void>((options) => {
  const {
    firstPublishedField = 'firstPublishedAt',
    format = DEFAULT_FORMAT,
    hideRelativeStatus = true,
  } = options ?? {}

  const badges = [
    firstPublishedField ? createFirstPublishedBadge(firstPublishedField, format) : null,
    createLastPublishedBadge(format),
  ].filter((badge) => badge !== null)

  return {
    name: 'sanity-plugin-publish-timestamps',
    i18n: {bundles: [enUS, nbNO]},
    document: {
      badges: (prev) => [...badges, ...prev],
    },
    studio: hideRelativeStatus ? {components: {layout: HideRelativeStatus}} : undefined,
  }
})

export {enUS as publishTimestampsEnUS, nbNO as publishTimestampsNbNO} from './i18n'
