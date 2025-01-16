import { Row } from '@jasonrundell/dropship'
import { styled } from '@pigment-css/react'
import { Skill, Skills as SkillsDef } from '@/typeDefinitions/app'

import { onlyUnique } from '@/lib/onlyUnique'
import Tokens from '@/lib/tokens'

const StyledListContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-top: 0;
  margin-bottom: ${Tokens.sizes.medium}rem;
  list-style: none;
  padding-left: 0;
  width: 100%;
`

const StyledList = styled('ul')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 0;
  list-style: none;
  padding-left: 0;
`

const StyledListItem = styled('li')`
  display: inline;
  margin-right: ${Tokens.sizes.small}rem;
  margin-left: 0;
  color: ${Tokens.colors.text};
  margin: 0 ${Tokens.sizes.small}rem 0 0;
  line-height: 1.6;
`

const StyledHeading = styled('h3')`
  font-size: ${Tokens.sizes.medium}rem;
  margin: 0;
`

const Skills = ({ skills }: SkillsDef) => {
  let categories: string[] = []

  // Build array of categories
  skills.forEach((skill: Skill) => {
    categories.push(skill.category)
  })

  // I only want the unique categories
  const uniqueCategories = categories.filter(onlyUnique)

  return (
    <Row>
      {uniqueCategories.map((parentCategory, index) => (
        <StyledListContainer key={index}>
          <StyledHeading>{parentCategory}</StyledHeading>
          <StyledList>
            {skills
              .filter((skill: Skill) => skill.category === parentCategory)
              .map((skill: Skill) => (
                <StyledListItem key={skill.id}>{skill.name}</StyledListItem>
              ))}
          </StyledList>
        </StyledListContainer>
      ))}
    </Row>
  )
}

export default Skills
