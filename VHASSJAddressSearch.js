if (typeof VHASSJAddressSearch === "undefined") {
    var VHASSJAddressSearch = {};
	var sResp;
	
	var MapShed = {
                Mobile: {
                    m5G: {
                        indoor: false,
                        outdoor: false
                    },
                    m5GSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m5GNSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m4G: {
                        indoor: false,
                        outdoor: false
                    },
                    m4GSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m4GNSA: {
                        indoor: false,
                        outdoor: false
                    },
                    m3G: {
                        indoor: false,
                        outdoor: false
                    }
                },
                FWA: {
                    f4G: {
                        is4G: false
                    },
                    f5G: {
                        is5G: false
                    },
                    f5GSA: {
                        is5Gsa: false
                    },
                    f5GNSA: {
                        is5Gnsa: false
                    }
                }
            };
	
	VHASSJAddressSearch.SelectAddress = function(request, response) {
			var sResp = VHAAppUtilities.doSearchAddress(request, false);
			$("a.siebui-icon-location").remove();
			$(".ccNwkpar").remove();
			SiebelApp.S_App.SetProfileAttr("URL1", "");
			if (sResp != false) {
				response(VHAAppUtilities.doSearchAddress(request, false));
			} else { // when error/message/fault
				response([]);
			}
			isQAS = "Y";
    };
	 VHASSJAddressSearch.HandleAddressSelection = function(event, ui) {
		                         $("#maskoverlay").styleShow();
								sResp = VHAAppUtilities.getAddress(ui);
								var this_t = this;
								sAddr = this_t.value;
								console.log(sResp);
								var SearchString = "[List Of Values.Type]='VHA_AUTO_COVRGE_CHK' AND [List Of Values.Active]='Y'";
								var sLovFlg = VHAAppUtilities.GetPickListValues("", SearchString);
      };

	function tssleep(ms) {
		return new Promise(function (resolve) {
			return setTimeout(resolve, ms);
		});
	}
	
	VHASSJAddressSearch.TriggerCoverageCheck = function(sResp) 
	{
		console.log(sResp);
		var SearchString = "[List Of Values.Type]='VHA_AUTO_COVRGE_CHK' AND [List Of Values.Active]='Y'";
		var sLovFlg = VHAAppUtilities.GetPickListValues("", SearchString);
		if (sLovFlg == "ON") {
			VHACovergaeCheck(sResp, this_t);
		}
		//Vasavi added below if for NBN Address
		if (sResp != false && sResp != undefined) {
			var sAddrAllowedFlg = 'Y';
			$.map(sResp.address.properties, function (i, j) {
				if (j == "postal_delivery_type" && i != null && i != "") {
					sAddrAllowedFlg = 'N';
				}
			});
			if (sAddrAllowedFlg == "Y") {
				var NBNLoc = "";
				TriggerNBNAddress(sResp, NBNLoc);
			   /* var NBNDetails = TriggerNBNAddress(sResp, NBNLoc);
				console.log(NBNDetails.NBNAvailable);
				console.log(NBNDetails.NBNDetailsNBNAU);
				console.log(NBNDetails.AccessTech);
				console.log(NBNDetails.NBNTypeDesc);*/
			} else {
				//$('[name='+t_this.GetPM().Get("GetControls")["Address"].GetInputName()+']').val("");
				alert("Invalid Address Type. Address must have type as Street or Rural.");
				return false;
			}
		}
	}
							
	function VHACovergaeCheck(sResp, this_t) { // ??
                if (sResp != "" && sResp != undefined)
				{
				var nser = SiebelApp.S_App.GetService("VF BS Process Manager");
                var nInputs = SiebelApp.S_App.NewPropertySet();
                nInputs.SetProperty("Service Name", "VHA Store Pickup Reservation Service Sales Calc");
                nInputs.SetProperty("role", "VCS");
                nInputs.SetProperty("longitude", sResp.address.geometry.coordinates[0]); //??
                nInputs.SetProperty("latitude", sResp.address.geometry.coordinates[1]);
                SiebelApp.S_App.SetProfileAttr("Testlan", sResp.address.geometry.coordinates[0]);
                SiebelApp.S_App.SetProfileAttr("Testlog", sResp.address.geometry.coordinates[1]);
                //nInputs.SetProperty("SessionId", vSessionId);
                nInputs.SetProperty("Method Name", "CoverageCheck");
                var ROups = nser.InvokeMethod("Run Process", nInputs);
                //var CCAppId = this_t.GetPM().Get("GetFullId");
                var s4G,
                s5G,
                s5Gsa,
                s5Gnsa;
                var resultCov = [];
                for (let i = 0; i < ROups.GetChildByType("ResultSet").childArray[1].childArray.length; i++) {
                    var curPropArr = ROups.GetChildByType("ResultSet").childArray[1].childArray[i].propArray;
                    resultCov.push(curPropArr);
                }

                ////console.log(resultCov);
                //var suiURL = ROups.childArray[0].childArray[0].childArray[1].childArray[3].childArray[0].propArray.uiUrl;
                var suiURL = SiebelApp.S_App.GetProfileAttr("URL1");
                //SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").SetFieldValue("Map URL", "https://mapt.vodafone.com.au/VHAMap/apps/retail-vf?lat=-33.52220942&lon=151.19767066&zl=16&device=generic5g");
                const arrSite = [...new Set(resultCov.map(x => x.Site))];
                //var ccpardiv = '<div class="ccNwkpar">';
                //var hdrdiv = "";
                //console.log(arrSite);
                arrSite.forEach(function (item1, index) {
                    // //console.log(index+". "+item);
                    var arrNetwork = resultCov.filter(function (a) {
                        return a.Site == item1;
                    });
                    //console.log(arrNetwork);
                    //hdrdiv = hdrdiv + '<div class="ccNwkchdmain"><div class="ccNwkhdr" id="ccNwkhdr"' + index + '>' + item1 + '</div><div class="ccNwkchd">';
                    arrNetwork.forEach(function (item2, index) {
                        if (item2.PropName != "") {
                            // //console.log(item.PropName+' == '+item.PropValue);
                            switch (item1) {
                            case "4G/5G Home Internet":
                                switch (item2.PropName) {
                                case "is4G":
                                    MapShed.FWA.f4G.is4G = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5G":
                                    MapShed.FWA.f5G.is5G = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5Gsa":
                                    MapShed.FWA.f5GSA.is5Gsa = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5Gnsa":
                                    MapShed.FWA.f5GNSA.is5Gnsa = item2.PropValue == "true" ? true : false;
                                    break;
                                };
                                break;
                            case "Mobile Coverage": //"mobilestatus":
                                switch (item2.PropName) {
                                case "is5Gindoor":
                                    MapShed.Mobile.m5G.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5Goutdoor":
                                    MapShed.Mobile.m5G.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GindoorNsa":
                                    MapShed.Mobile.m5GNSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GoutdoorNsa":
                                    MapShed.Mobile.m5GNSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GindoorSa":
                                    MapShed.Mobile.m5GSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is5GoutdoorSa":
                                    MapShed.Mobile.m5GSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4Gindoor":
                                    MapShed.Mobile.m4G.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4Goutdoor":
                                    MapShed.Mobile.m4G.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GindoorNsa":
                                    MapShed.Mobile.m4GNSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GoutdoorNsa":
                                    MapShed.Mobile.m4GNSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GindoorSa":
                                    MapShed.Mobile.m4GSA.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is4GoutdoorSa":
                                    MapShed.Mobile.m4GSA.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is3Gindoor":
                                    MapShed.Mobile.m3G.indoor = item2.PropValue == "true" ? true : false;
                                    break;
                                case "is3Goutdoor":
                                    MapShed.Mobile.m3G.outdoor = item2.PropValue == "true" ? true : false;
                                    break;
                                }
                                break;
                            default:
                                break;
                            }


                        }
                    });
                    var div = "";
                    switch (item1) {
                    case "4G/5G Home Internet":
                        var dVal = MapShed.FWA.f4G.is4G == true ? "4G – Available" : "4G - Not available";
                        var dCls = MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        //div = div + '<div class="ccNwk  btn ' + dCls + '" id="f4G"> ' + dVal + '</div>';
                        s4G = MapShed.FWA.f4G.is4G;
						// Hari 31/may/2024
						if (s4G == false) {
							$("#vha-sc-4G-Avl .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-4G-home-status").text(dVal);
						} 
						else 
						{
							$("#vha-sc-4G-Avl .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-4G-home-status").text(dVal);
						}

                        var dVal = MapShed.FWA.f5G.is5G == true ? "5G – Available" : "5G – Not available";
                        var dCls = MapShed.FWA.f5G.is5G == true ? "ccmsGreen" : "ccmsRed";
                        s5G = MapShed.FWA.f5G.is5G;
                        if (s5G == false) 
						{
							$("#vha-sc-5G-NA .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-5G-home-status").text(dVal);
						} 
						else 
						{
							$("#vha-sc-5G-NA .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-5G-home-status").text(dVal);
						}

                        var dVal = MapShed.FWA.f5GNSA.is5Gnsa == true ? "5G NSA – Available" : "5G NSA – Not available";
                        var dCls = MapShed.FWA.f5GNSA.is5Gnsa == true ? "ccmsGreen" : "ccmsRed";

                        s5Gnsa = MapShed.FWA.f5GNSA.is5Gnsa;
                        if (s5Gnsa == false)
						{
							$("#vha-sc-5GNSA-NA .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-5GNSA-home-status").text(dVal);
						} 
						else 
						{
							$("#vha-sc-5GNSA-NA .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-5GNSA-home-status").text(dVal);
						}

                        break;
                    case "Mobile Coverage": //"mobilestatus":
                        var m = MapShed.Mobile.m3G;
                        var dVal = m.indoor == true && m.outdoor == true ? "3G - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "3G - Outdoor Only" : m.indoor == true && m.outdoor == false ? "3G - Indoor Only" : "3G - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";

						if (dCls == "ccmsRed") {
							$("#vha-sc-3G-IO .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-3G-IO-mobile").text(dVal);
						} else if (dCls == "ccmsOrange") {
							$("#vha-sc-3G-IO .vha-sc-coverageStatus").addClass("CSOrange");
							$("#vha-sc-3G-IO-mobile").text(dVal);
						} else {
							$("#vha-sc-3G-IO .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-3G-IO-mobile").text(dVal);
						}

                        m = MapShed.Mobile.m4G;
                        var dVal = m.indoor == true && m.outdoor == true ? "4G - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "4G - Outdoor Only" : m.indoor == true && m.outdoor == false ? "4G - Indoor Only" : "4G - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        if (dCls == "ccmsRed") {
							$("#vha-sc-4G-IO .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-4G-IO-mobile").text(dVal);
						} else if (dCls == "ccmsOrange") {
							$("#vha-sc-4G-IO .vha-sc-coverageStatus").addClass("CSOrange");
							$("#vha-sc-4G-IO-mobile").text(dVal);
						} else {
							$("#vha-sc-4G-IO .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-4G-IO-mobile").text(dVal);
						}

                        m = MapShed.Mobile.m5G;
                        var dVal = m.indoor == true && m.outdoor == true ? "5G - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "5G - Outdoor Only" : m.indoor == true && m.outdoor == false ? "5G - Indoor Only" : "5G - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        if (dCls == "ccmsRed") {
							$("#vha-sc-5G-O .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-5G-O-mobile").text(dVal);
						} else if (dCls == "ccmsOrange") {
							$("#vha-sc-5G-O .vha-sc-coverageStatus").addClass("CSOrange");
							$("#vha-sc-5G-O-mobile").text(dVal);
						} else {
							$("#vha-sc-5G-O .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-5G-O-mobile").text(dVal);
						}


                        m = MapShed.Mobile.m5GNSA;
                        var dVal = m.indoor == true && m.outdoor == true ? "5G NSA - Indoor & Outdoor" : m.indoor == false && m.outdoor == true ? "5G NSA - Outdoor Only" : m.indoor == true && m.outdoor == false ? "5G NSA - Indoor Only" : "5G NSA - No coverage";
                        var dCls = m.indoor == true && m.outdoor == true ? "ccmsGreen" : m.indoor == false && m.outdoor == true ? "ccmsOrange" : m.indoor == true && m.outdoor == false ? "ccmsOrange" : "ccmsRed";
                        MapShed.FWA.f4G.is4G == true ? "ccmsGreen" : "ccmsRed";
                        if (dCls == "ccmsRed") {
							$("#vha-sc-5GNSA-NC .vha-sc-coverageStatus").addClass("CSRed");
							$("#vha-sc-5GNSA-NC-mobile").text(dVal);
						} else if (dCls == "ccmsOrange") {
							$("#vha-sc-5GNSA-NC .vha-sc-coverageStatus").addClass("CSOrange");
							$("#vha-sc-5GNSA-NC-mobile").text(dVal);
						} else {
							$("#vha-sc-5GNSA-NC .vha-sc-coverageStatus").addClass("CSGreen");
							$("#vha-sc-5GNSA-NC-mobile").text(dVal);
						}


                        break;
                    }

                });

                var nwkmsg = "";
                if (s4G == true || (s5G == true || s5Gnsa == true))
                    nwkmsg = "";
                else
                    nwkmsg = "";
				}	
				else {
					$('#vha-ign-coveragecheckresult').show();
				}
            }
			function TriggerNBNAddress_CusDas(sResp, NBNLoc) 
			{
                var sInterfaceCallBS = "Workflow Process Manager";
                var WFProcessName = "VHA Generic VBC";
                var BOMap = "VHA VBC Generic";
                var BO = "VHA VBC Generic";
                var BCMap = "List Of Values";
                var BC = "VF Transaction Settings";
                var sIntCallInputs = SiebelApp.S_App.NewPropertySet();
                var sIntCallOutputs = SiebelApp.S_App.NewPropertySet();

                var ser = SiebelApp.S_App.GetService(sInterfaceCallBS);
                //var propName = Inputs.GetFirstProperty();
                sIntCallInputs.SetProperty("Service Name", sInterfaceCallBS);
                sIntCallInputs.SetProperty("Method Name", "Run Process");

                //sIntCallInputs.SetProperty("SessionId",sessionId);
                sIntCallInputs.SetProperty("ProcessName", WFProcessName);
                sIntCallInputs.SetProperty("BusObjectMap", BOMap);
                sIntCallInputs.SetProperty("BusObject", BO);
                sIntCallInputs.SetProperty("BusCompMap", BCMap);
                sIntCallInputs.SetProperty("BusComp", BC);
                sIntCallInputs.SetProperty("ManualSearch", 'Y');
                sIntCallInputs.SetProperty("TransactionName", "VHA NBN Query Address");
                sIntCallInputs.SetProperty("TransactionType", "VBC_QUERY");
                sIntCallInputs.SetProperty("LOVType", "VHA_NBN_TOUCHPOINT");

                if (NBNLoc == "" || NBNLoc == undefined) {
                    var sRespUnitType = sResp.address.properties.complex_unit_type;
                    var sRespUnitIden = sResp.address.properties.complex_unit_identifier;
                    var sRespComType = sResp.address.properties.complex_level_type;
                    var sStreet1 = sResp.address.properties.street_number_1;
                    var sStreet2 = sResp.address.properties.street_number_2;
                    var sLotIden = sResp.address.properties.lot_identifier;

                    var sFloorType = (sRespUnitType !== null) ? sRespUnitType : (sRespUnitIden !== null) ? "Unit" : sRespComType;
                    var sFloor = (sRespUnitType !== null) ? sRespUnitIden : (sRespUnitIden !== null) ? sRespUnitIden : sRespComType;
                    var sStreetNum = (sStreet1 === null) ? "LOT" + sLotIden : (sStreet2 !== null) ? sStreet1 + "-" + sStreet2 : sStreet1;

                    sFloorType = (sFloorType != null) ? mCamelCase(sFloorType) : "";
                    sFloor = (sFloor != null) ? mCamelCase(sFloor) : "";

                    var sSuburb = sResp.address.properties.locality_name;
                    var sStreetName = sResp.address.properties.street_name;
                    var sStreetType = sResp.address.properties.street_type_description;
                    var sBuildingName = sResp.address.properties.site_name;
                    var sUnitType = sFloorType;
                    var sUnitNumber = sFloor;
                    var sBuildingNumber = sStreetNum;
                    var sPostcode = sResp.address.properties.postcode;
                    var sState = sResp.address.properties.state_territory;
					
					sSuburb = (sSuburb != null) ? sSuburb : "";
					sStreetName = (sStreetName != null) ? sStreetName : "";
					sStreetType = (sStreetType != null) ? sStreetType : "";
					sBuildingName = (sBuildingName != null) ? sBuildingName : "";
                    sStreetType = (sStreetType != null) ? mCamelCase(sStreetType) : "";
                    sRespUnitType = (sRespUnitType != null) ? mCamelCase(sRespUnitType) : "";
                    sRespComType = (sRespComType != null) ? mCamelCase(sRespComType) : "";

                    function mCamelCase(str) {
                        var sWrdsArr = str.split(' ');
                        str = "";
                        $.each(sWrdsArr, function (ind, val) {
                            if (ind != 0)
                                str = str + " " + val[0].toUpperCase() + val.toLowerCase().substring(1);
                            else
                                str = str + val[0].toUpperCase() + val.toLowerCase().substring(1);
                        });
                        return str;
                    }
					
					sIntCallInputs.SetProperty("Value", "VHANBNAddressMapQASNewCustomer");
                    sIntCallInputs.SetProperty("PropSet1", sSuburb);
                    sIntCallInputs.SetProperty("PropSet2", sStreetName);
                    sIntCallInputs.SetProperty("PropSet3", sStreetType);
                    sIntCallInputs.SetProperty("PropSet4", sBuildingName);
                    sIntCallInputs.SetProperty("PropSet5", sUnitType);
                    sIntCallInputs.SetProperty("PropSet6", sUnitNumber);
                    sIntCallInputs.SetProperty("PropSet7", sBuildingNumber);
                    sIntCallInputs.SetProperty("PropSet8", sPostcode);
                    sIntCallInputs.SetProperty("PropSet9", sState);
                    sIntCallInputs.SetProperty("PropSet10", "");
                    sIntCallInputs.SetProperty("PropSet11", "");
                    sIntCallInputs.SetProperty("PropSet12", "");
                    sIntCallInputs.SetProperty("PropSet13", "");
                    sIntCallInputs.SetProperty("PropSet14", "");
                    sIntCallInputs.SetProperty("PropSet15", "");
                    sIntCallInputs.SetProperty("PropSet16", "");
					
                    var ser = SiebelApp.S_App.GetService("VF BS Process Manager");
					//sIntCallInputs = SiebelApp.S_App.NewPropertySet();
                    sIntCallInputs.SetProperty("Service Name", "VHA Sales Calculator BS");
                    sIntCallInputs.SetProperty("Method Name", "VHAOneSQRESTAPI");
                    sIntCallInputs.SetProperty("PropSet27", "XYZ");
                    sIntCallInputs.SetProperty("PropSet26", "Addr");					
                    sIntCallInputs.SetProperty("PropSet10", sResp.address.properties.street_number_1);					
                    sIntCallInputs.SetProperty("PropSet23", sResp.address.properties.address_identifier);					
                    sIntCallInputs.SetProperty("PropSet24", sResp.address.geometry.coordinates[1]);					
                    sIntCallInputs.SetProperty("PropSet25", sResp.address.geometry.coordinates[0]);					
                    var OutputsResp = ser.InvokeMethod("Run Process", sIntCallInputs);  
					//OutputsResp.childArray[0].propArray.PriorityNetwork;
					//streetNumber + streetName +  streetType + state
					//OutputsResp.childArray[0].propArray.primaryAccessTechnology
					
					$('#servClass').text(OutputsResp.childArray[0].propArray.ServiceClass);
					$('#Techval').text(OutputsResp.childArray[0].propArray.AccessTech);
					var CustNBN = OutputsResp.childArray[0].propArray.CustNBN;
					var NBNwithAU = OutputsResp.childArray[0].propArray.NBNwithAU;
					var PriorityNetwork = OutputsResp.childArray[0].propArray.PriorityNetwork;
					var NBNAddress = OutputsResp.childArray[0].propArray.NBNAddress;
					var NBNAvlWholeSaler = OutputsResp.childArray[0].propArray.NBNAvlWholeSaler;
					var AccessTech = OutputsResp.childArray[0].propArray.AccessTech;
					var LocID = OutputsResp.childArray[0].propArray.LocID;
					var serviceabilityClass = OutputsResp.childArray[0].propArray.serviceabilityClass;
					var serviceName = OutputsResp.childArray[0].propArray.serviceName;
					var ServiceClass = OutputsResp.childArray[0].propArray.ServiceClass;
					if(OutputsResp.childArray[0].propArray.CustNBN  == "Yes")
					{
						$('#fixedAvailable').text("Fixed connection is available");
					}
					else{
						$('#fixedAvailable').text("Fixed connection is not available");
					}
					
					$('#vha-sc-nbn-pref-wholesal').val(OutputsResp.childArray[0].propArray.PriorityNetwork);
					$('#vha-sc-nbn-avail-on').val(OutputsResp.childArray[0].propArray.NBNwithAU);
					$('#vha-sc-nbn-new-Devcharge').val(OutputsResp.childArray[0].propArray.sNBNCharge);					
					$('#vha-sc-nbn-tech-type').val(OutputsResp.childArray[0].propArray.AccessTech);
					$('.vha-sc-nbnloc-val').val(OutputsResp.childArray[0].propArray.LocID);
					$('#vha-sc-avail-wholesal').val(OutputsResp.childArray[0].propArray.NBNAvlWholeSaler);					
					$('.vha-sc-nbnaddr-val').val(OutputsResp.childArray[0].propArray.NBNAddress);

				}
				
			} 
			function TriggerNBNAddress(sResp, NBNLoc) {
					//var service = SiebelApp.S_App.GetService("QAS WSDL");
					//var inPS = SiebelApp.S_App.NewPropertySet();
					//if (service) {
						var psmaResponce = sResp;
						var sSuburb = sResp.address.properties.locality_name;
						var sStreetName = sResp.address.properties.street_name;
						var sStreetType = sResp.address.properties.street_type; 
						var sBuildingName = "";
						var sUnitType = sResp.address.properties.complex_unit_type;
						var sUnitNumber = sResp.address.properties.complex_unit_identifier;
						var sBuildingNumber = "";
						var sPostcode = sResp.address.properties.postcode;
						var sState = sResp.address.properties.state_territory;
						//SBBAU-added for R1.1.hotfix COT  Unit Addr -Start
						var sFreeformaddressline1 = sResp.address.properties.formatted_address;
						var sLotNumber = sResp.address.properties.lot_identifier;
						var sPlanNumber = "";
						var sUnitType1 = sResp.address.properties.complex_unit_type;
						var sUnitNumber1 = sResp.address.properties.complex_unit_identifier;						
						var sSecondarySiteBuildingName = "";
						var sSecondaryRoadNumber1 = "";
						var sSecondaryRoadNumber2 = "";
						var sSecondaryRoadName = "";
						var sSecondaryRoadTypeCode = "";
						var sSecondaryRoadSuffixCode = "";
						var sDPID = "";
						var sLatitude = sResp.address.geometry.coordinates[0];
						var sLongitude = sResp.address.geometry.coordinates[1];
						//	SBBAU-added for R1.1.hotfix COT  Unit Addr-End					
						var sInterfaceCallBS = "Workflow Process Manager";
						//var WFProcessName = "VHA Generic VBC";
					    var WFProcessName = "VHA OneSQ REST API Process";
						var BOMap = "VHA VBC Generic";
						var BO = "VHA VBC Generic";
						var BCMap = "List Of Values";
						var BC = "VF Transaction Settings";
						var sIntCallInputs = SiebelApp.S_App.NewPropertySet();
						var sIntCallOutputs = SiebelApp.S_App.NewPropertySet();

						var ser = SiebelApp.S_App.GetService(sInterfaceCallBS);
						//var propName = Inputs.GetFirstProperty();
						sIntCallInputs.SetProperty("Service Name", sInterfaceCallBS);
						sIntCallInputs.SetProperty("Method Name", "Run Process");


						//sIntCallInputs.SetProperty("SessionId",sessionId);
						sIntCallInputs.SetProperty("ProcessName", WFProcessName);
						sIntCallInputs.SetProperty("BusObjectMap", BOMap);
						sIntCallInputs.SetProperty("BusObject", BO);
						sIntCallInputs.SetProperty("BusCompMap", BCMap);
						sIntCallInputs.SetProperty("BusComp", BC);
						sIntCallInputs.SetProperty("ManualSearch", 'Y');
						//sIntCallInputs.SetProperty("TransactionName", "VHA NBN Query Address");
						sIntCallInputs.SetProperty("TransactionType", "VBC_QUERY");
						sIntCallInputs.SetProperty("LOVType", "VHA_NBN_TOUCHPOINT");
						sIntCallInputs.SetProperty("Value", "VHANBNAddressMapQASNewCustomer");

						
						if (typeof psmaResponce !== 'undefined' && psmaResponce.address) {
							sIntCallInputs.SetProperty("longitude", psmaResponce.address.geometry?.coordinates?.[0] || "");
							sIntCallInputs.SetProperty("latitude", psmaResponce.address.geometry?.coordinates?.[1] || "");
							sIntCallInputs.SetProperty("GnafPid", psmaResponce.address.properties?.address_identifier || "");
							SiebelApp.S_App.SetProfileAttr("SwitchToFWAGnafId",psmaResponce.address.properties?.address_identifier);
						} else {
							console.error("psmaResponce is undefined or does not contain an address");
							sIntCallInputs.SetProperty("longitude","");
							sIntCallInputs.SetProperty("latitude","");
							sIntCallInputs.SetProperty("GnafPid","");
						}
						
						sIntCallInputs.SetProperty("suburb", sSuburb);
						sIntCallInputs.SetProperty("streetName", sStreetName);
						sIntCallInputs.SetProperty("streetType", sStreetType);
						sIntCallInputs.SetProperty("buildingName", sBuildingName);
						sIntCallInputs.SetProperty("unitType", sUnitType);
						sIntCallInputs.SetProperty("unitNumber", sUnitNumber);
						//	SBBAU-added for R1.1.hotfix COT  Unit Addr-Start
						/*if(SiebelApp.S_App.GetProfileAttr("ManageServicesSubType") == "Change Technology")
						{
							sIntCallInputs.SetProperty("unitType", sUnitType1);
							sIntCallInputs.SetProperty("unitNumber", sUnitNumber1);							
						}*/
						//	SBBAU-added for R1.1.hotfix COT  Unit Addr-End
						//sIntCallInputs.SetProperty("buildingLevelNumber", sBuildingNumber);
						sIntCallInputs.SetProperty("streetNumber", sBuildingNumber);
						sIntCallInputs.SetProperty("postcode", sPostcode);
						sIntCallInputs.SetProperty("state", sState);
						sIntCallInputs.SetProperty("streetNumber2", "");
						sIntCallInputs.SetProperty("streetTypeSuffix", "");
						sIntCallInputs.SetProperty("complexRoadName", "");
						sIntCallInputs.SetProperty("complexRoadTypeCode", "");
						sIntCallInputs.SetProperty("secondaryComplexName", "");
						sIntCallInputs.SetProperty("complexRoadNumber1", "");
						sIntCallInputs.SetProperty("complexRoadNumber2", "");
						sIntCallInputs.SetProperty("complexRoadSuffixCode", "");
						sIntCallInputs.SetProperty("buildingLevelType", "");
						sIntCallInputs.SetProperty("planNumber", "");						
						sIntCallInputs.SetProperty("TransactionName", "VHAOneSQRESTAPI"); 
						sIntCallInputs.SetProperty("MapName", "VHA OneSQ REST API Response Map");						
						sIntCallInputs.SetProperty("FlowName", "SQ");
						sIntCallInputs.SetProperty("OutputIntObjectName", "VHAOneSQRESTAPIIO");
						sIntCallInputs.SetProperty("FlowOneSQ","Addr");
						//sIntCallInputs.SetProperty("SessionId",SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Customer Details TBC").GetFieldValue("Id"));
						sIntCallInputs.SetProperty("SessionId","");
						
						
						var sNetwork = "NBN";						
						/*if (SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "Kogan"){
							sNetwork = "NBN";
						}	
						if($('[aria-labelledby*="VHA_NBN_Retrieve_Plans"]').is(":checked") == true){
							sNetwork = "NBN";							
						}			
						if(SiebelApp.S_App.GetProfileAttr("OverrideNetworkFlag") == "Y")
						   {
							   sNetwork = SiebelApp.S_App.GetProfileAttr("OverrideNetwork");
								SiebelApp.S_App.SetProfileAttr("OverrideNetworkFlag","N");
						   }*/
						sIntCallInputs.SetProperty("serviceName", sNetwork);
						
						
						
						if(SiebelApp.S_App.GetProfileAttr("MultiaddLocID") != "")
						{
							sIntCallInputs.SetProperty("NBN Location Id", SiebelApp.S_App.GetProfileAttr("MultiaddLocID"));
							TheApplication().SetProfileAttr("PickLocId", SiebelApp.S_App.GetProfileAttr("MultiaddLocID"))
							
								//SiebelApp.S_App.SetProfileAttr("Street Road Number1",$(this).attr("data-lid"));								
								
								sIntCallInputs.SetProperty("suburb", SiebelApp.S_App.GetProfileAttr("Locality Suburb Name"));
								sIntCallInputs.SetProperty("streetName", SiebelApp.S_App.GetProfileAttr("Street Road Name"));
								sIntCallInputs.SetProperty("streetType", sStreetType);
								sIntCallInputs.SetProperty("buildingName", sBuildingName);
								sIntCallInputs.SetProperty("unitType", SiebelApp.S_App.GetProfileAttr("Unit Type"));
								sIntCallInputs.SetProperty("unitNumber", SiebelApp.S_App.GetProfileAttr("Unit Number"));
								sIntCallInputs.SetProperty("streetNumber", SiebelApp.S_App.GetProfileAttr("Street Road Number1"));
								sIntCallInputs.SetProperty("postcode", SiebelApp.S_App.GetProfileAttr("Post Code"));
								sIntCallInputs.SetProperty("state", SiebelApp.S_App.GetProfileAttr("State Territory Code"));
								sIntCallInputs.SetProperty("allotmentNumber", SiebelApp.S_App.GetProfileAttr("Lot Number"));
								
								sIntCallInputs.SetProperty("streetNumber", SiebelApp.S_App.GetProfileAttr("Secondary Road Number"));
								sIntCallInputs.SetProperty("streetName", SiebelApp.S_App.GetProfileAttr("Secondary Road Name"));
								sIntCallInputs.SetProperty("streetType", SiebelApp.S_App.GetProfileAttr("Secondary Road Type Code"));
								sIntCallInputs.SetProperty("secondaryComplexName", SiebelApp.S_App.GetProfileAttr("Secondary Site Building Name"));
								sIntCallInputs.SetProperty("buildingLevelType", SiebelApp.S_App.GetProfileAttr("Level Type"));
								sIntCallInputs.SetProperty("buildingLevelNumber", SiebelApp.S_App.GetProfileAttr("Level Number"));
								
						}
						//Expiring Session
						var sSessionId = "";
						var sbs = SiebelApp.S_App.GetService("VF BS Process Manager");
						var nInputs = SiebelApp.S_App.NewPropertySet();
						nInputs.SetProperty("Service Name", "VHA Update Session"); 
						nInputs.SetProperty("SessionId", sSessionId);
						nInputs.SetProperty("Method Name", "UpdateSession");
						var ROups = sbs.InvokeMethod("Run Process", nInputs);						
						
						sIntCallOutputs = ser.InvokeMethod("RunProcess", sIntCallInputs);
						//var multiLocID = sIntCallOutputs.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).childArray[0].propArray["NBN Location Id"];
						if(SiebelApp.S_App.GetProfileAttr("MultiAddr") == 'Y' && SiebelApp.S_App.GetProfileAttr("MultiaddLocID") == "")
						{
							var multiAddData = sIntCallOutputs.GetChild(0).GetChild(0).GetChild(0).GetChild(0).GetChild(0).childArray;
							if(multiAddData != undefined)
							{
								var selectth = '<div class="main-bg-grey mt-5 pt-3 mutiAddressPopup" id="HomeAuthent" style="z-index: 9999;position: relative;"><div id="table-myModal" class="modal"><div class="table-modal-content" style="height:80%;overflow-y: scroll;"><h4 class="fs-1 pb-4 pl-4"><strong>Select a Address</strong></h4><div><span class="vha-popup-close mt-n65px mt-1 ml-668px vhaAddressClose" id="vha-ret-table-close-btn">X</span></div><div class="fs-1 fw-bold pb-4 ll-4"></div><table class="table table-bordered width-80p bg-white vha-ret-table-authen"><thead><tr><th>Address</th><th>Network</th><th>Location ID</th><th>Select</th></tr></thead><tbody></tbody></table><button class="skip vha-ret-popup-close-btn-home vhaAddressClose" id="vha-cont-prof-skipbtn-home">Cancel</button></div></div></div>';
								
								$('body').append(selectth);
								
								$.each(multiAddData, function (index, item) {
									 var row = $("<tr class='siebui-form' data-index='0' data-item=''>").attr("data-index", index);
									 
									 
									 
									 if(item.propArray['NBN Location Id'].substring(0, 3) == "LOC"){ var networkName = "NBN" }
									 else if(item.propArray['NBN Location Id'].substring(0, 3) == "OPC"){ var networkName = "OPTICOMM" }
									 else{ var networkName = "VISION" }
									 
									 
									 var multiUnitType = item.propArray['Unit Type'] !== undefined ? item.propArray['Unit Type'] : "";
									 var multiUnitNum = item.propArray['Unit Number'] !== undefined ? item.propArray['Unit Number']+", " : "";
									  var multiUnitNumber = item.propArray['Unit Number'] !== undefined ? item.propArray['Unit Number'] : "";
									 var multiStNum = item.propArray['Street Road Number1'] !== undefined ? item.propArray['Street Road Number1'] : "";
									 var multiStName = item.propArray['Street Road Name'] !== undefined ? item.propArray['Street Road Name'] : "";
									 var multiStRdType = item.propArray['Street Road Type Code'] !== undefined ? item.propArray['Street Road Type Code']+", " : "";
									 var multiSubrub = item.propArray['Locality Suburb Name'] !== undefined ? item.propArray['Locality Suburb Name'] : "";
									 var multiStTeritCode = item.propArray['State Territory Code'] !== undefined ? item.propArray['State Territory Code'] : "";
									 var multiPostCode = item.propArray['Post Code'] !== undefined ? item.propArray['Post Code'] : "";
									 var multiLotNum = item.propArray['Lot Number'] !== undefined ? "Lot "+item.propArray['Lot Number']+", " : "";
									 var multiLotNumber = item.propArray['Lot Number'] !== undefined ? item.propArray['Lot Number']: "";
									 var multiLevelType = item.propArray['Level Type'] !== undefined ? item.propArray['Level Type'] : "";									 
									 var multiLevelNum = item.propArray['Level Number'] !== undefined ? item.propArray['Level Number'] : "";
									 if(multiLevelType != "" && multiLevelNum !=""){
									  var multiLevel = "("+multiLevelType+multiLevelNum+ ")";
									 }else if(multiLevelType == "" &&  multiLevelNum !="")
									 {
										 var multiLevel = "("+multiLevelType+ ")";
									 }
									 else if(multiLevelType != "" &&  multiLevelNum =="")
									{
										var multiLevel = "("+multiLevelNum+ ")";
									}
									else{
										var multiLevel = "";
									}
									 var multiAddSiteBuildName = item.propArray['Address Site Building Name'] !== undefined ? item.propArray['Address Site Building Name'] : "";
									 var multiSecRoadNum1 = item.propArray['Secondary Road Number1'] !== undefined ? item.propArray['Secondary Road Number1'] : "";
									 var multiSecRoadNum2 = item.propArray['Secondary Road Number2'] !== undefined ? "-"+item.propArray['Secondary Road Number2']+", ": "";
									 var mulSecroadNumber = multiSecRoadNum1 + multiSecRoadNum2;
									 var multiSecRoadName = item.propArray['Secondary Road Name'] !== undefined ? item.propArray['Secondary Road Name'] : "";
									 var multiSecRoadTypeCode = item.propArray['Secondary Road Type Code'] !== undefined ? item.propArray['Secondary Road Type Code']+", " : "";
									 var multiSecSiteBuildName = item.propArray['Secondary Site Building Name'] !== undefined ? item.propArray['Secondary Site Building Name'] : "";
									 
									 row.append($("<td style='vertical-align:middle'>").text(multiUnitType +" "+multiUnitNum+multiLotNum+multiStNum +" "+multiStName+" "+multiStRdType+multiSubrub+" "+multiStTeritCode+" "+multiPostCode+mulSecroadNumber+" "+multiSecRoadName+" "+multiSecRoadTypeCode+" "+multiSecSiteBuildName+" "+multiLevel));
									 
									 //$.unitTypeCode + $.unitNumber + $.levelTypeCode + $.levelNumber + $.roadNumber1 + '-' + $.roadNumber2 + $.roadName + $.roadTypeCode + ',' + $.localityName + ',' + $.stateTerritoryCode
									 
									 row.append($("<td style='vertical-align:middle'>").text(networkName));
									 row.append($("<td style='vertical-align:middle'>").text(item.propArray['NBN Location Id']));
									 row.append($("<td class='mceField'><button type='button' class='siebui-ctrl-btn siebui-icon-selectAddress  appletButton multiSelectBtn' data-lid='"+item.propArray['NBN Location Id']+"' data-sroadn1='"+multiStNum+"' data-sroadn='"+multiStName+"' data-subrub='"+multiSubrub+"' data-utype='"+multiUnitType+"' data-unumber='"+multiUnitNumber+"' data-stcode='"+multiStTeritCode+"' data-sttypecode='"+multiStRdType+"'  data-pocode='"+multiPostCode+"' data-lotNum='"+multiLotNumber+"'  data-secRdNum='"+mulSecroadNumber+"' data-multiSecRoadTypeName='"+multiSecRoadName+"'  data-multiSecRoadTypeCode='"+multiSecRoadTypeCode+"' data-multisecBuildName='"+multiSecSiteBuildName+"'   data-multisecLevelType='"+multiLevelType+"'     data-multisecLevelNum='"+multiLevelNum+"'  id='multiSelectAddBtn' name='Select' data-display='Select' tabindex='0' title='Select' aria-label='Select' ><span>Select</span></button>"));
																					 
									 $(".vha-ret-table-authen tbody").append(row);
								});
							
								//$('body').append(selectth);
								
								$(".vhaAddressClose").on("click", function () {
									$(".mutiAddressPopup").addClass("displaynone");
									$('.mutiAddressPopup').remove();
								});
								$('.multiSelectBtn').on('click',function(){
									$(".mutiAddressPopup").addClass("displaynone");
									//updateSelectedNBNAddress($(this).attr("data-lid"));
									$('.mutiAddressPopup').remove();
									SiebelApp.S_App.SetProfileAttr("MultiaddLocID",$(this).attr("data-lid"));
									
									SiebelApp.S_App.SetProfileAttr("Street Road Number1",$(this).attr("data-sroadn1"));
									SiebelApp.S_App.SetProfileAttr("Street Road Name",$(this).attr("data-sroadn"));
									SiebelApp.S_App.SetProfileAttr("Locality Suburb Name",$(this).attr("data-subrub"));
									SiebelApp.S_App.SetProfileAttr("State Territory Code",$(this).attr("data-stcode"));
									SiebelApp.S_App.SetProfileAttr("Unit Type",$(this).attr("data-utype"));
									SiebelApp.S_App.SetProfileAttr("Unit Number",$(this).attr("data-unumber"));
									SiebelApp.S_App.SetProfileAttr("Post Code",$(this).attr("data-pocode"));
									SiebelApp.S_App.SetProfileAttr("Street Road Type Code",$(this).attr("data-sttypecode"));
									
									SiebelApp.S_App.SetProfileAttr("Lot Number",$(this).attr("data-lotNum"));
									//SiebelApp.S_App.SetProfileAttr("Secondary Road Number1",$(this).attr("data-secRdNum1"));
									SiebelApp.S_App.SetProfileAttr("Secondary Road Number",$(this).attr("data-mulSecroadNumber"));
									SiebelApp.S_App.SetProfileAttr("Secondary Road Name",$(this).attr("data-multiSecRoadTypeName"));
									SiebelApp.S_App.SetProfileAttr("Secondary Road Type Code",$(this).attr("data-multiSecRoadTypeCode"));
									SiebelApp.S_App.SetProfileAttr("Secondary Site Building Name",$(this).attr("data-multisecBuildName"));
									SiebelApp.S_App.SetProfileAttr("Level Type",$(this).attr("data-multisecLevelNum"));
									SiebelApp.S_App.SetProfileAttr("Level Number",$(this).attr("data-sttypecode"));
									
									
									TriggerNBNAddress();
								})
						
							}
						}
						else if(SiebelApp.S_App.GetProfileAttr("MultiaddLocID") != "")
						{
							SiebelApp.S_App.SetProfileAttr("MultiaddLocID", "");
							updateSelectedNBNAddress(sIntCallOutputs);
							var svcUI = TheApplication().GetService("FINS Teller UI Navigation");
							var psIn = TheApplication().NewPropertySet();
							var psOut = TheApplication().NewPropertySet();
							psIn.SetProperty("Refresh All","Y");
							svcUI.InvokeMethod("RefreshCurrentApplet",psIn,psOut);
							
							$('[data-display="Coverage Check"]').click();
						}
						else{
							//var emptyparam = '';
							updateSelectedNBNAddress(sIntCallOutputs);
							
							var svcUI = TheApplication().GetService("FINS Teller UI Navigation");
							var psIn = TheApplication().NewPropertySet();
							var psOut = TheApplication().NewPropertySet();
							psIn.SetProperty("Refresh All","Y");
							svcUI.InvokeMethod("RefreshCurrentApplet",psIn,psOut);
							
							$('[data-display="Coverage Check"]').click();
						}

						SiebelApp.S_App.SetProfileAttr("GeoAPICalled", "");
						SiebelApp.S_App.SetProfileAttr("GeoSQId", "");
						SiebelApp.S_App.SetProfileAttr("GeoNetwork", "");						
						var sBO = SiebelApp.S_App.GetActiveBusObj();
						var sBC = sBO.GetBusCompByName("VHA Site Qualification BC");
						var sSQId = sBC.GetFieldValue("Id");
						var sConfirmedNetwork = sBC.GetFieldValue("OneSQConfirmedNetwork");
						if(sSQId!= "" && (sConfirmedNetwork== "NBN" || sConfirmedNetwork== "OPTICOMM")){
							SiebelApp.S_App.SetProfileAttr("GeoAPICalled", "Y"); 
							SiebelApp.S_App.SetProfileAttr("GeoSQId", sSQId);
							SiebelApp.S_App.SetProfileAttr("GeoNetwork", sConfirmedNetwork);
						}
						if (sConfirmedNetwork =="VISION")
						{
						 SiebelApp.S_App.SetProfileAttr("BRECallExecuted", "Y"); 
						}
												
					//}
				}
				function updateSelectedNBNAddress(SelectedLOCId) {
					var SelectedNBNAddressList = VHAAppUtilities.GetConstants("NBNAddressList");
					var SelectedNBNAddressListLen = SelectedNBNAddressList.length;
					var SelectedNBNAddress = {};
					for (var i = 0; i < SelectedNBNAddressListLen; i++) {
						if (SelectedNBNAddressList[i]["NBN Location Id"] === SelectedLOCId) {
							SelectedNBNAddress = SelectedNBNAddressList[i];
							break;
						}
					}
					//Added the below block for April5 fix
					SelectedLOCId = getQueryAddressPropArray(SelectedLOCId);
					function getQueryAddressPropArray(obj) {
						  let result = null;

						  function search(node) {
							if (node?.type === 'ListOfVHA NBN Query Address' && Array.isArray(node.childArray)) {
							  for (const child of node.childArray) {
								if (child?.type === 'VHA NBN Query Address') {
								  result = child.propArray || [];
								  return;
								} else if (child?.childArray) {
								  search(child); 
								  if (result) return;
								}
							  }
							}


							if (Array.isArray(node?.childArray)) {
							  for (const child of node.childArray) {
								search(child);
								if (result) return;
							  }
							}
						  }

						  search(obj);
						  return result;
						}
					
					var Inputs = VHAAppUtilities.CreateSiebelPropertySet(SelectedNBNAddress);
					if(SelectedLOCId !== undefined && SelectedLOCId !== null)
					{
						Inputs.SetProperty("SessionId", getSessionId());
						if(SelectedLOCId["NBN Address Freeform Line1"] !== undefined && SelectedLOCId["NBN Address Freeform Line1"] !== "")
						{
						Inputs.SetProperty("NBN Address", SelectedLOCId["NBN Address Freeform Line1"]);
						}
						if(SelectedLOCId["NBN Location Id"] !== undefined && SelectedLOCId["NBN Location Id"] !== "")
						{
						Inputs.SetProperty("NBN Location Id", SelectedLOCId["NBN Location Id"]);
						}
						Inputs.SetProperty("Address Geography Code","");
						if(SelectedLOCId["Address Site Building Name"] !== undefined && SelectedLOCId["Address Site Building Name"] !== "")
						{
						Inputs.SetProperty("Address Site Building Name", SelectedLOCId["Address Site Building Name"]);
						}
						if(SelectedLOCId["Latitude"] !== undefined && SelectedLOCId["Latitude"] !== "")
						{
						Inputs.SetProperty("Latitude", SelectedLOCId["Latitude"]);
						}
						if(SelectedLOCId["Level Number"] !== undefined && SelectedLOCId["Level Number"] !== "")
						{
						Inputs.SetProperty("Level Number", SelectedLOCId["Level Number"]);
						}
						if(SelectedLOCId["Level Type"] !== undefined && SelectedLOCId["Level Type"] !== "")
						{
						Inputs.SetProperty("Level Type", SelectedLOCId["Level Type"]);
						}
						if(SelectedLOCId["Locality Suburb Name"] !== undefined && SelectedLOCId["Locality Suburb Name"] !== "")
						{
						Inputs.SetProperty("Locality Suburb Name", SelectedLOCId["Locality Suburb Name"]);
						}
						Inputs.SetProperty("Location Descriptor", "");
						if(SelectedLOCId["Longitude"] !== undefined && SelectedLOCId["Longitude"] !== "")
						{
						Inputs.SetProperty("Longitude", SelectedLOCId["Longitude"]);
						}
						if(SelectedLOCId["Lot Number"] !== undefined && SelectedLOCId["Lot Number"] !== "")
						{
						Inputs.SetProperty("Lot Number", SelectedLOCId["Lot Number"]);
						}
						if(SelectedLOCId["Plan Number"] !== undefined && SelectedLOCId["Plan Number"] !== "")
						{
						Inputs.SetProperty("Plan Number", SelectedLOCId["Plan Number"]);
						}
						if(SelectedLOCId["Post Code"] !== undefined && SelectedLOCId["Post Code"] !== "")
						{
						Inputs.SetProperty("Post Code", SelectedLOCId["Post Code"]);
						}
						Inputs.SetProperty("Premise Flag","Y");
						if(SelectedLOCId["Secondary Road Name"] !== undefined && SelectedLOCId["Secondary Road Name"] !== "")
						{
						Inputs.SetProperty("Secondary Road Name", SelectedLOCId["Secondary Road Name"]);
						}
						if(SelectedLOCId["Secondary Road Number1"] !== undefined && SelectedLOCId["Secondary Road Number1"] !== "")
						{
						Inputs.SetProperty("Secondary Road Number1", SelectedLOCId["Secondary Road Number1"]);
						}
						if(SelectedLOCId["Secondary Road Number2"] !== undefined && SelectedLOCId["Secondary Road Number2"] !== "")
						{
						Inputs.SetProperty("Secondary Road Number2", SelectedLOCId["Secondary Road Number2"]);
						}
						if(SelectedLOCId["Secondary Road Suffix Code"] !== undefined && SelectedLOCId["Secondary Road Suffix Code"] !== "")
						{
						Inputs.SetProperty("Secondary Road Suffix Code", SelectedLOCId["Secondary Road Suffix Code"]);
						}
						if(SelectedLOCId["Secondary Road Type Code"] !== undefined && SelectedLOCId["Secondary Road Type Code"] !== "")
						{
						Inputs.SetProperty("Secondary Road Type Code", SelectedLOCId["Secondary Road Type Code"]);
						}
						if(SelectedLOCId["Secondary Site Building Name"] !== undefined && SelectedLOCId["Secondary Site Building Name"] !== "")
						{
						Inputs.SetProperty("Secondary Site Building Name", SelectedLOCId["Secondary Site Building Name"]);
						}
						if(SelectedLOCId["State Territory Code"] !== undefined && SelectedLOCId["State Territory Code"] !== "")
						{
						Inputs.SetProperty("State Territory Code", SelectedLOCId["State Territory Code"]);
						}
						if(SelectedLOCId["Street Road Name"] !== undefined && SelectedLOCId["Street Road Name"] !== "")
						{
						Inputs.SetProperty("Street Road Name", SelectedLOCId["Street Road Name"]);
						}
						if(SelectedLOCId["Street Road Number1"] !== undefined && SelectedLOCId["Street Road Number1"] !== "")
						{
						Inputs.SetProperty("Street Road Number1", SelectedLOCId["Street Road Number1"]);
						}
						if(SelectedLOCId["Street Road Number2"] !== undefined && SelectedLOCId["Street Road Number2"] !== "")
						{
						Inputs.SetProperty("Street Road Number2", SelectedLOCId["Street Road Number2"]);
						}
						if(SelectedLOCId["Street Road Type Code"] !== undefined && SelectedLOCId["Street Road Type Code"] !== "")
						{
						var StreetType = VHAAppUtilities.GetPickListValues("", "[List Of Values.Type]='VHA_ADDRESS_STREETTYPE' AND [List Of Values.Name]='"+SelectedLOCId["Street Road Type Code"]+"' AND [List Of Values.Active]='Y'", {"All": "true"})[0].Value;
						Inputs.SetProperty("Street Road Type Code", StreetType);
						}
						if(SelectedLOCId["Street Road Type Suffix Code"] !== undefined && SelectedLOCId["Street Road Type Suffix Code"] !== "")
						{
						Inputs.SetProperty("Street Road Type Suffix Code", SelectedLOCId["Secondary Road Suffix Code"]);
						}
						if(SelectedLOCId["Unit Number"] !== undefined && SelectedLOCId["Unit Number"] !== "")
						{
						Inputs.SetProperty("Unit Number", SelectedLOCId["Unit Number"]);
						}
						if(SelectedLOCId["Unit Type"] !== undefined && SelectedLOCId["Unit Type"] !== "")
						{
						Inputs.SetProperty("Unit Type", SelectedLOCId["Unit Type"]);
						}

						var Outputs = VHAAppUtilities.CallBS("VHA Utilities BS", "InsertNBNAddress", Inputs);
						
						 /*var AssetAppletId = SiebelApp.S_App.GetActiveView().GetApplet("VHA SQ Service List Applet TBUI").GetPModel().Get("GetFullId");
						 if($('#s_' + AssetAppletId + "_div").length != 0)
						 {
							$('#s_' + AssetAppletId + "_div").removeAttr('style');
						 }
						 var AssetAppletId1 =SiebelApp.S_App.GetActiveView().GetApplet("VHA SQ Service List Toggle Applet TBUI").GetPModel().Get("GetFullId");
						 if($('#s_' + AssetAppletId1 + "_div").length != 0)
						 {
							$('#s_' + AssetAppletId1 + "_div").removeAttr('style');	
						 }*/
					}
					/*if(SiebelApp.S_App.GetProfileAttr("OverrideNetworkFlag") == "Y")
					{
						var SQApplet = SiebelApp.S_App.GetActiveView().GetApplet("VHA SQ Address Form Applet TBUI");
						var controls = SQApplet.GetControls();
						var SQBtn = controls["Site Qualification"].GetInputName();
						SiebelApp.S_App.SetProfileAttr("OverrideNetworkFlag","");
						$('[name="' + SQBtn + '"]').trigger("click");
						$("#openModal").remove();
						
					    				
					}*/
					
					
					
					//$('input[aria-label="Address"]').val(SiebelApp.S_App.GetActiveBusObj('Order Entry (Sales)').GetBusCompByName('VHA Connect FBB TBC').GetFieldValue('WSDL Address'));
					//$('div[aria-label="Service List in Order Information"] .siebui-applet').show();
				}
				//Chitra Added for upgarde OUI SQ availablity change
				
         
}

