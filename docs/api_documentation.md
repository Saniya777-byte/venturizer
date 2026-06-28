# API Documentation

This document describes all API endpoints exposed by the Venturizer Backend.

- **Base URL:** `http://localhost:4000` (Local) / `/api` prefixed.
- **Content-Type:** `application/json`

---

## 1. Endpoints List

### [POST] `/api/leads/validate-answer`
- **Purpose**: Evaluates a user's textual response in real-time using Gemini to verify if the answer is meaningful or if it represents keyboard smashing/spam.
- **Validation Rules**:
  - `fieldId` (String): Must be one of the registered AI-validated fields.
  - `answer` (String): Must be a string with a minimum length of 2 characters for text, or 10 characters for textareas.
- **Request Body**:
  ```json
  {
    "fieldId": "problem",
    "answer": "This is a detailed description of our startup's problem statement."
  }
  ```
- **Response** (Status: `200 OK`):
  ```json
  {
    "meaningful": true,
    "quality": 8,
    "reason": "Clear and relevant problem description."
  }
  ```
- **Error Response** (Status: `400 Bad Request` - Validation Failed):
  ```json
  {
    "error": "Validation failed",
    "details": [
      {
        "field": "answer",
        "message": "String must contain at least 10 character(s)"
      }
    ]
  }
  ```
- **Fallback Response** (Status: `200 OK` - AI API key missing or timeout):
  ```json
  {
    "meaningful": true,
    "quality": 5,
    "reason": "Fallback used"
  }
  ```

---

### [POST] `/api/leads`
- **Purpose**: Submits a completed chatbot response payload. Creates a `Lead` record, computes the hybrid qualification score, saves profile details, score breakdowns, and generates the AI summary report.
- **Request Body**:
  - Validation: Handled by Zod schemas (`lead.validator.js`).
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "linkedIn": "https://linkedin.com/in/janedoe",
    "type": "FOUNDER",
    "founder": {
      "role": "Co-founder & CEO",
      "companyName": "Solaria",
      "startupDescription": "We build decentralized solar energy sharing grids.",
      "background": "I have 5 years of experience in solar engineering.",
      "problem": "High costs of traditional electricity.",
      "customer": "Homeowners in suburban areas.",
      "mvpStatus": "COMPLETED",
      "mvpLink": "https://solaria.io",
      "traction": "50 active beta users.",
      "teamSize": 3,
      "teamFullTime": "YES",
      "fundingAsk": 10000000,
      "fundingStage": "PRE_SEED",
      "useOfFunds": "To hire developers.",
      "validationEvidence": "We have letters of intent.",
      "notableBacking": "We received a clean energy grant."
    },
    "answers": [
      {
        "questionId": "fullName",
        "question": "Welcome! What's your full name?",
        "answer": "Jane Doe"
      }
    ]
  }
  ```
- **Response** (Status: `211 Created`):
  ```json
  {
    "id": "cmqwibgei0000i788bc0ohdd2",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "linkedIn": "https://linkedin.com/in/janedoe",
    "type": "FOUNDER",
    "score": 94,
    "status": "HOT",
    "completed": true,
    "createdAt": "2026-06-28T12:02:05.123Z"
  }
  ```

---

### [GET] `/api/leads`
- **Purpose**: Retrieves a paginated list of leads for the dashboard table. Supports keyword searching and dropdown filters.
- **Query Parameters**:
  - `page` (Integer, Default: 1): Current page.
  - `limit` (Integer, Default: 10): Records per page.
  - `search` (String, Optional): Search keyword for name, email, or company.
  - `type` (String, Optional): Filters by type (`FOUNDER`, `INVESTOR`).
  - `status` (String, Optional): Filters by tier (`HOT`, `GOOD`, `MAYBE`, `LOW`).
  - `sortBy` (String, Default: `createdAt`): Sorting field.
  - `sortOrder` (String, Default: `desc`): Sort order (`asc`, `desc`).
- **Response** (Status: `200 OK`):
  ```json
  {
    "items": [
      {
        "id": "cmqwibgei0000i788bc0ohdd2",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+15551234567",
        "linkedIn": "https://linkedin.com/in/janedoe",
        "type": "FOUNDER",
        "score": 94,
        "status": "HOT",
        "completed": true,
        "createdAt": "2026-06-28T12:02:05.123Z",
        "founder": {
          "companyName": "Solaria"
        }
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

---

### [GET] `/api/leads/:id`
- **Purpose**: Retrieves a detailed lead profile, including all conversation answers, score breakdowns, and the AI summary SWOT report.
- **Path Parameter**:
  - `id` (String): Lead unique cuid.
- **Dynamic Action**: If the lead does not have an AI summary or has the old fallback summary, the backend automatically regenerates and upserts a custom analysis before returning the payload.
- **Response** (Status: `200 OK`):
  ```json
  {
    "id": "cmqwibgei0000i788bc0ohdd2",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "linkedIn": "https://linkedin.com/in/janedoe",
    "type": "FOUNDER",
    "score": 94,
    "status": "HOT",
    "createdAt": "2026-06-28T12:02:05.123Z",
    "founder": {
      "role": "Co-founder & CEO",
      "companyName": "Solaria"
    },
    "answers": [
      {
        "id": "cmqwid981000",
        "questionId": "fullName",
        "question": "Welcome! What's your full name?",
        "answer": "Jane Doe"
      }
    ],
    "scoreDetails": [
      {
        "id": "cmqwides1000",
        "criterion": "Founder Background",
        "points": 8,
        "maxPoints": 15,
        "reason": "Clear and relevant experience."
      }
    ],
    "aiSummary": {
      "id": "cmqwidf11000",
      "summary": "Jane Doe is building Solaria...",
      "strengths": ["Founder has relevant background."],
      "weaknesses": ["Needs customer proof points."],
      "recommendation": "Schedule partner review."
    }
  }
  ```

---

### [PATCH] `/api/leads/:id/status`
- **Purpose**: Updates the lead qualification status tier administratively.
- **Path Parameter**:
  - `id` (String): Lead unique cuid.
- **Request Body**:
  ```json
  {
    "status": "GOOD"
  }
  ```
- **Response** (Status: `200 OK`):
  ```json
  {
    "id": "cmqwibgei0000i788bc0ohdd2",
    "status": "GOOD"
  }
  ```

---

### [GET] `/api/dashboard`
- **Purpose**: Returns analytical aggregations for the dashboard cards and trend graphs.
- **Response** (Status: `200 OK`):
  ```json
  {
    "totals": {
      "totalLeads": 7,
      "founders": 3,
      "investors": 4,
      "hot": 2,
      "good": 4,
      "maybe": 1,
      "low": 0,
      "averageScore": 75
    },
    "recentSubmissions": [
      {
        "id": "cmqwibgei0000i788bc0ohdd2",
        "fullName": "Jane Doe",
        "score": 94,
        "status": "HOT"
      }
    ],
    "charts": {
      "byType": [
        { "label": "FOUNDER", "value": 3 },
        { "label": "INVESTOR", "value": 4 }
      ],
      "byStatus": [
        { "label": "HOT", "value": 2 },
        { "label": "GOOD", "value": 4 },
        { "label": "MAYBE", "value": 1 }
      ],
      "dailySubmissions": [
        { "date": "2026-06-28", "count": 7 }
      ]
    }
  }
  ```

---

## 2. Authentication Rules
- **Dashboard Shield:** Administrative dashboard routes on the frontend can be secured using a `DASHBOARD_SECRET` token checked during connection or by API clients via headers, depending on configuration settings.
