# Testing Guide

This guide outlines the validation and testing procedures to verify the features of the Venturizer Lead Qualification system.

---

## 1. Chatbot Flows Testing

### A. Founder Flow Validation
1. Open the Chatbot UI (`http://localhost:5173`).
2. Select **"Founder"** from the onboarding card.
3. Verify that the question sequence follows:
   - Name → Email → Phone → LinkedIn → Role → Company Name → Startup Description → Background → Problem → Customer → MVP Status → MVP Link (Conditional) → Traction → Team Size → Team Full Time → Funding Ask → Funding Stage → Use of Funds → Validation Evidence → Notable Backing → Additional Info.
4. If **MVP Status** is selected as `COMPLETED` or `IN_PROGRESS`, verify the chatbot asks for the **MVP Link**. If `IDEA` is selected, verify it skips the MVP link question.
5. Submit the final response and verify you are redirected to the success screen.

### B. Investor Flow Validation
1. Restart the chatbot.
2. Select **"Investor"** from the onboarding card.
3. Verify that the question sequence follows:
   - Name → Email → Phone → LinkedIn → Firm Name → Role at Firm → Thesis → Sectors → Stage Focus → Lead/Follow → Cheque Size → Cheque Range → Portfolio → Conflicts → Support Model → Hands-on Level → Deals per Year → Capital Available → Deployment Timeline → Additional Info.
4. Submit the final response and check for successful submission redirection.

---

## 2. Real-Time Validation Testing

### A. Client-Side Validations
- **Email Validation:** Type `invalid-email` on the email screen. Verify the system shows: `"Invalid email address"`.
- **LinkedIn Validation:** Type `https://google.com` or plain text. Verify the system shows: `"LinkedIn URL must be a valid LinkedIn link (e.g. linkedin.com/...)"`.
- **Text MinLength Verification:** Type a single letter `a` on a text field (e.g. startup name). Verify it shows: `"Must be at least 2 characters"`.
- **Textarea MinLength Verification:** Type `too short` on a textarea field (e.g. background description). Verify it shows: `"Must be at least 10 characters"`.

### B. Gemini AI Quality Validation
- **Keyboard Smashing Test:** On the **Background** question, type:
  `asdfasdfasdfasdfasdfasdf`
  Verify the input composer disables, the validation spinner runs, and the chatbot displays:
  `"Please enter a meaningful answer."` without letting you proceed.
- **Repeated Character Test:** Type:
  `aaaaa aaaaa aaaaa aaaaa aaaaa`
  Verify that this triggers the validation error.
- **Valid Text Entry Test:** Type a realistic background description:
  `"I have 10 years of experience in clean energy systems, managing technical development and launch."`
  Verify the field is validated successfully and allows you to proceed to the next question.

---

## 3. Scoring & Dashboard Testing

### A. Lead Scoring Calculations
Submit a founder profile with the following parameters:
- **LinkedIn:** Provided (`5 points`)
- **MVP Status:** `COMPLETED` (`20 points`)
- **Team Size:** `3` members and **Full Time:** `YES` (`15 points`)
- **AI Quality Fields:** (Assuming Gemini averages quality `8/10` across background, description, problem, customer, and traction = `(8/10) * 65` = `52 points`)
- **Expected Total Score:** `5 + 20 + 15 + 52 = 92`.
- **Expected Status:** `HOT`.

Verify that this lead appears on the **Dashboard** (`http://localhost:5173/dashboard`) in the leads table with a score of `92` and a status badge showing `HOT`.

### B. Dynamic Fallback Summary Verification
1. Temporarily disable your internet connection or remove the `GEMINI_API_KEY` from `backend/.env`.
2. Submit a lead or view an existing lead detail page in the dashboard.
3. In the terminal, verify the warning log appears:
   `GEMINI FALLBACK ACTIVATED`
4. On the lead details page:
   - Verify that the **Score Breakdown** displays `"Fallback used"` for AI-assessed fields.
   - Verify that the **AI Analysis** panel displays a structured summary populated with the founder's company name and background highlights instead of a generic "Summary unavailable."
