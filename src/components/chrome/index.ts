/**
 * Refined-terminal "chrome" primitives — the small set of visual primitives
 * that carry the syntax-highlight aesthetic across pages without scattering
 * one-off styles into every component.
 *
 * Usage:
 *   import { SectionHeading, PromptList, MetaDate, TerminalButtonLink,
 *            HeroConstDeclaration } from '@/components/chrome'
 */
export { default as SectionHeading } from './SectionHeading'
export type { SectionHeadingLevel } from './SectionHeading'
export { default as PromptList, PromptItem } from './PromptList'
export { default as MetaDate } from './MetaDate'
export { default as TerminalButtonLink } from './TerminalButtonLink'
export { default as HeroConstDeclaration } from './HeroConstDeclaration'
export type { HeroConstField } from './HeroConstDeclaration'
