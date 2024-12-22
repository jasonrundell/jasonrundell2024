'use client'
import { Row } from '@jasonrundell/dropship'
import styled from '@emotion/styled'
import { Skill, Skills as SkillsDef } from '@/typeDefinitions/app'

import { onlyUnique } from '@/lib/onlyUnique'
import { tokens } from '@/data/tokens'

const Skills = ({ skills }: SkillsDef) => {
  let categories: string[] = []

  // Build array of categories
  skills.forEach((skill: Skill) => {
    categories.push(skill.category)
  })

  // I only want the unique categories
  const uniqueCategories = categories.filter(onlyUnique)

  const StyledListContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 0;
    margin-bottom: ${tokens['--size-normal']};
    list-style: none;
    padding-left: 0;
    width: 100%;
  `

  const StyledList = styled.ul`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 0;
    list-style: none;
    padding-left: 0;
  `

  const StyledListItem = styled.li`
    display: inline;
    margin-right: ${tokens['--size-small']};
    margin-left: 0;
    color: ${tokens['--text-color']};
    margin: 0 ${tokens['--size-small']} 0 0;
    line-height: 1.6;
  `

  const StyledHeading = styled.h3`
    font-size: ${tokens['--size-normal']};
    margin: 0;
  `

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
