if (typeof(SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR");
    define("siebel/custom/VF_Intelligence_Search_Billing_Address_PR", ["siebel/jqgridrenderer"], function() {
        SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR = (function() {
            function VF_Intelligence_Search_Billing_Address_PR(pm) {
                SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR.superclass.constructor.apply(this, arguments)
            }
            SiebelJS.Extend(VF_Intelligence_Search_Billing_Address_PR, SiebelAppFacade.JQGridRenderer);
            let sCnt= 0;

            VF_Intelligence_Search_Billing_Address_PR.prototype.Init = function() {
                try {
                    SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR.superclass.Init.apply(this, arguments);
                } catch(e) { }

                this.GetPM().AttachPMBinding("FieldChange", function(control, fieldValue) {
                    var oView = SiebelApp.S_App.GetActiveView();
                    var sView = oView ? oView.GetName() : "";
                    var controlName = control.GetName();

                    if (controlName === "VF Manual Address Flg" && fieldValue === "Y") {
                        mSetPrflAttr("QAS Query Executed", "Y");
                    }

                    // SSJ guard: Prevent BAU logic from running in SSJ
                    if (sView && sView.indexOf("SSJ") > -1) {
                        return;
                    }

                    // --- ORIGINAL UNTOUCHED BAU CODE START ---
                    var activeApplet = (oView && typeof(oView.GetActiveApplet) === "function") ? oView.GetActiveApplet() : null;
                    if (activeApplet && (sView == "VF Billing Details View - TBUI" || sView == "VF Connection Wizard View - Billing Detail - TBUI")) {
                        var sAIN = activeApplet.GetId();
                        if (controlName == "VF Manual Address Flg") {
                            if (fieldValue == "Y") {
                                $('[aria-labelledby="WSDL_Address_Label_'+sAIN+'"]').closest("td").parent().show();
                                $('[aria-labelledby="City_AU_Label_'+sAIN+'"]').closest("td").parent().hide()
                            } else {
                                $('[aria-labelledby="WSDL_Address_Label_'+sAIN+'"]').closest("td").parent().show();
                                $('[aria-labelledby="City_AU_Label_'+sAIN+'"]').closest("td").parent().hide()
                            }
                        }
                    }
                    // --- ORIGINAL UNTOUCHED BAU CODE END ---
                })
            };

            VF_Intelligence_Search_Billing_Address_PR.prototype.ShowSelection = function() {
                try {
                    SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR.superclass.ShowSelection.apply(this, arguments);
                } catch(e) { }
            };

            VF_Intelligence_Search_Billing_Address_PR.prototype.BindData = function() {
                try {
                    SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR.superclass.BindData.apply(this, arguments);
                } catch(e) { }

                // Show list applet on Edit
                $('body').off('click.ssjsBillAddrEdit').on("click.ssjsBillAddrEdit", 'button[title="Billing Address Form Applet:Edit"]', function () {
                    var map = SiebelApp.S_App.GetActiveView() && SiebelApp.S_App.GetActiveView().GetAppletMap();
                    var app = map && map['VHA SSJ Billing Account Address List Applet TBUI'];
                    var id = app && app.GetFullId && app.GetFullId();
                    if(id) {
                        $("#" + id).removeClass("VFDisplayNone");
                        sCnt=1;
                    }
                });

                // NEW: keep list visible on NewRecord
                $('body').off('click.ssjsBillAddrNew').on('click.ssjsBillAddrNew', 'button[data-display="New"][title="Captured billing addresses List Applet:New"], button.siebui-icon-newrecord[title="Captured billing addresses List Applet:New"]', function () {
                    var map = SiebelApp.S_App.GetActiveView() && SiebelApp.S_App.GetActiveView().GetAppletMap();
                    var app = map && map['VHA SSJ Billing Account Address List Applet TBUI'];
                    var id = app && app.GetFullId && app.GetFullId();
                    if(id) {
                        $("#" + id).removeClass("VFDisplayNone");
                        sCnt=1;
                    }
                });

                // Reset counter on Save/Discard
                $('body').off('click.ssjsBillAddrDiscard').on("click.ssjsBillAddrDiscard", 'button[title="Billing Address Form Applet:Discard"]', function () {
                    sCnt=0;
                });

                $('body').off('click.ssjsBillAddrSave').on("click.ssjsBillAddrSave", 'button[title="Billing Address Form Applet:Save"]', function () {
                    sCnt=0;
                });
            };

            VF_Intelligence_Search_Billing_Address_PR.prototype.ShowUI = function() {
                try {
                    SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR.superclass.ShowUI.apply(this, arguments);
                } catch(err) { }

                var oView = SiebelApp.S_App.GetActiveView();
                var sView = oView ? oView.GetName() : "";
                var self = this;
                var pm = this.GetPM();

                setTimeout(function() {
                    var currentView = SiebelApp.S_App.GetActiveView();
                    if (self && self.GetPM && self.GetPM() && currentView && currentView.GetActiveApplet()) {
                        var AppName = currentView.GetActiveApplet().GetName();
                        if (AppName == "VHA Com Invoice Profile Toggle Form Applet TBUI Other") {
                            $("#HTML_Label7_Label_"+ self.GetPM().Get("GetId") +"").closest("table").attr("style", "margin-left: 25px !important");
                            return
                        }
                    }
                }, 100);

                $('[title="Billing Address List Applet"]').find("td.AppletTitle font:first-child").removeAttr("color").attr("size", "4");

                if (sView && (sView == "VF Billing Details View - TBUI" || sView == "VF Connection Wizard View - Billing Detail - TBUI" || sView.indexOf("SSJ") > -1)) {
                    if (pm) {
                        var controls = pm.Get("GetControls");
                        var $addr = $();

                        if (controls["VF Full Address"]) {
                            $addr = $('input[name="' + controls["VF Full Address"].GetInputName() + '"]');
                        } else if (controls["WSDL Address"]) {
                            $addr = $('input[name="' + controls["WSDL Address"].GetInputName() + '"]');
                        }

                        if ($addr.length > 0) {
                            $addr.autocomplete({
                                source:function( request, response ) {
                                    var sResp=VHAAppUtilities.doSearchAddress(request,false);
                                    response(sResp!=false ? sResp : []);
                                    mSetPrflAttr("QAS Query Executed","Y");
                                },
                                minLength: 10,
                                select: function( event, ui ) {
                                    var sResp=VHAAppUtilities.getAddress(ui);
                                    if(sResp!=false) {
                                        var Inputs = SiebelApp.S_App.NewPropertySet();
                                        Inputs.SetProperty("ViewName", sView);
                                        Inputs.SetProperty("Action", "UpdateBillCUTAddress");
                                        mSetPrflAttr("VFQASIsInbound","Y");
                                        VHAAppUtilities.updateAddress(sResp,Inputs);
                                    }
                                }
                            });
                        }
                    }
                }

                // SSJ: Hide list applet in base mode unless in edit/new state
                var map = SiebelApp.S_App.GetActiveView() && SiebelApp.S_App.GetActiveView().GetAppletMap();
                var app = map && map['VHA SSJ Billing Account Address List Applet TBUI'];
                if(app != null) {
                    var id = app.GetFullId && app.GetFullId();
                    if(id && sCnt === 0) {
                        $("#" + id).addClass("VFDisplayNone");
                    }
                }
            };

            VF_Intelligence_Search_Billing_Address_PR.prototype.EndLife = function() {
                try { $('body').off('.ssjsBillAddrEdit .ssjsBillAddrNew .ssjsBillAddrDiscard .ssjsBillAddrSave'); } catch(e) { }
                SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR.superclass.EndLife.apply(this, arguments);
            };

            function mSetPrflAttr(name,val) {
                var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
                if (ser) {
                    var Inputs = SiebelApp.S_App.NewPropertySet();
                    Inputs.SetProperty("Service Name", "SIS OM PMT Service");
                    Inputs.SetProperty("Method Name", "Set Profile Attribute");
                    Inputs.SetProperty("Profile Attribute Name", name);
                    Inputs.SetProperty("Profile Attribute Value", val);
                    ser.InvokeMethod("Run Process", Inputs);
                }
            }

            return VF_Intelligence_Search_Billing_Address_PR
        }());
        return "SiebelAppFacade.VF_Intelligence_Search_Billing_Address_PR"
    })
};
