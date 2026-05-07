if (typeof(SiebelAppFacade.VHASSJBillingDetailViewPR) === "undefined") {
  SiebelJS.Namespace("SiebelAppFacade.VHASSJBillingDetailViewPR");
  define("siebel/custom/VHASSJBillingDetailViewPR", ["siebel/viewpr", "siebel/custom/VHASSJValidations"],
    function () {
      SiebelAppFacade.VHASSJBillingDetailViewPR = (function () {

        function VHASSJBillingDetailViewPR(pm) {
          SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.constructor.apply(this, arguments);
        }

        // ==========================================================
        // 1. DATA BRIDGE: Explicitly maps BC values to the UI if TBUI stalls
        // ==========================================================
        function manualDataSync(applet) {
          if (!applet) return;
          var pm = applet.GetPModel();
          var bc = applet.GetBusComp();
          var recordSet = bc.GetRecordSet();
          var selection = bc.GetSelection();
          var controls = pm.Get("GetControls");

          // Force-map data from BC RecordSet directly to the UI controls
          if (selection !== -1 && recordSet[selection]) {
            var activeRecord = recordSet[selection];
            for (var ctrlName in controls) {
              var fieldName = controls[ctrlName].GetFieldName();
              if (fieldName && activeRecord[fieldName] !== undefined) {
                // Update PM Property for internal state
                pm.SetProperty(ctrlName, activeRecord[fieldName]);
                // Push directly to DOM if the field currently appears empty
                var uiEl = $("[name='" + controls[ctrlName].GetInputName() + "']");
                if (uiEl.length > 0 && !uiEl.val()) {
                  uiEl.val(activeRecord[fieldName]);
                }
              }
            }
          }
        }

        // ==========================================================
        // 2. LAYOUT HELPER: Uses "Soft Hide" to keep the Selection Link alive
        // ==========================================================
        function refreshBillingLayout() {
          var view = SiebelApp.S_App.GetActiveView();
          if (!view) return;

          var listApplet = view.GetApplet("VHA SSJ Billing Account Address List Applet TBUI");
          
          // --- NEW: Support both the default form and the manual address toggle form
          var formApplet = view.GetApplet("VF SSJ Billing Account Address Details TBUI") || view.GetApplet("VHA SSJ Billing Account Manual Address List Applet TBUI");
          
          if (!listApplet || !formApplet) return;

          var $listEl = $("#" + listApplet.GetFullId());
          var $formEl = $("#" + formApplet.GetFullId());

          // --- NEW: Check sessionStorage state first, fallback to DOM check for safety
          var isEditModeSession = sessionStorage.getItem("isAddressEditing") === "Y";
          var isEditModeDOM = $formEl.find("button[data-display='Save'], button:contains('Save')").length > 0;
          var isEditMode = isEditModeSession || isEditModeDOM;

          if (isEditMode) {
             // Reset to standard layout for editing
             $listEl.show().css({ "height": "auto", "opacity": "1", "visibility": "visible", "overflow": "visible", "display": "block" });
             if ($listEl.next().attr('id') !== $formEl.attr('id')) { $listEl.insertBefore($formEl); }
             
             setTimeout(function () { 
                var grid = $("#gbox_" + listApplet.GetFullId() + " .ui-jqgrid-btable");
                if(grid.length) { grid.setGridWidth($listEl.width()); $(window).trigger("resize"); }
             }, 200);
          } else {
            // BASE MODE: Hide List without 'deactivating' the data sync
            $listEl.css({
              "display": "block",
              "height": "0px",
              "overflow": "hidden",
              "opacity": "0",
              "margin": "0",
              "padding": "0"
            });
            // Perform fallback data sync for read-only mode
            manualDataSync(formApplet);
          }
        }

        // ==========================================================
        // 3. BAU HELPERS (CM-7656 - Bank Popups)
        // ==========================================================
        function watchUpdateBankAcctPopupAfterPickClick() {
          $(document).off("click.updateBankPopup", ".vha-ssj-bill-setup-an-icon .appletButton.siebui-icon-showpopup")
            .on("click.updateBankPopup", ".vha-ssj-bill-setup-an-icon .appletButton.siebui-icon-showpopup", function () {
              const popupWatcher = setInterval(function () {
                const updateBankPopup = document.querySelector(".update-bank-container");
                if (updateBankPopup) { handleUpdateBankAcctPopup(); clearInterval(popupWatcher); }
              }, 300);
            });
        }

        function handleUpdateBankAcctPopup() {
          const updateBankDetailsPopup = document.querySelector('.update-bank-container');
          if (updateBankDetailsPopup) {
            updateBankDetailsPopup.querySelectorAll("label, span, div").forEach(el => {
              if (el.textContent.trim() === "Account #") el.textContent = "Account number";
            });
            const closeIcon = document.querySelector(".update-bank-close");
            if (closeIcon) closeIcon.addEventListener("click", () => {
                let cancelBtn = document.querySelector(".update-btn-cancel button");
                if (cancelBtn) cancelBtn.click();
            });
          }
        }

        function watchBankPopupAfterPickClick() {
          $(document).off("click.bankPopup", ".VHASearch .applet-form-pick.applet-list-pick").on("click.bankPopup", ".VHASearch .applet-form-pick.applet-list-pick", function () {
              const popupWatcher = setInterval(function () {
                const bankPopup = document.querySelector(".bank-applet-container");
                if (bankPopup) { handleBankDetailsPopup(); clearInterval(popupWatcher); }
              }, 300);
            });
        }

        function handleBankDetailsPopup() {
          const bankDetailsPopup = document.querySelector('.bank-applet-container');
          if (bankDetailsPopup) {
            bankDetailsPopup.querySelectorAll("label, span, div").forEach(el => {
                if (el.textContent.trim() === "BSB Number") el.textContent = "BSB number";
            });
            const inputField = bankDetailsPopup.querySelector(".bank-input-container input");
            if (inputField) inputField.placeholder = "";
            const closeIcon = document.querySelector(".bank-close-btn");
            if (closeIcon) closeIcon.addEventListener("click", () => {
                let cancelBtn = document.querySelector(".bank-btn-cancel button");
                if (cancelBtn) cancelBtn.click();
            });
          }
        }

        SiebelJS.Extend(VHASSJBillingDetailViewPR, SiebelAppFacade.ViewPR);

        VHASSJBillingDetailViewPR.prototype.Init = function () {
          SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.Init.apply(this, arguments);
        }

        VHASSJBillingDetailViewPR.prototype.ShowUI = function () {
          SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.ShowUI.apply(this, arguments);

          var view = SiebelApp.S_App.GetActiveView();
          var isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
          var ext = SiebelApp.S_App.GetProfileAttr("ExistingCustomerFlag");

          // CM-7660 Heading logic
          $(".CustomProfileContainer .SFJHeading").each(function () {
            if ($(this).text().trim().toLowerCase() === "billing delivery options") {
              $(this).closest(".CustomProfileContainer").addClass("customBillingDeliveryOptions");
            }
          });
          
          // CM-9059: Conditional Field Visibility
          if (view.GetName() === "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" &&
            (isDFAFlow === "TPG" || isDFAFlow === "iiNet") && ext == "Y") {
            
            // REMOVED: Server-side Refresh Business Component (Prevented data binding)

            setTimeout(() => {
              var setupApplet = view.GetAppletMap()['VHA DFA Billing Setup Applet TBUI'];
              if (setupApplet) {
                var payType = setupApplet.GetBusComp().GetFieldValue("Payment Type") || "";
                $(".CardField, .bankField").addClass("VFLFDisplayNone");
                if (payType === "Bank account" || payType === "Direct Debit") {
                  $(".bankField").removeClass("VFLFDisplayNone");
                } else if (payType === "Debit or credit card" || payType === "Credit Card") {
                  $(".CardField").removeClass("VFLFDisplayNone");
                }
                // SCOPED HIDE: Only hide within the setup applet to protect address data
                $("#" + setupApplet.GetFullId()).find('.siebui-ctrl-link, .Capturenewdirect').hide();
              }
              refreshBillingLayout();
            }, 400);

            $('.Refreshbutton > div').hide();
            if (document.querySelector('.DFAformgrid')) {
              document.querySelector('.DFAformgrid').style.setProperty('display', 'none', 'important');
            }
          }

        //CM-7656 - Start code added by Renuka on 13/3/2026

        var $paymentTypeField = $(".BillingSetupContainer .vha-ssj-bill-setup-pay-dtls .FormItemVertical span").filter(function(){
            return $(this).text().trim() === "Payment type";
        }).closest(".FormItemVertical");
        if(!$paymentTypeField.hasClass("paymentTypeField")){
            $paymentTypeField.addClass("paymentTypeField");
        }

        var $accountNumberField = $(".BillingSetupContainer .vha-ssj-bill-setup-dd-dtls .FormItemVertical span").filter(function(){
            return $(this).text().trim() === "Account number";
        }).closest(".FormItemVertical");
        if(!$accountNumberField.hasClass("accountNumberField")){
            $accountNumberField.addClass("accountNumberField");
        }
         //CM-7656 - End code added by Renuka

          watchBankPopupAfterPickClick();
          watchUpdateBankAcctPopupAfterPickClick();
          setTimeout(refreshBillingLayout, 50);

          // --- NEW: Force Manual Applet into Edit Mode if it toggled into Base ---
          var manualAppletMap = view.GetAppletMap()['VHA SSJ Billing Account Manual Address List Applet TBUI'];
          if (manualAppletMap && sessionStorage.getItem("isAddressEditing") === "Y") {
              var manualAppletDivId = '#s_' + manualAppletMap.GetFullId() + '_div';
              // Check if it loaded as read-only (no inputs)
              var hasInputs = $(manualAppletDivId).find('input[type="text"]').length > 0;
              
              if (!hasInputs) {
                  setTimeout(function() {
                      manualAppletMap.InvokeMethod("EditRecord");
                  }, 150);
              }
          }
          // ------------------------------------------------------------------------
        }

        VHASSJBillingDetailViewPR.prototype.BindData = function (bRefresh) {
          SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.BindData.apply(this, arguments);
          // Manually sync the address details applet to ensure data is visible
          manualDataSync(this.GetPM().Get("AppletMap")["VF SSJ Billing Account Address Details TBUI"]);
          setTimeout(refreshBillingLayout, 150);
        }

        VHASSJBillingDetailViewPR.prototype.BindEvents = function () {
          SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.BindEvents.apply(this, arguments);

          $(document).off("click.vhaSSJLayout").on("click.vhaSSJLayout", "button, a", function () {
            var txt = ($(this).text() || "").trim().toLowerCase();
            
            // --- NEW: Set Session State based on Button Click ---
            if (txt === "edit") {
              sessionStorage.setItem("isAddressEditing", "Y");
              setTimeout(refreshBillingLayout, 500);
            } else if (txt === "save" || txt === "discard") {
              sessionStorage.setItem("isAddressEditing", "N");
              setTimeout(refreshBillingLayout, 500);
            } else if (txt === "manual address") {
              // Safety catch for the toggle
              setTimeout(refreshBillingLayout, 500);
            }
            // ----------------------------------------------------
          });

          $(".Refreshbutton img").off("click").on("click", function() {
            var service = SiebelApp.S_App.GetService("SIS OM PMT Service");
            var inPS = SiebelApp.S_App.NewPropertySet();
            var outPS = SiebelApp.S_App.NewPropertySet();
            inPS.SetProperty("Business Object Name","Order Entry (Sales)");
            inPS.SetProperty("Business Component Name","VF Com Invoice Profile TBUI");
            service.InvokeMethod("Refresh Business Component",inPS,outPS);
            setTimeout(refreshBillingLayout, 500);
          });
        }

        VHASSJBillingDetailViewPR.prototype.EndLife = function () {
          // --- NEW: Clean up state when navigating away ---
          sessionStorage.removeItem("isAddressEditing");
          
          $(document).off(".vhaSSJLayout");
          SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.EndLife.apply(this, arguments);
        }

        return VHASSJBillingDetailViewPR;
      }())
      return "SiebelAppFacade.VHASSJBillingDetailViewPR"
    })
}