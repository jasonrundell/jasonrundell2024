'use client';

import { Button } from '@/components/auth/ui/button';
import { Label } from '@/components/auth/ui/label';
import { LogOut, User, Calendar, Mail, Shield } from 'lucide-react';
import { styled } from '@pigment-css/react';
import Tokens from '@/lib/tokens';

// Styled components using Pigment-CSS
const PageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex: 1;
  padding: ${Tokens.sizes.padding.large.value}rem;
  background-color: ${Tokens.colors.muted.value};
`;

const CardContainer = styled('div')`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 800px;
  padding: 0;
  overflow: hidden;
  position: relative;
`;

const CardHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${Tokens.sizes.padding.medium.value}rem ${Tokens.sizes.padding.large.value}rem;
  background-color: ${Tokens.colors.primary.value};
  color: ${Tokens.colors.surface.value};
`;

const UserInfo = styled('div')`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled('div')`
  height: 4rem;
  width: 4rem;
  border-radius: 50%;
  background: ${Tokens.colors.background.value};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: bold;
  color: ${Tokens.colors.primary.value};
  margin-right: 1rem;
  border: 3px solid white;
`;

const UserDetails = styled('div')`
  display: flex;
  flex-direction: column;
`;

const ContentSection = styled('div')`
  padding: ${Tokens.sizes.padding.large.value}rem;
`;

const AccountInfoGrid = styled('div')`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${Tokens.sizes.large.value}rem;
  margin-top: ${Tokens.sizes.large.value}rem;
`;

const InfoCard = styled('div')`
  background: ${Tokens.colors.muted.value};
  border-radius: 0.5rem;
  padding: ${Tokens.sizes.padding.medium.value}rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoCardHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${Tokens.colors.textSecondary.value};
`;

const InfoValue = styled('div')`
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.75rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid ${Tokens.colors.border.value};
`;

const ActionBar = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-top: ${Tokens.sizes.large.value}rem;
  padding-top: ${Tokens.sizes.medium.value}rem;
  border-top: 1px solid ${Tokens.colors.border.value};
`;

const Title = styled('h1')`
  font-size: ${Tokens.sizes.headings.h1.value}rem;
  font-weight: 700;
  margin: 0;
  font-family: ${Tokens.fonts.heading.family};
  color: white;
`;

const Subtitle = styled('p')`
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  color: white;
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
  return (
    <PageContainer>
      <CardContainer>
        <CardHeader>
          <UserInfo>
            <UserAvatar>
              {(userData?.full_name || user.email || 'U').charAt(0).toUpperCase()}
            </UserAvatar>
            <UserDetails>
              <Title>Welcome, {userData?.full_name || user.email?.split('@')[0]}</Title>
              <Subtitle>Your personal dashboard</Subtitle>
            </UserDetails>
          </UserInfo>
          <form action={signOutAction}>
            <Button type="submit" variant="outline" style={{ backgroundColor: 'white', color: Tokens.colors.primary.value }}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </CardHeader>
        
        <ContentSection>
          <h2 style={{ 
            fontSize: `${Tokens.sizes.headings.h2.value}rem`, 
            marginBottom: '1.5rem',
            fontFamily: Tokens.fonts.heading.family
          }}>
            Account Information
          </h2>
          
          <AccountInfoGrid>
            <InfoCard>
              <InfoCardHeader>
                <User size={18} />
                <Label>Full Name</Label>
              </InfoCardHeader>
              <InfoValue>
                {userData?.full_name || 'Not provided'}
              </InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoCardHeader>
                <Mail size={18} />
                <Label>Email Address</Label>
              </InfoCardHeader>
              <InfoValue>
                {user.email}
              </InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoCardHeader>
                <Calendar size={18} />
                <Label>Account Created</Label>
              </InfoCardHeader>
              <InfoValue>
                {userData?.created_at 
                  ? new Date(userData.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) 
                  : 'Unknown'}
              </InfoValue>
            </InfoCard>
            
            <InfoCard>
              <InfoCardHeader>
                <Shield size={18} />
                <Label>Authentication Method</Label>
              </InfoCardHeader>
              <InfoValue style={{ textTransform: 'capitalize' }}>
                {user.app_metadata?.provider || 'email'}
              </InfoValue>
            </InfoCard>
          </AccountInfoGrid>
          
          <ActionBar>
            <Button variant="outline" onClick={() => window.location.href = "/"} type="button">
              Return to Home
            </Button>
          </ActionBar>
        </ContentSection>
      </CardContainer>
    </PageContainer>
  );
}
