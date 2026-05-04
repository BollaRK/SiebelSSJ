if (typeof(SiebelAppFacade.VHASSJPropositionViewPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHASSJPropositionViewPR");
    define("siebel/custom/VHASSJPropositionViewPR", ["siebel/viewpr"],
        function () {
        SiebelAppFacade.VHASSJPropositionViewPR = (function () {
            function VHASSJPropositionViewPR(pm) {
                SiebelAppFacade.VHASSJPropositionViewPR.superclass.constructor.apply(this, arguments);
            }
            SiebelJS.Extend(VHASSJPropositionViewPR, SiebelAppFacade.ViewPR);
            let VhaCheckStore_Cur_Page = 1;
            let VhaCheckStore_Per_Page = 5;
            let checkstoredata = [];
            let productCode = "";
            var selectedRecord;
            var deviceName = "";
            var quoteNum = "";
            var sQuoteId = "";
			let sCnt= 0;
            function displayReservationApplet() {
                var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Store Reservations List Applet TBUI"];
                if (applet) {
                    var pm = applet.GetPModel();
                    var fullId = pm.Get("GetFullId");
                    fullId = "s_" + fullId + "_div";
                    var recordCount = pm.Get("GetRecordSet").length;
                    if (recordCount >= 1) {
                        $(".PropositionContainerRCApplet").hide();
                        $("#" + fullId).show();
                        /*code added to fix - 9192- start*/
                        var ctrls = pm.Get("GetControls");
                        var ctrlId = ctrls["Reserve"].GetInputName();
                        $('#' + ctrlId + '_Ctrl').hide();
                        $('#' + ctrlId + '_Ctrl').click();
                        var recordSet = pm.Get("GetRecordSet");
                        //var selection = pm.Get("GetSelection");
                        var sDevice = recordSet[0]['Device Name'];
                        let sHtml = '<div class="vha-sfj-cc-dialogbox"><div class="vha-ssj-cc-app"><span class="vha-ssj-cc-app-icon"></span><span class="vha-ssj-cc-app-txt">' + sDevice + 'has been reserved for ring and collect.</span></div></div>';
                        $('#' + ctrlId + '_Ctrl').parent().after(sHtml);
                        /*end*/
                    } else {
                        $(".PropositionContainerRCApplet").show();
                        $("#" + fullId).hide();
                    }
                }
            }
            function handleMethodInvoke(methodName, inputPropSet) {
                if (methodName == "PositionOnRow000")
                    displayReservationApplet();
            }
            function getCoverageAddress() {
                //var sQuoteId = SiebelApp.S_App.GetProfileAttr('QuoteId');
                var inp,
                out;
                if (sQuoteId != "" && sQuoteId != null && sQuoteId != undefined) {
                    var Options = {};
                    inp = SiebelApp.S_App.NewPropertySet();
                    out = SiebelApp.S_App.NewPropertySet();
                    inp.SetProperty("SSJQuoteId", sQuoteId);
                    out = VHAAppUtilities.CallBS("VHA SSJ Generic Utility Service", "GetCoverageAddress", inp, Options);
                }
                return out;
            }
            function updateRadioLabel() {
                var $section = $("h4:contains('Number porting')").parent().find(".FormItemVertical");
                var $radios = $section.find("input[type='radio']");
                $radios.each(function (index) {
                    const $radio = $(this);
                    var area = $radio.attr("aria-label");
                    var name = $radio.attr("name");
                    var id = name + "_" + area;
                    if (area == "No")
                        $radio.parent().find("[id='" + id + "']").text("New MSISDN");
                    else if (area == "Yes - Postpay")
                        $radio.parent().find("[id='" + id + "']").text("Port In");
                    else {
                        $radio.hide();
                        $radio.parent().find("[id='" + id + "']").hide();
                    }
                });
                /*$radios.on('change', function () {
                const $radio = $(this);
                const isChecked = $radio.is(':checked'); // or: const isChecked = this.checked;
                const isValue = $radio.val();
                var LineFormAppletPM,LineFormAppletCtrl
                console.log('isChecked', isChecked);
                console.log('isValue', isValue);
                var LineFormApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                if(LineFormApplet) {
                LineFormAppletPM = LineFormApplet.GetPModel();
                LineFormAppletCtrl = LineFormAppletPM.Get("GetControls");
                var $portInMsisdn = $('input[name='+LineFormAppletCtrl['VF DFA MSISDN'].GetInputName()+']').parent().parent();
                var $Msisdn = $('input[name='+LineFormAppletCtrl['VFMSISDNTBUI'].GetInputName()+']').parent().parent();
                }
                //var $portInMsisdn = $("input[aria-label='Port In MSISDN']").closest(".FormItemVertical, .FormItemHorizontal");
                /* var $portInMsisdn = $("input[aria-label^='VF_DFA_MSISDN_Label']").closest(".FormItemVertical, .FormItemHorizontal");
                var $Msisdn = $("input[aria-label='MSISDN']").closest(".FormItemVertical, .FormItemHorizontal"); */
                /*var $DOB = $("input[aria-label='Date of Birth']").closest(".FormItemVertical, .FormItemHorizontal");
                $DOB.hide();
                if (isValue == "No") {
                $portInMsisdn.addClass('VFDisplayNone');
                $Msisdn.removeClass('VFDisplayNone');
                } else if (isValue == "Yes - Postpay") {
                setTimeout(() => {
                $DOB.hide();
                }, 100);
                $portInMsisdn.removeClass('VFDisplayNone');
                $Msisdn.addClass('VFDisplayNone');
                $("input[aria-label='Port in service account']").closest(".FormItemVertical, .FormItemHorizontal").hide();
                }
                });*/
            }
            $(document).on('autocompleteclose', 'input[type="text"][aria-label="Port In"]', function () {
                const isPortIn = this.value;
                console.log("isPortIn----", isPortIn);
                var $DOB = $("input[aria-label='Date of Birth']").closest(".FormItemVertical, .FormItemHorizontal");
                var $PISA = $("input[aria-label='Port in service account']").closest(".FormItemVertical, .FormItemHorizontal");
                if (isPortIn == "Yes - Prepay") {
                    $DOB.show();
                    //$("input[aria-label='Date of Birth']").attr("readonly", true);
                    $PISA.hide();
                } else {
                    $DOB.hide();
                    $PISA.show();
                }
            });
            function ReseverestorestockUI() {
                $("body").append(`<div class="vha-ssjful-check-str-popup-overlay">
                    <div class="vha-ssjful-check-str-popup-content success">
                    <div class="vha-ssjful-pop-header">
                    <div class="vha-ssjful-check-str-popup-title">Reserve store stock</div>
                    <span class="vha-ssjful-check-str-popup-close-icon"></span>
                    </div>
                    <hr>
                    <div class="vha-ssjful-check-str-popup-body">
                    <div class="vha-ssjful-check-str-popup-device"></div>
                    <div class="d-flex align-items-center">
                    <label class="vha-ssjful-check-str-popup-label">Search store options</label>
                    <input type="text" class="vha-ssjful-check-str-popup-input ui-autocomplete-input" placeholder="Suburb or postcode" value="">
                    <div class="vha-ssjful-check-str-popup-checkbox">
                    <input type="checkbox" id="vha-ssjful-check-str-popup-coverage" class="sameAsCoverage">
                    <label for="vha-ssjful-check-str-popup-coverage">Same as coverage check</label>
                    </div>
                    </div>
                    <table class="vha-ssjful-check-str-popup-table">
                    <thead>
                    <tr>
                    <th class="vha-ssjful-check-str-radioSelector-hdr"></th>
                    <th>Store name</th>
                    <th>Store code</th>
                    <th>Device availability</th>
                    <th>Store working Hours</th>
                    <th>Store address</th>
                    </tr>
                    </thead>
                    <tbody></tbody>
                    </table>
                    <div class="vha-ssjful-check-str-popup-pagination">
                    <div class="vha-ssjful-check-str-popup-pagination-info"></div>
                    <div class="vha-ssjful-check-str-popup-pagination-controls">
                    <button class="vha-ssjful-check-str-popup-prev">&lt;</button>
                    <button class="vha-ssjful-check-str-popup-next">&gt;</button>
                    </div>
                    </div>
                    </div>
                    <hr>
                    
                    <div class="vha-ssjful-check-str-popup-actions">
                      <button class="vha-ssjful-check-str-popup-close-btn">Cancel</button>
                      <button class="vha-ssjful-check-str-popup-confirm-btn" disabled = "disabled">Confirm store reservation</button>
                    </div>
                    </div>
					
					
					<div class="vha-ssjful-check-str-popup-content error">
                    <div class="vha-ssjful-pop-header">
                    <div class="vha-ssjful-check-str-popup-title">Too many physical products for ring and collect</div>
                    <span class="vha-ssjful-check-str-popup-close-icon"></span>
                    </div>
                    <hr>
                    <div class="vha-ssjful-check-str-popup-body">
                    <div class="d-flex align-items-center">
                    <div class="vha-ssjful-check-str-popup-label">Ring and collect is only available for services with one physical product. Please return to your cart and remove any extra physical products from this service to continue.</div>
                    </div>
                   
                    </div>
                    <hr>
                    
                    <div class="vha-ssjful-check-str-popup-actions">
                      <button class="vha-ssjful-check-str-popup-return-btn">Return to cart</button>
                    </div>
                    </div>
                    </div>
                    `);
            }
            function checkstocktable(latitude, longitude, value) {
                //let fullValue = $('.vha-ssjful-check-str-popup-input').val();
                let fullValue = value;
                let postcode = (fullValue || "").replace(/\D/g, '');
                SiebelApp.S_App.SetProfileAttr("SKUCd", productCode);
                SiebelApp.S_App.SetProfileAttr("StorePostCd", postcode);
                //Marvin : Added for CM-6229
                SiebelApp.S_App.SetProfileAttr("Longitude", longitude);
                SiebelApp.S_App.SetProfileAttr("Latitude", latitude);
                var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                var psInp = SiebelApp.S_App.NewPropertySet();
                psInp.SetProperty("Service Name", "VHA Search Store VBC BS");
                psInp.SetProperty("Business Component Name", "VHA Search Store VBC");
                psInp.SetProperty("Method Name", "Query");
                var Output = ser.InvokeMethod("Run Process", psInp);
                if (Output.GetChildByType('ResultSet')) {
                    checkstoredata = Output.GetChildByType('ResultSet').childArray;
                    renderTable(1);
                }
            }
            function renderTable(page = 1) {
                VhaCheckStore_Cur_Page = page;
                const start = (page - 1) * VhaCheckStore_Per_Page;
                const end = start + VhaCheckStore_Per_Page;
                const pageData = checkstoredata.slice(start, end);
                const $modal = $('.vha-ssjful-check-str-popup-overlay');
                const $tbody = $modal.find('.vha-ssjful-check-str-popup-table tbody');
                $tbody.empty();
                pageData.forEach((obj, index) => {
                    let row = obj.propArray;
                    $tbody.append(`
                            <tr rownum = "` + index + `" >
                            <td>
                            <input type="radio" name="store-selector" value="` + index + `" aria-label="" />
                            </td>
                              <td>${row['Store Business Name']}</td>
                              <td>${row['Store Code']}</td>
                              <td>${row['Device Availability']}</td>
                              <td tabindex="0" class="vha-ssjful-check-str-popup-hours" title="${row['Trading Hours']}">${row['Trading Hours']}</td>
                              <td>${row['Store Address']}</td>
                            </tr>
                          `);
                });
                $modal.find('.vha-ssjful-check-str-popup-table').show();
                $modal.find('.vha-ssjful-check-str-popup-pagination-controls').show();
                $modal.find('.vha-ssjful-check-str-popup-confirm-btn').prop('disabled', true);
                const total = checkstoredata.length;
                const showingStart = start + 1;
                const showingEnd = Math.min(end, total);
                $modal.find('.vha-ssjful-check-str-popup-pagination-info').text(`${showingStart}-${showingEnd} of ${total} items`);
                $modal.find('.vha-ssjful-check-str-popup-prev').prop('disabled', page === 1);
                $modal.find('.vha-ssjful-check-str-popup-next').prop('disabled', end >= total);
                //Radio selection
                $(".vha-ssjful-check-str-popup-table tbody td input[type='radio']").off('change').on('change', function () {
                    $modal.find('.vha-ssjful-check-str-popup-confirm-btn').prop('disabled', false);
                });
            }
            function hideSortIcons() {
                var conApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VFDFA Line Item Form Apple Propt"];
                if (!conApplet)
                    return;
                var conPM = conApplet.GetPModel();
                var conPlId = conPM.Get("GetFullId");
                if (!conPlId)
                    return;
                $("#" + conPlId).find(".ui-jqgrid-htable th .s-ico").hide();
            }
            // 9297 Defect
            function VHA_setOrderTypeDisplay(orderType) {
                try {
                    var ot = (orderType || "").trim();
                    if (!/^Rate plan change$/i.test(ot))
                        return;
                    var liApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                    if (!liApplet)
                        return;
                    var liPM = liApplet.GetPModel();
                    var fullId = liPM && liPM.Get("GetFullId");
                    if (!fullId)
                        return;
                    var $root = $("#s_" + fullId + "_div");
                    if (!$root.length)
                        $root = $("#" + fullId);
                    var $inp = $root.find("input[aria-labelledby^='Order_Type_Label_']");
                    if ($inp.length) {
                        $inp.val("Rate plan change").trigger("change");
                    }
                } catch (e) {
                    // no-op
                }
            }
            // CM-9625 Issue-2: Hide Number porting section for Upgrade flows
            function VHA_hideNumberPortingForUpgrade() {
                var $root = $(".PropositionContainerEditApplet"); // Scoped to proposition edit container
                if (!$root.length)
                    return;
                // 1) Hide the whole "Number porting" block by header text
                $root.find("h4").filter(function () {
                    return $.trim($(this).text()) === "Number porting";
                }).each(function () {
                    // Hide the nearest container that represents the section
                    var $section = $(this).closest(".ColumnForm, .FormGridExist, .vha-sfj-maincontainer");
                    if ($section.length)
                        $section.hide();
                    else
                        $(this).parent().hide(); // fallback
                });
                // 2) Safety net: hide porting-related fields if they render outside the section wrapper
                var ariaToHide = [
                    "Number porting",
                    "Port In",
                    "Port In MSISDN",
                    "Port in service account",
                    "Date of Birth",
                    "New MSISDN",
                    "MSISDN"
                ];
                ariaToHide.forEach(function (aria) {
                    $root
                    .find("input[aria-label='" + aria + "'], select[aria-label='" + aria + "'], textarea[aria-label='" + aria + "']")
                    .closest(".FormItemVertical, .FormItemHorizontal")
                    .hide();
                });
                // 3) Unbind any porting radio change handler added by custom code to prevent re-showing
                try {
                    var $section = $("h4:contains('Number porting')").parent();
                    $section.find("input[type='radio']").off("change.vhaPortIn");
                } catch (e) {}
            }
            // =====================================================
            // CM-9625 – Issue 2
            // Hide SIM details for Upgrade flow ONLY
            // =====================================================
            function VHA_hideSimDetailsForUpgrade() {
                var $root = $(".PropositionContainerEditApplet");
                if (!$root.length)
                    return;
                // Find the SIM and Payment headers
                var $simH4 = $root.find("h4").filter(function () {
                    return $.trim($(this).text()) === "SIM details";
                }).first();
                if (!$simH4.length)
                    return;
                var $payH4 = $root.find("h4").filter(function () {
                    return $.trim($(this).text()).toLowerCase() === "payment";
                }).first();
                if ($payH4.length) {
                    $simH4
                    .add($simH4.nextUntil($payH4)) // everything between SIM details and Payment
                    .hide();
                } else {
                    // If Payment header isn't found (fallback), hide SIM heading + next block only (safe)
                    $simH4.hide();
                    // Hide the immediate section container nearest to SIM header, but DO NOT use ColumnForm/FormGridExist
                    // because those often wrap Payment too.
                    var $safeBlock = $simH4.next();
                    if ($safeBlock.length)
                        $safeBlock.hide();
                }
                // Optional safety net: hide SIM-related fields/actions only (should not touch payment)
                var simAriaLabels = ["SIM type"];
                simAriaLabels.forEach(function (aria) {
                    $root
                    .find("input[aria-label='" + aria + "'], select[aria-label='" + aria + "']")
                    .closest(".FormItemVertical, .FormItemHorizontal")
                    .hide();
                });
                // Hide SIM-related action buttons only
                $root.find(
                    "button[aria-label='eSIM Download'], " +
                    "button[aria-label='Allocate SIM']").hide();
            }
            // ===========================
            // === [ADDED] Port-in logic
            // ===========================
            var PORT_IN_ARIA_VALUE = "Yes - Postpay";
            var DOB_ARIA = "Date of Birth";
            var PORT_IN_ACCT_ARIA = "Port in service account";
            var PORT_IN_FIELD_ARIA = "Port In"; // NEW
            var VHA_SaveValidationBound = false;
            // Is "Port In" selected?
            function VHA_isPortInSelected() {
                try {
                    var $section = $("h4:contains('Number porting')").parent();
                    var $checked = $section.find("input[type='radio']:checked");
                    if ($checked.length === 0)
                        return false;
                    var aria = ($checked.attr("aria-label") || "").trim();
                    var visible = ($checked.closest("label").text() || "").trim();
                    return (aria === PORT_IN_ARIA_VALUE) || /Port In/i.test(visible);
                } catch (e) {
                    return false;
                }
            }
            // Get DOB + Port in account containers
            function VHA_getPortInContainers() {
                var $dob = $("input[aria-label='" + DOB_ARIA + "']").closest(".FormItemVertical, .FormItemHorizontal");
                var $acct = $("input[aria-label='" + PORT_IN_ACCT_ARIA + "']").closest(".FormItemVertical, .FormItemHorizontal");
                var $portIn = $("input[aria-label='" + PORT_IN_FIELD_ARIA + "']").closest(".FormItemVertical, .FormItemHorizontal");
                return $dob.add($acct).add($portIn);
            }
            // Add/remove required semantics & visuals
            function VHA_setRequired($inputs, required) {
                if (!$inputs || !$inputs.length)
                    return;
                $inputs.each(function () {
                    var $i = $(this);
                    // Visual cue used by Siebel for required fields
                    $i.toggleClass("siebui-input-req", !!required);
                    // ARIA for accessibility
                    $i.attr("aria-required", required ? "true" : "false");
                    // HTML required attribute (non-blocking in SPA, harmless)
                    if (required)
                        $i.attr("required", "required");
                    else
                        $i.removeAttr("required");
                });
            }
            // Apply required state based on Port In selection
            function VHA_applyRequiredState() {
                var $dobInput = $("input[aria-label='" + DOB_ARIA + "']");
                var $acctInput = $("input[aria-label='" + PORT_IN_ACCT_ARIA + "']");
                var portIn = VHA_isPortInSelected();
                VHA_setRequired($dobInput.add($acctInput), portIn);
            }
            // Show/hide + required// jeeten: CM-10069: Commented below to stablize hide show based on actual data
            function VHA_togglePortInFields() {
                // var $containers = VHA_getPortInContainers();
                // if (!$containers.length) return;
                // if (VHA_isPortInSelected()) {
                //     $containers.show();
                // } else {
                //     $containers.hide();
                // }
                // VHA_applyRequiredState();
            }
            // Bind radio changes (idempotent)
            function VHA_bindPortInChangeHandler() {
                var $section = $("h4:contains('Number porting')").parent();
                var $radios = $section.find("input[type='radio']");
                if (!$radios.length)
                    return;
                $radios.off("change.vhaPortIn").on("change.vhaPortIn", function () {
                    VHA_togglePortInFields();
                });
            }
            // Cancel Save/Write if required fields empty when Port In
            function VHA_preInvokeSave(methodName, inPropSet, outPropSet) {
                // Only enforce on Save/WriteRecord
                if (methodName !== "SaveRecord" && methodName !== "WriteRecord")
                    return;
                if (!VHA_isPortInSelected())
                    return;
                var dobVal = ($("input[aria-label='" + DOB_ARIA + "']").val() || "").trim();
                var acctVal = ($("input[aria-label='" + PORT_IN_ACCT_ARIA + "']").val() || "").trim();
                if (!dobVal || !acctVal) {
                    // Cancel the operation and notify user
                    if (inPropSet && typeof inPropSet.SetProperty === "function") {
                        inPropSet.SetProperty("CancelOperation", true);
                        inPropSet.SetProperty("ErrMsg", "Please fill Date of Birth and Port in service account for Port In.");
                    }
                    alert("Please fill Date of Birth and Port in service account to proceed with Port In.");
                }
            }
            // Attach PreInvokeMethod validation on relevant applets (idempotent)
            function VHA_attachSaveValidation() {
                if (VHA_SaveValidationBound)
                    return;
                var appMap = SiebelApp.S_App.GetActiveView().GetAppletMap() || {};
                var appletKeys = [
                    // Include both—your fields and actions reside here in your codebase
                    "VFDFA Line Item Form Apple Propt",
                    "VF Dfa Order Entry Line Item List Applet TBUI"
                ];
                appletKeys.forEach(function (key) {
                    var applet = appMap[key];
                    if (!applet)
                        return;
                    var pm = applet.GetPModel && applet.GetPModel();
                    if (!pm || !pm.AttachPMBinding)
                        return;
                    pm.AttachPMBinding("PreInvokeMethod", VHA_preInvokeSave, {
                        sequence: true,
                        scope: this
                    });
                });
                VHA_SaveValidationBound = true;
            }
            // === [ADDED] End of Port-in logic ===
            VHASSJPropositionViewPR.prototype.Init = function () {
                SiebelAppFacade.VHASSJPropositionViewPR.superclass.Init.apply(this, arguments);
            }
            VHASSJPropositionViewPR.prototype.ShowUI = function () {
                //var pm = this.GetPM();
                SiebelAppFacade.VHASSJPropositionViewPR.superclass.ShowUI.apply(this, arguments);
                setTimeout(function () {
                    var $eSimInput = $("input[aria-labelledby^='eSIM_Download_Label']");
                    if ($eSimInput.length && !$eSimInput.val()) {
                        $eSimInput.attr("placeholder", "Select");
                    }
                }, 0);
                var self = this;
                quoteNum = SiebelApp.S_App.GetProfileAttr("Order Number");
                sQuoteId = SiebelApp.S_App.GetProfileAttr("QuoteId");
                ReseverestorestockUI();
                updateRadioLabel();
                // [ADDED]: Visibility + required + save validation
                VHA_togglePortInFields();
                VHA_bindPortInChangeHandler();
                VHA_attachSaveValidation();
                displayReservationApplet();
                hideSortIcons();
                //Jeeten: add identifiers for each MSISDNs
                var LineFormApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                if (LineFormApplet) {
                    LineFormAppletPM = LineFormApplet.GetPModel();
                    LineFormAppletCtrl = LineFormAppletPM.Get("GetControls");
                    var $portInMsisdn = $('input[name=' + LineFormAppletCtrl['VF DFA MSISDN'].GetInputName() + ']').parent().parent();
                    var $Msisdn = $('input[name=' + LineFormAppletCtrl['VFMSISDNTBUI'].GetInputName() + ']').parent().parent();
                    $Msisdn.addClass("vhaMSISDN");
                    $portInMsisdn.addClass("vhaPIMSISDN");
                }
                $('.FormItemVertical').find("input[aria-label='SKU Code']").parent().parent().hide();
                /*Samala Defect CM-9184 */
                $("input[aria-label='Port In MSISDN']").closest(".FormItemVertical, .FormItemHorizontal").hide();
                /*Samala Defect CM-9184 */
                $('.tree-wrap .ui-icon.ui-icon-radio-off.tree-leaf.treeclick').parent('.tree-wrap').addClass('vha-ssj-hide-tree-radio'); /*sai*/
                if ($('.vha-sfj-Editbtns .vha-mark-ready-wrapper').length === 0) {
                    var $editButton = $('.vha-sfj-Editbtns button.siebui-icon-gotocart');
                    if ($editButton.length > 0) {
                        var markReadyHTML = '<div class="vha-mark-ready-wrapper" style="display: inline-block; margin-left: 15px; vertical-align: middle;">' +
                            '<input type="checkbox" id="vha-mark-ready-chk" class="Vha-ssj-mark-as-ready" name="vha-mark-ready" style="cursor: pointer;">' +
                            '<label for="vha-mark-ready-chk" class="Vha-ssj-mark-as-ready-label" style="cursor: pointer; margin: 0;">Mark as Ready</label>' +
                            '</div>';
                        $editButton.after(markReadyHTML);
                        $('#vha-mark-ready-chk').off('change.vhaMarkReady').on('change.vhaMarkReady', function () {
                            var $checkbox = $(this);
                            var isChecked = $checkbox.is(':checked');
                            var appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap()["VF Dfa Order Entry Line Item List Applet TBUI"];
                            const pm = appletMap.GetPModel();
                            const bc = appletMap.GetBusComp();
                            //bc.ActivateField("Status");
                            var appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap()["VF Dfa Order Entry Line Item List Applet TBUI"];
                            if (isChecked && appletMap) {
                                bc.SetFieldValue("ReadyStatus", "Ready");
                                bc.WriteRecord();
                                // optional UI sync
								appletMap.InvokeMethod("NewQuery");
								appletMap.InvokeMethod("ExecuteQuery");
                                //pm.ExecuteMethod("RefreshRecord");
                            }
                            if (!isChecked && appletMap) {
                                bc.SetFieldValue("ReadyStatus", "Not Ready");
                                bc.WriteRecord();
                                // optional UI sync
								appletMap.InvokeMethod("NewQuery");
								appletMap.InvokeMethod("ExecuteQuery");
                                //pm.ExecuteMethod("RefreshRecord");
                            }
                        });
                    }
                }
                // --- CM-9625 Issue-1: remove "Mark as Ready" in Upgrade flow
                //  try {
                //	  var liApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                //	  if (liApplet) {
                //    var liBC = liApplet.GetBusComp();
                //  var orderType = liBC.GetFieldValue("VHA SSJ Disp Order Type Calc");
                //if (/^Upgrade$/i.test((orderType || "").trim())) {
                //$('.vha-sfj-Editbtns .vha-mark-ready-wrapper').remove();
                //}
                //}
                //} catch(e) {}
                var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VF Dfa Order Entry Line Item List Applet TBUI"];
                if (applet) {
                    var pm = applet.GetPModel();
                    pm.AttachPMBinding("InvokeMethod", handleMethodInvoke, {
                        sequence: true,
                        scope: this
                    });
                }
                var isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg") === "TPG" || SiebelApp.S_App.GetProfileAttr("VHANewOrg") === "iiNet";
                if (isDFAFlow) { //vinay: added for DFA flow
                    const hideProducrDetails = $('.PropositionContainerEditApplet .vha-sfj-maincontainer');
                    hideProducrDetails.find('h4').filter(function () {
                        return $.trim($(this).text()) === 'Product details';
                    }).closest('.ColumnForm').addClass('VFLFDisplayNone');
                    $('.PropositionContainerEditApplet .vha-sfj-maincontainer h4')
                    .filter(function () {
                        return $.trim($(this).text()).toLowerCase() === 'payment';
                    }).addClass('VFLFDisplayNone');
                    $('span[id^="Payment_Term_Label"]').closest('.FormItemVertical').addClass('VFLFDisplayNone');
                    $('span[id^="VHARRP_Label"]').closest('.FormItemVertical').addClass('VFLFDisplayNone');
                    $('.PropositionContainerRCApplet').addClass('VFLFDisplayNone');
                    $('input[aria-labelledby^="eSIM_Download_Label"]').closest('.VHAProplblalign').addClass('dfareadonly');
                    // Harika added for defect 9213
                    /*
                    setTimeout(() => {
                    $("input[type='radio'][value='Physical']").prop("checked", true);
                    }, 500); */
                }
                const $modal = $('.vha-ssjful-check-str-popup-overlay');
                $(".siebui-applet-buttons").hide();
                /*$("#s_6_1_37_0_Ctrl").hide();
                $(".s_6_1_43_0").hide(); */
                var pm = SiebelApp.S_App.GetActiveView().GetAppletMap()["VF Parent List Dfa Applet"].GetPModel();
                $("#" + pm.Get("GetFullId")).hide();
                var pm = SiebelApp.S_App.GetActiveView().GetAppletMap()["VF Salesperson Edit Applet - TBUI"].GetPModel();
                $("#" + pm.Get("GetFullId")).hide();
                // Add code here that should happen after default processing
                var Accapp = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Accessories List Applet TBUI"].GetPModel();
                var ssjprop = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Store Reservations Applet TBUI"].GetPModel();
                $(".PropositionContainerEditApplet").show();
                $("#" + Accapp.Get("GetFullId")).hide();
                $("#" + ssjprop.Get("GetFullId")).hide();
                setTimeout(function () {
                    var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                    //Def 9625
                    if (!applet)
                        return;
                    var bc = applet.GetBusComp();
                    var orderType = bc.GetFieldValue("VHA SSJ Disp Order Type Calc");
                    if (/^Upgrade$/i.test((orderType || "").trim())) {
                        var validateId = bc.GetFieldValue("Validate ID");
                        if (validateId !== "Y") {
                            bc.SetFieldValue("Validate ID", "Y");
                            bc.SetFieldValue("Port In", "N");
                            bc.SetFieldValue("SIM Required", "N");
                            try {
                                bc.WriteRecord();
                            } catch (e) {
                                console.warn("Upgrade auto-validation skipped:", e);
                            }
                        }
                    }
                    if (applet) {
                        var bc = applet.GetBusComp();
                        var orderType = bc.GetFieldValue("VHA SSJ Disp Order Type Calc");
                        // 9625 Issue-2
                        if (/^Upgrade$/i.test((orderType || "").trim())) {
                            VHA_hideNumberPortingForUpgrade();
                            VHA_hideSimDetailsForUpgrade();
                        }
                        // 9297 Defect
                        setTimeout(function () {
                            VHA_setOrderTypeDisplay(orderType);
                        }, 0);
                        var Accapp = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Accessories List Applet TBUI"];
                        //VHA KT 21/04/26 Start: Added for CM-10605
                        var $btnAcc = $("button[aria-label='Accessories & wearables']");
                        var isAccBtnDisable = ($btnAcc.prop("disabled") || $btnAcc.hasClass("appletButtonDis"));
                        var $btnDevice = $("button[aria-label='Device & SIM']");
                        var isDeviceBtnDisable = ($btnAcc.prop("disabled") || $btnAcc.hasClass("appletButtonDis"));
                        if (!isAccBtnDisable)
                            $(".vha-sfj-Propbtns button[aria-label='Accessories & wearables']").click();
                        if (!isDeviceBtnDisable)
                            $(".vha-sfj-Propbtns button[aria-label='Device & SIM']").click();
                        //VHA KT 21/04/26 End: Added for CM-10605
                        if (orderType == "Rate plan change") {
                            $(".PropositionContainerEditApplet").hide();
                            if (Accapp) {
                                if (!isAccBtnDisable)
                                    $(".vha-sfj-Propbtns button[aria-label='Accessories & wearables']").click(); //SSINGHA: Added for CM-10363
                                var recCount = Accapp.GetPModel().Get("GetRecordSet").length;
                                if (recCount > 0) {
                                    $("#" + Accapp.GetPModel().Get("GetFullId")).show();
                                    $(".vha-sfj-Propbtns button[aria-label='Accessories & wearables']").show();
                                } else {
                                    $("#" + Accapp.GetPModel().Get("GetFullId")).hide();
                                    $(".vha-sfj-Propbtns  button[aria-label='Accessories & wearables']").hide();
                                }
                            } /*CM-9871*/
                            $(".vha-sfj-Propbtns button[aria-label='Device & SIM']").hide();
                            $(".vha-sfj-Propbtns").css("border-bottom", "none");
                        } else {
                            $(".PropositionContainerEditApplet").show();
                            if (Accapp)
                                $("#" + Accapp.GetPModel().Get("GetFullId")).hide();
                            $(".vha-sfj-Propbtns button[aria-label='Device & SIM']").show();
                        }
                    }
                }, 500);
                /* var ssjLineItems = SiebelApp.S_App.GetActiveView().GetAppletMap()['VF Dfa Order Entry Line Item List Applet TBUI'].GetFullId(); //Sai
                var ssjRpcProfileAttr = theApplication().GetProfileAttr("sCOrderSubType"); //Sai
                var ssjLineItemstable = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'].GetFullId(); //Sai
                if (ssjRpcProfileAttr === "Change Proposition" || ssjRpcProfileAttr === "Modify") {
                // $("#" + ssjLineItems).hide();
                $('#CreditCheck').hide();
                $('#' + ssjLineItemstable).find('div.PropositionContainerEditApplet').hide();
                var $propBtns = $('#' + ssjLineItemstable).find('div.vha-sfj-Propbtns');
                $propBtns.show();
                $propBtns.find('button').not('.siebui-icon-accessories').hide();
                } else {
                $("#" + ssjLineItems).show();
                $('#CreditCheck').hide();
                $('#' + ssjLineItemstable).find('div.PropositionContainerEditApplet').show();
                $('#' + ssjLineItemstable).find('div.vha-sfj-Propbtns').show();
                } */
                $(".vha-sfj-Propbtns button").off("click").on("click", function () {
                    var buttonaria = $(this).find("span").text();
                    var Accapp = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Accessories List Applet TBUI"].GetPModel();
                    var ssjprop = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Store Reservations Applet TBUI"].GetPModel();
                    if (buttonaria == "Device & SIM") {
                        $(".PropositionContainerEditApplet").show();
                        $("#" + Accapp.Get("GetFullId")).hide();
                        $("#" + ssjprop.Get("GetFullId")).hide();
                    } else {
                        $(".PropositionContainerEditApplet").hide();
                        $("#" + Accapp.Get("GetFullId")).show();
                        $("#" + ssjprop.Get("GetFullId")).hide();
                        if (!self._accessoriesInvoked) {
                            var parentPM = SiebelApp.S_App.GetActiveView().GetAppletMap()["VFDFA Line Item Form Apple Propt"].GetPModel();
                            parentPM.ExecuteMethod("InvokeMethod", "Accessories");
                            self._accessoriesInvoked = true;
                        }
                        SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Accessories List Applet TBUI"].InvokeMethod("RefreshBusComp");
                        /* 09032026:Ravikumar: commenting out below line as it is handled using above RefreshBusComp method.
                        var accApplet = SiebelApp.S_App.GetActiveView().GetApplet("VHA SSJ Accessories List Applet TBUI");
                        if (accApplet) {
                        accApplet.Refresh();
                        }*/
                    }
                });
                $(".vha-rncbtns button").off("click").on("click", function () {
                    var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VFDFA Line Item Form Apple Propt"];
                    if (applet) {
                        var busComp = applet.GetBusComp();
                        deviceName = busComp.GetFieldValue("VF Device TBUI");
                        productCode = busComp.GetFieldValue("VF Handset Code TBUI");
                    }
                    $('.vha-ssjful-check-str-popup-input').val('');
                    $modal.find('.vha-ssjful-check-str-popup-confirm-btn').prop('disabled', true);
                    //deviceDetails = "IPhone 16 Pro";
                    $modal.find('.vha-ssjful-check-str-popup-device').text(deviceName); //Marvin: Updated for CM-5582
                    $modal.show();
                    var Options = {};
                    var inp = SiebelApp.S_App.NewPropertySet();
                    inp.SetProperty("QuoteNum", quoteNum);
                    var out = SiebelApp.S_App.NewPropertySet();
                    out = VHAAppUtilities.CallBS("VF SSJ Order review Utilities BS", "GetDeviceCount", inp, Options);
                    var deviceCount = 0;
                    deviceCount = Number(out.GetProperty("deviceCount"));
                    if (deviceCount > 1) {
                        $modal.find('.success').hide();
                        $modal.find('.error').show();
                    } else {
                        $modal.find('.success').show();
                        $modal.find('.error').hide();
                    }
                    $modal.find('.vha-ssjful-check-str-popup-pagination-controls').hide();
                });
                //Close button
                $modal.find('.vha-ssjful-check-str-popup-close-icon, .vha-ssjful-check-str-popup-close-btn').on('click', function () {
                    $modal.hide();
                    $modal.find('.vha-ssjful-check-str-popup-table').hide();
                    $modal.find('.vha-ssjful-check-str-popup-pagination-controls').hide();
                    $modal.find('.vha-ssjful-check-str-popup-pagination-info').text('');
                });
                //Confirm Reservation button
                $modal.find('.vha-ssjful-check-str-popup-confirm-btn').on('click', function () {
                    $modal.hide();
                    $modal.find('.vha-ssjful-check-str-popup-table').hide();
                    $modal.find('.vha-ssjful-check-str-popup-pagination-controls').hide();
                    $modal.find('.vha-ssjful-check-str-popup-pagination-info').text('');
                    var $selectedRadio = $modal.find('input[name="store-selector"]:checked');
                    var selectedValue = $selectedRadio.val();
                    var $row = $selectedRadio.closest('tr');
                    var itemId = SiebelApp.S_App.GetActiveView().GetActiveApplet().GetBusComp().GetFieldValue("Id");
                    selectedRecord = SiebelApp.S_App.NewPropertySet();
                    selectedRecord.SetProperty("Id", itemId);
                    selectedRecord.SetProperty("ProductName", deviceName);
                    selectedRecord.SetProperty("storeName", $row.find('td').eq(1).text().trim());
                    selectedRecord.SetProperty("storeCode", $row.find('td').eq(2).text().trim());
                    selectedRecord.SetProperty("deviceAvailability", $row.find('td').eq(3).text().trim());
                    selectedRecord.SetProperty("tradingHours", $row.find('td').eq(4).text().trim());
                    selectedRecord.SetProperty("storeAddress", $row.find('td').eq(5).text().trim());
                    var sKUCode = "";
                    var sApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VFDFA Line Item Form Apple Propt"];
                    if (sApplet)
                        sKUCode = sApplet.GetBusComp().GetFieldValue("VF Handset Code TBUI");
                    selectedRecord.SetProperty("SKUCode", sKUCode);
                    //Create record in applet
                    var Options = {};
                    var out = SiebelApp.S_App.NewPropertySet();
                    out = VHAAppUtilities.CallBS("VHA SSJ Generic Utility Service", "createReservationRecord", selectedRecord, Options);
                    displayReservationApplet();
                });
                //ReturnToCart
                $modal.find('.vha-ssjful-check-str-popup-return-btn').on('click', function () {
                    $modal.hide();
                    $modal.find('.vha-ssjful-check-str-popup-table').hide();
                    $modal.find('.vha-ssjful-check-str-popup-pagination-controls').hide();
                    $modal.find('.vha-ssjful-check-str-popup-pagination-info').text('');
                    var Options = {};
                    SiebelApp.S_App.SetProfileAttr("SSJParentOrderId", sQuoteId);
                    SiebelApp.S_App.SetProfileAttr("FromProdConfig", sQuoteId);
                    SiebelApp.S_App.SetProfileAttr("BackToCartSSJ", "Y");
                    var inputPropSet = SiebelApp.S_App.NewPropertySet();
                    var outputPropSet = SiebelApp.S_App.NewPropertySet();
                    inputPropSet.SetProperty("View", "VHA Sales Calculator SSJ View");
                    inputPropSet.SetProperty("Business Component", "Order Entry - Orders");
                    inputPropSet.SetProperty("Row Id", sQuoteId);
                    outputPropSet = VHAAppUtilities.CallBS("Shopping Service", "GotoView", inputPropSet, Options);
                });
                //Previous button
                $modal.find('.vha-scj-check-str-popup-prev').on('click', function () {
                    if (VhaCheckStore_Cur_Page > 1)
                        renderTable(VhaCheckStore_Cur_Page - 1);
                });
                //Next button
                $modal.find('.vha-scj-check-str-popup-next').on('click', function () {
                    const totalPages = Math.ceil(checkstoredata.length / VhaCheckStore_Per_Page);
                    if (VhaCheckStore_Cur_Page < totalPages)
                        renderTable(VhaCheckStore_Cur_Page + 1);
                });
                //hours keypress
                $modal.on('keydown', '.vha-scj-check-str-popup-hours', function (e) {
                    if (e.key === 'ArrowRight') {
                        this.scrollLeft += 20;
                    } else if (e.key === 'ArrowLeft') {
                        this.scrollLeft -= 20;
                    }
                });
                $(".sameAsCoverage").on("change", function () {
                    if (!$(this).is(":checked"))
                        return $('.vha-ssjful-check-str-popup-input').val("");
                    var out = SiebelApp.S_App.NewPropertySet();
                    var addrr,
                    lat,
                    lon;
                    out = getCoverageAddress();
                    if (out != undefined && out != "") {
                        addrr = out.GetProperty("Addr").split(',').at(-1).trim();
                        lat = Number(out.GetProperty("Lat"));
                        lon = Number(out.GetProperty("Long"));
                    }
                    if (addrr === '')
                        return;
                    $('.vha-ssjful-check-str-popup-input').val(addrr);
                    checkstocktable(lat, lon, addrr);
                });
                // check store stock input
                $(".vha-ssjful-check-str-popup-input").on("input", function () {
                    if ($(this).data("ui-autocomplete"))
                        return;
                    $(this).autocomplete({
                        minLength: 4,
                        source: function (request, response) {
                            try {
                                var inputVal = request.term;
                                var isNumeric = /^\d+$/.test(inputVal);
                                var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                                var Inputs = SiebelApp.S_App.NewPropertySet();
                                Inputs.SetProperty("ProcessName", "VHA SSJ PostCode Check Process");
                                if (isNumeric) {
                                    Inputs.SetProperty("PostCode", inputVal);
                                    Inputs.SetProperty("SubUrb", "");
                                } else {
                                    Inputs.SetProperty("PostCode", "");
                                    Inputs.SetProperty("SubUrb", inputVal);
                                }
                                var Output = ser.InvokeMethod("RunProcess", Inputs);
                                let data = Output.GetChildByType("ResultSet").childArray[0].childArray[0].childArray;
                                let suggestions = [];
                                data.forEach(function (item) {
                                    let props = item.propArray;
                                    let suburb = props["Suburb"] || "";
                                    let postcode = props["Postcode"] || "";
                                    let state = props["State"] || "";
                                    let longitude = props["Longitude"] || ""; //Marvin: Added for CM-6229
                                    let latitude = props["Latitude"] || ""; //Marvin: Added for CM-6229
                                    let label = `${suburb}, ${postcode}, ${state}`;
                                    suggestions.push({
                                        label: label,
                                        value: label,
                                        latitude: latitude,
                                        longitude: longitude,
                                        type: "Checkstorestock",
                                    });
                                });
                                response(suggestions);
                            } catch (e) {
                                //alert unbale to search
                            }
                        },
                        select: function (event, ui) {
                            console.log("Selected:", ui.item);
                            checkstocktable(ui.item.latitude, ui.item.longitude, ui.item.value);
                        },
                    });
                });
                //09-03-26:RajuD: added for CM-8023
                $(function () {
                    $('.vha-sfj-Propbtns').on('click', '.siebui-icon-devicesim, .siebui-icon-accessories', function (e) {
                        e.preventDefault();
                        $(this)
                        .addClass('vha-prop-tab')
                        .attr('aria-pressed', 'true')
                        .siblings('.siebui-icon-devicesim, .siebui-icon-accessories')
                        .removeClass('vha-prop-tab')
                        .attr('aria-pressed', 'false');
                    });
                });
                $(function () {
                    // initial active
                    $('.vha-sfj-Propbtns').each(function () {
                        $(this).find('.siebui-icon-devicesim').first()
                        .addClass('vha-prop-tab').attr('aria-pressed', 'true')
                        .siblings('.siebui-icon-devicesim, .siebui-icon-accessories')
                        .removeClass('vha-prop-tab').attr('aria-pressed', 'false');
                    });
                });
                //Rajud-end
                $('button[title="Accessories & wearables"]').click(function () {
                    SiebelApp.S_App.SetProfileAttr("skucodessj", "");
					if (SiebelApp.S_App.GetActiveView().GetApplet("VHA SSJ Accessories List Applet TBUI") != null) { 
						//$('.ui-jqgrid-hbox').find('input:checkbox').hide(); //Vivek-04/03/26 
						$('.siebui-btn-grp-applet, .ui-icon-seek-first, .ui-icon-seek-end').hide();
						let sAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Accessories List Applet TBUI'];
						let sAplId = sAppl.GetFullId();
						let sEnt = " items";
						
						setTimeout(function () {
							let sFlg = "Y";
							if(sCnt == 0)
							{			
								VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
									sCnt = 1;
							}
						}, 1000);
					}
                });
            }
            VHASSJPropositionViewPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.VHASSJPropositionViewPR.superclass.BindData.apply(this, arguments);
                $('.FormItemVertical').find("input[aria-label='SKU Code']").parent().parent().hide();
                // [ADDED]: Re-apply visibility/required after data refresh
                VHA_togglePortInFields();
                // 9297 Defect
                try {
                    var liApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                    if (liApplet) {
                        var bc = liApplet.GetBusComp();
                        var orderType = bc.GetFieldValue("VHA SSJ Disp Order Type Calc");
                        setTimeout(function () {
                            if (/^Rate plan change$/i.test((orderType || "").trim())) {
                                $("input[aria-labelledby^='Order_Type_Label_']").val("Rate plan change").trigger("change");
                            }
                        }, 0);
                    }
                } catch (e) {}
                setTimeout(function () {
                    var $eSimInput = $("input[aria-labelledby^='eSIM_Download_Label']");
                    if ($eSimInput.length && !$eSimInput.val()) {
                        $eSimInput.attr("placeholder", "Select");
                    }
                }, 0);
            }
            VHASSJPropositionViewPR.prototype.BindEvents = function () {
                SiebelAppFacade.VHASSJPropositionViewPR.superclass.BindEvents.apply(this, arguments);
                //09-03-26:RajuD: added for CM-8023
                $(function () {
                    $('.vha-sfj-Propbtns').on('click', '.siebui-icon-devicesim, .siebui-icon-accessories', function (e) {
                        e.preventDefault();
                        $(this)
                        .addClass('vha-prop-tab')
                        .attr('aria-pressed', 'true')
                        .siblings('.siebui-icon-devicesim, .siebui-icon-accessories')
                        .removeClass('vha-prop-tab')
                        .attr('aria-pressed', 'false');
                    });
                });
                //Rajud-end
                //Samala CM-9217//
                /*$("input[aria-label='MSISDN']").on("focus", function() {
                this.blur()
                });*/
                //Samala CM-9217//
            }
            VHASSJPropositionViewPR.prototype.EndLife = function () {
                SiebelAppFacade.VHASSJPropositionViewPR.superclass.EndLife.apply(this, arguments);
                // No-op: existing lifecycle remains unchanged
            }
            return VHASSJPropositionViewPR;
        }
            ());
        return "SiebelAppFacade.VHASSJPropositionViewPR";
    })
}