if (typeof(SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR");
    define("siebel/custom/VHAOrderEntryAttachmentListAppletSSJPR", ["siebel/jqgridrenderer"], function () {
        SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR = (function () {
            function VHAOrderEntryAttachmentListAppletSSJPR(pm) {
                SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR.superclass.constructor.apply(this, arguments)
            }
            SiebelJS.Extend(VHAOrderEntryAttachmentListAppletSSJPR, SiebelAppFacade.JQGridRenderer);
            VHAOrderEntryAttachmentListAppletSSJPR.prototype.Init = function () {
                SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR.superclass.Init.apply(this, arguments)
            };
            VHAOrderEntryAttachmentListAppletSSJPR.prototype.ShowUI = function () {
                SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR.superclass.ShowUI.apply(this, arguments);
                var pm = this.GetPM();
                var sViewName = SiebelApp.S_App.GetActiveView().GetName();
                var sFlowName = $(".siebui-applet-taskui-h").html().slice(0, ($(".siebui-applet-taskui-h").html().indexOf('<span class="siebui-taskui-title">')));
                var sAutoRetrieveView = ["VF New Connect MSO Order Summary View TBUI SSJ - eSIM Details"];
                var sAutoRetrieveFlow = ["Connect Postpay", "Connect NBN", "Pre to Post Transfer"];
                var SearchString = "[List Of Values.Type]='VF_CR_ENABLE_FLAG' AND [List Of Values.Active]='Y' AND [List Of Values.Name]='AutoGenContract'";
                var sLovFlg = VHAAppUtilities.GetPickListValues("", SearchString);
                var user = SiebelApp.S_App.GetProfileAttr("VHA User Type");
                var SearchString = "[List Of Values.Type]='VHA_USER_TYPE' AND [List Of Values.Active]='Y' AND [List Of Values.Name]='Retail'";
                var sRetailUser = VHAAppUtilities.GetPickListValues("", SearchString);
                var sIsAutoRetrievalFlow = false;
                sAutoRetrieveFlow.forEach(function (item) {
                    if (sFlowName.indexOf(item) != -1) {
                        sIsAutoRetrievalFlow = true
                    }
                });
                if (sLovFlg == "Y" && (sAutoRetrieveView.indexOf(sViewName) != -1) && (sIsAutoRetrievalFlow) && (user == sRetailUser)) {
                    setTimeout(function () {
                        var controls = pm.Get("GetControls");
                        var GenCtctBtn = controls["GenerateForm"].GetInputName();
                        $('[name="' + GenCtctBtn + '"]').trigger("click")
                    }, 1)
                }
            };
            return VHAOrderEntryAttachmentListAppletSSJPR
        }
            ());
        return "SiebelAppFacade.VHAOrderEntryAttachmentListAppletSSJPR"
    })
};