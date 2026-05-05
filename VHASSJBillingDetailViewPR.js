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
                if (!applet)
                    return;
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
                if (!view)
                    return;
                if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                    var listApplet = view.GetApplet("VHA SSJ Billing Account Address List Applet TBUI");
                    var formApplet = view.GetApplet("VF SSJ Billing Account Address Details TBUI");
                    if (!listApplet || !formApplet)
                        return;
                    var $listEl = $("#" + listApplet.GetFullId());
                    var $formEl = $("#" + formApplet.GetFullId());
                    // Detection: Edit mode is active if Save button exists
                    var isEditMode = $formEl.find("button[data-display='Save'], button:contains('Save')").length > 0;
                    if (isEditMode) {
                        // Reset to standard layout for editing
                        $listEl.show().css({
                            "height": "auto",
                            "opacity": "1",
                            "visibility": "visible",
                            "overflow": "visible",
                            "display": "block"
                        });
                        if ($listEl.next().attr('id') !== $formEl.attr('id')) {
                            $listEl.insertBefore($formEl);
                        }
                        setTimeout(function () {
                            var grid = $("#gbox_" + listApplet.GetFullId() + " .ui-jqgrid-btable");
                            if (grid.length) {
                                grid.setGridWidth($listEl.width());
                                $(window).trigger("resize");
                            }
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
                        //Soumalya:Added if condition for SIT blocker
                        if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ")
                            manualDataSync(formApplet);
                    }
                }
            }
            // ==========================================================
            // 3. BAU HELPERS (CM-7656 - Bank Popups)
            // ==========================================================
            function watchUpdateBankAcctPopupAfterPickClick() {
                if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                    $(document).off("click.updateBankPopup", ".vha-ssj-bill-setup-an-icon .appletButton.siebui-icon-showpopup").on("click.updateBankPopup", ".vha-ssj-bill-setup-an-icon .appletButton.siebui-icon-showpopup", function () {
                        const popupWatcher = setInterval(function () {
                            const updateBankPopup = document.querySelector(".update-bank-container");
                            if (updateBankPopup) {
                                handleUpdateBankAcctPopup();
                                clearInterval(popupWatcher);
                            }
                        }, 300);
                    });
                }
            }
            function handleUpdateBankAcctPopup() {
                if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                    const updateBankDetailsPopup = document.querySelector('.update-bank-container');
                    if (updateBankDetailsPopup) {
                        updateBankDetailsPopup.querySelectorAll("label, span, div").forEach(el => {
                            if (el.textContent.trim() === "Account #")
                                el.textContent = "Account number";
                        });
                        const closeIcon = document.querySelector(".update-bank-close");
                        if (closeIcon)
                            closeIcon.addEventListener("click", () => {
                                let cancelBtn = document.querySelector(".update-btn-cancel button");
                                if (cancelBtn)
                                    cancelBtn.click();
                            });
                    }
                }
            }
            function watchBankPopupAfterPickClick() {
                if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                    $(document).off("click.bankPopup", ".VHASearch .applet-form-pick.applet-list-pick").on("click.bankPopup", ".VHASearch .applet-form-pick.applet-list-pick", function () {
                        const popupWatcher = setInterval(function () {
                            const bankPopup = document.querySelector(".bank-applet-container");
                            if (bankPopup) {
                                handleBankDetailsPopup();
                                clearInterval(popupWatcher);
                            }
                        }, 300);
                    });
                }
            }
            function handleBankDetailsPopup() {
                if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                    const bankDetailsPopup = document.querySelector('.bank-applet-container');
                    if (bankDetailsPopup) {
                        bankDetailsPopup.querySelectorAll("label, span, div").forEach(el => {
                            if (el.textContent.trim() === "BSB Number")
                                el.textContent = "BSB number";
                        });
                        const inputField = bankDetailsPopup.querySelector(".bank-input-container input");
                        if (inputField)
                            inputField.placeholder = "";
                        const closeIcon = document.querySelector(".bank-close-btn");
                        if (closeIcon)
                            closeIcon.addEventListener("click", () => {
                                let cancelBtn = document.querySelector(".bank-btn-cancel button");
                                if (cancelBtn)
                                    cancelBtn.click();
                            });
                    }
                }
            }
            SiebelJS.Extend(VHASSJBillingDetailViewPR, SiebelAppFacade.ViewPR);
            var activeView = "",
            isDFAFlow = "";
            VHASSJBillingDetailViewPR.prototype.Init = function () {
                SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.Init.apply(this, arguments);
                activeView = SiebelApp.S_App.GetActiveView().GetName();
            }
            VHASSJBillingDetailViewPR.prototype.ShowUI = function () {
                SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.ShowUI.apply(this, arguments);
                var view = SiebelApp.S_App.GetActiveView();
                isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
                var ext = SiebelApp.S_App.GetProfileAttr("ExistingCustomerFlag");
                // CM-7660 Heading logic
                $(".CustomProfileContainer .SFJHeading").each(function () {
                    if ($(this).text().trim().toLowerCase() === "billing delivery options") {
                        $(this).closest(".CustomProfileContainer").addClass("customBillingDeliveryOptions");
                    }
                });
                //CM-9059 - Start code added by samala - For DFA Billing Existing Page
                var sView1 = SiebelApp.S_App.GetActiveView().GetName();
                //var isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
                var ext = SiebelApp.S_App.GetProfileAttr("ExistingCustomerFlag");
                if (sView1 === "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" &&
                    (isDFAFlow === "TPG" || isDFAFlow === "iiNet")) {
                    if (ext == "Y") {
                        var service = SiebelApp.S_App.GetService("SIS OM PMT Service");
                        var inPS = SiebelApp.S_App.NewPropertySet();
                        var outPS = SiebelApp.S_App.NewPropertySet();
                        inPS.SetProperty("Business Object Name", "Order Entry (Sales)");
                        inPS.SetProperty("Business Component Name", "VF Com Invoice Profile TBUI");
                        service.InvokeMethod("Refresh Business Component", inPS, outPS);
                        setTimeout(() => {
                            var payType = (SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA DFA Billing Setup Applet TBUI'].GetBusComp("VF Com Invoice Profile TBUI").GetFieldValue("Payment Type") || "");
                            $(".CardField, .bankField").addClass("VFLFDisplayNone");
                            if (payType === "None" || payType === "Other" || payType === "APM") {
                                $(".CardField, .bankField").addClass("VFLFDisplayNone");
                            }
                            if (payType === "Bank account" || payType === "Direct Debit") {
                                $(".bankField").removeClass("VFLFDisplayNone");
                            } else if (payType === "Debit or credit card" || payType === "Credit Card") {
                                $(".CardField").removeClass("VFLFDisplayNone");
                            }
                        }, 500);
                        $('.Capturenewdirect, .siebui-ctrl-link, .Refreshbutton > div').hide();
                    }
                } else if (sView1 === "VHA Connection Wizard View - Billing Detail - TBUI-SSJ") {
                    //console.log("view", sView1);
                    setTimeout(() => {
                        if (ext == "N") {
                            $(".vha-sfj-bottom-buttons").addClass('VFLFDisplayNone');
                        }
                    }, 500);
                }
                //CM-9059 - END code added by samala - For DFA Billing Existing Page
                //CM-7656 - Start code added by Renuka on 13/3/2026
                var $paymentTypeField = $(".BillingSetupContainer .vha-ssj-bill-setup-pay-dtls .FormItemVertical span").filter(function () {
                    return $(this).text().trim() === "Payment type";
                }).closest(".FormItemVertical");
                if (!$paymentTypeField.hasClass("paymentTypeField")) {
                    $paymentTypeField.addClass("paymentTypeField");
                }
                var $accountNumberField = $(".BillingSetupContainer .vha-ssj-bill-setup-dd-dtls .FormItemVertical span").filter(function () {
                    return $(this).text().trim() === "Account number";
                }).closest(".FormItemVertical");
                if (!$accountNumberField.hasClass("accountNumberField")) {
                    $accountNumberField.addClass("accountNumberField");
                }
                //CM-7656 - End code added by Renuka
                watchBankPopupAfterPickClick();
                watchUpdateBankAcctPopupAfterPickClick();
                // CR fix: removed makeBillingAddressReadOnly() call - users must be able to edit address per CR (Billing Address CR)
                setTimeout(refreshBillingLayout, 50);
            }
            VHASSJBillingDetailViewPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.BindData.apply(this, arguments);
                // Manually sync the address details applet to ensure data is visible
                //Soumalya:Added if condition for SIT blocker
                if (activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || activeView == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                    // CR fix: use GetActiveView().GetApplet() instead of GetPM().Get("GetAppletMap") - PR-only approach per Billing Address CR
                    manualDataSync(SiebelApp.S_App.GetActiveView().GetApplet("VF SSJ Billing Account Address Details TBUI"));
                    // CR fix: removed makeBillingAddressReadOnly() call - users must be able to edit address per CR (Billing Address CR)
                    setTimeout(refreshBillingLayout, 150);
                }
            }
            VHASSJBillingDetailViewPR.prototype.BindEvents = function () {
                SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.BindEvents.apply(this, arguments);
                $(document).off("click.vhaSSJLayout").on("click.vhaSSJLayout", "button, a", function () {
                    var txt = ($(this).text() || "").trim().toLowerCase();
                    if (txt === "edit" || txt === "save" || txt === "discard") {
                        setTimeout(refreshBillingLayout, 500);
                    }
                });
                // ---- DFA Flow Billing Page- SAMALA----//
                // CR fix: When manual address checkbox is clicked inside address form applet,
                // switch the applet to Edit mode so user can enter/update the manual address (Billing Address CR)
                $(document).off("change.vhaBillingManualAddr").on("change.vhaBillingManualAddr", ".BillingAddressContainer input[type='checkbox']", function () {
                    if (activeView === "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ") {
                        var addrFormApplet = SiebelApp.S_App.GetActiveView().GetApplet("VF SSJ Billing Account Address Details TBUI");
                        if (addrFormApplet) {
                            var $formEl = $("#" + addrFormApplet.GetFullId());
                            var isAlreadyEditing = $formEl.find("button[data-display='Save'], button:contains('Save')").length > 0;
                            if (!isAlreadyEditing) {
                                setTimeout(function () {
                                    addrFormApplet.InvokeMethod("EditRecord");
                                }, 100);
                            }
                        }
                    }
                });
                // ---- Manual address checkbox End ----//
                $(".Refreshbutton img").off("click").on("click", function () {
                    var appletPM = SiebelApp.S_App.GetActiveView().GetApplet("VHA DFA Billing Setup Applet TBUI").GetPModel();
                    var service = SiebelApp.S_App.GetService("SIS OM PMT Service");
                    var inPS = SiebelApp.S_App.NewPropertySet();
                    var outPS = SiebelApp.S_App.NewPropertySet();
                    inPS.SetProperty("Business Object Name", "Order Entry (Sales)");
                    inPS.SetProperty("Business Component Name", "VF Com Invoice Profile TBUI");
                    service.InvokeMethod("Refresh Business Component", inPS, outPS);
                    //var isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
                    if (isDFAFlow === "TPG" || isDFAFlow === "iiNet") {
                        setTimeout(() => {
                            var payType = (SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA DFA Billing Setup Applet TBUI'].GetBusComp("VF Com Invoice Profile TBUI").GetFieldValue("Payment Type") || "");
                            $(".CardField, .bankField").addClass("VFLFDisplayNone");
                            if (payType === "None" || payType === "Other" || payType === "APM" || payType === "Additional payment method") {
                                $(".CardField, .bankField").addClass("VFLFDisplayNone");
                            }
                            if (payType === "Bank account" || payType === "Direct Debit") {
                                $(".bankField").removeClass("VFLFDisplayNone");
                            } else if (payType === "Debit or credit card" || payType === "Credit Card" || payType === "Debit card") {
                                $(".CardField").removeClass("VFLFDisplayNone");
                            }
                        }, 500);
                    }
                });
                if (isDFAFlow === "TPG" || isDFAFlow === "iiNet") {
                    document.addEventListener('click', function (e) {
                        //var isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
                        //if (isDFAFlow === "TPG" || isDFAFlow === "iiNet") {
                        const btn = e.target.closest(
                                'button[data-display="Edit"][title="Billing setup List Applet:Edit"]');
                        if (!btn)
                            return;
                        setTimeout(() => {
                            $('.Capturenewdirect, .siebui-ctrl-link, .Refreshbutton > div').show();
                        }, 1200);
                        //}
                    });
                }
                // ---- DFA Flow Billing Page SAMALA ----//
            }
            //Sowmya Billing Address 29-04
            function makeBillingAddressReadOnly() {
                var view = SiebelApp.S_App.GetActiveView();
                if (!view)
                    return;
                var formApplet = view.GetApplet("VF SSJ Billing Account Address Details TBUI");
                if (!formApplet)
                    return;
                var $formEl = $("#" + formApplet.GetFullId());
                var isEditMode = $formEl.find("button[data-display='Save'], button:contains('Save')").length > 0;
                if (isEditMode) {
                    $('.BillingAddressContainer input[type="text"]').each(function () {
                        $(this).attr('aria-readonly', 'true');
                        $(this).prop('readonly', true);
                    });
                    $('.BillingAddressContainer textarea').each(function () {
                        $(this).attr('aria-readonly', 'true');
                        $(this).prop('readonly', true);
                    });
                    $('.BillingAddressContainer').addClass('read-only-mode');
                }
            }
            VHASSJBillingDetailViewPR.prototype.EndLife = function () {
                $(document).off(".vhaSSJLayout");
                $(document).off(".vhaBillingManualAddr");
                SiebelAppFacade.VHASSJBillingDetailViewPR.superclass.EndLife.apply(this, arguments);
            }
            return VHASSJBillingDetailViewPR;
        }
            ())
        return "SiebelAppFacade.VHASSJBillingDetailViewPR"
    })
}
