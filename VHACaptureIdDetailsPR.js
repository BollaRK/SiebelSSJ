if (typeof(SiebelAppFacade.VHACaptureIdDetailsPR) === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHACaptureIdDetailsPR");
    define("siebel/custom/VHACaptureIdDetailsPR", ["order!siebel/phyrenderer"], function() {
        SiebelAppFacade.VHACaptureIdDetailsPR = (function() {
                function VHACaptureIdDetailsPR(pm) {
                    SiebelAppFacade.VHACaptureIdDetailsPR.superclass.constructor.call(this, pm);
                }
                SiebelJS.Extend(VHACaptureIdDetailsPR, SiebelAppFacade.PhysicalRenderer);
                VHACaptureIdDetailsPR.prototype.Init = function() {
                    SiebelAppFacade.VHACaptureIdDetailsPR.superclass.Init.call(this);
                    this.GetPM().AddMethod("FieldChange", OnFieldChange, {
                        sequence: false,
                        scope: this
                    });

                    var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VF SSJ Capture Identification Details List Applet – Postpay TBUI'];
                    if (applet) {
                        applet.GetPModel().AttachPostProxyExecuteBinding("DeleteRecord", function(methodName, inputPS, outputPS) {
                            $(".vha-ssj-dialogbox").hide();
                        }, {
                            scope: this,
                            sequence: false
                        });
                    }

                };

                function updateCounter(TotalAttempts) {
                    var viewName = SiebelApp.S_App.GetActiveView().GetName();
                    if (viewName == "VF SSJ Customer ID Details – Postpay TBUI") {
                        var appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap();
                        var applet = appletMap["VHA SSJ Postpay Capture Id Failure List Applet TBUI"];
                        if (applet) {
                            var IdType = $("input[aria-label^='Primary Id']").val() || $("input[aria-label^='Secondary Id']").val();
                            IdType = transformIdType(IdType);
                            if (IdType != "" && IdType != undefined && IdType != null) {
                                var pm = applet.GetPModel();
                                var recordSet = pm.Get("GetRecordSet");
                                if (recordSet.length > 0) {
                                    var idRecord = recordSet.filter(function(rec) {
                                        return (rec['Id Type'] == IdType)
                                    });
                                    if (idRecord != "" && idRecord != undefined && idRecord != null) {
                                        var noOfAtt = Number(idRecord[0]['VF No. Of Failed Attempts']);
                                        var remaininng = TotalAttempts - noOfAtt;
                                        $(".PrimaryIdCapture .AlertBodyText strong, .SecondaryIdCapture .AlertBodyText strong").text(remaininng);
                                    }
                                }
                            }
                        }
                    }
                }

                function transformIdType(input) {
                    if (input == null) return input;
                    var map = {
                        "Green Medicare Card": "Medicare Card"
                    };
                    return map[input] ? map[input] : input;
                }

                var isClickReqd = "TRUE";
                var ifFirstLoad = "TRUE";
                var totalAttemps = 0;
                VHACaptureIdDetailsPR.prototype.ShowUI = function() {
                    SiebelAppFacade.VHACaptureIdDetailsPR.superclass.ShowUI.call(this);
                    /*juhi 10107*/
                    var el = $("[id^=SSJScanMessage_Label]")[0];
                    var n  = el && el.nextSibling;
                    
                    if (n && n.nodeType === 3) {
                    n.nodeValue = n.nodeValue.replace(/\s*:\s*/, " ");
                    }

                    this.GetPM().AttachPostProxyExecuteBinding("AddRecord", function(methodName, inputPS, outputPS) {
                        var confirmTxt = SiebelApp.S_App.GetProfileAttr("VHAIDCombinationWarning"); // VHA Suresh P: Added to display Warning in UI for VEVO
                        if (confirmTxt != "") {
                            SiebelApp.S_App.SetProfileAttr("VHAIDCombinationWarning", "");
                            alert(confirmTxt);
                        }
                        updateCounter(totalAttemps);
                    }, {
                        scope: this,
                        sequence: false
                    });
                    this.GetPM().AttachPostProxyExecuteBinding("DVSPostpayValidation", function(methodName, inputPS, outputPS) {
                        var confirmTxt = SiebelApp.S_App.GetProfileAttr("VHAIDCombinationWarning");
                        if (confirmTxt != "") {
                            SiebelApp.S_App.SetProfileAttr("VHAIDCombinationWarning", "");
                            alert(confirmTxt);
                        }
                    }, {
                        scope: this,
                        sequence: false
                    });

                    var pm = this.GetPM();

                    showImage(pm);
                    $('.sCountryFields').closest('tr').addClass('VFDisplayNone');
                    $('.sCountryFieldHide').each(function() {
                        var sParentDiv = $(this).closest('tr');
                        var sNextTrs = sParentDiv.nextAll();
                        sNextTrs.each(function() {
                            if ($(this).hasClass('sCountryFields')) {
                                return false;
                            } else
                                $(this).addClass('VFDisplayNone');

                        });

                    });

                    var pm = this.GetPM();
                    var controls = pm.Get("GetControls");
                    var primName = controls["IdType"] && controls["IdType"].GetInputName();
                    var secName = controls["SecondaryIdType"] && controls["SecondaryIdType"].GetInputName();

                    var primVal = primName ? $('[name=' + primName + ']').val() : "";
                    var secVal = secName ? $('[name=' + secName + ']').val() : "";

                    if ((primVal === "Green Medicare Card" || secVal === "Green Medicare Card") && SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI") {
                        mAddSequence(pm);
                    }

                    //if($('[aria-labelledby="IdType_Label"]').val() == "Green Medicare Card")  /*TULASIY:15-09-2022::Added for upgrade 22.7 issues*/
                    if ($('[name=' + this.GetPM().Get("GetControls")["IdType"].GetInputName() + ']').val() == "Green Medicare Card" && SiebelApp.S_App.GetActiveView().GetName() != "VF SSJ Customer ID Details – Postpay TBUI")
                        mAddSequence(pm);
                    if (SiebelApp.S_App.GetActiveView().GetName() == "VF Customer ID Details – Postpay TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF Customer ID Details – PretoPost TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF Select Service View - TBUI") {
                        var sIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA Postpay Add Identification TBC").GetFieldValue("Primary ID Type");

                        if (sIdType == "")
                            sIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA Postpay Add Identification TBC").GetFieldValue("Secondary ID Type");
                        if (sIdType == "Passport") {
                            mAddSequence(pm);
                        }
                    } // VHA Suresh P: Added to default the sequence.

                    //KT 23/01/26: Added below lines for defect CM-7206
                    if (SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI") {
                        let ppLimit = Number(VHAAppUtilities.GetPickListValues("", "[List Of Values.Type]='VF_CR_ENABLE_FLAG' AND [List Of Values.Name]='DVS Postpay Limit' AND [List Of Values.Active]='Y'", "")[0]);
                        totalAttemps = ppLimit;
                        $('.vha-ssj-info-pass').siblings('strong').text(ppLimit);
                        setTimeout(updateCounter, 500, totalAttemps);
                    }
					//rajud:20/03/2026: CM-9503
					setTimeout(function () {
						var vCapIdAppId;
						var vApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()['VF SSJ Capture Identification Details List Applet – Postpay TBUI'];
						if(vApplet)
						{
							vCapIdAppId = vApplet.GetFullId();
							
						}

						if (vCapIdAppId != null) {
							$('#' + vCapIdAppId).find('form .NotSelected').addClass('vha-ssj-oh');
						}
					}, 2000);
                }

                function OnFieldChange(control, value) {
					
					 VHAAppUtilities.bindChangeEvent();
                    var pm = this.GetPM();
                    if (isClickReqd == "TRUE" && ifFirstLoad != "TRUE") {

                    }

                    if (control.GetName() === "Issuer") {
                        if (value === "NSW") {
                            $('span[id^="QCondition_Label"]').closest('.FormItemVertical').show();
                        } else {
                            $('span[id^="QCondition_Label"]').closest('.FormItemVertical').hide();
                        }
                    }

                    if (control.GetName() === "IdType" || (control.GetName() === "SecondaryIdType" && SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI") || control.GetName() === "Country" || control.GetName() === "Issuer") {
                        showImage(pm);
                    }
                    if (control.GetName() === "IdType") {
                        if (SiebelApp.S_App.GetActiveView().GetName() == "VF Select Service View - TBUI") {
                            isClickReqd = "TRUE";
                            ifFirstLoad = "FALSE";
                        }
                    }
                    if (control.GetName() === "IdType" || (control.GetName() === "SecondaryIdType" && SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI") && value == "Green Medicare Card") {
                        mAddSequence(pm);
                    } else if (control.GetName() === "Country" || control.GetName() === "Issuer") {
                        //var sIdType=$('[aria-labelledby="IdType_Label"]').val(); /*TULASIY:15-09-2022::Added for upgrade 22.7 issues*/
                        var sIdType = $('[name=' + this.GetPM().Get("GetControls")["IdType"].GetInputName() + ']').val();
                        if (sIdType == "" && (SiebelApp.S_App.GetActiveView().GetName() == "VF Customer ID Details – Postpay TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF Customer ID Details – PretoPost TBUI")) // VHA Suresh P: Added check to get value from Sec Id
                            sIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA Postpay Add Identification TBC").GetFieldValue("Secondary ID Type");

                        if (sIdType == "International Passport" || sIdType == "Passport") {
                            switch (value) {
                                case "India":
                                    mCountryFieldShow(pm);
                                    $('#indiafields').addClass('sCountryFieldShow');
                                    $('#indiafields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "China":
                                    mCountryFieldShow(pm);
                                    $('#chinafields').addClass('sCountryFieldShow');
                                    $('#chinafields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "Nepal":
                                    mCountryFieldShow(pm);
                                    $('#nepalfields').addClass('sCountryFieldShow');
                                    $('#nepalfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "Japan":
                                    mCountryFieldShow(pm);
                                    $('#japanfields').addClass('sCountryFieldShow');
                                    $('#japanfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "United States of America":
                                    mCountryFieldShow(pm);
                                    $('#usafields').addClass('sCountryFieldShow');
                                    $('#usafields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "Malaysia":
                                    mCountryFieldShow(pm);
                                    $('#malaysiafields').addClass('sCountryFieldShow');
                                    $('#malaysiafields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "Taiwan":
                                    mCountryFieldShow(pm);
                                    $('#taiwanfields').addClass('sCountryFieldShow');
                                    $('#taiwanfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "Australia":
                                    mCountryFieldShow(pm);
                                    $('#AUSNZfields').addClass('sCountryFieldShow');
                                    $('#AUSNZfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "New Zealand":
                                    mCountryFieldShow(pm);
                                    $('#AUSNZfields').addClass('sCountryFieldShow');
                                    $('#AUSNZfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                default:
                                    mCountryFieldShow(pm);
                                    $('#otherfields').addClass('sCountryFieldHide');
                                    $('#otherfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mRemoveSequence(pm);
                                    break;
                            }
                        } else if (sIdType == "Driver's Licence" || sIdType == "Proof of Age Card(Govt Issued)") {
                            switch (value) {
                                case "NSW":
                                    mCountryFieldShow(pm);
                                    $('#NSWfields').addClass('sCountryFieldShow');
                                    $('#NSWfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "VIC":
                                    mCountryFieldShow(pm);
                                    $('#VICfields').addClass('sCountryFieldShow');
                                    $('#VICfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "SA":
                                    mCountryFieldShow(pm);
                                    $('#SAfields').addClass('sCountryFieldShow');
                                    $('#SAfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "WA":
                                    mCountryFieldShow(pm);
                                    $('#WAfields').addClass('sCountryFieldShow');
                                    $('#WAfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "ACT":
                                    mCountryFieldShow(pm);
                                    $('#ACTfields').addClass('sCountryFieldShow');
                                    $('#ACTfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "QLD":
                                    mCountryFieldShow(pm);
                                    $('#QLDfields').addClass('sCountryFieldShow');
                                    $('#QLDfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "NT":
                                    mCountryFieldShow(pm);
                                    $('#NTfields').addClass('sCountryFieldShow');
                                    $('#NTfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                case "TAS":
                                    mCountryFieldShow(pm);
                                    $('#TASfields').addClass('sCountryFieldShow');
                                    $('#TASfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mAddSequence(pm);
                                    break;

                                default:
                                    mCountryFieldShow(pm);
                                    $('#otherfields').addClass('sCountryFieldHide');
                                    $('#otherfields').each(function() {
                                        var sParentDiv = $(this).closest('tr');
                                        var sNextTrs = sParentDiv.nextAll();
                                        sNextTrs.each(function() {
                                            if ($(this).find(".sCountryFields").length > 0) {
                                                return false;
                                            } else
                                                $(this).removeClass('VFDisplayNone');
                                        });

                                    });
                                    mRemoveSequence(pm);
                                    break;
                            }
                        }
                    }
                    /*if(control.GetName() === "Country")
					{
						var sIdType=$('[aria-labelledby="IdType_Label"]').val();
						if(sIdType == "International Passport")
						{
							switch(value)
							{
								case "India":
								var sListOfFields=["PassportNumber","Surname","GivenName","MiddleName_Disp","DateOfBirth","Expiry Date"];
								var sCols=[1,2,1,2,1,2];
								var sRows=[1,1,2,2,3,3];
								mShuffleFields(sListOfFields);
								break;
								case "Nepal":
								var sListOfFields=["PassportNumber","GivenName","Surname","MiddleName_NoDisp","DateOfBirth","Expiry Date"];
								var sCols=[1,2,1,2,1,2];
								var sRows=[1,1,2,2,3,3];
								mShuffleFields(sListOfFields);
								break;
								case "China":
								var sListOfFields=["PassportNumber","GivenName","MiddleName_Disp","Surname","DateOfBirth","Expiry Date"];
								var sCols=[1,2,1,2,1,2];
								var sRows=[1,1,2,2,3,3];
								mShuffleFields(sListOfFields);
								break;
								default:
								var sListOfFields=["PassportNumber","GivenName","MiddleName_Disp","Surname","DateOfBirth","Expiry Date"];
								var sCols=[1,2,1,2,1,2];
								var sRows=[1,1,2,2,3,3];
								mShuffleFields(sListOfFields);
								break;
							}
							function mShuffleFields(sListOfFields)
							{
								var controls=pm.Get("GetControls");
								var sTdValArr=new Array();
								var sTdLblArr=new Array();
								var sCloseestTbl;
								sListOfFields.forEach(function(item,index){
								var sItemParsed=item.replace("_NoDisp","");
								sItemParsed=sItemParsed.replace("_Disp","");
                                var sUiName=controls[sItemParsed].GetInputName();
								if(item.indexOf("_NoDisp")!=-1)
								{
									
									$("[name='" + sUiName + "']").parent().addClass("VFDisplayNone");
									$("[name='" + sUiName + "']").parent().parent().prev().find('div').addClass("VFDisplayNone");
								}
								if(item.indexOf("_Disp")!=-1)
								{
									$("[name='" + sUiName + "']").parent().removeClass("VFDisplayNone");
									$("[name='" + sUiName + "']").parent().parent().prev().find('div').removeClass("VFDisplayNone");
								}
								sTdValArr[index]=$("[name='" + sUiName + "']").parent();
								sTdLblArr[index]=$("[name='" + sUiName + "']").parent().parent().prev().find('div');
								$("[name='" + sUiName + "']").parent().parent().prev().find('div').remove();
								$("[name='" + sUiName + "']").parent().remove();
     							});
								console.log("UIElemArr");
								console.log(sTdValArr);
								console.log("Label");
								console.log(sTdLblArr);
								var sTbl=$("#s_" + pm.Get("GetFullId") + "_div").find("table");
								var sSeq=0;
								sListOfFields.forEach(function(item,index){
									
									var sTr=sTbl.find('tr:nth-child('+(sRows[index]+3)+')');
									var sColForLbl=(sCols[index]-1)*2+2;
									var sColForVal=(sCols[index]-1)*2+3;
									sTr.find('td:nth-child('+sColForVal+')').html(sTdValArr[index]);
									sTr.find('td:nth-child('+sColForLbl+')').html(sTdLblArr[index]);
									sTr.find('td:nth-child('+sColForLbl+')').find('span .SeqNum').remove();
									if(sTr.find('td:nth-child('+sColForLbl+') .VFDisplayNone').length==0)
										sSeq=sSeq+1;
									sTr.find('td:nth-child('+sColForLbl+')').find('span').prepend("<span class='SeqNum'>"+(sSeq)+". </span>");
								});
				
							}
						}
					}*/

                }

                function showImage(pm) {
                    setTimeout(function() {
                        /*TULASIY:15-09-2022::Added for upgrade 22.7 issues*/
                        var uIdtype1 = "IdType_Label_" + pm.Get("GetId");
                        var uIdtype2 = "SecondaryIdType_Label_" + pm.Get("GetId");
                        var sIdType = $('[aria-labelledby=' + uIdtype1 + ']').val();

                        if (sIdType == "") // VHA Suresh: If Prim Id is added as Sec Id
                            sIdType = $('[aria-labelledby=' + uIdtype2 + ']').val(); /*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/

                        if (sIdType != "" && sIdType != null && sIdType != undefined)
                            sIdType = sIdType.replace("'", "");
                        if (sIdType == "International Passport")
                            sIdType = "Passport";
                        var SearchString = "";
                        var uCountry = "Country_Label_" + pm.Get("GetId");
                        var uIssuer = "Issuer_Label_" + pm.Get("GetId");
                        if (($('[aria-labelledby=' + uCountry + ']').val() != "" && $('[aria-labelledby=' + uCountry + ']').val() != null) && (sIdType == "Passport" || sIdType == "VISA")) /*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/
                            if (($('[aria-labelledby=' + uCountry + ']').val() != "India") && ($('[aria-labelledby=' + uCountry + ']').val() != "Japan") && ($('[aria-labelledby=' + uCountry + ']').val() != "Nepal") && ($('[aria-labelledby=' + uCountry + ']').val() != "Malaysia") && ($('[aria-labelledby=' + uCountry + ']').val() != "Taiwan") && ($('[aria-labelledby=' + uCountry + ']').val() != "China") && ($('[aria-labelledby=' + uCountry + ']').val() != "United States of America") && ($('[aria-labelledby=' + uCountry + ']').val() != "Australia") && ($('[aria-labelledby=' + uCountry + ']').val() != "New Zealand")) /*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/
                                sIdType = sIdType + "|Default";
                            else
                                sIdType = sIdType + "|" + $('[aria-labelledby=' + uCountry + ']').val(); /*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/

                        else if (($('[aria-labelledby=' + uIssuer + ']').val() != null && $('[aria-labelledby=' + uIssuer + ']').val() != "") && (sIdType == "Drivers Licence" || sIdType == "Proof of Age Card(Govt Issued)")) /*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/
                            sIdType = sIdType + "|" + $('[aria-labelledby=' + uIssuer + ']').val(); /*TULASIY:15-09-2022::Modified for upgrade 22.7 issues*/

                        SearchString = "[List Of Values.Type]='VHA_ID_SAMPLE' AND [List Of Values.Active]='Y' AND [List Of Values.Name]='" + sIdType + "'";
                        var sFileName = VHAAppUtilities.GetPickListValues("", SearchString);
                        if (sFileName.length > 0) {
                            var sBgImgVal = "images/custom/IDProofImages/" + sFileName;
                            var sAppId = pm.Get("GetFullId");
                            //$("#" + sAppId).find(".AppletHIFormBorder").attr("Id","IdClassApplet").css("background-image",sBgImgVal);
                            //var sContainerHt;					
                            if ($('#SampleImg').length == 0) {
                                if (SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI") {
                                    $("#" + sAppId).find(".IDVisualReferenceImage").append("<div id='SampleImg'><img src='" + sBgImgVal + "'/></div>").addClass("VHAParentRelative");
                                    $('#SampleImg').addClass("VHAParentRelative");

                                    var sContainerHt = $("#" + sAppId).find(".IDVisualReferenceImage").height();
                                } else {
                                    $("#" + sAppId).find(".siebui-applet-content").append("<div id='SampleImg'><img src='" + sBgImgVal + "'/></div>").addClass("VHAParentRelative");
                                    var sContainerHt = $("#" + sAppId).find(".siebui-applet-content.VHAParentRelative").height();
                                }
                            } else {
                                $('#SampleImg img').attr("src", sBgImgVal);
                                if (SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI") {
                                    var sContainerHt = $("#" + sAppId).find(".IDVisualReferenceImage").height();
                                    $('#SampleImg').addClass("VHAParentRelative");
                                } else {
                                    var sContainerHt = $("#" + sAppId).find(".siebui-applet-content.VHAParentRelative").height();
                                }

                            }
                            $("#" + sAppId).find(".siebui-applet-content>div").addClass("VHAInlineBlock").addClass("VHANoOutline");
                            //var sContainerHt=$("#" + sAppId).find(".siebui-applet-content.VHAParentRelative").height();
                            //$('#SampleImg').css('left',$("#" + sAppId).find(".siebui-applet-content.VHAParentRelative>div").first().width()+10);
                            if (SiebelApp.S_App.GetActiveView().GetName() == "VF Customer ID Details – Postpay TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF SSJ Customer ID Details – Postpay TBUI" || SiebelApp.S_App.GetActiveView().GetName() == "VF Select Service View - TBUI") {
                                $('#SampleImg').css('left', +800);
                            } else if (SiebelApp.S_App.GetActiveView().GetName() == "VF Contact Id View" || SiebelApp.S_App.GetActiveView().GetName() == "VF Connection View - Customer Detail") {
                                var sIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VF Capture Id Details VBC").GetFieldValue("ID Type");
                                if (sIdType == "International Passport" || sIdType == "Passport")
                                    $('#SampleImg').css('left', +980);
                                else if (sIdType == "Green Medicare Card" || sIdType == "Interim Medicare Card" || sIdType == "Reciprocal Medicare Card")
                                    $('#SampleImg').css('left', +950);
                                else if (sIdType == "Driver's Licence")
                                    $('#SampleImg').css('left', +925);
                                else if (sIdType == "Proof of Age Card(Govt Issued)")
                                    $('#SampleImg').css('left', +850);
                                else
                                    $('#SampleImg').css('left', +790);
                            }
                            if ((sContainerHt * 0.9) > 250)
                                $('#SampleImg').addClass("VHAIdFixedDimension");
                            else
                                $('#SampleImg').addClass("VHAIdVaryDimension");
                        } else {
                            if ($('#SampleImg').length > 0)
                                $('#SampleImg').remove();
                        }
                    }, 10);
                }

                function mAddSequence(pm) {
                    var sTbl = $("#s_" + pm.Get("GetFullId") + "_div").find("table").find('.sCountryFieldShow');
                    $('.sCountryFieldShow').each(function() {
                        var sParentDiv = $(this).closest('tr');
                        var sNextTrs = sParentDiv.nextAll();
                        var sSeq = 0;
                        sNextTrs.each(function() {
                            if ($(this).hasClass('sCountryFields')) {
                                return false;
                            } else {
                                var sTdArr = $(this).find('td');
                                sTdArr.each(function() {
                                    if ($(this).find(".mceGridLabel").length > 0) {
                                        var sId = $(this).find('span').attr('id'); // VHA Suresh: Added to skip sequence for Country & Q-Condition
                                        if (sId != "Country_Label" && sId != "Issue_Date_Label" && sId != "Issue_Date1_Label" && sId != "Issue_Date3_Label" && sId != "Issue_Date6_Label" && sId != "QCondition_Label" && sId != "Qcondition_Label" && sId != "Issue_Date7_Label" && sId != "Issue_Date8_Label" && sId != "MiddleName11_Label" && sId != "MiddleName22_Label" && sId != "MiddleName33_Label" && sId != "MiddleName44_Label" && sId != "MiddleName55_Label" && sId != "MiddleName66_Label" && sId != "MiddleName88_Label") {
                                            sSeq = sSeq + 1;
                                            $(this).find('span .SeqNum').remove();
                                            $(this).find('span').prepend("<span class='SeqNum'>" + (sSeq) + ". </span>");
                                        }
                                    }
                                });
                            }
                        });

                    });

                }

                function mRemoveSequence(pm) {
                    var sTbl = $("#s_" + pm.Get("GetFullId") + "_div").find("table").find('.sCountryFieldHide');
                    $('.sCountryFieldHide').each(function() {
                        var sParentDiv = $(this).closest('tr');
                        var sNextTrs = sParentDiv.nextAll();
                        var sSeq = 0;
                        sNextTrs.each(function() {
                            if ($(this).hasClass('sCountryFields')) {
                                return false;
                            } else {
                                var sTdArr = $(this).find('td');
                                sTdArr.each(function() {
                                    if ($(this).find(".mceGridLabel").length > 0) {
                                        var sId = $(this).find('span').attr('id');
                                        if (sId != "Country_Label" && sId != "QCondition_Label" && sId != "Qcondition_Label" && sId != "Issue_Date_Label") {
                                            $(this).find('span .SeqNum').remove();
                                        }
                                    }
                                });
                            }
                        });
                    });
                }

                function mCountryFieldShow(pm) {
                    $('.sCountryFieldShow').each(function() {
                        var sParentDiv = $(this).closest('tr');
                        var sNextTrs = sParentDiv.nextAll();
                        sNextTrs.each(function() {
                            if ($(this).find(".sCountryFields").length > 0) {
                                return false;
                            } else
                                $(this).addClass('VFDisplayNone');
                        });

                    });
                }
                VHACaptureIdDetailsPR.prototype.BindEvents = function() { //Connect Upgrade Task Pane Auto Close - START
                    SiebelAppFacade.VHACaptureIdDetailsPR.superclass.BindEvents.apply(this, arguments);

                    if (SiebelApp.S_App.GetActiveView().GetName() == "VF Select Service View - TBUI") {
                        var sPrimIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA Postpay Add Identification TBC").GetFieldValue("Primary ID Type");
                        var sSecIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA Postpay Add Identification TBC").GetFieldValue("Secondary ID Type");
                        var sOffIdType = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName("VHA Postpay Add Identification TBC").GetFieldValue("Offer ID Type");
                        if (sPrimIdType == "" || sSecIdType == "" || sOffIdType == "") {
                            if (isClickReqd == "TRUE" && ifFirstLoad == "FALSE") {
                                VHAAppUtilities.CallBS("Task UI Service (SWE)", "ToggleTaskPane", SiebelApp.S_App.NewPropertySet());
                                isClickReqd = "FALSE";
                                ifFirstLoad == "TRUE";
                                isClicked = true;
                            }
                        } else if (sPrimIdType == "Driver's Licence" || sPrimIdType == "International Passport" || sPrimIdType == "Proof of Age Card(Govt Issued)" || sPrimIdType == "Passport" || sSecIdType == "International Passport" || sSecIdType == "Driver's Licence" || sSecIdType == "Proof of Age Card(Govt Issued)" || sSecIdType == "Passport" || sSecIdType == "Green Medicare Card" || sSecIdType == "Defence Force ID" || sSecIdType == "Defence Force ID" || sSecIdType == "Gold Veteran Affairs Card" || sSecIdType == "DVA Health Care Card" || sOffIdType == "Student ID" || sOffIdType == "Pensioner Card") {
                            if (isClickReqd == "TRUE") {
                                VHAAppUtilities.CallBS("Task UI Service (SWE)", "ToggleTaskPane", SiebelApp.S_App.NewPropertySet());
                                isClickReqd = "FALSE";
                                isClicked = true;
                            }
                        }
                    } //Connect Upgrade Task Pane Auto Close - END
                }
                return VHACaptureIdDetailsPR;
            }
            ());
        return "SiebelAppFacade.VHACaptureIdDetailsPR";
    });
}