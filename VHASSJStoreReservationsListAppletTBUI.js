if (typeof (SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI");
    define("siebel/custom/VHASSJStoreReservationsListAppletTBUI", ["siebel/jqgridrenderer"],
        function () {
            SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI = (function () {

                function VHASSJStoreReservationsListAppletTBUI(pm) {
                    SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI.superclass.constructor.apply(this, arguments);
                }
                SiebelJS.Extend(VHASSJStoreReservationsListAppletTBUI, SiebelAppFacade.JQGridRenderer);
                let pm, recordSet, ctrls, ctrlId2, ctrlId3, ctrlId4;

                VHASSJStoreReservationsListAppletTBUI.prototype.Init = function () {
                    SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI.superclass.Init.apply(this, arguments);

                }

                VHASSJStoreReservationsListAppletTBUI.prototype.ShowUI = function () {
                    SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI.superclass.ShowUI.apply(this, arguments);

                }

                VHASSJStoreReservationsListAppletTBUI.prototype.BindData = function (bRefresh) {
                    SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI.superclass.BindData.apply(this, arguments);
                }

                VHASSJStoreReservationsListAppletTBUI.prototype.BindEvents = function () {
                    SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI.superclass.BindEvents.apply(this, arguments);
                    pm = this.GetPM();                                        
                    ctrls = pm.Get("GetControls");
                    ctrlId2 = ctrls["ExtendReservation"].GetInputName();
                    ctrlId3 = ctrls["UnReserve"].GetInputName();
                    ctrlId4 = ctrls["Refresh"].GetInputName();
                    $('#' + ctrlId2 + '_Ctrl').addClass('VHASFJRefresh');
                    let sRow = pm.Get("GetNumRows");
                    if(sRow > 0){
                    recordSet = pm.Get("GetRecordSet");
                    var selection = pm.Get("GetSelection");
                    let sDevice = recordSet[selection]['Device Name'];}
                    $('#' + ctrlId2 + '_Ctrl').click(function () {
						$('.vha-sfj-cc-dialogbox').remove();
                        let sHTML = '<div class="vha-sfj-cc-dialogbox"><div class="vha-ssj-cc-app"><span class="vha-ssj-cc-app-icon"></span><span class="vha-ssj-cc-app-txt">Your ring and collect reservation has been extended.</span></div></div>';
                        $('#' + ctrlId2 + '_Ctrl').parent().after(sHTML);
                    });
                    $('#' + ctrlId3 + '_Ctrl').click(function () {
						$('.vha-sfj-cc-dialogbox').remove();
                        let sHTML = '<div class="vha-sfj-cc-dialogbox"><div class="vha-ssj-cc-app"><span class="vha-ssj-cc-app-icon"></span><span class="vha-ssj-cc-app-txt">' + sDevice + ' has been unreserved for Ring and collect.</span></div></div>';
                        $('#' + ctrlId3 + '_Ctrl').parent().after(sHTML);
                    });
                }

                VHASSJStoreReservationsListAppletTBUI.prototype.EndLife = function () {
                    SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI.superclass.EndLife.apply(this, arguments);
                    pm = ''; recordSet = ''; ctrls = ''; ctrlId2 = ''; ctrlId3 = ''; ctrlId4 = '';
                }

                return VHASSJStoreReservationsListAppletTBUI;
            }()
            );
            return "SiebelAppFacade.VHASSJStoreReservationsListAppletTBUI";
        })
}