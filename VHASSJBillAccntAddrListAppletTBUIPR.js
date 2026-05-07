if (typeof(SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR) === "undefined") {

 SiebelJS.Namespace("SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR");
 define("siebel/custom/VHASSJBillAccntAddrListAppletTBUIPR", ["siebel/jqgridrenderer"],
  function () {
   SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR = (function () {

    function VHASSJBillAccntAddrListAppletTBUIPR(pm) {
     SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.constructor.apply(this, arguments);
    }

    SiebelJS.Extend(VHASSJBillAccntAddrListAppletTBUIPR, SiebelAppFacade.JQGridRenderer);

    VHASSJBillAccntAddrListAppletTBUIPR.prototype.Init = function () {
     SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.Init.apply(this, arguments);
    }

    VHASSJBillAccntAddrListAppletTBUIPR.prototype.ShowUI = function () {
     SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.ShowUI.apply(this, arguments);
		var jqGrid = this.GetGrid();
		jqGrid.jqGrid("setGridParam", {
			shrinkToFit: true
		});
		jqGrid.jqGrid('setColProp', 'Attention_to', {
			widthOrg: 150
		});
		jqGrid.jqGrid('setColProp', 'Street_Address', {
			widthOrg: 150
		});
		jqGrid.jqGrid('setColProp', 'Street_Address_2', {
			widthOrg: 150
		});
		jqGrid.jqGrid('setColProp', 'City_no_star_AU', {
			widthOrg: 150
		});
		jqGrid.jqGrid('setColProp', 'Postal_Code_no_star_AU', {
			widthOrg: 150
		});
		jqGrid.jqGrid('setColProp', 'Country', {
			widthOrg: 150
		});
		jqGrid.jqGrid('setColProp', 'Start_Date_no_star1', {
			widthOrg: 100
		});
		jqGrid.jqGrid('setColProp', 'End_Date', {
			widthOrg: 100
		});
		jqGrid.jqGrid('setColProp', 'SSA_Primary_Field', {
			widthOrg: 100
		});
		//jqGrid.jqGrid('hideCol', "Order_Sequence");
		jqGrid.jqGrid('setGridWidth', 1278);
    }

    VHASSJBillAccntAddrListAppletTBUIPR.prototype.BindData = function (bRefresh) {
     SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.BindData.apply(this, arguments);
    }

    VHASSJBillAccntAddrListAppletTBUIPR.prototype.BindEvents = function () {
     SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.BindEvents.apply(this, arguments);
    }

    VHASSJBillAccntAddrListAppletTBUIPR.prototype.EndLife = function () {
     SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.EndLife.apply(this, arguments);
    }

    return VHASSJBillAccntAddrListAppletTBUIPR;
   }()
  );
  return "SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR";
 })
}
