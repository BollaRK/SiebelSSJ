if (typeof(SiebelAppFacade.VHASSJBillingAccountPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHASSJBillingAccountPR");
    define("siebel/custom/VHASSJBillingAccountPR", ["siebel/jqgridrenderer","siebel/custom/VHAAppUtilities"], function () {
        SiebelAppFacade.VHASSJBillingAccountPR = (function () {
            function VHASSJBillingAccountPR(pm) {
                SiebelAppFacade.VHASSJBillingAccountPR.superclass.constructor.apply(this, arguments);
            }
            SiebelJS.Extend(VHASSJBillingAccountPR, SiebelAppFacade.JQGridRenderer);
            var pm,
            fullId,
            controls,
            qryBAcntrl,
            vVHANewOrg,
            ba_openOrd_html,
            selectedBillaccountId,
            defBillaccountId,recordSet,assetId,activeRecord,rowIndex,rowNum, grid;
            VHASSJBillingAccountPR.prototype.Init = function () {
                SiebelAppFacade.VHASSJBillingAccountPR.superclass.Init.apply(this, arguments);
                SiebelApp.S_App.SetProfileAttr("msisdn", ""); // added by vinay kumar
                SiebelApp.S_App.SetProfileAttr("JourneyType", "");
                pm = this.GetPM();
                fullId = pm.Get("GetFullId");
                controls = pm.Get("GetControls");
                listCols = pm.Get("GetListOfColumns");
                pm.AddMethod("InvokeMethod", PostInvokeMethod, {
                    sequence: false,
                    scope: pm,
                });
            }
            //Added by Soumalya for open order check.Updated by Vivek 
            function ssjOpenOrderCheck(entityId, entity) {
                var bsCheck = SiebelApp.S_App.GetService("VF BS Process Manager");
                var psInputs = SiebelApp.S_App.NewPropertySet();
                var psOutputs = SiebelApp.S_App.NewPropertySet();
                psInputs.SetProperty("Service Name", "Workflow Process Manager");
                psInputs.SetProperty("Method Name", "RunProcess");
                psInputs.SetProperty("ProcessName", "VHA SSJ Open Order Check WF");
                if (entity == "BA") {
                    psInputs.SetProperty("BillingAccntId", entityId);
                } else {
                    psInputs.SetProperty("AssetId", entityId);
                }
                var ai = {};
                ai.async = true;
                ai.selfbusy = true;
                ai.scope = this;
                ai.mask = true;
                ai.opdecode = true;
                ai.errcb = function () {
                    console.log("function ssjOpenOrderCheck error");
                };
                ai.cb = function () {
                    psOutputs = arguments[2].childArray[0];
                    var sDiv = $('.vha-billing-change-tabs-cont');
                    var sTxt;
                    // Jeeten: 5-Feb: Check if open order exists on billing account or asset
                    if (psOutputs.propArray["OpenOrderExist"] == "Y") {
                        if (psOutputs.propArray["Error Message"] == "Quote Created: Order Submitted") {
                            //error code: 1 means billing account level check response
                            if (psOutputs.propArray["Error Code"] == "1") {
                                sTxt = "There is an order in progress on this account. Actions may be limited.";
                                VHAAppUtilities.WarningBanner(sDiv, sTxt, entity);  
                                sessionStorage.setItem("sMsg", sTxt);
                            } else {
                                sTxt = "This service cannot be edited as it has an order in progress.";
                                VHAAppUtilities.WarningBanner(sDiv, sTxt, entity);
                                // Disable Upgrade and Rate Plan Change buttons
                                $('[name="'+controls["VHA Upgrade"].GetInputName()+'"').attr("disabled", true);
                                $('[name="'+controls["VHA Rate Plan Change"].GetInputName()+'"').attr("disabled", true);
                            }
                        } else if (psOutputs.propArray["Error Message"] == "Quote Created: Fullfillment In Progress") {
                            //error code: 1 means billing account level check response
                             if (psOutputs.propArray["Error Code"] == "1") {
                                sTxt = "There is a pending order on this account. Actions may be limited.";
                                VHAAppUtilities.WarningBanner(sDiv, sTxt, entity);  
                                sessionStorage.setItem("sMsg", sTxt);
                            } else {
                                sTxt = "This service cannot be edited as it has a pending order submission.";
                                VHAAppUtilities.WarningBanner(sDiv, sTxt, entity);
                                 // Disable Upgrade and Rate Plan Change buttons
                                $('[name="'+controls["VHA Upgrade"].GetInputName()+'"').attr("disabled", true);
                                $('[name="'+controls["VHA Rate Plan Change"].GetInputName()+'"').attr("disabled", true);
                            }
                        }
                    } else {
                        // Enable Upgrade and Rate Plan Change buttons
                        $('[name="'+controls["VHA Upgrade"].GetInputName()+'"').attr("disabled", false);
                        $('[name="'+controls["VHA Rate Plan Change"].GetInputName()+'"').attr("disabled", false);
                    }
                };
                bsCheck.InvokeMethod("Run Process", psInputs, ai);
            }           
            //Added by Soumalya for open order check - Asset Selection
            function HandleSelectionChange() {
                rowIndex = pm.Get("GetSelection");
                //rowNum = pm.Get("GetBusComp").GetCurRowNum();
                if (rowIndex !== -1) {
                    recordSet = pm.Get("GetRecordSet");
                    assetId = recordSet[rowIndex]["Id"];
                    //assetId = activeRecord["Id"];
                    var sActive = pm.Get("IsActive");
                    if (sActive === true) { //Vivek_12/02/26
                        rowIndex = rowIndex + 1;
                        grid.find('.VHArow_radio').eq(rowIndex).prop('checked', true);
                        ssjOpenOrderCheck(assetId, "Asset")
                    }
                }
            }
            function PostInvokeMethod(methodName, psIn, lp, returnStructure) {
                console.log(methodName);
                if (methodName == "PositionOnRow000" || methodName == "GotoNextSet" || methodName == "GotoNext" || methodName == "GotoPrevious" || methodName == "GotoPreviousSet") {
                    // setTimeout(function () {//Vivek_12/02/26
                        HandleSelectionChange();
                    // }, 1000);
                }
                //Jeeten: 17-apr-26: CM-10541 :Fixing refresh issue in upgrade eligibility
                if (methodName == "SSJEligibilityCheck") {
                    checkUpgradeEligibilityBanner();
                }
            }

            function checkUpgradeEligibilityBanner() {
                //if (!e.target.closest('button[data-display="Check upgrade eligibility"]')) return;
                // const values = [...document.querySelectorAll('#s_2_l td[aria-roledescription="Upgrade eligibility"]')]
                //     .map(td => td.textContent.trim())
                //     .filter(v => v !== ""); //remove empty values
                
                setTimeout(() => {
                    let sRecords = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetPModel().Get("GetRawRecordSet");
                    if (sRecords.length > 0){
                        var data = sRecords;
                        var flag = "N";
                        
                        $.each(data, function (index, obj) {
                            if (obj["Upgrade Eligibility Flag Display Calc"] === "No") {
                                flag = "Y";
                                return false; // break loop
                            }
                        });
    
                        if (flag === "Y"){
                            $('.upgrade-eligibility-banner').remove();
                            const msg = `1 or more services are not eligible to be upgraded.`;
                            const bannerHtml = `
                                <div class="upgrade-eligibility-banner">
                                    <div class="upgrade-eligibility-banner__body">
                                    <span class="upgrade-eligibility-banner__icon">
                                        <img src="images/custom/menu-icons/warningIcon.svg"
                                            alt="warning" data-test-id="warning">
                                    </span>
                                    <div class="upgrade-eligibility-banner__msg" data-test-id="warningMsg">
                                        ${msg}
                                        <div class="upgrade-eligibility-banner__content"></div>
                                    </div>
                                    </div>
                                    <div class="upgrade-eligibility-banner__close" role="button" aria-label="Close">
                                    <img src="images/custom/menu-icons/Cross_20x20.svg" alt="close">
                                    </div>
                                </div>
                                `;
                            // insert AFTER your target div
                            $('.vha-billing-change-tabs-cont').after(bannerHtml);
                        }
                    }
                }, 1500);
            }
            VHASSJBillingAccountPR.prototype.ShowUI = function () {
                SiebelAppFacade.VHASSJBillingAccountPR.superclass.ShowUI.apply(this, arguments);
                $("button[name='" + controls["Query BA"].GetInputName() + "']").addClass("SSJQryBaAstBtn VFDisplayNone");
                //Added for open order check
                $('#s_' + SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetFullId() + '_div').addClass('vha-billing-change');
                $('.vha-billing-change .tree-wrap').addClass('VFDisplayNone');
				$('.s-ico').hide();
                $('.vha-billing-change .siebui-applet-header').after('<div class="vha-scj-tabs-cont-main vha-billing-change-tabs-cont"></div>');
                vVHANewOrg = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
				$('.ui-icon-radio-off').hide();
                $('.jqgfirstrow').hide(); //Vivek-13/02/26
                $('.ui-jqgrid-hbox').find('input:checkbox').hide(); //Vivek-13/02/26
                setTimeout(function () {
                                       
                    let totalRecordNum = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetBusComp().GetNumRows();
                    //let totalRecordNum =  SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetBusComp().GetNumRows();
                    let siebCounter = $('div[aria-label="Billing account in Customer Account"]').find('.siebui-row-counter').text();
                    let delimOne = " - ";
                    let delimTwo = " of ";
                    let indDelimOne = siebCounter.indexOf(delimOne);
                    let indDelimTwo = siebCounter.indexOf(delimTwo);
                    let recCount = siebCounter.substring(0, indDelimOne);
                    let recTotal = siebCounter.substring(indDelimOne + delimOne.length);
                    let indThree = recTotal.indexOf(delimTwo);
                    let recTotal2 = recTotal.substring(0, indThree);
                    let recCounter = `<td><span id="rec-sel-cnt">` + recCount + `</span><span> - </span><span id="rec-cnt-table">` + recTotal2 + `</span><span> of </span><span>` + totalRecordNum + `</span><span> active assets</span></td>`; //Updated by Sowmya - 10567
                    $('div[aria-label="Billing account in Customer Account"] .ui-pg-table table tr').prepend(recCounter);
                }, 1000);
 
                if (vVHANewOrg == "TPG" || vVHANewOrg == "iiNet") {
                    $("#s_2_1_5_0_Ctrl").prop("disabled", true); // added for DFA defect - 6206 to disable upgrade button
                }
 
                var custAccId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("Account").GetFieldValue("Row Id");
                var billAcc = SiebelApp.S_App.GetService("VF BS Process Manager");
                var billInput = SiebelApp.S_App.NewPropertySet();
                var billout = SiebelApp.S_App.NewPropertySet();
                billInput.SetProperty("Service Name", "VHA Get Billing Accounts BS");
                billInput.SetProperty("AccountId", custAccId);
                billInput.SetProperty("Method Name", "SSJGetBillingAccountsDet");
                billout = billAcc.InvokeMethod("Run Process", billInput);
                var billingAccOut = billout.childArray[0].childArray[0].childArray;
                //console.log(billingAccOut);
                if (billingAccOut != undefined) {
                    let billingAccountDiv = $('div[aria-label="Billing account in Customer Account"] form');
                    let label = $('<label class="ssjLabel" for="billAccSelect">').text('Select billing account').css({
                        'margin-right': '10px'
                    });
                    let billDropdown = $('<select id="billAccSelect" class="ssjDropdownedit">');
                    $('button[data-display="Query BA"]').hide();
                    $('.siebui-popup-togglebar').hide();
                    if (billingAccOut.length > 0) {
                        billingAccOut.forEach(function (account, index) {
                            let accountId = account.propArray.BillAccId;
                            let billAccNums = account.propArray.BillAccNum;
                            let billAccStatus = account.propArray.Status;
                            //$("img").attr({width: "150", height: "100"});
                            billDropdown.append($('<option>').val(billAccNums).text(billAccNums).attr({
                                    'bill-status': billAccStatus,
                                    'bill-accId': accountId
                                }));//Added for open order check
                        });
                        let defaultBillling = $(".selected-billing-info").val();
                        var billingAccNo = billingAccOut[0].propArray.BillAccNum;
                        var status = billingAccOut[0].propArray.Status;
                        defBillaccountId = billingAccOut[0].propArray.BillAccId;//Added for open order check
                        var statusClass = (status == "Open" || status == "Active") ? "CSGreen" : "CSRed";
                        $('div[aria-label="Billing account in Customer Account"] .siebui-applet-title').after('<div class="selected-billing-info" id ="selected-billing-Id">${billingAccNo}</div>');
                        $('#selected-billing-Id').after(`<div class="selected-billing-status-static" style="background-color:#F0F2F5; border-radius: 4px;"><span class="vha-sc-coverageStatus ${statusClass}"></span><span>${status}</span></div>`);
                    }
                    billingAccountDiv.prepend(label, billDropdown);
                    $('.selected-billing-info').html($("#billAccSelect").val());
                    $('.selected-billing-status').html($("#billAccSelect").find('option:selected').attr('bill-status'));
                    billDropdown.on('change', function () {
                        let selectedValue = $(this).val();
                        let selectedStatus = $(this).find('option:selected').attr('bill-status');
                        selectedBillaccountId = $(this).find('option:selected').attr('bill-accId');//Added by Soumalya for open order check
                        let appletTitleDiv = $('div[aria-label="Billing account in Customer Account"] .siebui-applet-title');
                        appletTitleDiv.nextAll('.selected-billing-info, .selected-billing-status, .selected-billing-status-static').remove();
                        $('.vha-sc-coverageStatus').remove();
                        appletTitleDiv.after(`<div class="selected-billing-info"> ${selectedValue} </div>`);
                        const statusClass = (selectedStatus == "Open" || selectedStatus == "Active") ? "CSGreen" : "CSRed";
                        // sowmya radius
                        $('.selected-billing-info').after(`<div class="selected-billing-status"><div class="selected-billing-status" style="background-color:#F0F2F5; border-radius: 5px;"><span class="vha-sc-coverageStatus ${statusClass}"></span><span> ${selectedStatus} </span></div></div>`);
                        SiebelApp.S_App.SetProfileAttr("SSJBillAccNum", selectedValue);
                        $('button[data-display="Query BA"]').click();
                        $('.siebui-popup-togglebar').hide();
                        //Added by Soumalya call open order check for BA on change.
                        ssjOpenOrderCheck(selectedBillaccountId, "BA");
                    });
                    setTimeout(function () {
                        var bsRespCheck1 = SiebelApp.S_App.GetService("VF BS Process Manager");
                        var psInputs1 = SiebelApp.S_App.NewPropertySet();
                        var psOutputs1 = SiebelApp.S_App.NewPropertySet();
                        psInputs1.SetProperty("Service Name", "SIS OM PMT Service");
                        psInputs1.SetProperty("Method Name", "Set Profile Attribute");
                        psInputs1.SetProperty("Profile Attribute Name", "SSJBillAccNum");
                        psInputs1.SetProperty("Profile Attribute Value", billingAccNo);
                        psOutputs1 = bsRespCheck1.InvokeMethod("Run Process", psInputs1);
                        $("button[name='" + controls["Query BA"].GetInputName() + "']").click();
                        //Added by Soumalya call open order check for BA on change.
                        ssjOpenOrderCheck(defBillaccountId, "BA");
                    }, 500);
                    $('#s_' + SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetFullId() + '_div').addClass('vha-billing-change');
                }
            }
            VHASSJBillingAccountPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.VHASSJBillingAccountPR.superclass.BindData.apply(this, arguments);
                $("button[name='" + controls["Query BA"].GetInputName() + "']").addClass("SSJQryBaAstBtn VFDisplayNone");
                $('.vha-billing-change .tree-wrap').addClass('VFDisplayNone');
                HandleSelectionChange();
                //Vivek_12/02/26
                var self = this;
                grid = this.GetGrid();
                grid.find('tbody tr').each(function (rowIndex) {
                    var $row = $(this);
                    // Clear first cell, add radio
                    $row.find('td:first').html(`<input type="radio" name="rowRadio" value="${rowIndex}" class="VHArow_radio">`);
                });
                grid.find('.VHArow_radio').on('change', function () {
                    // Uncheck all others
                    grid.find('.VHArow_radio').not(this).prop('checked', false);
                });
                // Restore PM selection on load
                var currentSel = this.GetPM().Get("GetSelection");
                if (currentSel !== null) {
                    currentSel = currentSel + 1;
                    grid.find('.VHArow_radio').eq(currentSel).prop('checked', true);
                }
            }
            VHASSJBillingAccountPR.prototype.BindEvents = function () {
                SiebelAppFacade.VHASSJBillingAccountPR.superclass.BindEvents.apply(this, arguments);
                $('button[title="Billing account List Applet:Upgrade"]').on('click', function () {
                    SiebelApp.S_App.SetProfileAttr("JourneyType", "Upgrade");
                    //vinay: commented below code for defect CM-10340
                    /*let msisdn = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetBusComp().GetFieldValue("Asset Num");
                    SiebelApp.S_App.SetProfileAttr("msisdn", msisdn);*/ 
                });
                $('button[title="Billing account List Applet:Rate Plan Change"]').on('click', function () {
                    SiebelApp.S_App.SetProfileAttr("JourneyType", "RPC");
                    //vinay: commented below code for defect CM-10340
                    /*let msisdn = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetBusComp().GetFieldValue("Asset Num");
                    SiebelApp.S_App.SetProfileAttr("msisdn", msisdn);*/
                });
 
                $('div[aria-label="Billing account in Customer Account"] tbody')[0].addEventListener('click', function () {
                    setTimeout(function () {
                        let rowNum = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetBusComp().GetCurRowNum();
                        let siebCounter = $('div[aria-label="Billing account in Customer Account"]').find('.siebui-row-counter').text();
                        let delimOne = " - ";
                        let delimTwo = " of ";
                        let indDelimOne = siebCounter.indexOf(delimOne);
                        let recTotal = siebCounter.substring(indDelimOne + delimOne.length);
                        let indThree = recTotal.indexOf(delimTwo);
                        let recTotal2 = recTotal.substring(0, indThree);
                        document.getElementById('rec-cnt-table').innerText = recTotal2;
                        document.getElementById('rec-sel-cnt').innerText = rowNum;
                    }, 500);
                });
                
                document.addEventListener("click", e => { //dhana_Upgrade-Eligibility
                    if (!e.target.closest('button[data-display="Check upgrade eligibility"]')) return;
                    const values = [...document.querySelectorAll('#s_2_l td[aria-roledescription="Upgrade eligibility"]')]
                        .map(td => td.textContent.trim())
                        .filter(v => v !== ""); //remove empty values
                    const noCount = values.filter(v => v.toLowerCase() === "no").length;

                    if (noCount > 0) {
                        // remove banner
                        $('.upgrade-eligibility-banner').remove();
                        const msg = `1 or more services are not eligible to be upgraded.`;
                        const bannerHtml = `
                            <div class="upgrade-eligibility-banner">
                                <div class="upgrade-eligibility-banner__body">
                                <span class="upgrade-eligibility-banner__icon">
                                    <img src="images/custom/menu-icons/warningIcon.svg"
                                        alt="warning" data-test-id="warning">
                                </span>
                                <div class="upgrade-eligibility-banner__msg" data-test-id="warningMsg">
                                    ${msg}
                                    <div class="upgrade-eligibility-banner__content"></div>
                                </div>
                                </div>
                                <div class="upgrade-eligibility-banner__close" role="button" aria-label="Close">
                                <img src="images/custom/menu-icons/Cross_20x20.svg" alt="close">
                                </div>
                            </div>
                            `;
                        // insert AFTER your target div
                        $('.vha-billing-change-tabs-cont').after(bannerHtml);
                    }
                });

                $(document).on("click", ".upgrade-eligibility-banner .upgrade-eligibility-banner__close", function () { //dhana_Upgrade-Eligibility
                    $(this).closest(".upgrade-eligibility-banner").remove();
                });

 
                $('div[aria-label="Billing account in Customer Account"] tbody')[2].addEventListener('click', function () {
                    setTimeout(function () {
                        let rowNum = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Asset Billing Applet'].GetBusComp().GetCurRowNum();
                        let siebCounter = $('div[aria-label="Billing account in Customer Account"]').find('.siebui-row-counter').text();
                        let delimOne = " - ";
                        let delimTwo = " of ";
                        let indDelimOne = siebCounter.indexOf(delimOne);
                        let recTotal = siebCounter.substring(indDelimOne + delimOne.length);
                        let indThree = recTotal.indexOf(delimTwo);
                        let recTotal2 = recTotal.substring(0, indThree);
                        document.getElementById('rec-cnt-table').innerText = recTotal2;
                        document.getElementById('rec-sel-cnt').innerText = rowNum;
                    }, 500);
                });
            }
            VHASSJBillingAccountPR.prototype.EndLife = function () {
                SiebelAppFacade.VHASSJBillingAccountPR.superclass.EndLife.apply(this, arguments);
            }
            return VHASSJBillingAccountPR;
        }
            ());
        return "SiebelAppFacade.VHASSJBillingAccountPR";
    })
}