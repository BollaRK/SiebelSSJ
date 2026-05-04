if (typeof(SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR");
    define("siebel/custom/VHASSJCustomerDetailsFormAppletPR", ["siebel/phyrenderer"],
        function () {
        SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR = (function () {

            function VHASSJCustomerDetailsFormAppletPR(pm) {
                SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR.superclass.constructor.call(this, pm);
            }

            SiebelJS.Extend(VHASSJCustomerDetailsFormAppletPR, SiebelAppFacade.PhysicalRenderer);
            var pm,
            fullId,
            controls,
            remainEquipLimit,remEquipLmtFldVal;
            VHASSJCustomerDetailsFormAppletPR.prototype.Init = function () {
                SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR.superclass.Init.apply(this, arguments);
				pm = this.GetPM();
                fullId = pm.Get("GetFullId");
                controls = pm.Get("GetControls");
            }
            VHASSJCustomerDetailsFormAppletPR.prototype.ShowUI = function () {
                SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR.superclass.ShowUI.apply(this, arguments);
				$('.ssj-section1-customer').addClass("displaynone");
                //Jeeten: Updated UI or SSJ
                var appletId = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Customer Details Form Applet'].GetFullId();
                var appletSelector = "#" + appletId;
                $(appletSelector).before(`<div class="vha-scj-st3-new-serv vha-account-name" id="vha-ssj-view-tittle"><span></span></div>`)
                var AccName = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Customer Details Form Applet'].GetPModel().Get('GetBusComp').GetFieldValue('Name');
                // if (AccName && typeof AccName === 'string') { //Dhana_CM- 6375
                //     AccName = AccName.replace(",", "");
                // }
                $('.vha-account-name').find('span').text(AccName);
                $('#s_' + SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Customer Details Form Applet'].GetFullId() + '_div').addClass('vha-customer-detail');
                var AccStatus = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Customer Details Form Applet'].GetPModel().Get('GetBusComp').GetFieldValue('Account Status');
                var statusClass = (AccStatus == "Open" || AccStatus == "Active") ? "CSGreen" : "CSRed";
                var inputName = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Customer Details Form Applet'].GetControls()["AccountStatus"].GetInputName();
                $('[name="' + inputName + '"]').before(`<span class="vha-sc-coverageStatus ${statusClass}"></span>`);
                var statusDiv = `<div class="acc-status-class"></div> `;
                var inputSelector = "input[name='" + inputName + "']";
                var inputElement = $(inputSelector)[0];
                if (inputElement) {
                    inputElement.style.setProperty('width', '80px', 'important');
                }
                $(inputSelector).siblings().addBack().wrapAll(statusDiv);
                var $labelDiv = $(".vha-customer-detail table td .mceLabel:has(span)");
                $labelDiv.html(function (index, oldHtml) {
                    return oldHtml.replace(":", "");
                });
            }

            VHASSJCustomerDetailsFormAppletPR.prototype.BindData = function (bRefresh) {
                SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR.superclass.BindData.apply(this, arguments);
				//console.log("I was in Bind data");
				remEquipLmtFldVal = pm.Get("GetBusComp").GetFieldValue("VHA Remaining Equipment Limit");
				if(remEquipLmtFldVal == "" || remEquipLmtFldVal == null)
					$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$00.00");
				else
				{
					remainEquipLimit = Number(remEquipLmtFldVal);
					if(remainEquipLimit == NaN)
						$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$00.00");
					else
					{
						remainEquipLimit = Number((Number(remainEquipLimit)).toFixed(2));
						if((remainEquipLimit.toLocaleString("en-US")).indexOf('.')== "-1")
							$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$"+remainEquipLimit.toLocaleString("en-US")+".00");
						else
							$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$"+remainEquipLimit.toLocaleString("en-US"));
					}
				}
            }

            VHASSJCustomerDetailsFormAppletPR.prototype.BindEvents = function () {
                SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR.superclass.BindEvents.apply(this, arguments);
				remEquipLmtFldVal = pm.Get("GetBusComp").GetFieldValue("VHA Remaining Equipment Limit");
				if(remEquipLmtFldVal == "" || remEquipLmtFldVal == null)
					$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$00.00");
				else
				{
					remainEquipLimit = Number(remEquipLmtFldVal);
					if(remainEquipLimit == NaN)
						$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$00.00");
					else
					{
						remainEquipLimit = Number((Number(remainEquipLimit)).toFixed(2));
						if((remainEquipLimit.toLocaleString("en-US")).indexOf('.')== "-1")
							$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$"+remainEquipLimit.toLocaleString("en-US")+".00");
						else
							$("input[name='"+controls['VHA Remaining Equipment Limit'].GetInputName()+"']").val("$"+remainEquipLimit.toLocaleString("en-US"));
					}
				}
            }

            VHASSJCustomerDetailsFormAppletPR.prototype.EndLife = function () {
                SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR.superclass.EndLife.apply(this, arguments);
            }

            return VHASSJCustomerDetailsFormAppletPR;
        }
            ());
        return "SiebelAppFacade.VHASSJCustomerDetailsFormAppletPR";
    })
}
