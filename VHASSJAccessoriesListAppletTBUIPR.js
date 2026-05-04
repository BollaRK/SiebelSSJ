if (typeof(SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR) === "undefined") {

 SiebelJS.Namespace("SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR");
 define("siebel/custom/VHASSJAccessoriesListAppletTBUIPR", ["siebel/jqgridrenderer","siebel/custom/VHAAppUtilities"],
  function () {
   SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR = (function () {

    function VHASSJAccessoriesListAppletTBUIPR(pm) {
     SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR.superclass.constructor.apply(this, arguments);
    }

    SiebelJS.Extend(VHASSJAccessoriesListAppletTBUIPR, SiebelAppFacade.JQGridRenderer);
	let sAppl, sAplId, sFlg, sEnt, grid, pm, rowIndex;
	let sCnt = 0;

    VHASSJAccessoriesListAppletTBUIPR.prototype.Init = function () {
     SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR.superclass.Init.apply(this, arguments);
	 //pm = this.GetPM();
	 
    }

    VHASSJAccessoriesListAppletTBUIPR.prototype.ShowUI = function () {
     SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR.superclass.ShowUI.apply(this, arguments);
		var sAppletId = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Accessories List Applet TBUI"].GetFullId();
		/* $('#' + sAppletId).find('.ui-jqgrid-pager').addClass('VFDisplayNone'); */
		$('#' + sAppletId).addClass('vha-acc-pp-applet');
	 $('.siebui-applet-title').each(function () {
		// prevent running twice
		if ($(this).data('done')) return;
		let parts = $(this).html().split(/<br\s*\/?>/i);
		let html = `
			<span>${parts[0] || ''}</span><br>
			<span class="vha-ssj-after-br-acc">${parts[1] || ''}</span>
		`;
		$(this).html(html);
		$(this).data('done', true);
	});
	
	/*--jqgrid--*/
	var jqGrid = this.GetGrid();
		jqGrid.jqGrid("setGridParam", {
			shrinkToFit: true
		});
		jqGrid.jqGrid('setColProp', 'Accessory_Name', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'Accessory_Type', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'VHA_App_Stock_Indicator', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'IMEI', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'EID', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'Add_Device_Care', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'Contract_Term', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'VHA_RRP_inc_GST', {
			widthOrg: 175
		});
		jqGrid.jqGrid('setColProp', 'Monthly_Payment_Amount', {
			widthOrg: 175
		});
		//jqGrid.jqGrid('hideCol', "Order_Sequence");
		jqGrid.jqGrid('setGridWidth', 1600);
		/*if (SiebelApp.S_App.GetActiveView().GetApplet("VHA SSJ Accessories List Applet TBUI") != null) { 
		//$('.ui-jqgrid-hbox').find('input:checkbox').hide(); //Vivek-04/03/26 
		$('.siebui-btn-grp-applet, .ui-icon-seek-first, .ui-icon-seek-end').hide();
		sAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Accessories List Applet TBUI'];
		sAplId = sAppl.GetFullId();
		sEnt = " items" 
		setTimeout(function () {
			sFlg = "Y";
			VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
		}, 1000);
	}*/
    }

    VHASSJAccessoriesListAppletTBUIPR.prototype.BindData = function (bRefresh) {
     SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR.superclass.BindData.apply(this, arguments);
	 $('.siebui-applet-title').each(function () {
		// prevent running twice
		if ($(this).data('done')) return;
		let parts = $(this).html().split(/<br\s*\/?>/i);
		let html = `
			<span>${parts[0] || ''}</span><br>
			<span class="vha-ssj-after-br-acc">${parts[1] || ''}</span>
		`;
		$(this).html(html);
		$(this).data('done', true);
	});
	
	  
    }

    VHASSJAccessoriesListAppletTBUIPR.prototype.BindEvents = function () {
     SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR.superclass.BindEvents.apply(this, arguments);
	 if (SiebelApp.S_App.GetActiveView().GetApplet("VHA SSJ Accessories List Applet TBUI") != null) {
		sAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Accessories List Applet TBUI'];
		sAplId = sAppl.GetFullId();
		$('#' + sAplId + ' tbody')[2].addEventListener('click', function () {
			setTimeout(function () {
				sFlg = "N";
				VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
			}, 500);
		});
		$('#' + sAplId + ' tbody')[0].addEventListener('click', function () {
			setTimeout(function () {
				sFlg = "N";
				VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
			}, 500);
		});
	}
    }

    VHASSJAccessoriesListAppletTBUIPR.prototype.EndLife = function () {
     SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR.superclass.EndLife.apply(this, arguments);
    }

    return VHASSJAccessoriesListAppletTBUIPR;
   }()
  );
  return "SiebelAppFacade.VHASSJAccessoriesListAppletTBUIPR";
 })
}