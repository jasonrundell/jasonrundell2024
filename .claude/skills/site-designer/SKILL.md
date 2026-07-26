---
name: site-designer
description: >-
  Visual redesign partner for jasonrundell.com. Builds Pencil mocks, dual style
  guides, and implements approved designs in the Next.js repo. Use when
  redesigning the site, creating visual systems, Pencil/.pen mocks, style
  guides, design-to-code handoff, or when leadership-rebrand-site hands off a
  mood brief for visual execution.
---

# Site Designer - jasonrundell.com

Downstream execution partner to
[`leadership-rebrand-site`](../leadership-rebrand-site/SKILL.md).

| Skill                     | Owns                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------- |
| `leadership-rebrand-site` | _What / why_ - positioning, IA, section jobs, copy brief, CTA strategy, **mood brief** |
| `site-designer`           | _How it looks / behaves_ - visual system, Pencil mocks, style guides, implementation   |

Do **not** invent a competing brand story. Load strategy first; refine layout
and craft only.

## Prerequisites (hard gate)

Before opening Pencil:

1. Read
   [`../leadership-rebrand-site/SKILL.md`](../leadership-rebrand-site/SKILL.md)
   and
   [`../leadership-rebrand-site/positioning.md`](../leadership-rebrand-site/positioning.md).
2. Confirm an in-session (or recently agreed) strategy package exists:
   - Positioning statement
   - Mood brief (2–4 sentences)
   - IA / homepage structure
   - CTA strategy
3. If any of those are missing → **stop**. Run or point the user to
   `leadership-rebrand-site` first.

Designer may refine composition. Designer must **not** rewrite positioning,
audience priority, or CTA strategy.

## Pencil MCP

Visual mocks in Pencil are **required**. Do not approve or implement from
markdown/ASCII alone.

1. Ensure the Pencil extension is installed and activated.
2. Open or create `design/site.pen` so the Pencil MCP server is running.
3. Verify Pencil tools are available (Settings → Tools & MCP). If missing, ask
   the user to open the `.pen` file and reconnect - do not proceed without MCP.
4. Follow Pencil workflow: `get_editor_state` → guidelines/style guides →
   `batch_design` → `get_screenshot` + `snapshot_layout` per screen.

Greenfield is allowed. Do **not** preserve existing site patterns by default.

## Artifact paths

```
.cursor/skills/site-designer/
├── SKILL.md
└── style-guide.md          # AI canonical style guide

design/
├── style-guide.html        # Human review page (open in browser)
└── site.pen                # Pencil canvas (minimum mock set)
```

- **Markdown is canonical** for agents. HTML is the human review surface.
- If they diverge: update `style-guide.md` first, then sync
  `design/style-guide.html`.

## Minimum mock set (approval package)

Build all of these in `design/site.pen` before requesting approval:

1. **Home first viewport** - desktop + mobile
2. **Home full scroll** - all sections from the rebrand IA
3. **One interior page** - default **How I lead** (unless the brief specifies
   another)
4. **Shared chrome** - nav + footer as reusable Pencil components

Also complete before approval:

5. [style-guide.md](style-guide.md) - filled (not TBD placeholders)
6. [design/style-guide.html](../../../design/style-guide.html) - synced visual
   review page

## Workflow

1. **Strategy gate** - prerequisites above.
2. **Visual system** - lock tokens, type, color roles, spacing, motion, imagery
   from the mood brief. Write both style guides.
3. **Pencil mocks** - minimum set; screenshot and layout-check each screen.
4. **Approval gate** - present paths + screenshots; list what you are asking to
   approve; **STOP**. Wait for explicit go-ahead (`approved`, `LGTM`,
   `implement`, etc.). On change requests: iterate in Pencil + style guides,
   then re-request approval. Never implement silently.
5. **Implement** - only after approval. Match `design/site.pen` and the style
   guides in the Next.js app. Greenfield OK.
6. **Verify** - leadership + craft checklist (below) and responsive/a11y basics.

## Style guide contents (one page)

Both `style-guide.md` and `design/style-guide.html` must cover:

- Mood / brand tension reminder (leadership + craft)
- Color roles + hex/CSS variables
- Typography (families, scale, usage)
- Spacing scale
- Motion principles (2–3 intentional motions; respect `prefers-reduced-motion`)
- Imagery rules
- Component craft notes (buttons, links, chrome)
- Do / don’t (include AI cliché bans from the rebrand skill)

## Design constraints (inherit + enforce)

From `leadership-rebrand-site` and project frontend rules:

- One composition in the first viewport - not a dashboard
- Name/brand as a hero-level signal
- Hero budget: brand/name, one headline, one supporting sentence, one CTA group,
  one dominant visual
- No hero overlays; default no cards in the hero
- One job per section
- Expressive type (no Inter / Roboto / Arial / system defaults)
- Atmospheric background - not flat single-color
- Real visual anchor for craft + leadership
- Avoid purple-gradient / dark-glow / cream-serif-terracotta AI clichés
- WCAG 2.1 AA mindset; fully responsive

## Leadership + craft checklist

Before finishing mocks or implementation:

- [ ] First viewport reads as technical engineering leader
- [ ] Org/outcome proof and hands-on technical depth both visible in the system
- [ ] Visual language feels crafted - not template-corporate
- [ ] Style guides match Pencil and (after implement) code
- [ ] Approval was explicit before any code changes

## Output / handoff format

### At approval gate

1. Paths: `design/site.pen`, `style-guide.md`, `design/style-guide.html`
2. Screenshot summary of each minimum mock
3. Approval checklist (visual system, first viewport, home scroll, How I lead,
   chrome, style guides)
4. Clear stop: waiting for user approval

### After approval (implementation)

1. Code changes matching approved mocks
2. Note any intentional deviations (must be called out)
3. Confirm style guides still accurate

## Partner skill

Strategy, mood brief, IA, copy, CTAs:
[`leadership-rebrand-site`](../leadership-rebrand-site/SKILL.md)
