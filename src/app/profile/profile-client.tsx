'use client';

import { Button } from '@/components/auth/ui/button';
import { Label } from '@/components/auth/ui/label';
import { LogOut, User, Calendar, Mail, Shield, Home } from 'lucide-react';
import { styled } from '@pigment-css/react';
import Tokens from '@/lib/tokens';

// Styled components using Pigment-CSS
const ProfileContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`;

const UserInfoSection = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, ${Tokens.colors.primary.value}15, ${Tokens.colors.primary.value}05);
  border-radius: 1rem;
  border: 1px solid ${Tokens.colors.primary.value}20;
`;

const UserAvatar = styled('div')`
  height: 5rem;
  width: 5rem;
  border-radius: 50%;
  background: ${Tokens.colors.primary.value};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border: 4px solid ${Tokens.colors.backgroundDarker.value};
  box-shadow: 0 4px 20px rgba(233, 190, 98, 0.3);
`;

const UserName = styled('h2')`
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0;
  color: ${Tokens.colors.textPrimary.value};
`;

const UserEmail = styled('p')`
  font-size: 1rem;
  margin: 0;
  color: ${Tokens.colors.textSecondary.value};
  opacity: 0.8;
`;

const AccountInfoSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled('h3')`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: ${Tokens.colors.textPrimary.value};
  text-align: center;
`;

const InfoGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoCard = styled('div')`
  background: ${Tokens.colors.backgroundDarker.value};
  border-radius: 0.75rem;
  padding: 1.25rem;
  border: 1px solid ${Tokens.colors.primary.value}20;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${Tokens.colors.primary.value}40;
    transform: translateY(-2px);
  }
`;

const InfoCardHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${Tokens.colors.primary.value};
`;

const InfoValue = styled('div')`
  font-size: 1rem;
  font-weight: 500;
  color: ${Tokens.colors.textPrimary.value};
  padding: 0.5rem 0;
`;

const ActionsSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const ActionButtons = styled('div')`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

interface ProfileClientProps {
  user: {
    email: string;
    app_metadata?: {
      provider?: string;
    };
  };
  userData?: {
    full_name?: string;
    created_at?: string;
  };
  signOutAction: () => void;
}

export default function ProfileClient({ user, userData, signOutAction }: ProfileClientProps) {
  const displayName = userData?.full_name || user.email?.split('@')[0] || 'User';
  const email = user.email || 'No email provided';
  const fullName = userData?.full_name || 'Not provided';
  const accountCreated = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    : 'Unknown';
  const authMethod = user.app_metadata?.provider || 'email';

  // Debug logging
  console.log('ProfileClient render:', {
    user,
    userData,
    displayName,
    fullName,
    accountCreated,
    authMethod
  });

  return (
    <ProfileContainer>
      <UserInfoSection>
        <UserAvatar>
          {displayName.charAt(0).toUpperCase()}
        </UserAvatar>
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
              <Label style={{ color: Tokens.colors.primary.value, margin: 0 }}>Email Address</Label>
            </InfoCardHeader>
            <InfoValue>{email}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <Calendar size={20} />
              <Label style={{ color: Tokens.colors.primary.value, margin: 0 }}>Account Created</Label>
            </InfoCardHeader>
            <InfoValue>{accountCreated}</InfoValue>
          </InfoCard>

          <InfoCard>
            <InfoCardHeader>
              <Shield size={20} />
              <Label style={{ color: Tokens.colors.primary.value, margin: 0 }}>Authentication Method</Label>
            </InfoCardHeader>
            <InfoValue style={{ textTransform: 'capitalize' }}>{authMethod}</InfoValue>
          </InfoCard>
        </InfoGrid>
      </AccountInfoSection>
    </ProfileContainer>
  );
}
