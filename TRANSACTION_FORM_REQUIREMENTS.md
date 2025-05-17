# Transaction Form Requirements & Implementation Guide

## Overview
This document provides a comprehensive and detailed specification for the PortalWizard Transaction Form, its features, validation, backend integration, and future extensibility. It is intended as a reference for developers and stakeholders to ensure alignment and clarity throughout development.

---

## 1. Multi-Step Transaction Form
- **Purpose:** Capture all necessary transaction data in a logical, user-friendly, and validated multi-step process.
- **Steps:**
  1. **Transaction Type & Date**
      - Fields: Market Type, Transaction Type, Transaction Date
      - (Optional future: Developer/Project selection if Market Type is 'new_launch')
  2. **Property Details**
      - Fields: Property Name/Address, Property Type, Address
  3. **Client Information**
      - Fields: Client Name, Email, Phone, Type, ID Number
  4. **Co-Broking Setup**
      - Fields: Co-Broking Type, Agent Name, Agency Name, Agent RERA
  5. **Commission Calculation**
      - Fields: Total Price, Annual Rent, Commission Value, Commission Type, Commission Percentage
      - **Commission Breakdown:**
        - Show agent's tier (read-only, from profile)
        - Apply tier-based commission logic (overriding %, leadership bonus)
        - Visual breakdown: base commission, leadership bonus, total
        - All calculations update live as values change
  6. **Document Uploads**
      - Placeholder for file upload (to be implemented)
  7. **Review & Submit**
      - Show all entered data for confirmation
      - Allow editing previous steps before final submission

---

## 2. Validation & UX
- All required fields must be validated with clear error messages
- Numeric fields (prices, commissions) must be positive and properly formatted
- Email/phone fields must use appropriate patterns
- Step navigation: cannot proceed unless current step is valid
- Use Suspense and loading indicators for async actions (e.g., submission)

---

## 3. Backend Integration
- **Submission:**
  - On final submit, POST all data to backend API endpoint (to be defined)
  - Handle API errors gracefully and provide user feedback
- **Storage:**
  - Store all transaction data, including commission breakdown, in the database
  - Document upload: store file metadata and link to transaction record
- **Retrieval:**
  - Prepare for future display of transactions in agent and admin portals

---

## 4. Tier-Based Commission Structure (Read-Only)
- **Source:** Agent's tier is fetched from their profile (not user-selectable)
- **Tiers & Logic:**
  - Advisor: 70% overriding, no leadership bonus
  - Sales Leader: 80% overriding, 7% leadership bonus
  - Team Leader: 83% overriding, 5% leadership bonus
  - Group Leader: 85% overriding, 8% leadership bonus
  - Supreme Leader: 85% overriding, 6% leadership bonus
- **Implementation:**
  - Commission breakdown UI must show:
    - Agent tier (read-only)
    - Overriding %, leadership bonus % (if any)
    - Base commission, leadership bonus, total commission
  - All calculations must update in real time as commission value changes

---

## 5. Extensibility & Future Enhancements
- **Admin Portal:**
  - Transaction approval/rejection workflow
  - Tier assignment and management
  - Reporting and analytics
- **Agent Portal:**
  - Transaction history and status
  - Commission progress tracking
- **Document Upload:**
  - Full file upload and management (future phase)
- **Tier System:**
  - Real-time tier fetch and integration once backend is ready

---

## 6. Non-Requirements (Out of Scope for Now)
- User-selectable tiers (tiers are admin-assigned only)
- Admin interface for tier management (future phase)
- Progress tracking toward next tier (future feature)

---

## 7. References
- See `README.md` for project-wide architecture and dependency chain.
- See UI layout/flow in `README_UI_LAYOUT.md` (if available).

---

*This document should be updated as the transaction form evolves or as new requirements are discovered.*
