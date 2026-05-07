## Siebel Development Standards

When answering any question related to Siebel CRM configuration or development:
1. Always prefer Siebel Tools-based (declarative) solutions over JavaScript/scripting.
2. Always reference Oracle Siebel Bookshelf best practices.
3. Key Bookshelf URLs to reference:
   - Configuring Siebel Business Applications: https://docs.oracle.com/cd/E14004_01/books/ConfigApps/
   - Siebel Open UI API Reference: https://docs.oracle.com/cd/E14004_01/books/OUIRG/
   - Siebel eScript API Reference: https://docs.oracle.com/cd/E14004_01/books/eScript/
4. Prefer: Pre Default Value, Force Active, Calculated Fields, Workflow Policies over presentation-layer workarounds.
5. Never suggest WriteRecord() from within BindData() or BindEvents().

---

## SSJ Defect / Change Request Intake (Triage)

When the user reports a **defect/bug/issue** or a **CR (change request)** for Siebel SSJ (including CM- ticket references), follow this workflow.

### Step 1 — Collect triage info (ask ONE question at a time)
Do **not** start troubleshooting until these are answered.

**Q1. Journey**
- Ask: "Is it happening in **TBUI SSJ journey** or **BAU journey**?"
- Allowed answers: `TBUI SSJ` / `BAU`

**Q2. Flow** (only if Q1 = TBUI SSJ)
- Ask: "Is it for **existing customer flow** or **new customer flow**?"
- Allowed answers: `Existing` / `New`

**Q3. Page** (only if Q1 = TBUI SSJ)
- Ask: "Which **page number (1–9)** is it happening on?"
- Allowed answers: `1,2,3,4,5,6,7,8,9`
- If the user provides a page *name* instead of a number, accept it and map it to the page number.

**Q4. Minimum details**
Ask for:
- Expected behavior vs actual behavior
- Steps to reproduce
- Environment (UAT/PROD), browser/device (if UI)
- Any error text, screenshot, console log

### Step 2 — Summarize before analysis
After answers are collected, produce a short structured summary **before** proposing fixes:
- Journey: ...
- Flow: ... (if TBUI SSJ)
- Page: ... (1–9) + PageName
- Main Task: ... (if TBUI SSJ)
- Sub Task: ... (if TBUI SSJ)
- View: ...
- Applet(s): ... (derived from View SIF)
- BC/BO: ... (derived from Applet/BC SIF)
- BS/WF/LOV involved: ... (derived from referenced logic)
- Expected:
- Actual:
- Steps:
- Environment:

---

## TBUI SSJ Troubleshooting Scope Reduction Rules

These rules apply **only when Journey = TBUI SSJ**.

### Scope rule (critical)
When Journey = TBUI SSJ and the Page (1–9) is identified:
1. **Set the Main Task to: `VHA DFA Post Pay Connection`**.
2. **Use only the page’s Sub Task + View** (from the mapping below) to drive investigation.
3. **Focus analysis ONLY on artifacts related to that page’s View/Applets/BCs/Services**.
4. Do not scan unrelated SIFs/JS unless the page’s artifacts reference them.

### TBUI SSJ Page → Sub Task → View mapping (authoritative)
Use this mapping whenever user provides page number or page name.

1. **Capture customer details**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New): `VF SSJ Connection Wizard View – Shopping Cart – TBUI`
   - Sub Task (Existing): `VF SSJ Connection Wizard View – Shopping Cart – TBUI`
   - View (New): `VF Capture Customer Details – Postpay - SSJ`
   - View (Existing): `VF Capture Customer Details – Postpay - SSJ`

2. **Capture ID details**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New): `VHA Kogan Capture Id Details Sub Task`
   - Sub Task (Existing): `VHA Kogan Capture Id Details Sub Task`
   - View (New): `VF SSJ Customer ID Details – Postpay TBUI`
   - View (Existing): `VF SSJ Customer ID Details – Postpay TBUI`

3. **Capture Credit check**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New): `VF Perform Credit Check Task`
   - View (New): `VF Connection Wizard View - Credit Check – TBUI - SSJ`
   - Sub Task (Existing): `VF Perform Credit Check Existing Customer`
   - View (Existing): `VF Connection Wizard View - Credit Check – TBUI - SSJ Exist Customer`

4. **Billing Details**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New): `VF Capture Billing Details Task`
   - View (New): `VHA Connection Wizard View - Billing Detail - TBUI - SSJ`
   - Sub Task (Existing): `VF Capture SSJ Exist Billing Details Task`
   - View (Existing): `VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ`

5. **Coverage Check Details**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New/Existing): `VHA SSJ Coverage Check Details Task`
   - View (New/Existing): `VF Coverage Check Details - Postpay - SSJ`

6. **Proposition**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New/Existing): `VF SSJ Add Proposition Task MSO`
   - View (New/Existing): `VF SSJ Connection Wizard View – Shopping Cart – TBUI`

7. **Prepayment and sharing**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New/Existing): `VF SSJ MSO Configure Mobile Payment Plan Task`
   - View (New/Existing): `VF SSJ Prepayments View-TBUI`

8. **Order Review**
   - Main Task: `VHA DFA Post Pay Connection`
   - View (New Connect / Upgrade / RPC): `VF New Connect MSO Order Summary View TBUI SSJ - eSIM Details`
   - Sub Task (New Connect): `VF Order SSJ Submit Task MSO`
   - Sub Task (Upgrade/RPC): `VF SSJ Upg Order Summary Task`

9. **Make a Prepayment**
   - Main Task: `VHA DFA Post Pay Connection`
   - Sub Task (New/Existing): `VHA Prepayments Task`
   - View (New/Existing): `VHA SSJ Prepayment Processing View`

### What to consult (in order)
Once the page is known, use this order to minimize time:

1) **Main Task + Sub Task (navigation context)**
- Confirm the issue is in Main Task: `VHA DFA Post Pay Connection`.
- Confirm the Sub Task and View from the mapping for the selected page and flow.

2) **View SIF**
- Locate the SIF entry for the mapped **View name**.
- From the view definition, list the **applets** on that view.

3) **Applet SIF(s)**
- For each relevant applet on that view: identify underlying **BC** and key controls/fields.

4) **BC/BO SIF(s)**
- For each relevant BC: review calculated fields, user properties, validation/search specs, picklists.

5) **Business Service / Workflow / Runtime events / LOVs (only if implicated)**
- Only consult BS/WF/LOVs that are referenced by the View/Applet/BC OR clearly mentioned by the user’s symptoms.

6) **Open UI PR/JS/CSS overrides for that view/applet**
- Search this repo for Presentation Renderer / custom JS matching:
  - the **View name**, **Applet name**, module define name (e.g., `siebel/custom/<name>`), or file naming pattern like `*PR.js`.
- Prioritize files that explicitly check `SiebelApp.S_App.GetActiveView().GetName()` or reference the applet name.

### Output rule
When responding, always include:
- The page number + page name
- Main Task + Sub Task + View used
- The exact View/Applet/BC names you used for analysis
- The specific repo files you consulted (by filename)
- What you ruled out due to scoping
