if (typeof(SiebelAppFacade.VHASSJPropositionLineItemListAppletPR) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.VHASSJPropositionLineItemListAppletPR");
    define("siebel/custom/VHASSJPropositionLineItemListAppletPR", ["siebel/jqgridrenderer"],
        function() {
            SiebelAppFacade.VHASSJPropositionLineItemListAppletPR = (function() {

                function VHASSJPropositionLineItemListAppletPR(pm) {
                    SiebelAppFacade.VHASSJPropositionLineItemListAppletPR.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(VHASSJPropositionLineItemListAppletPR, SiebelAppFacade.JQGridRenderer);
                var pm;
                let sAppl,
                    sAplId,
                    sFlg,
                    sEnt,
                    grid,
                    dfaAppl,
                    rowIndex; //Vivek_12/02/26
                let taskAppl; //Soumalya 12032026
                let sCnt = 0;

                VHASSJPropositionLineItemListAppletPR.prototype.Init = function() {
                    SiebelAppFacade.VHASSJPropositionLineItemListAppletPR.superclass.Init.apply(this, arguments);
                    pm = this.GetPM();

                    pm.AddMethod("FieldChange", OnFieldChange, {
                        sequence: false,
                        scope: this
                    });
                    pm.AddMethod("InvokeMethod", PostInvokeMethod, {
                        sequence: false,
                        scope: pm,
                    });
                }

                function HandleSelectionChange() {
                    doProcessing(pm);
                    rowIndex = pm.Get("GetSelection");
                    if (rowIndex !== -1) {
                        var sActive = pm.Get("IsActive");
                        if (sActive === true) {
                            grid.find('.VHArow_radio').eq(rowIndex).prop('checked', true); //vivek
                        }
                    }
                }

                function PostInvokeMethod(methodName, psIn, lp, returnStructure) { //vivek
                    if (methodName == "PositionOnRow000" || methodName == "GotoNextSet" || methodName == "GotoNext" || methodName == "GotoPrevious" || methodName == "GotoPreviousSet") {
                        HandleSelectionChange();
                    }
                    /*if(methodName == "ResumeQuote"){ 	
                    	SiebelApp.S_App.uiStatus.Free();
                    	if(pm.Get("GetBusComp").GetFieldValue("Quote Still Valid") == "Yes"){
                    		if(pm.Get("GetBusComp").GetFieldValue("Quote Status Display") == "Order In Progress"){
                    			if($('.SSJQuotePausedTask a[name="Name"]').length > 0){
                    				setTimeout(function () {
                    					$('.SSJQuotePausedTask a[name="Name"]')[0].click();
                    				}, 1000);
                    			}
                    		}
                    	}
                    }*/
                }

                function hideRingAndCollect(stockIndicator, sProdType) {
                    setTimeout(function() {
                        if (stockIndicator == "Out of Stock - Connect Later" || (sProdType.indexOf("NBN Only") >=0 || sProdType.indexOf("NBN with MBB") >=0))
                            $(".PropositionContainerRCApplet").hide();
                        else
                            $(".PropositionContainerRCApplet").show();
                    }, 50);
                }

                function doProcessing(pm) {
                    setTimeout(function() {
                        var connectionType = '',
                            sMSISDN, stockIndicator;
							var sProdType=''; 
                        var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VFDFA Line Item Form Apple Propt'];
                        if (applet) {
                            connectionType = applet.GetBusComp().GetFieldValue("VF ConnectionType");
                            sMSISDN = applet.GetBusComp().GetFieldValue("VHA MSISDN Calc");
                            stockIndicator = applet.GetBusComp().GetFieldValue("VF Stock Indicator TBUI");
							
							var ctrl = applet.GetControls()["VF Root Siebel Product Type"];
							var controlId = ctrl.GetInputName();
							var fieldName = ctrl.GetFieldName();
							sProdType = applet.GetBusComp().GetFieldValue(fieldName);
							$("span[id='"+controlId+"']").hide();
                        }
						
                        if (connectionType == "SIM Only")
						{
                            $(".PropositionContainerEditApplet .ColumnForm:has(h4:contains('Product details'))").hide();
						    $('.vhasimopayment').hide();
                            $('.vhasimopaymentterm').hide();
                            $('.vhasimorrp').hide();
						}
						
                        else
						{
                            $(".PropositionContainerEditApplet .ColumnForm:has(h4:contains('Product details'))").show();
						    $('.vhasimopayment').show();
                            $('.vhasimopaymentterm').show();
                            $('.vhasimorrp').show();
						}


                        if (sMSISDN == "" || sMSISDN == null || sMSISDN == undefined) {
                            $('.VHAPropositionMainContainer .PropositionContainer .SFJHeading').contents().filter(function() {
                                return this.nodeType === 3 && this.nodeValue.trim() === "|";
                            }).remove();
                        }

                        hideRingAndCollect(stockIndicator, sProdType);

                    }, 50);
                }

                function OnFieldChange(control, value) {
                    if (control.GetName() == "VF Stock Indicator TBUI")
                        hideRingAndCollect(value, "");
                }

                VHASSJPropositionLineItemListAppletPR.prototype.ShowUI = function() {
                    SiebelAppFacade.VHASSJPropositionLineItemListAppletPR.superclass.ShowUI.apply(this, arguments);
                    var pm = this.GetPM();
                    //doProcessing(pm);
                    if (SiebelApp.S_App.GetActiveView().GetApplet("VF Dfa Order Entry Line Item List Applet TBUI") != null) {

                        dfaAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()['VF Dfa Order Entry Line Item List Applet TBUI'].GetFullId();
                        $('#' + dfaAppl).addClass('VHAListAppletColAlign');

                        $('.jqgfirstrow').hide(); //Vivek-13/02/26
                        $('.ui-jqgrid-hbox').find('input:checkbox').hide(); //Vivek-13/02/26

                        sAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()['VF Dfa Order Entry Line Item List Applet TBUI'];
                        sAplId = sAppl.GetFullId();
                        sEnt = " items"; //Vivek-13/02/26
                        setTimeout(function() {
                            sFlg = "Y";
                            VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
                        }, 1000);
                        //Soumalya 12032026
                        if (SiebelApp.S_App.GetActiveView().GetApplet("VHA SSJ Inbox Item Task List Applet") != null) {
                            taskAppl = SiebelApp.S_App.GetActiveView().GetAppletMap()['VHA SSJ Inbox Item Task List Applet'].GetFullId();
                            $('#' + taskAppl).addClass('VFDisplayNone SSJQuotePausedTask');
                        }
                    }
                }

                VHASSJPropositionLineItemListAppletPR.prototype.BindData = function(bRefresh) {
                    SiebelAppFacade.VHASSJPropositionLineItemListAppletPR.superclass.BindData.apply(this, arguments);
                    //Vivek_13/02/26
                    if (SiebelApp.S_App.GetActiveView().GetApplet("VF Dfa Order Entry Line Item List Applet TBUI") != null) {
                        HandleSelectionChange();
                        var self = this;
                        var sId = sAppl.GetId();
                        grid = this.GetGrid();
                        grid.find('tbody tr').each(function(rowIndex) {
                            var $row = $(this);
                            // Clear first cell, add radio
                            $row.find('#' + rowIndex + '_s_' + sId + '_l_SelectAll').html(`<input type="radio" name="rowRadio" value="${rowIndex}" class="VHArow_radio">`);
                        });
                        grid.find('.VHArow_radio').on('change', function() {
                            // Uncheck all others
                            grid.find('.VHArow_radio').not(this).prop('checked', false);
                        });
                        // Restore PM selection on load
                        var currentSel = this.GetPM().Get("GetSelection");
                        if (currentSel !== null) {
                            grid.find('.VHArow_radio').eq(currentSel).prop('checked', true);
                        }
                    }
                }

                VHASSJPropositionLineItemListAppletPR.prototype.BindEvents = function() {
                    SiebelAppFacade.VHASSJPropositionLineItemListAppletPR.superclass.BindEvents.apply(this, arguments);
                    if (SiebelApp.S_App.GetActiveView().GetApplet("VF Dfa Order Entry Line Item List Applet TBUI") != null) {
                        $('#' + sAplId + ' tbody')[2].addEventListener('click', function() {
                            setTimeout(function() {
                                sFlg = "N";
                                VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
                            }, 500);
                        });
                        $('#' + sAplId + ' tbody')[0].addEventListener('click', function() {
                            setTimeout(function() {
                                sFlg = "N";
                                VHAAppUtilities.sPagination(sAppl, sAplId, sFlg, sEnt);
                            }, 500);
                        });
                    }
                }

                VHASSJPropositionLineItemListAppletPR.prototype.EndLife = function() {
                    SiebelAppFacade.VHASSJPropositionLineItemListAppletPR.superclass.EndLife.apply(this, arguments);
                }

                return VHASSJPropositionLineItemListAppletPR;
            }());
            return "SiebelAppFacade.VHASSJPropositionLineItemListAppletPR";
        })
}