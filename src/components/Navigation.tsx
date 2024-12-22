import Link from 'next/link'
import styled from '@emotion/styled'

import { tokens } from '@/data/tokens'

const Navigation: React.FC = () => {
  const StyledNav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: ${tokens['--size-small']};
    background: ${tokens['--background-color-3']};
    z-index: 1;
  `

  const StyledList = styled.ul`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
  `

  const StyledListItem = styled.li`
    margin: 0;
    padding: 0;
  `

  const StyledLink = styled(Link)`
    display: block;
    padding: ${tokens['--size-smallest']};
    color: ${tokens['--secondary-color']};
    text-decoration: none;
    transition: color 0.2s ease-in-out;
    font-weight: 700;

    &:hover {
      color: ${tokens['--primary-color']};
    }
  `

  return (
    <StyledNav>
      <StyledList>
        <StyledListItem>
          <StyledLink href="/#home">Home</StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/#blog">Blog</StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/#skills">Skills</StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/#experience">Experience</StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/#references">References</StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/#contact">Contact</StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/jason-rundell-web-developer-resume.pdf" download>
            Download Resume
          </StyledLink>
        </StyledListItem>
      </StyledList>
    </StyledNav>
  )
}

export default Navigation
