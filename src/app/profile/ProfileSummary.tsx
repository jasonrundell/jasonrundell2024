'use client'

import { Calendar, Mail, Shield } from 'lucide-react'
import {
  UserInfoSection,
  UserAvatar,
  UserName,
  UserEmail,
  AccountInfoSection,
  SectionTitle,
  InfoGrid,
  InfoCard,
  InfoCardHeader,
  InfoValue,
  StyledInfoLabel,
  StyledInfoValueCapitalize,
} from './profile-styles'

interface ProfileSummaryProps {
  displayName: string
  email: string
  accountCreated: string
  authMethod: string
}

export default function ProfileSummary({
  displayName,
  email,
  accountCreated,
  authMethod,
}: ProfileSummaryProps) {
  return (
    <>
      <UserInfoSection>
        <UserAvatar>{displayName.charAt(0).toUpperCase()}</UserAvatar>
        <div>
          <UserName>Welcome, {displayName}</UserName>
          <UserEmail>{email}</UserEmail>
        </div>
      </UserInfoSection>

      <AccountInfoSection>
        <SectionTitle>Account Information</SectionTitle>
        <InfoGrid>
          <InfoCard>
            <InfoCardHeader>
              <Mail size={20} />
              <StyledInfoLabel>Email Address</StyledInfoLabel>
            </InfoCardHeader>
            <InfoValue>{email}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <Calendar size={20} />
              <StyledInfoLabel>Account Created</StyledInfoLabel>
            </InfoCardHeader>
            <InfoValue>{accountCreated}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <Shield size={20} />
              <StyledInfoLabel>Authentication Method</StyledInfoLabel>
            </InfoCardHeader>
            <StyledInfoValueCapitalize>{authMethod}</StyledInfoValueCapitalize>
          </InfoCard>
        </InfoGrid>
      </AccountInfoSection>
    </>
  )
}
