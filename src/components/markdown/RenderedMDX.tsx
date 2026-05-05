'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface RenderedMDXProps {
  source: string
}

const markdownComponents: Components = {
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ''}
      {...props}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  ),
  code: ({ children, className, ...props }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <pre className={className}>
          <code {...props} className={className}>
            {children}
          </code>
        </pre>
      )
    }
    return (
      <code {...props} className={className}>
        {children}
      </code>
    )
  },
}

/**
 * Renders a markdown/MDX body string using react-markdown with GFM support.
 *
 * Used wherever Contentful rich text was previously rendered via
 * documentToReactComponents(). The `source` string comes from gray-matter
 * frontmatter parsing of the MDX file's body.
 *
 * Images are rendered as plain <img> elements with responsive sizing so that
 * content/ images (unknown dimensions) render without requiring explicit
 * width/height props.
 */
export default function RenderedMDX({ source }: RenderedMDXProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {source}
    </ReactMarkdown>
  )
}
