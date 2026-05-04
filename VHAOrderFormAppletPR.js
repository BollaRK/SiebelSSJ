if (typeof (SiebelAppFacade.VHAOrderFormAppletPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHAOrderFormAppletPR");
    define("siebel/custom/VHAOrderFormAppletPR", ["order!siebel/phyrenderer"], function() {
        SiebelAppFacade.VHAOrderFormAppletPR = (function() {
            function VHAOrderFormAppletPR(pm) {
                SiebelAppFacade.VHAOrderFormAppletPR.superclass.constructor.call(this, pm)
            }
            SiebelJS.Extend(VHAOrderFormAppletPR, SiebelAppFacade.PhysicalRenderer);
            VHAOrderFormAppletPR.prototype.ShowUI = function() {
                SiebelAppFacade.VHAOrderFormAppletPR.superclass.ShowUI.call(this);
                var pm = this.GetPM();
                var busObj = SiebelApp.S_App.GetActiveBusObj();
                var OrderBC = busObj.GetBusCompByName("Order Entry - Orders");
                var IsDealer = OrderBC.GetFieldValue("VF Partner Portal - Calc");
                var controls = pm.Get("GetControls");
                var ExtRefctrl = controls["VF External Reference Id"].GetInputName();
                if (SiebelApp.S_App.GetProfileAttr("VHA User Type") == "Retail") {
                    setTimeout(function() {
                        $("#VF_External_Reference_Id_Label").parent().parent().hide();
                        $("input[name='" + ExtRefctrl + "']").parent().parent().hide()
                    }, 50)
                }
            }
            ;
            return VHAOrderFormAppletPR
        }());
        return "SiebelAppFacade.VHAOrderFormAppletPR"
    })
}
;