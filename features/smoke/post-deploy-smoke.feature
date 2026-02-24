@smoke @post-deploy
Feature: Post-Deployment Smoke Verification

  Quick no-booking flow to verify chat widget is functioning after deployment.

  @critical @NoBookingProcessyellowappletrain
  Scenario: Run chatbot test for smoke verification - yellowappletrain
    Given I open the chatbot page for "No booking: mossyriverstone"
    When I enter all test prompts one by one until the final quote is displayed
