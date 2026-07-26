---
name: leadership-rebrand-site
description: >-
  Design a personal marketing website that positions Jason Rundell as a
  technical engineering leader without erasing hands-on development craft.
  Produces positioning, mood brief, IA, homepage structure, microcopy, and CTA
  strategy. Hands visual system and implementation to site-designer. Use when
  designing, redesigning, or briefing a personal brand site, portfolio, or
  marketing homepage for leadership + player-coach positioning, or when the user
  mentions jasonrundell.com, personal site design, or leadership marketing site.
---

# Leadership Brand Site Design

Design (or brief) a personal marketing site that resolves one tension:

**Leadership + craft.** Visitors must feel both: this person can lead an
engineering org _and_ still go deep enough to raise the technical bar.

For full positioning, proof points, and audience detail, read
[positioning.md](positioning.md).

## Partner skill

Visual system, Pencil mocks, dual style guides, and implementation belong to
[`site-designer`](../site-designer/SKILL.md). This skill stops at strategy +
**mood brief**. Do not invent a full token/type/imagery system here.

## Workflow

1. **Confirm scope.** Design brief only, mood brief, homepage wireframe, full
   IA + copy, or handoff to `site-designer`. Ask only if a decision would
   materially change the design.
2. **Load positioning.** Read [positioning.md](positioning.md). Prefer facts
   from the user's resume / career-fit docs over inventing metrics.
3. **Lock the brand tension.** Every major section must prove leadership _and_
   craft (see checklist below). Reject pure-manager or pure-IC vibes.
4. **Deliver** using the Output Format. Lead with positioning + mood brief, then
   structure and copy. For visuals → `site-designer`.

## Brand Tension (non-negotiable)

Make both true in the first viewport and throughout:

1. **Leadership** - direction, quality bars, hiring/coaching, Product
   partnership, measurable outcomes
2. **Craft** - architecture, delivery systems, code quality, DevEx; not a pure
   people-manager who left the keyboard

Avoid:

- Generic “transformational leader” corporate speak
- Pure IC portfolio that buries leadership
- Resume-on-a-webpage layouts
- Purple-gradient / Inter-default / dark-mode-glow AI clichés
- Card-heavy dashboards, pill clusters, or stat strips in the hero

## Design Constraints

- One composition in the first viewport - not a dashboard
- Name/brand as a hero-level signal (not just nav text)
- Hero budget: brand/name, one headline, one short supporting sentence, one CTA
  group, one dominant visual idea
- No hero overlays (floating badges, chips, stickers)
- Default: no cards in the hero; cards only when they contain a real interaction
- One job per section: one purpose, one headline, one short supporting line
- Expressive typography (avoid Inter, Roboto, Arial, system defaults)
- Atmospheric background - not flat single-color
- Real visual anchor signaling craft + leadership (not abstract purple blobs)
- At least 2–3 intentional motion ideas (presence/hierarchy, not noise)
- Fully responsive; WCAG 2.1 AA mindset
- Define a clear visual direction with CSS variables / tokens

## Tone of Voice

- Direct, improvement-focused, confident - not boastful
- Concrete outcomes over adjectives
- No buzzword soup (“synergy,” “passionate about excellence,” “thought leader”)
- Signature energy: diagnose → improve → measure → scale the team

## Suggested IA

Improve if a stronger structure fits the scope:

| Page / section         | Job                                                                              |
| ---------------------- | -------------------------------------------------------------------------------- |
| Home                   | Positioning + proof + primary CTA                                                |
| How I lead             | Operating principles: improver, player-coach, governance, metrics                |
| Selected work          | Case teasers: problem → intervention → measurable result (org + technical depth) |
| About                  | Stage-fit story: thrive where chaos needs order                                  |
| Contact / work with me | FT vs fractional vs consulting clarity                                           |

Optional subordinate path: “want to see the builder?” → selected case studies /
writing / GitHub - never the primary narrative.

## Leadership + Craft Checklist

Before finishing, verify the design repeatedly proves both:

- [ ] First viewport reads as technical engineering leader (not “manager site”
      or “dev portfolio”)
- [ ] At least one proof point is an org/outcome metric
- [ ] At least one proof point shows hands-on technical depth
- [ ] Case modules mix delivery/leadership intervention with stack or systems
      detail
- [ ] CTAs cover leadership conversations without hiding consulting/builder
      paths
- [ ] Visual language feels crafted (type, atmosphere, motion) - not
      template-corporate
- [ ] A stranger would leave thinking: _can lead my org and still raise the
      technical bar_

## Output Format

Produce these deliverables (skip only if the user narrowed scope):

1. **Positioning statement** (1 sentence) + **tagline options** (5)
2. **Mood brief** - 2–4 sentences: atmosphere, craft signal, what to avoid. Full
   visual system (tokens, type, Pencil mocks, style guides) →
   [`site-designer`](../site-designer/SKILL.md)
3. **Homepage wireframe** - section-by-section: purpose, headline, body, CTA,
   visual job (not pixel specs)
4. **Component inventory** - nav, hero, proof (if any), case module, principles,
   CTA band, footer
5. **Content outline** - draft microcopy for hero + 3 case-study teasers
   balancing leadership + hands-on depth
6. **CTA strategy** - FT leadership vs fractional/consulting without confusing
   the brand
7. **Leadership-without-losing-craft checklist** - filled against this design
8. Optional: ASCII or markdown sketch of the first viewport
9. **Handoff** - when visuals/implementation are next, point to `site-designer`

## Success Criteria

A stranger should leave thinking:

> “This person can lead my engineering org _and_ still go deep enough to raise
> the technical bar.”

Not: “Nice manager resume site.” or “Cool developer portfolio.”

## Additional Resources

- [positioning.md](positioning.md) - identity, audiences, proof points,
  engagement modes
- [`site-designer`](../site-designer/SKILL.md) - Pencil mocks, style guides,
  design-to-code
- [style-guide.md](../site-designer/style-guide.md) - AI canonical visual system
  (once filled)
- [design/style-guide.html](../../../design/style-guide.html) - human review
  page
