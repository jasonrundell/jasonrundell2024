import React from 'react'
import { styled } from '@pigment-css/react'
import { Skills as SkillsDef } from '@/typeDefinitions/app'
import Tokens from '@/lib/tokens'

/**
 * Capability matrix - skills grouped by category into a hairline grid. Replaces
 * the earlier 3D cloud with a calm, scannable editorial treatment that reads as
 * a systems map of what Jason works in.
 */

const bp = `${Tokens.sizes.breakpoints.large.value}${Tokens.sizes.breakpoints.large.unit}`

const StyledMatrix = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  border-bottom: none;

  @media (min-width: 40rem) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: ${bp}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const StyledCell = styled('div')`
  padding: 1.5rem;
  border-bottom: 1px solid ${Tokens.colors.lineSubtle.var};

  @media (min-width: 40rem) {
    border-right: 1px solid ${Tokens.colors.lineSubtle.var};

    &:nth-of-type(2n) {
      border-right: none;
    }
  }

  @media (min-width: ${bp}) {
    &:nth-of-type(2n) {
      border-right: 1px solid ${Tokens.colors.lineSubtle.var};
    }
    &:nth-of-type(3n) {
      border-right: none;
    }
  }
`

const StyledCategory = styled('h3')`
  font-family: ${Tokens.fonts.monospace.var};
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${Tokens.colors.accent.var};
  margin: 0 0 1rem;
`

const StyledSkillList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const StyledSkill = styled('li')`
  font-family: ${Tokens.fonts.body.var};
  font-size: 0.875rem;
  color: ${Tokens.colors.ink.var};
  border: 1px solid ${Tokens.colors.lineSubtle.var};
  background-color: ${Tokens.colors.surfacePrimary.var};
  padding: 0.3rem 0.65rem;
`

interface CategoryGroup {
  category: string
  skills: string[]
}

function groupByCategory(skills: SkillsDef['skills']): CategoryGroup[] {
  const order: string[] = []
  const map = new Map<string, string[]>()
  for (const skill of skills) {
    if (!map.has(skill.category)) {
      map.set(skill.category, [])
      order.push(skill.category)
    }
    map.get(skill.category)!.push(skill.name)
  }
  return order.map((category) => ({
    category,
    skills: map.get(category) ?? [],
  }))
}

export default function Skills({ skills }: SkillsDef) {
  if (!skills || skills.length === 0) {
    console.error('Skills component rendered without data.')
    throw new Error('Skills data is required.')
  }

  const groups = groupByCategory(skills)

  return (
    <StyledMatrix aria-label="Capability matrix">
      {groups.map((group) => (
        <StyledCell key={group.category}>
          <StyledCategory>{group.category}</StyledCategory>
          <StyledSkillList aria-label={group.category}>
            {group.skills.map((name) => (
              <StyledSkill key={name}>{name}</StyledSkill>
            ))}
          </StyledSkillList>
        </StyledCell>
      ))}
    </StyledMatrix>
  )
}
