import React from 'react'
import Link from 'next/link'
import { Row, Spacer } from '@jasonrundell/dropship'

import {
  StyledContainer,
  StyledSection,
  StyledBreadcrumb,
} from '@/styles/common'
import ContactList from '@/components/ContactList'

export const metadata = {
  title: 'Contact | Jason Rundell',
  description:
    'Get in touch with Jason Rundell — email, LinkedIn, GitHub, and a calendar link to book time.',
}

export const revalidate = 86400

export default function ContactPage() {
  return (
    <StyledContainer>
      <StyledSection id="contact-page">
        <StyledBreadcrumb>
          <Link href="/">Home</Link> &gt; Contact
        </StyledBreadcrumb>
        <h1>Contact me</h1>
        <Row>
          <p>
            The fastest way to reach me is email. For longer conversations, book
            time on the calendar or connect on LinkedIn.
          </p>
        </Row>
        <Spacer />
        <Row>
          <ContactList />
        </Row>
      </StyledSection>
    </StyledContainer>
  )
}
