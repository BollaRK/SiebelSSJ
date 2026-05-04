if (typeof(SiebelAppFacade.VHABillingSetupAppletTBUIPR) === "undefined") {

 SiebelJS.Namespace("SiebelAppFacade.VHABillingSetupAppletTBUIPR");
 define("siebel/custom/VHABillingSetupAppletTBUIPR", ["siebel/phyrenderer"],
  function () {
   SiebelAppFacade.VHABillingSetupAppletTBUIPR = (function () {

    function VHABillingSetupAppletTBUIPR(pm) {
     SiebelAppFacade.VHABillingSetupAppletTBUIPR.superclass.constructor.apply(this, arguments);
    }

    SiebelJS.Extend(VHABillingSetupAppletTBUIPR, SiebelAppFacade.PhysicalRenderer);
	var pm,fullId,controls;
    VHABillingSetupAppletTBUIPR.prototype.Init = function () {
     SiebelAppFacade.VHABillingSetupAppletTBUIPR.superclass.Init.apply(this, arguments);
	 pm = this.GetPM();
     fullId = pm.Get("GetFullId");
     controls = pm.Get("GetControls");
    }

    VHABillingSetupAppletTBUIPR.prototype.ShowUI = function () {
     SiebelAppFacade.VHABillingSetupAppletTBUIPR.superclass.ShowUI.apply(this, arguments);
	 $('.vha-ssj-bill-set-pay-term-val').addClass('VFDisplayNone');
	 $('.vha-ssj-bill-set-acc-type-val').addClass('VFDisplayNone');
	 $(".vha-ssj-bill-setup-an-inp, .vha-ssj-bill-setup-an-icon").wrapAll("<div class='vha-ssj-bill-setup-acc-num-flex'></div>");
    }

    VHABillingSetupAppletTBUIPR.prototype.BindData = function (bRefresh) {
     SiebelAppFacade.VHABillingSetupAppletTBUIPR.superclass.BindData.apply(this, arguments);
    }

    VHABillingSetupAppletTBUIPR.prototype.BindEvents = function () {
     SiebelAppFacade.VHABillingSetupAppletTBUIPR.superclass.BindEvents.apply(this, arguments);
		$('.vha-ssj-bill-set-pay-term').append("<div class='vha-ssj-bill-set-pay-term-pr-val'>" + pm.ExecuteMethod("GetFieldValue", controls["Payment Term"]) + "</div>");
		$('.vha-ssj-bill-set-acc-type').append("<div class='vha-ssj-bill-set-acc-type-pr-val'>" + pm.ExecuteMethod("GetFieldValue", controls["Accounting Type"]) + "</div>");
    }

    VHABillingSetupAppletTBUIPR.prototype.EndLife = function () {
     SiebelAppFacade.VHABillingSetupAppletTBUIPR.superclass.EndLife.apply(this, arguments);
    }

    return VHABillingSetupAppletTBUIPR;
   }()
  );
  return "SiebelAppFacade.VHABillingSetupAppletTBUIPR";
 })
}
