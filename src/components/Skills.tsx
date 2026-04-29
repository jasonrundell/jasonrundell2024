import { Row } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'
import { Skill, Skills as SkillsDef } from '@/typeDefinitions/app'

import { onlyUnique } from '@/lib/onlyUnique'
import Tokens from '@/lib/tokens'
import PromptList, { PromptItem } from '@/components/chrome/PromptList'

const StyledListContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 0;
  margin-bottom: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  list-style: none;
  padding-left: 0;
  width: 100%;
`

const StyledHeading = styled('h3')`
  font-size: ${Tokens.sizes.medium.value}${Tokens.sizes.medium.unit};
  margin: 0 0 ${Tokens.sizes.xsmall.value}${Tokens.sizes.xsmall.unit} 0;
`

export default function Skills({ skills }: SkillsDef) {
  const categories: string[] = []

  skills.forEach((skill: Skill) => {
    categories.push(skill.category)
  })

  const uniqueCategories = categories.filter(onlyUnique)

  return (
    <Row>
      {uniqueCategories.map((parentCategory, index) => (
        <StyledListContainer key={index}>
          <StyledHeading>{parentCategory}</StyledHeading>
          <PromptList aria-label={`${parentCategory} skills`}>
            {skills
              .filter((skill: Skill) => skill.category === parentCategory)
              .map((skill: Skill) => (
                <PromptItem key={skill.id}>{skill.name}</PromptItem>
              ))}
          </PromptList>
        </StyledListContainer>
      ))}
    </Row>
  )
}
