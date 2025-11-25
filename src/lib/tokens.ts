import tokensFile from './common.tokens.json'

// Ensure the tokens are properly parsed and have fallbacks
const Tokens = JSON.parse(JSON.stringify(tokensFile))

// Add fallback values for missing properties to prevent styling breaks
if (!Tokens.colors) Tokens.colors = {}
if (!Tokens.sizes) Tokens.sizes = {}
if (!Tokens.fontSizes) Tokens.fontSizes = {}
if (!Tokens.borderRadius) Tokens.borderRadius = {}
if (!Tokens.fonts) Tokens.fonts = {}

// Ensure critical color properties exist
if (!Tokens.colors.primary)
  Tokens.colors.primary = { value: '#e9be62', unit: 'hex' }
if (!Tokens.colors.secondary)
  Tokens.colors.secondary = { value: '#eee', unit: 'hex' }
if (!Tokens.colors.background)
  Tokens.colors.background = { value: '#232f3e', unit: 'hex' }
if (!Tokens.colors.backgroundDarker)
  Tokens.colors.backgroundDarker = { value: '#151c25', unit: 'hex' }
if (!Tokens.colors.textPrimary)
  Tokens.colors.textPrimary = { value: '#9aaec6', unit: 'hex' }
if (!Tokens.colors.textSecondary)
  Tokens.colors.textSecondary = { value: '#757575', unit: 'hex' }
if (!Tokens.colors.border) Tokens.colors.border = { value: '#ddd', unit: 'hex' }
if (!Tokens.colors.success)
  Tokens.colors.success = { value: '#0070f3', unit: 'hex' }
if (!Tokens.colors.warning)
  Tokens.colors.warning = { value: '#f5a623', unit: 'hex' }
if (!Tokens.colors.error)
  Tokens.colors.error = { value: '#d93f3f', unit: 'hex' }

// Ensure critical size properties exist
if (!Tokens.sizes.spacing) Tokens.sizes.spacing = {}
if (!Tokens.sizes.padding) Tokens.sizes.padding = {}
if (!Tokens.sizes.fonts) Tokens.sizes.fonts = {}
if (!Tokens.sizes.breakpoints) Tokens.sizes.breakpoints = {}

if (!Tokens.sizes.spacing.small)
  Tokens.sizes.spacing.small = { value: 1, unit: 'rem' }
if (!Tokens.sizes.spacing.medium)
  Tokens.sizes.spacing.medium = { value: 1.25, unit: 'rem' }
if (!Tokens.sizes.spacing.large)
  Tokens.sizes.spacing.large = { value: 1.5, unit: 'rem' }

if (!Tokens.sizes.padding.small)
  Tokens.sizes.padding.small = { value: 1, unit: 'rem' }
if (!Tokens.sizes.padding.medium)
  Tokens.sizes.padding.medium = { value: 1.25, unit: 'rem' }
if (!Tokens.sizes.padding.large)
  Tokens.sizes.padding.large = { value: 2, unit: 'rem' }
if (!Tokens.sizes.padding.xlarge)
  Tokens.sizes.padding.xlarge = { value: 3, unit: 'rem' }

if (!Tokens.sizes.fonts.small)
  Tokens.sizes.fonts.small = { value: 1, unit: 'rem' }
if (!Tokens.sizes.fonts.medium)
  Tokens.sizes.fonts.medium = { value: 1.5, unit: 'rem' }
if (!Tokens.sizes.fonts.large)
  Tokens.sizes.fonts.large = { value: 1.75, unit: 'rem' }
if (!Tokens.sizes.fonts.xlarge)
  Tokens.sizes.fonts.xlarge = { value: 2.75, unit: 'rem' }

if (!Tokens.sizes.breakpoints.small)
  Tokens.sizes.breakpoints.small = { value: 20, unit: 'rem' }
if (!Tokens.sizes.breakpoints.medium)
  Tokens.sizes.breakpoints.medium = { value: 48, unit: 'rem' }
if (!Tokens.sizes.breakpoints.large)
  Tokens.sizes.breakpoints.large = { value: 64, unit: 'rem' }
if (!Tokens.sizes.breakpoints.xlarge)
  Tokens.sizes.breakpoints.xlarge = { value: 90, unit: 'rem' }

if (!Tokens.sizes.xsmall) Tokens.sizes.xsmall = { value: 0.25, unit: 'rem' }
if (!Tokens.sizes.small) Tokens.sizes.small = { value: 1, unit: 'rem' }
if (!Tokens.sizes.medium) Tokens.sizes.medium = { value: 1.25, unit: 'rem' }
if (!Tokens.sizes.large) Tokens.sizes.large = { value: 1.5, unit: 'rem' }
if (!Tokens.sizes.xlarge) Tokens.sizes.xlarge = { value: 2, unit: 'rem' }

if (!Tokens.fontSizes.sm) Tokens.fontSizes.sm = { value: 0.875, unit: 'rem' }
if (!Tokens.fontSizes.base) Tokens.fontSizes.base = { value: 1, unit: 'rem' }
if (!Tokens.fontSizes.lg) Tokens.fontSizes.lg = { value: 1.125, unit: 'rem' }

if (!Tokens.borderRadius.small)
  Tokens.borderRadius.small = { value: 0.25, unit: 'rem' }
if (!Tokens.borderRadius.medium)
  Tokens.borderRadius.medium = { value: 0.5, unit: 'rem' }
if (!Tokens.borderRadius.large)
  Tokens.borderRadius.large = { value: 0.75, unit: 'rem' }

if (!Tokens.fonts.body) Tokens.fonts.body = { family: 'Arial, sans-serif' }
if (!Tokens.fonts.heading) Tokens.fonts.heading = { family: 'Georgia, serif' }
if (!Tokens.fonts.monospace)
  Tokens.fonts.monospace = { family: 'Courier New, monospace' }

export default Tokens
