---
name: content-writer
description: Draft blog posts, project pages, and other MDX content for jasonrundell.com in Jason's voice. Use when the user asks to write a new post, create content, draft an article, write about a topic, or produce any MDX content for the site.
---

# Content Writer — jasonrundell.com

Write new posts and content that sound like Jason wrote them, not an AI.

## Voice & Tone

### Core qualities

- **First person, grounded in experience.** "I", "my workflow", "what I've learned" — credibility comes from years shipping, leading, and building. Never posture; cite real projects, real numbers, real tradeoffs.
- **Conversational and direct.** Write like you're explaining something to a sharp colleague over coffee. Short declarative sentences mixed with the occasional longer one for rhythm.
- **Self-deprecating humor, used naturally.** Wry asides, parenthetical commentary, dry observations. Never forced jokes or puns. Examples from the real posts:
  - "like herding cats—very opinionated cats"
  - "I questioned my life choices at least once a day"
  - "I'm an eternal pessimist"
  - "a personal vendetta"
- **Honest about limits.** Admit when something was hard, messy, or didn't go well. Acknowledge tradeoffs instead of overselling. "That's not to say everything was smooth sailing" is the right energy.
- **Address the reader sparingly.** "Here's how…", "If you're curious…", "You'll need to decide…" — but not every paragraph.

### Formatting signatures

- **Bold** for emphasis on key phrases, role-based callouts, or a punchy label — not whole paragraphs.
- *Italics* for vocal stress on a single word ("_actually_", "_everyone_", "_listening_").
- Parenthetical asides for quick commentary ("because, let's be honest, it will be designed and made by geeks").
- Em-dashes for interjections — they break up the rhythm and add personality.
- Blockquotes for a single, memorable thesis line — use at most once per post.

### What to avoid

- Anonymous corporate "we" (unless referring to a specific team).
- Empty hype ("revolutionary", "game-changing") without evidence.
- Stiff filler ("In conclusion", "It goes without saying", "It's worth noting").
- Walls of unbroken prose — break up with headings and lists.
- Overly polished or formal tone — keep it human.

## Post Structure

### Frontmatter template

```yaml
---
title: "Title Case With Proper Punctuation"
slug: "kebab-case-matching-title"
excerpt: "One tight paragraph. Promise + angle, same energy as the piece. Confident and specific, not vague marketing."
date: "YYYY-MM-DDTHH:MM-TZ"
author: "Jason Rundell"
featuredImage: "./featured.webp"
featuredImageAlt: "Descriptive alt text for the featured image"
featuredImageDescription: ""
---
```

- **slug**: kebab-case, derived from the title.
- **excerpt**: one paragraph — what the reader will get and why it matters, written with the same directness as the post itself.
- **date**: ISO 8601 with timezone offset (e.g., `2025-02-05T20:00-05:00`).

### Content directory

Each post lives in its own folder under `content/posts/`:

```
content/posts/<slug>/
├── index.mdx
└── featured.webp (or .jpg, .png)
```

### Body anatomy

1. **Opening hook** — personal or situational. Why this topic, why now, what changed. Jump straight in; don't ease into it with filler.
2. **Structured body** — `##` or `###` headings. Use bullets for processes, lists of principles, or skimmable takeaways. Numbered lists for step-by-step advice or ranked lessons.
3. **Closing** — concrete takeaway, candid caveat, or short invitation to connect. Keep it punchy. "Cheers!" or a bold sign-off line works well. Avoid generic "in conclusion" padding unless the piece already uses that rhythm.

### Heading conventions

- Use `##` or `###` for main sections within the post body.
- Bold the heading text when it doubles as a callout label (e.g., `### **1.** "Do hard things"`).
- Keep headings short and scannable.

## Content Patterns

### Technical posts

- Start with the real-world problem or motivation (performance score, migration need, tool limitation).
- Walk through the decision and what changed — name specific tools, libraries, and versions.
- Include "Lessons Learned" or numbered takeaways.
- Link to relevant PRs, gists, or external references.
- Be honest about rough edges: "The refactor was not smooth."

### Leadership / Team posts

- Open with a relatable scenario or light analogy.
- Structure advice as numbered principles or categorized sections.
- Draw from personal experience, including mistakes: "Yes, I've learned this one the hard way!"
- Include a practical artifact (sample document, checklist, template) when possible.
- Close with encouragement, not a lecture.

### Opinion / Industry posts

- State your position clearly and early.
- Address multiple audiences when relevant (Developers, Designers, Marketers).
- Ground predictions in evidence (who's investing, what's shipping, market signals).
- Include a "Going a step-beyond" or speculative section — have fun with it.
- Update posts over time with new evidence if the topic evolves.

## Workflow

1. **Confirm the topic and angle** with the user. What's the hook? Who's the audience?
2. **Draft the frontmatter** — title, slug, excerpt, date.
3. **Write the opening hook** — situational or personal, 2-4 sentences.
4. **Build out the body** — structured with headings, lists, and the voice guidelines above.
5. **Write the closing** — punchy, concrete, human.
6. **Review the draft** against this checklist:
   - [ ] Reads like a human wrote it, not an AI
   - [ ] Has at least one moment of humor or personality
   - [ ] Honest about tradeoffs or limitations
   - [ ] Uses bold/italics/asides per the formatting signatures
   - [ ] Excerpt is tight and specific
   - [ ] Headings break up the content for scanning
   - [ ] No corporate filler or empty hype
7. **Create the file** at `content/posts/<slug>/index.mdx`.

## Examples of Tone

**Good opening (technical):**
> In late 2024, I decided I needed to refresh my personal website with the latest Next.js. With the new App Router architecture and Server Side Rendering, it turned into a significant rebuild with not much of my 2023 code being re-used.

**Good opening (leadership):**
> So, you've found yourself in the role of a team lead, and after realizing that trying to align your team on values is like herding cats—very opinionated cats—you're ready to bring some order to the chaos.

**Good lesson learned:**
> **TypeScript will judge you** — TypeScript isn't a fan of CSS-in-JS libraries in general. You'll end up wrestling with types, especially if you rely heavily on dynamic props.

**Good closing:**
> Now go forth, gather those values, and watch your team transform into a well-oiled machine. Or, at the very least, a group of people who are more pleasant to work with.
