import React from 'react'

type CSSVars = React.CSSProperties & Record<`--${string}`, string>
type SpacerSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'

const spacerClassNames: Record<SpacerSize, string> = {
  xsmall: 's1j1ckvc-1',
  small: 's1j1ckvc-2',
  medium: 's1j1ckvc-3',
  large: 's1j1ckvc-4',
  xlarge: 's1j1ckvc-5',
}

const mediumSpacerClassNames: Record<SpacerSize, string> = {
  xsmall: 's1j1ckvc-6',
  small: 's1j1ckvc-7',
  medium: 's1j1ckvc-8',
  large: 's1j1ckvc-9',
  xlarge: 's1j1ckvc-10',
}

const largeSpacerClassNames: Record<SpacerSize, string> = {
  xsmall: 's1j1ckvc-11',
  small: 's1j1ckvc-12',
  medium: 's1j1ckvc-13',
  large: 's1j1ckvc-14',
  xlarge: 's1j1ckvc-15',
}

function classNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function Row({
  justify = 'start',
  align = 'start',
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
}) {
  return (
    <div
      className={classNames('s1kfkqp6', className)}
      style={
        {
          '--s1kfkqp6-0': justify,
          '--s1kfkqp6-1': align,
          ...style,
        } as CSSVars
      }
      {...props}
    />
  )
}

export function Grid({
  columnGap = '',
  rowGap = '',
  gridTemplateColumns = '1fr',
  mediumTemplateColumns = '1fr 1fr',
  largeTemplateColumns = '1fr 1fr 1fr',
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  columnGap?: string
  rowGap?: string
  gridTemplateColumns?: string
  mediumTemplateColumns?: string
  largeTemplateColumns?: string
}) {
  return (
    <div
      className={classNames('s1w3m6ls', className)}
      style={
        {
          '--s1w3m6ls-0': columnGap,
          '--s1w3m6ls-1': rowGap,
          '--s1w3m6ls-2': gridTemplateColumns,
          '--s1w3m6ls-3': mediumTemplateColumns,
          '--s1w3m6ls-4': largeTemplateColumns,
          ...style,
        } as CSSVars
      }
      {...props}
    />
  )
}

export function Spacer({
  smallScreen = 'small',
  mediumScreen = 'small',
  largeScreen = 'small',
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  smallScreen?: SpacerSize
  mediumScreen?: SpacerSize
  largeScreen?: SpacerSize
}) {
  return (
    <div
      className={classNames(
        's1j1ckvc',
        spacerClassNames[smallScreen],
        mediumSpacerClassNames[mediumScreen],
        largeSpacerClassNames[largeScreen],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

export function Heading({
  level = 1,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}) {
  return React.createElement(`h${level}`, {
    className: classNames('safy9og', `safy9og-${level}`, className),
    ...props,
  })
}

export function Blockquote({
  color,
  className,
  style,
  ...props
}: React.BlockquoteHTMLAttributes<HTMLQuoteElement> & { color?: string }) {
  return (
    <blockquote
      className={classNames('slq3ov4', className)}
      style={
        {
          '--slq3ov4-0': color ?? '',
          '--slq3ov4-1': color ?? '',
          ...style,
        } as CSSVars
      }
      {...props}
    />
  )
}

export function Box({
  isTight = false,
  isRoomy = false,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  isTight?: boolean
  isRoomy?: boolean
}) {
  return (
    <div
      className={classNames(
        'snisusl',
        isRoomy ? 'snisusl-1' : isTight ? 'snisusl-2' : 'snisusl-3',
        className
      )}
      {...props}
    />
  )
}

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames('sywgbre', className)} {...props} />
}

export function Button({
  primary = false,
  size = 'medium',
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  primary?: boolean
  size?: 'small' | 'medium' | 'large'
  label: string
}) {
  const sizeClassName =
    size === 'small' ? 's14painh-1' : size === 'large' ? 's14painh-3' : 's14painh-2'

  return (
    <button
      type="button"
      className={classNames(
        's14painh',
        sizeClassName,
        primary ? 's14painh-4' : 's14painh-5',
        className
      )}
      {...props}
    >
      {label}
    </button>
  )
}

export function Link({
  label = 'Click here to visit',
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  label?: string
}) {
  return (
    <a className={classNames('swintyh', className)} {...props}>
      {label}
    </a>
  )
}
