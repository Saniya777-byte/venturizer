# Conversation Flow Diagram

This document describes the step-by-step logic of the user's journey through the Venturizer Qualification Chatbot and its connection to the lead evaluation and dashboard layers.

---

## 1. Complete Workflow Diagram

The flow charts the path of a user from starting the chat to being scored, stored, and analyzed by the admin.

```mermaid
graph TD
    User([User visits Chatbot]) --> FlowInit{Select Flow Type}
    
    FlowInit -->|Founder| QFounder[Founder Question Flow]
    FlowInit -->|Investor| QInvestor[Investor Question Flow]
    
    %% Input Loop
    QFounder --> InputF[User provides answer]
    QInvestor --> InputI[User provides answer]
    
    InputF --> ValBaseF{Base Client Validation}
    InputI --> ValBaseI{Base Client Validation}
    
    ValBaseF -->|Invalid: empty/too short| ErrBaseF[Show error & re-input]
    ValBaseI -->|Invalid: empty/too short| ErrBaseI[Show error & re-input]
    
    ErrBaseF --> QFounder
    ErrBaseI --> QInvestor
    
    ValBaseF -->|Valid & descriptive field| ValAIF{Gemini AI Validation}
    ValBaseI -->|Valid & descriptive field| ValAII{Gemini AI Validation}
    
    ValBaseF -->|Valid & structured field| NextQStepF{Next Question?}
    ValBaseI -->|Valid & structured field| NextQStepI{Next Question?}
    
    %% Gemini Chat Validations
    ValAIF -->|meaningful = false| ErrAIF[Show: 'Please enter a meaningful answer.' & hold question]
    ValAII -->|meaningful = false| ErrAII[Show: 'Please enter a meaningful answer.' & hold question]
    
    ErrAIF --> QFounder
    ErrAII --> QInvestor
    
    ValAIF -->|meaningful = true| NextQStepF
    ValAII -->|meaningful = true| NextQStepI
    
    %% Next Questions Check
    NextQStepF -->|Yes| QFounder
    NextQStepI -->|Yes| QInvestor
    
    %% Submission Flow
    NextQStepF -->|No more questions| SubmitLead[Submit Lead Payload to Backend]
    NextQStepI -->|No more questions| SubmitLead
    
    %% Backend Flow
    SubmitLead --> BackendEval[Backend collectAiScores + generateSummary]
    BackendEval --> ScoreLead[Run Rule-based + AI Hybrid Scoring Engine]
    ScoreLead --> SaveDB[(PostgreSQL Neon DB)]
    SaveDB --> Dashboard[Admin Dashboard updates in Real-time]
    Dashboard --> LeadReview[Admin views detailed lead report with AI SWOT Analysis]
```

---

## 2. PNG-Friendly Plaintext Workflow Diagram

For rendering engines that prefer standard structural representation:

```
[User starts Chatbot]
       |
       v
[Select Flow Type: Founder or Investor]
       |
       +---> [Founder Questions] <---+
       |            |                 | (If Validation Fails)
       |            v                 |
       |     [Base Local Validation]--+
       |            | (Passes)
       |            v
       |     [Gemini AI Check] -------+ (If meaningful == false)
       |            | (Passes)
       |            v
       |     [Save Temp Answer]
       |
       +---> [Investor Questions] <--+
                    |                 | (If Validation Fails)
                    v                 |
             [Base Local Validation]--+
                    | (Passes)
                    v
             [Gemini AI Check] -------+ (If meaningful == false)
                    | (Passes)
                    v
             [Save Temp Answer]
                    |
                    v
          (All Questions Answered)
                    |
                    v
        [Submit Payload to Backend]
                    |
                    v
        [Process AI Scores & Summary]
                    |
                    v
        [Calculate Hybrid Qualification Score]
                    |
                    v
        [Save Record to Database (Neon)]
                    |
                    v
        [Admin reviews Lead Detail & SWOT on Dashboard]
```
