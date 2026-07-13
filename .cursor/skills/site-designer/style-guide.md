# jasonrundell.com - Style Guide

> **Status:** Draft for approval (with Pencil mocks)  
> **Canonical for AI:** this file  
> **Human review:**
> [`design/style-guide.html`](../../../design/style-guide.html)  
> **Mocks:** [`design/site.pen`](../../../design/site.pen) - Line-Art frames  
> **Strategy partner:**
> [`leadership-rebrand-site`](../leadership-rebrand-site/SKILL.md)

## Mood

- **Brand tension:** Leadership + craft - technical engineering leader who still
  raises the bar hands-on.
- **Mood brief:** Calm authority with a craft signal - workshop light on paper
  and steel, not startup neon. Deliberate, spacious, measurable. Dominant visual
  = continuous-line editorial illustrations (scalable vector), not abstract
  blobs, terminal gimmicks, or diagram-panel systems maps.
- **Atmosphere:** Cool off-white ground, sharp edges, hairline structure,
  forest-green accent for actions and a single focal mark per illustration.

## Color

| Role          | Token                                   | Value     | Usage                                                         |
| ------------- | --------------------------------------- | --------- | ------------------------------------------------------------- |
| Background    | `--color-bg` / `$surfacePrimary`        | `#F7F8FA` | Page ground                                                   |
| Surface       | `--color-surface` / `$surfaceSecondary` | `#FFFFFF` | Alternating bands, panels                                     |
| Text          | `--color-text` / `$ink`                 | `#1A1A1A` | Headlines, primary UI                                         |
| Text muted    | `--color-ink-muted` / `$inkMuted`       | `#5F5F5F` | Body, nav links                                               |
| Text faint    | `--color-ink-faint` / `$inkFaint`       | `#767676` | Meta / motion notes                                           |
| Accent        | `--color-accent` / `$accent`            | `#1F4D3A` | CTAs, mono labels, single illo focal fill                     |
| Accent soft   | `--color-accent-soft` / `$accentSoft`   | `#2F5D50` | Hover / secondary emphasis                                    |
| Craft steel   | `--color-craft-steel` / `$craftSteel`   | `#3F3F46` | Reserved steel tone (Pencil variable; not yet in code tokens) |
| Illust. ink   | (script `ink`)                          | `#2E3338` | Continuous-line path fills in `design/illustrations/*.js`     |
| Border        | `--color-line` / `$line`                | `#1A1A1A` | Hairline strokes, framed panels                               |
| Border subtle | `--color-line-subtle` / `$lineSubtle`   | `#E6E8EC` | Section hairlines                                             |
| Footer link   | `--color-footer-link`                   | `#D6D3D1` | Footer body/links, open mobile secondary links                |

Contrast: WCAG 2.1 AA (4.5:1 text, 3:1 large text). `inkMuted`, `inkFaint`, and
`lineSubtle` are intentionally darker than the original Pencil swatches so muted
body/meta text clears AA on the paper ground.

## Typography

| Role         | Family        | Size / weight | Notes                                  |
| ------------ | ------------- | ------------- | -------------------------------------- |
| Display      | Newsreader    | 48–56 / 600   | Hero + page titles (hero desktop ≈ 52) |
| Heading      | Newsreader    | 28–36 / 600   | Section titles                         |
| Body         | Geist         | 15–18 / 400   | Reading text                           |
| Mono / craft | IBM Plex Mono | 11–14 / 500   | Eyebrows, metrics, craft labels        |

Avoid Inter, Roboto, Arial, system defaults.

## Spacing

| Token           | Value                      | Usage               |
| --------------- | -------------------------- | ------------------- |
| Page gutter     | 64px desktop / 20px mobile | Horizontal padding  |
| Section pad     | 56–72px vertical           | Between major bands |
| Stack gap       | 20–36px                    | Within a section    |
| Tight           | 8–12px                     | Labels → body       |
| Primary CTA pad | 14×22                      | Solid accent button |

## Motion

| Motion           | Trigger                 | Intent                                                          |
| ---------------- | ----------------------- | --------------------------------------------------------------- |
| Hero / illo draw | Scroll-in / first paint | Continuous-line illustration draws itself; copy settles with it |
| Section enter    | Scroll into view        | Soft upward fade for proof / principles / cases                 |
| CTA press        | Hover / focus           | Accent darkens to `$accentSoft`; no glow                        |

Respect `prefers-reduced-motion` - illustration and section motion become
instant (no draw animation).

## Imagery

- Dominant visual: **continuous-line editorial** - scalable vector paths
  (`design/illustrations/`), one shared source per scene
- Palette inside illos: paper `#F7F8FA`, line ink `#2E3338`, **exactly one**
  solid `$accent` focal element
- Scenes (map to content, not decoration):
  - **Hero** - team → branching system → platform (homepage)
  - **Loop** - diagnose → improve → measure → scale (How I lead)
  - **Branch** - commits merge into a platform (Selected work)
- No photography required in hero; no overlay badges or chips
- Hairline borders, sharp corners

## Components

| Element       | Rules                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primary CTA   | Solid `$accent`, light text (`#F7F8FA`), sharp corners, 14×22 padding                                                                                                                                                                                                                                                                                                                                                                                                      |
| Secondary CTA | Text link with arrow (`View project →`); no pill, no border                                                                                                                                                                                                                                                                                                                                                                                                                |
| Nav           | Brand (Newsreader) left; Geist links + primary CTA right. Reusable Pencil: `LA Nav Desktop`                                                                                                                                                                                                                                                                                                                                                                                |
| Mobile nav    | Closed: Brand + “Menu” (`LA Nav Mobile`). Open: full-height `$ink` sheet with Close (`#A8A29E`), large Newsreader links, primary CTA (`Line-Art - Mobile Menu Open`)                                                                                                                                                                                                                                                                                                       |
| Footer        | Dark `$ink` band; Navigate / Connect / Engage columns; engagement modes in mono note. Reusable Pencil: `LA Footer`                                                                                                                                                                                                                                                                                                                                                         |
| Cards         | Default none in hero; mode tiles only in “Ways to work” (interaction/choice)                                                                                                                                                                                                                                                                                                                                                                                               |
| Project card  | Hairline-separated list row (top `$lineSubtle` rule, no box), stacked: mono meta label (`$accent`, e.g. year / award) → Newsreader title (`$ink`, 24 desktop / 18 mobile) → Geist description (`$inkMuted`) → mono tech stack (`$inkFaint`) → secondary **`View project →`** link (`$accent`, Geist 600, 8px above). No thumbnail. Whole row links to `/projects/[slug]`; the arrow link is the explicit affordance. Pencil: `Line-Art - Selected Work Desktop` / `Mobile` |

## Hover / interactive states

| Element                       | Default                | Hover                                                           |
| ----------------------------- | ---------------------- | --------------------------------------------------------------- |
| Nav link                      | `$inkMuted`            | `$ink`                                                          |
| Primary CTA                   | `$accent` fill         | `$accentSoft` fill (no glow)                                    |
| Secondary link                | `$ink`                 | `$accent`                                                       |
| Project card `View project →` | `$accent` text         | `$accentSoft`; arrow nudges right (no underline)                |
| Project card (row)            | `$lineSubtle` top rule | card region tints toward `$surfaceSecondary`; title → `$accent` |
| Footer link                   | `#D6D3D1`              | `#F7F8FA`                                                       |
| Mobile Menu                   | `$inkMuted`            | `$ink`; open drawer uses `$onInk` links + `#D6D3D1` secondary   |

Focus: visible outline using `$accent` / ink - never rely on color alone.

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
