
if (typeof (SiebelAppFacade.VHALCaptureIdentificationPR) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.VHALCaptureIdentificationPR");
    define("siebel/custom/VHALCaptureIdentificationPR", ["siebel/jqgridrenderer", "siebel/custom/VHAAppUtilities"], function () {
        SiebelAppFacade.VHALCaptureIdentificationPR = (function () {
            function VHALCaptureIdentificationPR(pm) {
                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.constructor.apply(this, arguments)
            }
            SiebelJS.Extend(VHALCaptureIdentificationPR, SiebelAppFacade.JQGridRenderer);
            let grid,
                pm,
                sAppl,
                rowIndex;

            VHALCaptureIdentificationPR.prototype.Init = function () {
                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.Init.apply(this, arguments);
                pm = this.GetPM();
                pm.AddMethod("InvokeMethod", PostInvokeMethod, {
                    sequence: false,
                    scope: pm,
                });
            }
            function HandleSelectionChange() {
                rowIndex = this.GetPM().Get("GetSelection");
                if (rowIndex !== -1) {
                    var sActive = pm.Get("IsActive");
                    if (sActive === true) {
                        grid.find('.VHArow_radio').eq(rowIndex).prop('checked', true);
                    }
                }
            }
            function PostInvokeMethod(methodName, psIn, lp, returnStructure) {
                if (methodName == "PositionOnRow000" || methodName == "GotoNextSet" || methodName == "GotoNext" || methodName == "GotoPrevious" || methodName == "GotoPreviousSet") {
                    HandleSelectionChange();
                }
            }

            VHALCaptureIdentificationPR.prototype.Init = function () {

                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.Init.apply(this, arguments);

            }

            VHALCaptureIdentificationPR.prototype.ShowUI = function () {

                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.ShowUI.apply(this, arguments);
                if (SiebelApp.S_App.GetActiveView().GetApplet("VF SSJ Capture Identification Details List Applet – Postpay TBUI") != null) {
                    $('.jqgfirstrow').hide();
                    $('.ui-jqgrid-hbox').find('input:checkbox').hide();
                    sAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()["VF SSJ Capture Identification Details List Applet – Postpay TBUI"];

                }
                //juhi 10911--------
                if (SiebelApp.S_App.GetActiveView().GetApplet("VF SSJ ID Scan Session List Applet – TBUI") != null){
                        $('.ui-jqgrid').addClass('VHASharingList');
                }
            }

            VHALCaptureIdentificationPR.prototype.BindData = function (bRefresh) {

                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.BindData.apply(this, arguments);
                if (SiebelApp.S_App.GetActiveView().GetApplet("VF SSJ Capture Identification Details List Applet – Postpay TBUI") != null) {
                    //HandleSelectionChange();
                    var self = this;
                    var sId = sAppl.GetId();
                    grid = this.GetGrid();
                    grid.find('tbody tr').each(function (rowIndex) {
                        var $row = $(this);

                        $row.find('#' + rowIndex + '_s_' + sId + '_l_SelectAll').html(`<input type="radio" name="rowRadio" value="${rowIndex}" class="VHArow_radio">`);
                    });
                    grid.find('.VHArow_radio').on('change', function () {

                        grid.find('.VHArow_radio').not(this).prop('checked', false);
                    });

                    var currentSel = this.GetPM().Get("GetSelection");
                    if (currentSel !== null) {
                        grid.find('.VHArow_radio').eq(currentSel).prop('checked', true);
                    }
                }
            }

            VHALCaptureIdentificationPR.prototype.BindEvents = function () {

                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.BindEvents.apply(this, arguments);
				
				var inpo  = SiebelApp.S_App.GetProfileAttr("VFOrganisationName");
                if (inpo === "Vodafone AU"){

				$(".siebui-icon-dvsvalidationpostpay").addClass('validateID_removeSSJ');
                }
                
            }

            VHALCaptureIdentificationPR.prototype.EndLife = function () {

                SiebelAppFacade.VHALCaptureIdentificationPR.superclass.EndLife.apply(this, arguments);

            }

            return VHALCaptureIdentificationPR;
        }()
        );
        return "SiebelAppFacade.VHALCaptureIdentificationPR";
    })
}
