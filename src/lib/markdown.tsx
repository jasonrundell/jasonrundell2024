'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RenderedMDXProps {
  source: string
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
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        img: ({ src, alt, ...props }: any) => (
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
      }}
    >
      {source}
    </ReactMarkdown>
  )
}
