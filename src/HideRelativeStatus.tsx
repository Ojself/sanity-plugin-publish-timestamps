import {type LayoutProps} from 'sanity'

// The built-in footer line ("Published 4 minutes ago") has no config switch, so hide it by test id.
const CSS = '[data-testid="pane-footer-document-status"]{display:none}'

export function HideRelativeStatus(props: LayoutProps) {
  return (
    <>
      <style>{CSS}</style>
      {props.renderDefault(props)}
    </>
  )
}
