// Same card as Open Graph. Route segment config must be a literal in this
// file for Next.js to read it, so only the values and handler are re-exported.
export {
  default,
  alt,
  size,
  contentType,
  generateStaticParams,
} from './opengraph-image'

export const dynamicParams = false
