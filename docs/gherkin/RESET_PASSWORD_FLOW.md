# Account Password Reset Flow

This document describes the complete password reset flow using Gherkin scenarios
for behavior-driven development and testing.

## Overview

The password reset flow allows users to securely reset their password when they
forget it. The process involves:

1. User requests password reset via email
2. User receives email with recovery link
3. User clicks link and sets new password
4. User signs in with new password

## Gherkin Scenarios

### Feature: Password Reset Request

```gherkin
Feature: Password Reset Request
  As a user
  I want to request a password reset
  So that I can regain access to my account when I forget my password

  Background:
    Given I am on the forgot password page
    And I have a valid email address
    And I am not currently logged in

  Scenario: Successfully request password reset
    When I enter my email address
    And I click the "Reset Password" button
    Then I should see a success message
    And I should receive an email with a password reset link
    And the success message should contain my email address

  Scenario: Request password reset when already logged in
    Given I am already logged in to my account
    When I try to access the forgot password page
    Then I should be redirected to my profile page
    And I should not be able to request a password reset

  Scenario: Request password reset with invalid email
    When I enter an invalid email address
    And I click the "Reset Password" button
    Then I should see an error message
    And the error should indicate that the email is invalid

  Scenario: Request password reset with empty email
    When I leave the email field empty
    And I click the "Reset Password" button
    Then I should see an error message
    And the error should indicate that email is required

  Scenario: Request password reset when database is paused
    Given the Supabase database is paused
    When I enter my email address
    And I click the "Reset Password" button
    Then I should see an error message
    And the error should indicate that the database is paused

  Scenario: Request password reset when database is unavailable
    Given the Supabase database is unavailable
    When I enter my email address
    And I click the "Reset Password" button
    Then I should see an error message
    And the error should indicate that the database is unavailable
```

### Feature: Password Reset via Email Link

```gherkin
Feature: Password Reset via Email Link
  As a user
  I want to reset my password using the email link
  So that I can set a new password and regain account access

  Background:
    Given I have received a password reset email
    And the email contains a valid recovery link

  Scenario: Successfully access password reset page
    When I click the password reset link in my email
    Then I should be redirected to the reset password page
    And I should not be automatically logged in
    And I should see a form to enter my new password

  Scenario: Access password reset page with invalid token
    Given I have an invalid or expired recovery token
    When I try to access the reset password page
    Then I should be redirected to the forgot password page
    And I should see an error message about invalid token

  Scenario: Access password reset page without token
    When I try to access the reset password page without a token
    Then I should be redirected to the forgot password page
    And I should see an error message about missing token

  Scenario: Access password reset page with expired token
    Given my recovery token has expired
    When I try to access the reset password page
    Then I should be redirected to the forgot password page
    And I should see an error message about expired token
```

### Feature: Password Reset Form

```gherkin
Feature: Password Reset Form
  As a user
  I want to set a new password
  So that I can complete the password reset process

  Background:
    Given I am on the reset password page
    And I have a valid recovery token

  Scenario: Successfully reset password
    When I enter a new password
    And I confirm the new password
    And I click the "Reset password" button
    Then my password should be updated
    And I should be redirected to the sign-in page
    And I should see a success message about password reset
    And I should not be logged in

  Scenario: Reset password with mismatched confirmation
    When I enter a new password
    And I enter a different password in the confirmation field
    And I click the "Reset password" button
    Then I should see an error message
    And the error should indicate that passwords do not match
    And my password should not be changed

  Scenario: Reset password with missing password
    When I leave the password field empty
    And I enter a confirmation password
    And I click the "Reset password" button
    Then I should see an error message
    And the error should indicate that password is required

  Scenario: Reset password with missing confirmation
    When I enter a new password
    And I leave the confirmation field empty
    And I click the "Reset password" button
    Then I should see an error message
    And the error should indicate that confirmation password is required

  Scenario: Reset password with invalid token
    Given my recovery token is invalid
    When I enter a new password
    And I confirm the new password
    And I click the "Reset password" button
    Then I should see an error message
    And I should be redirected to the forgot password page
    And the error should indicate that the token is invalid or expired

  Scenario: Reset password when database is unavailable
    Given the Supabase database is unavailable
    When I enter a new password
    And I confirm the new password
    And I click the "Reset password" button
    Then I should see an error message
    And the error should indicate that the operation failed

  Scenario: Reset password when already logged in
    Given I am already logged in to my account
    When I try to access the reset password page
    Then I should be redirected to my profile page
    And I should not be able to reset my password
```

### Feature: Post-Password Reset Authentication

```gherkin
Feature: Post-Password Reset Authentication
  As a user
  I want to sign in with my new password
  So that I can access my account after resetting my password

  Background:
    Given I have successfully reset my password
    And I am on the sign-in page
    And I see a success message about password reset

  Scenario: Successfully sign in with new password
    When I enter my email address
    And I enter my new password
    And I click the "Sign in" button
    Then I should be successfully authenticated
    And I should be redirected to my profile page

  Scenario: Sign in with old password after reset
    When I enter my email address
    And I enter my old password
    And I click the "Sign in" button
    Then I should see an error message
    And the error should indicate invalid credentials
    And I should remain on the sign-in page

  Scenario: Sign in with incorrect new password
    When I enter my email address
    And I enter an incorrect password
    And I click the "Sign in" button
    Then I should see an error message
    And the error should indicate invalid credentials
    And I should remain on the sign-in page

  Scenario: Sign in with non-existent email
    When I enter a non-existent email address
    And I enter any password
    And I click the "Sign in" button
    Then I should see an error message
    And the error should indicate invalid credentials
    And I should remain on the sign-in page

  Scenario: Sign in when database is paused
    Given the Supabase database is paused
    When I enter my email address
    And I enter my new password
    And I click the "Sign in" button
    Then I should see an error message
    And the error should indicate that the database is paused

  Scenario: Sign in when database is unavailable
    Given the Supabase database is unavailable
    When I enter my email address
    And I enter my new password
    And I click the "Sign in" button
    Then I should see an error message
    And the error should indicate that the database is unavailable
```

### Feature: Error Handling and User Experience

```gherkin
Feature: Error Handling and User Experience
  As a user
  I want clear error messages and guidance
  So that I can understand what went wrong and how to proceed

  Scenario: Clear error messages for invalid credentials
    When I enter invalid login credentials
    And I click the "Sign in" button
    Then I should see a clear error message
    And the error should say "Invalid email or password. Please try again."
    And the sign-in button should not be stuck in loading state

  Scenario: Clear error messages for database issues
    When the database is paused or unavailable
    And I try to perform any authentication action
    Then I should see a clear error message
    And the error should explain the database status
    And I should be given guidance on what to do

  Scenario: Clear error messages for expired tokens
    When I try to use an expired password reset token
    Then I should see a clear error message
    And the error should explain that the token has expired
    And I should be guided to request a new reset link

  Scenario: Clear success messages
    When I successfully complete a password reset
    Then I should see a clear success message
    And the message should confirm that my password was updated
    And I should be guided to sign in with my new password

  Scenario: Form validation feedback
    When I submit a form with validation errors
    Then I should see immediate feedback
    And the error messages should be specific and actionable
    And I should not lose my form data unnecessarily
```

## Technical Implementation Notes

### Key Components

- **Forgot Password Page**: `/forgot-password` - User requests password reset
- **Auth Callback**: `/auth/callback` - Handles recovery token exchange
- **Reset Password Page**: `/reset-password` - User sets new password
- **Sign-in Page**: `/sign-in` - User authenticates with new password

### Security Considerations

- Recovery tokens are single-use and time-limited
- Users are never auto-logged in during password reset
- Temporary sessions are created only for password updates
- Users are automatically signed out after password reset
- All error messages are generic to prevent information leakage
- Only non-authenticated users can request password resets
- Already logged-in users are redirected away from password reset flows
- Password reset functionality is completely separate from authenticated
  password changes

### Error Handling

- Database availability checks before operations
- Token validation and expiration handling
- Clear user feedback for all error conditions
- Graceful fallbacks for system failures

### Testing Recommendations

- Test all error paths and edge cases
- Verify token expiration scenarios
- Test database pause/unavailable states
- Validate security requirements are met
- Ensure proper user experience flow
