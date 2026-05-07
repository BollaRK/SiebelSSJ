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
- Page: ... (1–9) + PageName (if mapping exists)
- View: ... (if known)
- Applet(s): ... (if known)
- BC/BO: ... (if known)
- BS/WF/LOV involved: ... (if known)
- Expected:
- Actual:
- Steps:
- Environment:

---

## TBUI SSJ Troubleshooting Scope Reduction Rules

These rules apply **only when Journey = TBUI SSJ**.

### Scope rule (critical)
When Journey = TBUI SSJ and the Page (1–9) is identified:
1. **Focus analysis ONLY on artifacts related to that page**.
2. Do not scan unrelated SIFs/JS unless the page’s artifacts reference them.

### What to consult (in order)
Once the page is known, use this order to minimize time:

1) **View SIF**
- Identify the **View** for the page.
- From the view definition, list the **applets** on that view (and whether they are list/form/toggle/task playbar etc.).

2) **Applet SIF(s)**
- For each relevant applet: identify underlying **BC** and key controls/fields.

3) **BC/BO SIF(s)**
- For each relevant BC: review calculated fields, user properties, validation/search specs, picklists.

4) **Business Service / Workflow / Runtime events (if implicated)**
- If the issue mentions validations, errors, popups, automation, integrations, or background logic:
  consult corresponding **BS**, **WF**, runtime events, LOVs referenced by the page/view/applet/BC.

5) **Open UI PR/JS/CSS overrides for that view/applet**
- Search this repo for Presentation Renderer / custom JS matching:
  - the **View name**, **Applet name**, module define name (e.g., `siebel/custom/<name>`), or file naming pattern like `*PR.js`.
- Prioritize files that explicitly check `SiebelApp.S_App.GetActiveView().GetName()` or reference the applet name.

### Output rule
When responding, always include:
- The exact View/Applet/BC names you used for analysis
- The specific repo files you consulted (by filename)
- What you ruled out due to scoping

### Missing mapping rule
If the page-number → view/applet mapping is not yet available, ask the user to provide:
- Page number → View name mapping (1–9)
OR
- The SIF/task file where the SSJ journey pages are defined
Then proceed with the scope reduction rules.
