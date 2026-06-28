# Project Architectural Decisions

This document details the engineering and architectural decisions made during the design and development of the Venturizer platform.

---

## 1. Frontend: React + Vite
- **Rationale:** React's component-based model is well-suited for building an interactive step-by-step chatbot and a data-rich admin dashboard.
- **Vite Advantage:** Vite offers fast HMR (Hot Module Replacement) and optimized build times compared to traditional bundlers like Webpack, improving developer experience.
- **State Isolation:** Keeps the conversation state separate from rendering, enabling support for back-navigation (`← Back` button) and client-side validation checks.

---

## 2. Backend: Node.js + Express
- **Rationale:** Express provides a lightweight, unopinionated framework for building REST APIs.
- **Asynchronous Execution:** JavaScript's non-blocking I/O event loop matches our need to handle multiple external API requests (such as Gemini validation calls) concurrently.
- **Ecosystem:** Simplifies integration with Prisma and the Google Generative AI SDK using npm packages.

---

## 3. Database: PostgreSQL (Neon Cloud)
- **Rationale:** Relational integrity is essential for this application. A lead record has strict relations to founder/investor profiles, answer transcripts, and score breakdowns.
- **Neon Serverless:** Provides cloud-hosted PostgreSQL with autoscaling and branching capabilities, simplifying database administration.
- **Transaction Safety:** Enforces ACID compliance during lead submissions, ensuring data is saved successfully across multiple tables or rolled back on failure.

---

## 4. ORM: Prisma
- **Rationale:** Auto-generates a type-safe client based on our `schema.prisma` file, reducing query errors.
- **Migration Engine:** Manages schema modifications and handles database migrations smoothly.
- **Relations:** Enables declarative data fetching via `include` statements (e.g. loading a lead along with its associated answers and AI summaries).

---

## 5. Large Language Model: Gemini 2.5 Flash
- **Rationale:** Offers low latency and structured JSON output configurations, making it suitable for real-time validation checks.
- **Cost Efficiency:** Provides a larger token window and lower cost per query compared to other models.
- **Text Comprehension:** Evaluates input quality, identifying gibberish, spam patterns, and semantic details accurately.

---

## 6. Hybrid AI & Rule-Based Scoring Architecture
- **Rationale:** Relying entirely on LLMs for scoring is non-deterministic, slow, and expensive. Relying entirely on rules makes the system vulnerable to spam.
- **How they collaborate:** The rule-based engine scores structured parameters (e.g., MVP completion, team details) consistently, while Gemini validates descriptive text fields. If text quality is low, the points allocated for those fields are discounted, providing a balanced, spam-resistant scoring system.

---

## 7. Separate Founder & Investor Flows
- **Rationale:** Founders and investors have distinct qualification requirements. 
  - Founders are evaluated on product development, market need, traction, and team.
  - Investors are evaluated on capital availability, ticket size, sectors, and thesis.
- **Implementation:** Keeping these flows separate in both question datasets and backend profiles ensures data is stored cleanly and scored using the appropriate rubrics.
