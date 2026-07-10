# jasonrundell.com — Style Guide

> **Status:** Draft for approval (with Pencil mocks)  
> **Canonical for AI:** this file  
> **Human review:** [`design/style-guide.html`](../../../design/style-guide.html)  
> **Mocks:** [`design/site.pen`](../../../design/site.pen) — Line-Art frames  
> **Strategy partner:** [`leadership-rebrand-site`](../leadership-rebrand-site/SKILL.md)

## Mood

- **Brand tension:** Leadership + craft — technical engineering leader who still raises the bar hands-on.
- **Mood brief:** Calm authority with a craft signal — workshop light on paper and steel, not startup neon. Deliberate, spacious, measurable. Dominant visual = continuous-line editorial illustrations (scalable vector), not abstract blobs, terminal gimmicks, or diagram-panel systems maps.
- **Atmosphere:** Cool off-white ground, sharp edges, hairline structure, forest-green accent for actions and a single focal mark per illustration.

## Color

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Background | `--color-bg` / `$surfacePrimary` | `#F7F8FA` | Page ground |
| Surface | `--color-surface` / `$surfaceSecondary` | `#FFFFFF` | Alternating bands, panels |
| Text | `--color-text` / `$ink` | `#1A1A1A` | Headlines, primary UI |
| Text muted | `--color-text-muted` / `$inkMuted` | `#666666` | Body, nav links |
| Text faint | `--color-text-faint` / `$inkFaint` | `#888888` | Meta / motion notes |
| Accent | `--color-accent` / `$accent` | `#1F4D3A` | CTAs, mono labels, single illo focal fill |
| Accent soft | `--color-accent-soft` / `$accentSoft` | `#2F5D50` | Hover / secondary emphasis |
| Craft steel | `--color-craft-steel` / `$craftSteel` | `#3F3F46` | Reserved steel tone (Pencil variable) |
| Illust. ink | (script `ink`) | `#2E3338` | Continuous-line path fills in `design/illustrations/*.js` |
| Border | `--color-border` / `$line` | `#1A1A1A` | Hairline strokes, framed panels |
| Border subtle | `--color-border-subtle` / `$lineSubtle` | `#EEF0F2` | Section hairlines |
| Footer muted | — | `#A8A29E` | Footer body / open mobile “Close” |

Contrast: WCAG 2.1 AA (4.5:1 text, 3:1 large text).

## Typography

| Role | Family | Size / weight | Notes |
| --- | --- | --- | --- |
| Display | Newsreader | 48–56 / 600 | Hero + page titles (hero desktop ≈ 52) |
| Heading | Newsreader | 28–36 / 600 | Section titles |
| Body | Geist | 15–18 / 400 | Reading text |
| Mono / craft | IBM Plex Mono | 11–14 / 500 | Eyebrows, metrics, craft labels |

Avoid Inter, Roboto, Arial, system defaults.

## Spacing

| Token | Value | Usage |
| --- | --- | --- |
| Page gutter | 64px desktop / 20px mobile | Horizontal padding |
| Section pad | 56–72px vertical | Between major bands |
| Stack gap | 20–36px | Within a section |
| Tight | 8–12px | Labels → body |
| Primary CTA pad | 14×22 | Solid accent button |

## Motion

| Motion | Trigger | Intent |
| --- | --- | --- |
| Hero / illo draw | Scroll-in / first paint | Continuous-line illustration draws itself; copy settles with it |
| Section enter | Scroll into view | Soft upward fade for proof / principles / cases |
| CTA press | Hover / focus | Accent darkens to `$accentSoft`; no glow |

Respect `prefers-reduced-motion` — illustration and section motion become instant (no draw animation).

## Imagery

- Dominant visual: **continuous-line editorial** — scalable vector paths (`design/illustrations/`), one shared source per scene
- Palette inside illos: paper `#F7F8FA`, line ink `#2E3338`, **exactly one** solid `$accent` focal element
- Scenes (map to content, not decoration):
  - **Hero** — team → branching system → platform (homepage)
  - **Loop** — diagnose → improve → measure → scale (How I lead)
  - **Branch** — commits merge into a platform (Selected work)
- No photography required in hero; no overlay badges or chips
- Hairline borders, sharp corners

## Components

| Element | Rules |
| --- | --- |
| Primary CTA | Solid `$accent`, light text (`#F7F8FA`), sharp corners, 14×22 padding |
| Secondary CTA | Text link with arrow; no pill |
| Nav | Brand (Newsreader) left; Geist links + primary CTA right |
| Mobile nav | Closed: Brand + “Menu”. Open: full-height `$ink` sheet with Close (`#A8A29E`), large Newsreader links, primary CTA |
| Footer | Dark `$ink` band; Explore / Connect columns; engagement modes in mono note |
| Cards | Default none in hero; mode tiles only in “Ways to work” (interaction/choice) |

## Hover / interactive states

| Element | Default | Hover |
| --- | --- | --- |
| Nav link | `$inkMuted` | `$ink` |
| Primary CTA | `$accent` fill | `$accentSoft` fill (no glow) |
| Secondary link | `$ink` | `$accent` |
| Footer link | `#E7E5E4` | `#F7F8FA` |
| Mobile Menu | `$inkMuted` | `$ink`; open state label = “Close” (`#A8A29E`) |

Focus: visible outline using `$accent` / ink — never rely on color alone.

## Do / Don’t

**Do**

- Prove leadership _and_ craft in the first viewport
- Keep one job per section
- Match Pencil Line-Art mocks after approval
- Reserve accent for actions, mono labels, and one focal mark per illustration

**Don’t**

- Purple gradients, dark glow, cream + terracotta serif clichés
- Resume-page or pure IC portfolio vibes
- Hero overlays, pill clusters, hero stat strips
- Multiple accent fills inside one illustration
- Implement before explicit user approval
