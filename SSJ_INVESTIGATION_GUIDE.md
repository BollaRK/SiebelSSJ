# SSJ Issue Investigation Guide

## Investigation Workflow Rule

When an issue or new requirement is reported, **always follow this three-step clarification sequence before looking at any SIF file**:

```
Step 1 → Ask: "Which page is the issue happening on?" (1–9)
Step 2 → Ask: "Is it happening on the New Customer flow or the Existing Customer flow?"
Step 3 → Open only the SIF files listed in the matching cell of the table below.
```

> **Note:** For pages 5, 6, 7 — both flows share the same view and task, so step 2 can be skipped.

---

## Page × Flow → SIF File Reference Table

| Page | Flow | View Name | View SIF(s) | Sub-Task / Task Name | Task SIF(s) | Page-wise SIF |
|---|---|---|---|---|---|---|
| **1** Capture Customer Details | New | VF Capture Customer Details – Postpay - SSJ | `2a.sif` | VF SSJ Connection Wizard View – Shopping Cart – TBUI (VIEW) | `objects (5).sif` | `page1_capture_customer_details.sif` |
| **1** Capture Customer Details | Existing | VF Capture Customer Details – Postpay - SSJ | `2a.sif` | VF SSJ Connection Wizard View – Shopping Cart – TBUI (VIEW) | `objects (5).sif` | `page1_capture_customer_details.sif` |
| **2** Capture ID Details | New | VF SSJ Customer ID Details – Postpay TBUI | `2a.sif` | VHA Kogan Capture Id Details Sub Task | `objects.sif` | `page2_capture_id_details.sif` |
| **2** Capture ID Details | Existing | VF SSJ Customer ID Details – Postpay TBUI | `2a.sif` | VHA Kogan Capture Id Details Sub Task | `objects.sif` | `page2_capture_id_details.sif` |
| **3** Credit Check | New | VF Connection Wizard View - Credit Check – TBUI - SSJ | `2b.sif` | VF Perform Credit Check Task | `objects.sif` | `page3_credit_check.sif` |
| **3** Credit Check | Existing | VF Connection Wizard View - Credit Check – TBUI - SSJ Exist Customer | `objects (5).sif` | VF Perform Credit Check Existing Customer | `1b.sif` | `page3_credit_check.sif` |
| **4** Billing Details | New | VHA Connection Wizard View - Billing Detail - TBUI - SSJ | `2b.sif` | VF Capture Billing Details Task | `objects.sif` | `page4_billing_details.sif` |
| **4** Billing Details | Existing | VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ | `objects (5).sif` | VF Capture SSJ Exist Billing Details Task | `1b.sif` | `page4_billing_details.sif` |
| **5** Coverage Check | Both | VF Coverage Check Details - Postpay - SSJ | `objects (5).sif` | VHA SSJ Coverage Check Details Task | `1a.sif` | `page5_coverage_check.sif` |
| **6** Proposition | Both | VF SSJ Connection Wizard View – Shopping Cart – TBUI | `objects (5).sif` | VF SSJ Add Proposition Task MSO | `objects.sif` | `page6_proposition.sif` |
| **7** Prepayment & Sharing | Both | VF SSJ Prepayments View-TBUI | `objects (5).sif` | VF SSJ MSO Configure Mobile Payment Plan Task | `1a.sif` | `page7_prepayment_sharing.sif` |
| **8** Order Review | New Connect | VF New Connect MSO Order Summary View TBUI SSJ - eSIM Details | `objects (5).sif` | VF Order SSJ Submit Task MSO | `objects.sif` | `page8_order_review.sif` |
| **8** Order Review | Upgrade / RPC | VF New Connect MSO Order Summary View TBUI SSJ - eSIM Details | `objects (5).sif` | VF SSJ Upg Order Summary Task | `objects.sif` | `page8_order_review.sif` |
| **9** Make a Prepayment | Both | VHA SSJ Prepayment Processing View | `2g.sif`, `3.sif` | VHA Prepayments Task | `objects.sif` | `page9_make_prepayment.sif` |

---

## How to Use This Guide

### Scenario A — Bug reported on a specific page
1. Ask: **"Which page (1–9)?"**
2. Ask: **"New Customer or Existing Customer flow?"** (skip for pages 5–7, 9)
3. Open the **Page-wise SIF** listed in the last column — this is the consolidated reference.
4. If the bug involves the View definition → also check the **View SIF(s)**.
5. If the bug involves task logic / steps → also check the **Task SIF(s)**.

### Scenario B — New requirement for a specific page
1. Follow the same steps as Scenario A to identify the right SIF files.
2. Make changes in the **source SIF files** (View SIF and/or Task SIF columns) — the page-wise SIFs are derived reference files.

### Scenario C — Issue spans both flows of the same page
Open both the New and Existing row SIF files for that page and compare.

---

## Quick Source SIF Summary

| Source SIF | What it primarily contains |
|---|---|
| `2a.sif` | Page 1 View (Capture Customer Details), Page 2 View (Customer ID Details) |
| `2b.sif` | Page 3 New View (Credit Check SSJ), Page 4 New View (Billing Detail SSJ) |
| `objects (5).sif` | Page 3 Exist View, Page 4 Exist View, Page 5 View, Page 6 View, Page 7 View, Page 8 View |
| `objects.sif` | Page 2 Task, Page 3 New Task, Page 4 New Task, Page 6 Task, Page 8 Tasks, Page 9 Task |
| `1a.sif` | Page 5 Task (Coverage Check), Page 7 Task (Mobile Payment Plan) |
| `1b.sif` | Page 3 Exist Task, Page 4 Exist Task |
| `2g.sif`, `3.sif` | Page 9 View (Prepayment Processing) |

---

## Page Name Aliases (for quick lookup)

| Alias you might say | Canonical page number |
|---|---|
| "Customer details", "customer capture" | Page 1 |
| "ID details", "ID page", "ID capture" | Page 2 |
| "Credit check" | Page 3 |
| "Billing", "billing details" | Page 4 |
| "Coverage", "coverage check" | Page 5 |
| "Proposition", "prop page" | Page 6 |
| "Prepayment sharing", "payment plan", "sharing" | Page 7 |
| "Order review", "order summary" | Page 8 |
| "Make a prepayment", "prepayment processing" | Page 9 |

---

## PR / JS Files Grouped by SSJ Page

> **Why this section exists:** Each AI/agent chat session is stateless — answers given only in chat are lost when the session ends. This table persists the PR-file → page mapping in the repo so it survives across sessions and reviewers.
>
> Mapping was derived from each file's namespace declaration and the applet/view names referenced inside its header (e.g. `VHACaptureIdDetailsPR.js` references applet `VF SSJ Capture Identification Details List Applet – Postpay TBUI` → Page 2).

### Page-specific Physical Renderers (PRs)

| Page | PR / JS file(s) | Notes |
|---|---|---|
| **1** Capture Customer Details | `VHASSJCustomerDetailsFormAppletPR.js` | Form applet PR (extends `PhysicalRenderer`) |
| **2** Capture ID Details | `VHACaptureIdDetailsPR.js` | References `VF SSJ Capture Identification Details List Applet – Postpay TBUI` |
| **3** Credit Check | *(none repo-local)* | Uses OOTB renderers + cross-cutting files |
| **4** Billing Details | `VHASSJBillingDetailViewPR.js` (View PR) <br> `VHASSJBillingAccountPR.js` (billing account list) <br> `VHABillingSetupAppletTBUIPR.js` (billing setup applet) <br> `VF_Intelligence_Search_Billing_Address_PR.js` (address lookup grid) <br> `VHASSJAddressSearch.js` (address-search helper) | View PR extends `ViewPR`; address files are billing-address pickers used on this page |
| **5** Coverage Check | *(none repo-local)* | OOTB + cross-cutting |
| **6** Proposition | `VHASSJPropositionViewPR.js` (View PR) <br> `VHASSJPropositionLineItemListAppletPR.js` <br> `VHASSJAccessoriesListAppletTBUIPR.js` <br> `VHASSJStoreReservationsListAppletTBUI.js` <br> `VHASalesCalculatorSSJViewPR.js` <br> `VHANSASalesCalcUpgradePDFPR.js` | View PR + applets that render inside the shopping-cart / proposition view |
| **7** Prepayment & Sharing | *(none repo-local)* | OOTB + cross-cutting |
| **8** Order Review | `VHALFOrderReviewSSJPR.js` (View PR) <br> `VHASSJOrderReviewShippingAddPR.js` (shipping address) <br> `VHAOrderEntryAttachmentListAppletSSJPR.js` (attachments) <br> `VHAOrderFormAppletPR.js` (order form applet) | LF Order Review is the order-summary view PR |
| **9** Make a Prepayment | *(none repo-local)* | OOTB + cross-cutting |

### Cross-cutting files (apply to all pages)

| File | Purpose |
|---|---|
| `VHASSJNavigationPR.js` | SSJ wizard navigation (next/prev) and framework crash-prevention patches |
| `VHACustomUIFrameWork.js` | Generic SSJ UI framework helpers; uses `VHA Customer Navigation Applet - SSJ` |
| `VHASSJValidations.js` | Shared validation utility (business-service property-set calls) |
| `VHALFTheme.css` | SSJ look-and-feel styling for all pages |

### Notes
- Pages **3, 5, 7, 9** have no page-specific custom PR file in this repo — they rely on OOTB Siebel renderers plus the cross-cutting files. If additional PR files for those pages exist elsewhere, slot them into the table.
- `VHASSJAddressSearch.js` and `VHASSJValidations.js` are utility modules; listed under their primary consumer page but may be loaded by other pages too.
