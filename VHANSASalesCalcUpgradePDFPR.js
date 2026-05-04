if (typeof SiebelAppFacade.VHANSASalesCalcUpgradePDFPR === "undefined") {
    SiebelJS.Namespace("SiebelAppFacade.VHANSASalesCalcUpgradePDFPR");
    var pdfSiebMsg = "";
    define("siebel/custom/VHANSASalesCalcUpgradePDFPR", ["siebel/phyrenderer", "siebel/custom/pdfLibrary/jspdf.min"], function() {
        SiebelAppFacade.VHANSASalesCalcUpgradePDFPR = (function() {
            function VHANSASalesCalcUpgradePDFPR(pm) {
                SiebelAppFacade.VHANSASalesCalcUpgradePDFPR.superclass.constructor.apply(this, arguments);
            }
            SiebelJS.Extend(VHANSASalesCalcUpgradePDFPR, SiebelAppFacade.PhysicalRenderer);
            VHANSASalesCalcUpgradePDFPR.prototype.Init = function() {
                SiebelAppFacade.VHANSASalesCalcUpgradePDFPR.superclass.Init.apply(this, arguments);
            }
            ;
            var metaData = {
                logo: {
                    width: 18,
                    height: 18
                },
                banner: {
                    width: 170,
                    height: 80
                },
                disclaim: {
                    width: 180,
                    height: 80
                },
                fontSize: {
                    seven: 7,
                    eight: 8,
                    nine: 9,
                    ten: 10,
                    large: 20
                },
                textStyle: {
                    bold: "bold",
                    normal: "normal"
                },
                backgroundColor: {
                    red: "#e60000",
                    white: "#ffffff",
                    black: "#000000"
                },
                textColor: {
                    red: "#e60000",
                    white: "#ffffff",
                    black: "#000000"
                },
                pageMargin: {
                    left: 10,
                    right: 10,
                    left9: 9
                },
                lineSpace: {
                    vertical: 7,
                    vertical2: 4
                },
                tableRight: {
                    cellHeight: 21.4,
                    cellWidth1: 38,
                    cellWidth2: 52,
                    cellWidth3: 23,
                    cellWidth4: 67
                },
            };
            var cStyle = {
                leftCell: {
                    columnWidth: 135,
                    fillColor: [255, 255, 255],
                    cellPadding: {
                        top: 2,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                },
                rightCell: {
                    columnWidth: 135,
                    fillColor: [255, 255, 255],
                    cellPadding: {
                        top: 2,
                        right: 0,
                        bottom: 0,
                        left: 5
                    }
                },
                planrightCell: {
                    columnWidth: 135,
                    fillColor: [255, 255, 255],
                    cellPadding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 10
                    }
                }
            };
            VHANSASalesCalcUpgradePDFPR.prototype.ShowUI = function() {
                SiebelAppFacade.VHANSASalesCalcUpgradePDFPR.superclass.ShowUI.apply(this, arguments);
            }
            ;
            var getHtmlTemplate = function() {
                return '<iframe id="pdf_preview_sc" type="application/pdf" src=""></iframe>';
            }
            VHANSASalesCalcUpgradePDFPR.prototype.BindData = function(bRefresh) {
                SiebelAppFacade.VHANSASalesCalcUpgradePDFPR.superclass.BindData.apply(this, arguments);
            }
            ;
            VHANSASalesCalcUpgradePDFPR.prototype.BindEvents = function() {
                SiebelAppFacade.VHANSASalesCalcUpgradePDFPR.superclass.BindEvents.apply(this, arguments);
            }
            ;
            VHANSASalesCalcUpgradePDFPR.createPDF = function(scJson, sTransType) {
                console.log("createPDF");
                var apMap = SiebelApp.S_App.GetActiveView().GetAppletMap();
                console.log(apMap);
                var IAAppletId = apMap["VHA NSA Sales Calc Applet"].GetFullId();
                var sRelSwitch = VHAAppUtilities.GetPickListValues("", "[List Of Values.Type]='VHA_RELEASE_SWITCH' AND [List Of Values.Name]='RELEASE_ONE_DOT_TWO' AND [List Of Values.Active]='Y'", "")[0];
                $("#" + IAAppletId).html(getHtmlTemplate());
                var x = metaData.pageMargin.left;
                var y = metaData.lineSpace.vertical;
                let newSvcExist = "N";
                //Marvin: Added to fix the space between new and existing services.
                var doc = new jsPDF({
                    orientation: "p",
                    unit: "mm",
                    format: "a4",
                    putOnlyUsedFonts: true,
                    floatPrecision: 16,
                    imageCompression: 1,
                    quality: 1
                });
                doc.setProperties({
                    title: 'Quote Summary'
                });
                var sQuoteNo = scJson.QuoteHeader.QuoteNumber;
                var sCostPerMonth = scJson.QuoteHeader.AllCostPerMonth;
                var sOneTimeCost = scJson.QuoteHeader.OneTimeCost;
                var sPrepaymentAmt = scJson.QuoteHeader.Prepayment.PrepaymentAmt != "" ? scJson.QuoteHeader.Prepayment.PrepaymentAmt : "0.00";
                var pageHeight = doc.internal.pageSize.height;
                var ya = y;
                ya = y + 40;
                doc.addImage(loadImage(), "PNG", x + 45, ya, 24, 24);
                doc.setFontSize(44);
                doc.setFontStyle(metaData.textStyle.bold);
                doc.setTextColor(255, 0, 0);
                doc.text("vodafone", x + 73, ya + 15);
                doc.setFontSize(metaData.fontSize.ten);
                doc.setFontStyle(metaData.textStyle.normal);
                doc.setTextColor(0, 0, 0);
                ya = ya + 45;
                doc.setFontSize(26);
                doc.text("Exclusive package just for you", x + 33, ya);
                doc.setFontSize(metaData.fontSize.ten);
                doc.setFontStyle(metaData.textStyle.normal);
                ya = ya + 60;
                doc.setFontSize(22);
                doc.setFontStyle(metaData.textStyle.bold);
                doc.setTextColor(255, 0, 0);
                doc.text("Reasons you'll love us", x + 50, ya);
                doc.setFontSize(metaData.fontSize.ten);
                doc.setFontStyle(metaData.textStyle.normal);
                doc.setTextColor(0, 0, 0);
                ya = ya + 20;
                doc.addImage(vfaward(), "PNG", x + 20, ya, 20, 18);
                doc.addImage(vfnetwork(), "PNG", x + 87, ya, 18, 18);
                doc.addImage(vfroam(), "PNG", x + 154, ya, 16, 18);
                ya = ya + 20;
                var adRow = "";
                var adRowtemp = "";
                var adRowarry = [];
                adRow = [{
                    value1: "Awarded Best Provider of iPhone and Samsung Plans by WhistleOut",
                    value2: "Increased Network capacity with 5G in more than 3000 suburbs across Aus",
                    value3: "Roam for $5 a day in over 100 countries and use your included data for travel with peace of mind"
                }];
                adRow.forEach(element => {
                    adRowtemp = [element.value1, element.value2, element.value3];
                    adRowarry.push(adRowtemp);
                }
                );
                doc.autoTable("", adRowarry, {
                    startY: (number = ya),
                    margin: {
                        left: x
                    },
                    tableWidth: 200,
                    headStyles: {
                        fillColor: [255, 255, 255],
                        textColor: "red"
                    },
                    bodyStyles: {
                        fillColor: [255, 255, 255],
                        textColor: "red"
                    },
                    columnStyles: {
                        0: {
                            columnWidth: 67,
                            fillColor: [255, 255, 255],
                            halign: 'center',
                            cellPadding: {
                                right: 8
                            },
                            fontSize: 12
                        },
                        1: {
                            columnWidth: 66,
                            fillColor: [255, 255, 255],
                            halign: 'center',
                            cellPadding: {
                                right: 8
                            },
                            fontSize: 12
                        },
                        2: {
                            columnWidth: 66,
                            fillColor: [255, 255, 255],
                            halign: 'center',
                            cellPadding: {
                                right: 8
                            },
                            fontSize: 12
                        }
                    }
                });
                doc.addPage();
                doc.addImage(loadImage(), "PNG", x, y + 1, metaData.logo.width, metaData.logo.height);
                doc.setFontSize(metaData.fontSize.large);
                doc.setFontStyle(metaData.textStyle.bold);
                doc.text("Your Vodafone Package", x + 20, y + 12);
                doc.setFontSize(metaData.fontSize.ten);
                doc.setFontStyle(metaData.textStyle.normal);
                y = metaData.logo.height + 20;
                var Column1 = ""
                  , Column2 = "";
                var valTotalSrvPerMth = 0;
                var FurtherRow = ""
                  , Furthertemp = "";
                var RQIrows1 = []
                  , RQIrows2 = []
                  , Qrows1 = [];
                if (scJson.QuoteHeader.RootItem.length > 0 || scJson.QuoteHeader.ExistingServices[0].length > 0) {
                    scJson.QuoteHeader.RootItem.forEach(function(rliItem, rliIdx) {
                        valTotalSrvPerMth = rliItem.TotalSrvPerMth;
                        //Marvin: Added to check for value. 
                        if (rliItem.FixedProposition) {
                            Column1 = rliItem.FixedProposition;
                        } else {
                            Column1 = rliItem.Proposition;
                        }
                        Column2 = valTotalSrvPerMth ? "$" + rliItem.TotalSrvPerMth : "";
                        //Marvin: Added to set the value to null when value is 0;
                        FurtherRow = [{
                            value1: Column1,
                            value2: Column2
                        }];
                        FurtherRow.forEach(element => {
                            Furthertemp = [element.value1, element.value2];
                            RQIrows1.push(Furthertemp);
                        }
                        );
                    });
                    if (scJson.QuoteHeader.ExistingServices[0]) {
                        scJson.QuoteHeader.ExistingServices[0].forEach(function(rliItem, rliIdx) {
                            if (rliItem?.update) {
                                valTotalSrvPerMth = scJson.QuoteHeader.AllCostPerMonth;
                                if (rliItem.update.FixedProposition) {
                                    Column1 = rliItem.update.FixedProposition;
                                } else {
                                    if (!rliItem.update.Proposition) {
                                        Column1 = rliItem.update[0].Proposition;
                                    } else {
                                        Column1 = rliItem.update.Proposition;
                                    }
                                }

                                Column2 = "";
                                //Setting to null for now as field is missing. 
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    RQIrows1.push(Furthertemp);
                                }
                                );
                            }
                        });
                    }
                    FurtherRow = [{
                        value1: "Total Indicative cost per month",
                        value2: "$" + sCostPerMonth
                    }];
                    FurtherRow.forEach(element => {
                        Furthertemp = [element.value1, element.value2];
                        RQIrows2.push(Furthertemp);
                    }
                    );
                    FurtherRow = [{
                        value1: "Total Indicative One-time Cost",
                        value2: "$" + sOneTimeCost
                    }];
                    FurtherRow.forEach(element => {
                        Furthertemp = [element.value1, element.value2];
                        RQIrows2.push(Furthertemp);
                    }
                    );
                    var col = ["Quote No", sQuoteNo]
                    doc.autoTable(col, RQIrows1, {
                        startY: (number = y += 4),
                        margin: {
                            left: x
                        },
                        tableWidth: 200,
                        headStyles: {
                            fillColor: [255, 255, 255],
                            textColor: "black"
                        },
                        bodyStyles: {
                            fillColor: [255, 255, 255],
                            textColor: "black"
                        },
                        columnStyles: {
                            0: {
                                columnWidth: 135,
                                fillColor: [255, 255, 255]
                            },
                            1: {
                                columnWidth: 30,
                                fillColor: [255, 255, 255]
                            }
                        }
                    });
                    y = doc.lastAutoTable.finalY;
                    doc.autoTable("", RQIrows2, {
                        startY: (number = y += 7),
                        margin: {
                            left: x
                        },
                        tableWidth: 200,
                        headStyles: {
                            fillColor: [255, 255, 255],
                            textColor: "black"
                        },
                        bodyStyles: {
                            fillColor: [255, 255, 255],
                            textColor: "black"
                        },
                        columnStyles: {
                            0: {
                                columnWidth: 135,
                                fillColor: [255, 255, 255],
                                fontStyle: "bold",
                                cellPadding: {
                                    top: 1,
                                    right: 0,
                                    bottom: 0,
                                    left: 2
                                }
                            },
                            1: {
                                columnWidth: 30,
                                fillColor: [255, 255, 255],
                                fontStyle: "bold",
                                cellPadding: {
                                    top: 1,
                                    right: 0,
                                    bottom: 0,
                                    left: 2
                                }
                            }
                        }
                    });
                    y = doc.lastAutoTable.finalY;
                    FurtherRow = [{
                        value1: "Item",
                        value2: "Total Indicative cost per month"
                    }];
                    FurtherRow.forEach(element => {
                        Furthertemp = [element.value1, element.value2];
                        Qrows1.push(Furthertemp);
                    }
                    );
                    doc.autoTable("", Qrows1, {
                        startY: (number = y += 7),
                        margin: {
                            left: x
                        },
                        tableWidth: 190,
                        headStyles: {
                            fillColor: [255, 255, 255],
                            textColor: [0, 0, 0]
                        },
                        bodyStyles: {
                            fillColor: [255, 255, 255],
                            textColor: [0, 0, 0]
                        },
                        columnStyles: {
                            0: {
                                columnWidth: 160,
                                fillColor: [255, 255, 255],
                                fontStyle: "bold"
                            },
                            1: {
                                columnWidth: 30,
                                fillColor: [255, 255, 255],
                                fontStyle: "bold"
                            }
                        }
                    });
                    y = doc.lastAutoTable.finalY;
                    doc.setDrawColor(0, 0, 0);
                    doc.line(x, y, x + 190, y);
                    y = y + 4;
                    scJson.QuoteHeader.RootItem.forEach(function(rliItem, rliIdx) {
                        newSvcExist = "Y";
                        //Marvin: Added for spacing between new and upgrade services.
                        Qrows2 = [];
                        console.log("Hello-->" + rliIdx);
                        var valTtlSrvPerMth = rliItem.TotalSrvPerMth;
                        //Marvin: Added to check the value;
                        var finTtlSrvPerMth = valTtlSrvPerMth ? "$" + rliItem.TotalSrvPerMth : "";
                        //Marvin: Added to set the value to null when value is 0;
                        if (rliIdx > 0)
                            y += 12;
                        else
                            y += 3;
                        doc.text("", 20, 50);
                        doc.setFontStyle(metaData.textStyle.bold);
                        doc.setFont("helvetica", "bold");

                        let planNode = "";
                        //if(rliItem.FixedPlanItem !== "")
                        if (rliItem.FixedPlanItem && Object.keys(rliItem.FixedPlanItem).length > 0) {
                            planNode = rliItem.FixedPlanItem;
                        } else {
                            planNode = rliItem.PlanItem;
                        }

                        if (rliItem.MSISDN != "") {
                            doc.text(rliItem.SrvType + " - " + planNode.Name + " - " + rliItem.MSISDN, x, y);
                        } else {
                            doc.text(rliItem.SrvType + " - " + planNode.Name, x, y);
                        }
                        doc.setFontStyle(metaData.textStyle.normal);
                        doc.text(finTtlSrvPerMth, x + 167, y);
                        //Marvin: Added to finTtlSrvPerMth for set the value;
                        Column1 = planNode.Descr;
                        Column2 = "$" + planNode.Price;
                        FurtherRow = [{
                            value1: Column1,
                            value2: Column2
                        }];
                        FurtherRow.forEach(element => {
                            Furthertemp = [element.value1, element.value2];
                            Qrows2.push(Furthertemp);
                        }
                        );
                        doc.autoTable("", Qrows2, {
                            startY: (number = y += 1),
                            margin: {
                                left: x
                            },
                            tableWidth: 180,
                            headStyles: {
                                fillColor: [255, 255, 255],
                                textColor: [0, 0, 0]
                            },
                            bodyStyles: {
                                fillColor: [255, 255, 255],
                                textColor: [0, 0, 0]
                            },
                            columnStyles: {
                                0: cStyle.leftCell,
                                1: cStyle.planrightCell
                            }
                        });
                        y = doc.lastAutoTable.finalY;
                        if (rliItem.DeviceItem.length > 0) {
                            y = y + 8;
                            Qrows3 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Device", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.DeviceItem.sort(function(a, b) {
                                return parseFloat(a.Action) - parseFloat(b.Action);
                            });
                            rliItem.DeviceItem.forEach(function(dvcItem, dvcIdx) {
                                if (dvcItem.Action != "Delete") {
                                    if (dvcItem.Term != "" && dvcItem.Action == "Add") {
                                        if (dvcItem.Prepayment__Amount > 0) {
                                            Column1 = dvcItem.Item__Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.Term + ") \n\t[Adjusted Prepayment Amount $" + dvcItem.Prepayment__Amount + "]";
                                        } else {
                                            Column1 = dvcItem.Item__Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.Term + ")";
                                        }
                                        Column2 = (dvcItem.Monthly__Repayment.indexOf("$") > -1) ? dvcItem.Monthly__Repayment : "$" + dvcItem.Monthly__Repayment;
                                        //Marvin : Added condition to only add "$" when it does not exist.
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows3.push(Furthertemp);
                                        }
                                        );
                                        if (dvcItem.Insurance != "") {
                                            Column1 = "\t" + dvcItem.Insurance + " for " + dvcItem.Item__Name;
                                            Column2 = "$" + dvcItem.InsPri;
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows3.push(Furthertemp);
                                            }
                                            );
                                        }
                                    }
                                    if (dvcItem.RemTerm != "" && dvcItem.Action == "Existing") {
                                        Column1 = dvcItem.Item__Name + " (" + dvcItem.RemTerm + " month's remaining)";
                                        Column2 = "$" + dvcItem.Monthly__Repayment;
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows3.push(Furthertemp);
                                        }
                                        );
                                    }
                                }
                            });
                            doc.autoTable("", Qrows3, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        //Marvin: Fixed Modem
                        if (rliItem.FixedmodemItem.length > 0) {
                            y = y + 8;
                            Qrows3 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Device", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.FixedmodemItem.sort(function(a, b) {
                                return parseFloat(a.Action) - parseFloat(b.Action);
                            });
                            rliItem.FixedmodemItem.forEach(function(dvcItem, dvcIdx) {
                                if (dvcItem.Action != "Delete") {
                                    if (dvcItem.Term != "" && dvcItem.Action == "Add") {
                                        /*if (dvcItem.Prepayment__Amount > 0) {
                                            Column1 = dvcItem.FixedModem__Name + " (" + parseFloat(dvcItem.RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.Term + ") \n\t[Adjusted Prepayment Amount $" + dvcItem.Prepayment__Amount + "]";
                                        } else {
                                            Column1 = dvcItem.FixedModem__Name + " (" + parseFloat(dvcItem.RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.Term + ")";
                                        }*/
                                        Column1 = dvcItem.FixedModem__Name;
                                        Column2 = (dvcItem.RRP__Inc__GST.indexOf("$") > -1) ? dvcItem.RRP__Inc__GST : "$" + dvcItem.RRP__Inc__GST;
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows3.push(Furthertemp);
                                        }
                                        );
                                        /*if (dvcItem.Insurance != "") {
                                            Column1 = "\t" + dvcItem.Insurance + " for " + dvcItem.Item__Name;
                                            Column2 = "$" + dvcItem.InsPri;
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element=>{
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows3.push(Furthertemp);
                                            }
                                            );
                                        }*/
                                    }
                                    if (dvcItem.RemTerm != "" && dvcItem.Action == "Existing") {
                                        Column1 = dvcItem.Item__Name + " (" + dvcItem.RemTerm + " month's remaining)";
                                        Column2 = "$" + dvcItem.RRP__Inc__GST;
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows3.push(Furthertemp);
                                        }
                                        );
                                    }
                                }
                            });
                            doc.autoTable("", Qrows3, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        //Marvin: Added 
                        if (rliItem.TabletItem.length > 0) {
                            y = y + 4;
                            Qrows3 = [];
                            //doc.setFontStyle(metaData.textStyle.bold);
                            //doc.text("Device", x + 5, y);
                            //doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.TabletItem.sort(function(a, b) {
                                return parseFloat(a.Action) - parseFloat(b.Action);
                            });
                            rliItem.TabletItem.forEach(function(dvcItem, dvcIdx) {
                                if (dvcItem.Action != "Delete") {
                                    if (dvcItem.DeviceTerm != "" && dvcItem.Action == "Add") {
                                        if (dvcItem.Prepayment__Amount > 0) {
                                            Column1 = dvcItem.UI__Source_Product_Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.DeviceTerm + ") \n\t[Adjusted Prepayment Amount $" + dvcItem.Prepayment__Amount + "]";
                                        } else {
                                            Column1 = dvcItem.UI__Source_Product_Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.DeviceTerm + ")";
                                        }
                                        Column2 = (dvcItem.Monthly__Repayment.indexOf("$") > -1) ? dvcItem.Monthly__Repayment : "$" + dvcItem.Monthly__Repayment;
                                        //Marvin : Added condition to only add "$" when it does not exist.
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows3.push(Furthertemp);
                                        }
                                        );
                                        if (dvcItem.Insurance != "") {
                                            Column1 = "\t" + dvcItem.Insurance + " for " + dvcItem.UI__Source_Product_Name;
                                            Column2 = "$" + dvcItem.InsPri;
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows3.push(Furthertemp);
                                            }
                                            );
                                        }
                                    }
                                    if (dvcItem.RemTerm != "" && dvcItem.Action == "Existing") {
                                        Column1 = dvcItem.Item__Name + " (" + dvcItem.RemTerm + " month's remaining)";
                                        Column2 = "$" + dvcItem.UI__Source_Product_Name;
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows3.push(Furthertemp);
                                        }
                                        );
                                    }
                                }
                            });
                            doc.autoTable("", Qrows3, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.SecondaryItem.length > 0) {
                            y = y + 8;
                            Qrows4 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Secondary Device", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.SecondaryItem.sort(function(a, b) {
                                return parseFloat(b.Monthly__Repayment) - parseFloat(a.Monthly__Repayment);
                            });
                            rliItem.SecondaryItem.forEach(function(sdItem, sdIdx) {
                                if (sdItem.Term != "" && sdItem.Action == "Add") {
                                    if (Number(sdItem.Prepayment__Amount) > 0) {
                                        Column1 = sdItem.Item__Name + " (" + sdItem.RRP__Inc__GST + " Incl. GST over " + sdItem.Term + ") \n\t[Adjusted Prepayment Amount $" + sdItem.Prepayment__Amount + "]";
                                    } else {
                                        Column1 = sdItem.Item__Name + " (" + sdItem.RRP__Inc__GST + " Incl. GST over " + sdItem.Term + ")";
                                    }
                                    //Column2 = "$" + sdItem.Monthly__Repayment;
                                    Column2 = (sdItem.Monthly__Repayment.indexOf("$") > -1) ? sdItem.Monthly__Repayment : "$" + sdItem.Monthly__Repayment;
                                    //Marvin : Added condition to only add "$" when it does not exist.
                                    FurtherRow = [{
                                        value1: Column1,
                                        value2: Column2
                                    }];
                                    FurtherRow.forEach(element => {
                                        Furthertemp = [element.value1, element.value2];
                                        Qrows4.push(Furthertemp);
                                    }
                                    );
                                    if (sdItem.Insurance != "") {
                                        Column1 = "\t" + sdItem.Insurance + " for " + sdItem.Item__Name;
                                        Column2 = "$" + sdItem.InsPri;
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows4.push(Furthertemp);
                                        }
                                        );
                                    }
                                } else if (sdItem.RemTerm != "") {
                                    Column1 = sdItem.Item__Name + " (" + sdItem.RemTerm + " month's remaining)";
                                    Column2 = "$" + sdItem.Monthly__Repayment;
                                    FurtherRow = [{
                                        value1: Column1,
                                        value2: Column2
                                    }];
                                    FurtherRow.forEach(element => {
                                        Furthertemp = [element.value1, element.value2];
                                        Qrows4.push(Furthertemp);
                                    }
                                    );
                                }
                            });
                            doc.autoTable("", Qrows4, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.AccItem.length > 0) {
                            y = y + 8;
                            Qrows5 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Accessories", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.AccItem.sort(function(a, b) {
                                return parseFloat(b.Monthly__Repayment) - parseFloat(a.Monthly__Repayment);
                            });
                            rliItem.AccItem.forEach(function(acItem, acIdx) {
                                if (acItem.Action == "Add") {
                                    /*if (Number(acItem.Prepayment__Amount) > 0)
                                        Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ") \n\t[Adjusted Prepayment Amount $" + acItem.Prepayment__Amount + "]";
                                    else
                                        Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ")";
                                    Column2 = "$" + acItem.Monthly__Repayment;*/
                                    //Marvin: CM-5563 : Added as Monthly repayment is not available in Accessory.
                                    Column1 = acItem.Accessory__Name;
                                    Column2 = "$" + acItem.Accessory__RRP__Inc__GST;
                                    //Marvin : Added for CM-5563 fixed
                                    FurtherRow = [{
                                        value1: Column1,
                                        value2: Column2
                                    }];
                                    FurtherRow.forEach(element => {
                                        Furthertemp = [element.value1, element.value2];
                                        Qrows5.push(Furthertemp);
                                    }
                                    );
                                } else if (acItem.Action == "Existing") {
                                    Column1 = "APP Contract with " + acItem.Number__of__Accessories + " Accessories (" + acItem.RemTerm + " month's remaining)";
                                    Column2 = "$" + acItem.Monthly__Repayment;
                                    FurtherRow = [{
                                        value1: Column1,
                                        value2: Column2
                                    }];
                                    FurtherRow.forEach(element => {
                                        Furthertemp = [element.value1, element.value2];
                                        Qrows5.push(Furthertemp);
                                    }
                                    );
                                } else {}
                            });
                            doc.autoTable("", Qrows5, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem?.fixedAccItem?.length > 0) {
                            //Dhana_19feb
                            y = y + 8;
                            Qrows5 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Accessories", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.fixedAccItem.sort(function(a, b) {
                                return parseFloat(b.Monthly__Repayment) - parseFloat(a.Monthly__Repayment);
                            });
                            rliItem.fixedAccItem.forEach(function(acItem, acIdx) {
                                if (acItem.Action == "Add") {
                                    /*if (Number(acItem.Prepayment__Amount) > 0)
                                        Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ") \n\t[Adjusted Prepayment Amount $" + acItem.Prepayment__Amount + "]";
                                    else
                                        Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ")";
                                    Column2 = "$" + acItem.Monthly__Repayment;*/
                                    //Marvin: CM-5563 : Added as Monthly repayment is not available in Accessory.
                                    Column1 = acItem.Accessory__Name;
                                    Column2 = "$" + acItem.Accessory__RRP__Inc__GST;
                                    //Marvin : Added for CM-5563 fixed
                                    FurtherRow = [{
                                        value1: Column1,
                                        value2: Column2
                                    }];
                                    FurtherRow.forEach(element => {
                                        Furthertemp = [element.value1, element.value2];
                                        Qrows5.push(Furthertemp);
                                    }
                                    );
                                } else if (acItem.Action == "Existing") {
                                    Column1 = "APP Contract with " + acItem.Number__of__Accessories + " Accessories (" + acItem.RemTerm + " month's remaining)";
                                    Column2 = "$" + acItem.Monthly__Repayment;
                                    FurtherRow = [{
                                        value1: Column1,
                                        value2: Column2
                                    }];
                                    FurtherRow.forEach(element => {
                                        Furthertemp = [element.value1, element.value2];
                                        Qrows5.push(Furthertemp);
                                    }
                                    );
                                } else {}
                            });
                            doc.autoTable("", Qrows5, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.PackItem.length > 0) {
                            y = y + 8;
                            Qrows6 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Packs, Passes, and Add-Ons", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.PackItem.forEach(function(packItem, packIdx) {
                                if (packItem.Period)
                                    Column1 = packItem.Name + " (for " + packItem.Period + " Months)";
                                else
                                    Column1 = packItem.Name;
                                Column2 = "$" + parseFloat(packItem.Price).toFixed(2);
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    Qrows6.push(Furthertemp);
                                }
                                );
                            });
                            doc.autoTable("", Qrows6, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.FeeRollItem.Name != "" && rliItem.FeeRollItem.Name != null && rliItem.FeeRollItem.Action == "Add") {
                            y = y + 8;
                            Qrows10 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Early Upgrade Fee Rollover", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            if (rliItem.FeeRollItem.Period)
                                Column1 = rliItem.FeeRollItem.Name + " (for " + rliItem.FeeRollItem.Period + " Months)";
                            else
                                Column1 = rliItem.FeeRollItem.Name;
                            Column2 = "$" + parseFloat(rliItem.FeeRollItem.Price).toFixed(2);
                            FurtherRow = [{
                                value1: Column1,
                                value2: Column2
                            }];
                            FurtherRow.forEach(element => {
                                Furthertemp = [element.value1, element.value2];
                                Qrows10.push(Furthertemp);
                            }
                            );
                            doc.autoTable("", Qrows10, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.CreditItem.length > 0) {
                            y = y + 8;
                            Qrows9 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Credits", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.CreditItem.forEach(function(crdItem, crdIdx) {
                                if (crdItem.Period)
                                    Column1 = crdItem.Name + " (for " + crdItem.Period + " Months)";
                                else
                                    Column1 = crdItem.Name;
                                if (crdItem.Price)
                                    Column2 = "-$" + parseFloat(crdItem.Price).toFixed(2);
                                else if (crdItem.UI_Price)
                                    Column2 = "-$" + parseFloat(crdItem.UI_Price).toFixed(2);
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    Qrows9.push(Furthertemp);
                                }
                                );
                            });
                            doc.autoTable("", Qrows9, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.DDItem.length > 0) {
                            y = y + 8;
                            Qrows14 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Device Discount", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.DDItem.forEach(function(ddItem, ddIdx) {
                                if (ddItem.Period)
                                    Column1 = ddItem.Name + " (for " + ddItem.Period + " Months)";
                                else
                                    Column1 = ddItem.Name;
                                Column2 = "-$" + parseFloat(ddItem.Price).toFixed(2);
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    Qrows14.push(Furthertemp);
                                }
                                );
                            });
                            doc.autoTable("", Qrows14, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.BonusItem.length > 0) {
                            y = y + 8;
                            Qrows15 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            if (sRelSwitch == "Y")
                                doc.text("Offers", x + 5, y);
                            else
                                doc.text("Bonus", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.BonusItem.forEach(function(bItem, bIdx) {
                                if (bItem.Period) {
                                    if (sRelSwitch != "Y" && bItem.UI_Type == "BundleSave")
                                        Column1 = bItem.Name + " (" + bItem.Period + ")";
                                    else
                                        Column1 = bItem.Name + " (for " + bItem.Period + " Months)";
                                } else if (sRelSwitch == "Y" && bItem.Name == "MSP Discount") {
                                    Column1 = "MSP Discount";
                                } else {
                                    Column1 = bItem.Name;
                                }
                                if (bItem.Price && bItem.GPI !== "Bonus IDD")
                                    Column2 = "-$" + parseFloat(bItem.Price).toFixed(2);
                                else
                                    Column2 = "";
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    Qrows15.push(Furthertemp);
                                }
                                );
                            });
                            doc.autoTable("", Qrows15, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.TradeItem.Name != "" && rliItem.TradeItem.Name != null && rliItem.TradeItem.Action == "Add") {
                            y = y + 8;
                            Qrows12 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("Trade In", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            var tPrice = 0;
                            if (rliItem.TradeItem.Period) {
                                Column1 = rliItem.TradeItem.Name + " ($" + rliItem.TradeItem.Price + " for " + rliItem.TradeItem.Period + " Months)";
                                tPrice = Number(rliItem.TradeItem.Price / rliItem.TradeItem.Period);
                            } else {
                                Column1 = rliItem.TradeItem.Name;
                                tPrice = Number(rliItem.TradeItem.Price);
                            }
                            Column2 = "-$" + tPrice;
                            FurtherRow = [{
                                value1: Column1,
                                value2: Column2
                            }];
                            FurtherRow.forEach(element => {
                                Furthertemp = [element.value1, element.value2];
                                Qrows12.push(Furthertemp);
                            }
                            );
                            doc.autoTable("", Qrows12, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (rliItem.OtpItem.length > 0) {
                            y = y + 8;
                            Qrows11 = [];
                            doc.setFontStyle(metaData.textStyle.bold);
                            doc.text("One-time payments", x + 5, y);
                            doc.setFontStyle(metaData.textStyle.normal);
                            rliItem.OtpItem.forEach(function(otpItem, otpIdx) {
                                Column1 = otpItem.Name;
                                Column2 = "$" + otpItem.Price;
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    Qrows11.push(Furthertemp);
                                }
                                );
                            });
                            doc.autoTable("", Qrows11, {
                                startY: (number = y += 1),
                                margin: {
                                    left: x + 5
                                },
                                tableWidth: 180,
                                headStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                bodyStyles: {
                                    fillColor: [255, 255, 255],
                                    textColor: [0, 0, 0]
                                },
                                columnStyles: {
                                    0: cStyle.leftCell,
                                    1: cStyle.rightCell
                                }
                            });
                            y = doc.lastAutoTable.finalY;
                        }
                        if (scJson.QuoteHeader.RootItem.length != (rliIdx + 1)) {
                            doc.setDrawColor(0, 0, 0);
                            doc.line(x, y + 4, x + 157, y + 4);
                        }
                        y = doc.lastAutoTable.finalY;
                        console.log(rliItem.Id + "-->" + y);
                    });
                    let existRoot = "";
                    if (scJson.QuoteHeader.ExistingServices[0]) {
                        scJson.QuoteHeader.ExistingServices[0].forEach(function(rliItem, rliIdx) {
                            if (rliItem?.update) {
                                Qrows2 = [];
                                console.log("Hello-->" + rliIdx);
                                if (!rliItem.update.Proposition) {
                                    existRoot = rliItem.update[0];
                                } else {
                                    existRoot = rliItem.update;
                                }
                                var valTtlSrvPerMth = existRoot.TotalSrvPerMth;
                                //Marvin: Added to check the value;
                                var finTtlSrvPerMth = valTtlSrvPerMth ? "$" + existRoot.TotalSrvPerMth : "";
                                //Marvin: Added to set the value to null when value is 0;
                                if (rliIdx > 0 || newSvcExist === "Y")
                                    y += 12;
                                else
                                    y += 3;
                                doc.text("", 20, 60);
                                doc.setFontStyle(metaData.textStyle.bold);
                                doc.setFont("helvetica", "bold");
                                if (existRoot.FixedPlanItem && Object.keys(existRoot.FixedPlanItem).length > 0) {
                                    planNode = existRoot.FixedPlanItem;
                                } else {
                                    planNode = existRoot.plan;
                                }
                                if (rliItem.MSISDN != "") {
                                    if (planNode.Name) {
                                        //Marvin: Added for CM-9404 for Upg RRP condition.
                                        doc.text(existRoot.SrvType + " - " + planNode.Name + " - " + rliItem.MSISDN, x, y);
                                    } else {
                                        doc.text(existRoot.SrvType + " - " + rliItem.MSISDN, x, y);
                                    }
                                } else {
                                    doc.text(existRoot.SrvType + " - " + planNode.Name, x, y);
                                }
                                doc.setFontStyle(metaData.textStyle.normal);
                                doc.text(finTtlSrvPerMth, x + 167, y);
                                //Marvin: Added to finTtlSrvPerMth for set the value;
                                Column1 = planNode.Descr;
                                if (planNode.Name) {
                                    //Marvin: Added for CM-9404 for Upg RRP condition.
                                    Column2 = "$" + planNode.Price;
                                }
                                FurtherRow = [{
                                    value1: Column1,
                                    value2: Column2
                                }];
                                FurtherRow.forEach(element => {
                                    Furthertemp = [element.value1, element.value2];
                                    Qrows2.push(Furthertemp);
                                }
                                );
                                doc.autoTable("", Qrows2, {
                                    startY: (number = y += 1),
                                    margin: {
                                        left: x
                                    },
                                    tableWidth: 180,
                                    headStyles: {
                                        fillColor: [255, 255, 255],
                                        textColor: [0, 0, 0]
                                    },
                                    bodyStyles: {
                                        fillColor: [255, 255, 255],
                                        textColor: [0, 0, 0]
                                    },
                                    columnStyles: {
                                        0: cStyle.leftCell,
                                        1: cStyle.planrightCell
                                    }
                                });
                                y = doc.lastAutoTable.finalY;
                                if (existRoot.DeviceItem.length > 0) {
                                    y = y + 8;
                                    Qrows3 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Device", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.DeviceItem.sort(function(a, b) {
                                        return parseFloat(a.Action) - parseFloat(b.Action);
                                    });
                                    existRoot.DeviceItem.forEach(function(dvcItem, dvcIdx) {
                                        if (dvcItem.Action != "Delete") {
                                            if (dvcItem.Term != "" && dvcItem.Action == "Add") {
                                                if (dvcItem.Prepayment__Amount > 0) {
                                                    Column1 = dvcItem.Item__Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.Term + ") \n\t[Adjusted Prepayment Amount $" + dvcItem.Prepayment__Amount + "]";
                                                } else {
                                                    Column1 = dvcItem.Item__Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.Term + ")";
                                                }
                                                Column2 = (dvcItem.Monthly__Repayment.indexOf("$") > -1) ? dvcItem.Monthly__Repayment : "$" + dvcItem.Monthly__Repayment;
                                                //Marvin : Added condition to only add "$" when it does not exist.
                                                FurtherRow = [{
                                                    value1: Column1,
                                                    value2: Column2
                                                }];
                                                FurtherRow.forEach(element => {
                                                    Furthertemp = [element.value1, element.value2];
                                                    Qrows3.push(Furthertemp);
                                                }
                                                );
                                                if (dvcItem.Insurance != "") {
                                                    Column1 = "\t" + dvcItem.Insurance + " for " + dvcItem.Item__Name;
                                                    Column2 = "$" + dvcItem.InsPri;
                                                    FurtherRow = [{
                                                        value1: Column1,
                                                        value2: Column2
                                                    }];
                                                    FurtherRow.forEach(element => {
                                                        Furthertemp = [element.value1, element.value2];
                                                        Qrows3.push(Furthertemp);
                                                    }
                                                    );
                                                }
                                            }
                                            if (dvcItem.RemTerm != "" && dvcItem.Action == "Existing") {
                                                Column1 = dvcItem.Item__Name + " (" + dvcItem.RemTerm + " month's remaining)";
                                                Column2 = "$" + dvcItem.Monthly__Repayment;
                                                FurtherRow = [{
                                                    value1: Column1,
                                                    value2: Column2
                                                }];
                                                FurtherRow.forEach(element => {
                                                    Furthertemp = [element.value1, element.value2];
                                                    Qrows3.push(Furthertemp);
                                                }
                                                );
                                            }
                                        }
                                    });
                                    doc.autoTable("", Qrows3, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                //Marvin: Added 
                                if (existRoot.TabletItem.length > 0) {
                                    y = y + 4;
                                    Qrows3 = [];
                                    //doc.setFontStyle(metaData.textStyle.bold);
                                    //doc.text("Device", x + 5, y);
                                    //doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.TabletItem.sort(function(a, b) {
                                        return parseFloat(a.Action) - parseFloat(b.Action);
                                    });
                                    existRoot.TabletItem.forEach(function(dvcItem, dvcIdx) {
                                        if (dvcItem.Action != "Delete") {
                                            if (dvcItem.DeviceTerm != "" && dvcItem.Action == "Add") {
                                                if (dvcItem.Prepayment__Amount > 0) {
                                                    Column1 = dvcItem.UI__Source_Product_Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.DeviceTerm + ") \n\t[Adjusted Prepayment Amount $" + dvcItem.Prepayment__Amount + "]";
                                                } else {
                                                    Column1 = dvcItem.UI__Source_Product_Name + " (" + parseFloat(dvcItem.UI__RRP__Inc__GST).toFixed(2) + " Incl. GST over " + dvcItem.DeviceTerm + ")";
                                                }
                                                Column2 = (dvcItem.Monthly__Repayment.indexOf("$") > -1) ? dvcItem.Monthly__Repayment : "$" + dvcItem.Monthly__Repayment;
                                                //Marvin : Added condition to only add "$" when it does not exist.
                                                FurtherRow = [{
                                                    value1: Column1,
                                                    value2: Column2
                                                }];
                                                FurtherRow.forEach(element => {
                                                    Furthertemp = [element.value1, element.value2];
                                                    Qrows3.push(Furthertemp);
                                                }
                                                );
                                                if (dvcItem.Insurance != "") {
                                                    Column1 = "\t" + dvcItem.Insurance + " for " + dvcItem.UI__Source_Product_Name;
                                                    Column2 = "$" + dvcItem.InsPri;
                                                    FurtherRow = [{
                                                        value1: Column1,
                                                        value2: Column2
                                                    }];
                                                    FurtherRow.forEach(element => {
                                                        Furthertemp = [element.value1, element.value2];
                                                        Qrows3.push(Furthertemp);
                                                    }
                                                    );
                                                }
                                            }
                                            if (dvcItem.RemTerm != "" && dvcItem.Action == "Existing") {
                                                Column1 = dvcItem.Item__Name + " (" + dvcItem.RemTerm + " month's remaining)";
                                                Column2 = "$" + dvcItem.UI__Source_Product_Name;
                                                FurtherRow = [{
                                                    value1: Column1,
                                                    value2: Column2
                                                }];
                                                FurtherRow.forEach(element => {
                                                    Furthertemp = [element.value1, element.value2];
                                                    Qrows3.push(Furthertemp);
                                                }
                                                );
                                            }
                                        }
                                    });
                                    doc.autoTable("", Qrows3, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (existRoot.SecondaryItem.length > 0) {
                                    y = y + 8;
                                    Qrows4 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Secondary Device", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.SecondaryItem.sort(function(a, b) {
                                        return parseFloat(b.Monthly__Repayment) - parseFloat(a.Monthly__Repayment);
                                    });
                                    existRoot.SecondaryItem.forEach(function(sdItem, sdIdx) {
                                        if (sdItem.Term != "" && sdItem.Action == "Add") {
                                            if (Number(sdItem.Prepayment__Amount) > 0) {
                                                Column1 = sdItem.Item__Name + " (" + sdItem.RRP__Inc__GST + " Incl. GST over " + sdItem.Term + ") \n\t[Adjusted Prepayment Amount $" + sdItem.Prepayment__Amount + "]";
                                            } else {
                                                Column1 = sdItem.Item__Name + " (" + sdItem.RRP__Inc__GST + " Incl. GST over " + sdItem.Term + ")";
                                            }
                                            //Column2 = "$" + sdItem.Monthly__Repayment;
                                            Column2 = (sdItem.Monthly__Repayment.indexOf("$") > -1) ? sdItem.Monthly__Repayment : "$" + sdItem.Monthly__Repayment;
                                            //Marvin : Added condition to only add "$" when it does not exist.
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows4.push(Furthertemp);
                                            }
                                            );
                                            if (sdItem.Insurance != "") {
                                                Column1 = "\t" + sdItem.Insurance + " for " + sdItem.Item__Name;
                                                Column2 = "$" + sdItem.InsPri;
                                                FurtherRow = [{
                                                    value1: Column1,
                                                    value2: Column2
                                                }];
                                                FurtherRow.forEach(element => {
                                                    Furthertemp = [element.value1, element.value2];
                                                    Qrows4.push(Furthertemp);
                                                }
                                                );
                                            }
                                        } else if (sdItem.RemTerm != "") {
                                            Column1 = sdItem.Item__Name + " (" + sdItem.RemTerm + " month's remaining)";
                                            Column2 = "$" + sdItem.Monthly__Repayment;
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows4.push(Furthertemp);
                                            }
                                            );
                                        }
                                    });
                                    doc.autoTable("", Qrows4, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (existRoot.AccItem.length > 0) {
                                    y = y + 8;
                                    Qrows5 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Accessories", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.AccItem.sort(function(a, b) {
                                        return parseFloat(b.Monthly__Repayment) - parseFloat(a.Monthly__Repayment);
                                    });
                                    existRoot.AccItem.forEach(function(acItem, acIdx) {
                                        if (acItem.Action == "Add") {
                                            /*if (Number(acItem.Prepayment__Amount) > 0)
												Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ") \n\t[Adjusted Prepayment Amount $" + acItem.Prepayment__Amount + "]";
											else
												Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ")";
											Column2 = "$" + acItem.Monthly__Repayment;*/
                                            //Marvin: CM-5563 : Added as Monthly repayment is not available in Accessory.
                                            Column1 = acItem.Accessory__Name;
                                            Column2 = "$" + acItem.Accessory__RRP__Inc__GST;
                                            //Marvin : Added for CM-5563 fixed
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows5.push(Furthertemp);
                                            }
                                            );
                                        } else if (acItem.Action == "Existing") {
                                            Column1 = "APP Contract with " + acItem.Number__of__Accessories + " Accessories (" + acItem.RemTerm + " month's remaining)";
                                            Column2 = "$" + acItem.Monthly__Repayment;
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows5.push(Furthertemp);
                                            }
                                            );
                                        } else {}
                                    });
                                    doc.autoTable("", Qrows5, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (existRoot?.fixedAccItem?.length > 0) {
                                    //Dhana_19feb
                                    y = y + 8;
                                    Qrows5 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Accessories", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.fixedAccItem.sort(function(a, b) {
                                        return parseFloat(b.Monthly__Repayment) - parseFloat(a.Monthly__Repayment);
                                    });
                                    existRoot.fixedAccItem.forEach(function(acItem, acIdx) {
                                        if (acItem.Action == "Add") {
                                            /*if (Number(acItem.Prepayment__Amount) > 0)
												Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ") \n\t[Adjusted Prepayment Amount $" + acItem.Prepayment__Amount + "]";
											else
												Column1 = acItem.Accessory__Name + " (" + acItem.Accessory__RRP__Inc__GST + " Incl. GST over " + acItem.Term + ")";
											Column2 = "$" + acItem.Monthly__Repayment;*/
                                            //Marvin: CM-5563 : Added as Monthly repayment is not available in Accessory.
                                            Column1 = acItem.Accessory__Name;
                                            Column2 = "$" + acItem.Accessory__RRP__Inc__GST;
                                            //Marvin : Added for CM-5563 fixed
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows5.push(Furthertemp);
                                            }
                                            );
                                        } else if (acItem.Action == "Existing") {
                                            Column1 = "APP Contract with " + acItem.Number__of__Accessories + " Accessories (" + acItem.RemTerm + " month's remaining)";
                                            Column2 = "$" + acItem.Monthly__Repayment;
                                            FurtherRow = [{
                                                value1: Column1,
                                                value2: Column2
                                            }];
                                            FurtherRow.forEach(element => {
                                                Furthertemp = [element.value1, element.value2];
                                                Qrows5.push(Furthertemp);
                                            }
                                            );
                                        } else {}
                                    });
                                    doc.autoTable("", Qrows5, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (existRoot.PackItem.length > 0) {
                                    y = y + 8;
                                    Qrows6 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Packs, Passes, and Add-Ons", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.PackItem.forEach(function(packItem, packIdx) {
                                        if (packItem.Period)
                                            Column1 = packItem.Name + " (for " + packItem.Period + " Months)";
                                        else
                                            Column1 = packItem.Name;
                                        Column2 = "$" + parseFloat(packItem.Price).toFixed(2);
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows6.push(Furthertemp);
                                        }
                                        );
                                    });
                                    doc.autoTable("", Qrows6, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                /*if (existRoot.FeeRollItem.Name != "" && existRoot.FeeRollItem.Name != null && existRoot.FeeRollItem.Action == "Add") {
									y = y + 8;
									Qrows10 = [];
									doc.setFontStyle(metaData.textStyle.bold);
									doc.text("Early Upgrade Fee Rollover", x + 5, y);
									doc.setFontStyle(metaData.textStyle.normal);
									if (existRoot.FeeRollItem.Period)
										Column1 = existRoot.FeeRollItem.Name + " (for " + existRoot.FeeRollItem.Period + " Months)";
									else
										Column1 = existRoot.FeeRollItem.Name;
									Column2 = "$" + existRoot.FeeRollItem.Price;
									FurtherRow = [{
											value1: Column1,
											value2: Column2
										}
									];
									FurtherRow.forEach(element => {
										Furthertemp = [element.value1, element.value2];
										Qrows10.push(Furthertemp);
									});
									doc.autoTable("", Qrows10, {
										startY: (number = y += 1),
										margin: {
											left: x + 5
										},
										tableWidth: 180,
										headStyles: {
											fillColor: [255, 255, 255],
											textColor: [0, 0, 0]
										},
										bodyStyles: {
											fillColor: [255, 255, 255],
											textColor: [0, 0, 0]
										},
										columnStyles: {
											0: cStyle.leftCell,
											1: cStyle.rightCell
										}
									});
									y = doc.lastAutoTable.finalY;
								}*/
                                if (existRoot.CreditItem) {
                                    y = y + 8;
                                    Qrows9 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Credits", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.CreditItem.forEach(function(crdItem, crdIdx) {
                                        if (crdItem.Period)
                                            Column1 = crdItem.Name + " (for " + crdItem.Period + " Months)";
                                        else
                                            Column1 = crdItem.Name;

                                        Column2 = "-$" + parseFloat(crdItem.Price).toFixed(2);

                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows9.push(Furthertemp);
                                        }
                                        );
                                    });
                                    doc.autoTable("", Qrows9, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (existRoot.DDItem) {
                                    y = y + 8;
                                    Qrows14 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("Device Discount", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.DDItem.forEach(function(ddItem, ddIdx) {
                                        if (ddItem.Period)
                                            Column1 = ddItem.Name + " (for " + ddItem.Period + " Months)";
                                        else
                                            Column1 = ddItem.Name;
                                        Column2 = "-$" + parseFloat(ddItem.Price).toFixed(2);
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows14.push(Furthertemp);
                                        }
                                        );
                                    });
                                    doc.autoTable("", Qrows14, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (existRoot.BonusItem) {
                                    y = y + 8;
                                    Qrows15 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    if (sRelSwitch == "Y")
                                        doc.text("Offers", x + 5, y);
                                    else
                                        doc.text("Bonus", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.BonusItem.forEach(function(bItem, bIdx) {
                                        if (bItem.Period) {
                                            if (sRelSwitch != "Y" && bItem.UI_Type == "BundleSave")
                                                Column1 = bItem.Name + " (" + bItem.Period + ")";
                                            else
                                                Column1 = bItem.Name + " (for " + bItem.Period + " Months)";
                                        } else if (sRelSwitch == "Y" && bItem.Name == "MSP Discount") {
                                            Column1 = "MSP Discount";
                                        } else {
                                            Column1 = parseFloat(bItem.Name).toFixed(2);
                                        }
                                        if (bItem.Price && bItem.GPI !== "Bonus IDD")
                                            Column2 = "-$" + parseFloat(bItem.Price).toFixed(2);
                                        else
                                            Column2 = "";

                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows15.push(Furthertemp);
                                        }
                                        );
                                    });
                                    doc.autoTable("", Qrows15, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                /*if (existRoot.TradeItem.Name != "" && existRoot.TradeItem.Name != null && existRoot.TradeItem.Action == "Add") {
									y = y + 8;
									Qrows12 = [];
									doc.setFontStyle(metaData.textStyle.bold);
									doc.text("Trade In", x + 5, y);
									doc.setFontStyle(metaData.textStyle.normal);
									var tPrice = 0;
									if (existRoot.TradeItem.Period) {
										Column1 = existRoot.TradeItem.Name + " ($" + existRoot.TradeItem.Price + " for " + existRoot.TradeItem.Period + " Months)";
										tPrice = Number(existRoot.TradeItem.Price / existRoot.TradeItem.Period);
									} else {
										Column1 = existRoot.TradeItem.Name;
										tPrice = Number(existRoot.TradeItem.Price);
									}
									Column2 = "-$" + parseFloat(tPrice).toFixed(2);
									FurtherRow = [{
											value1: Column1,
											value2: Column2
										}
									];
									FurtherRow.forEach(element => {
										Furthertemp = [element.value1, element.value2];
										Qrows12.push(Furthertemp);
									});
									doc.autoTable("", Qrows12, {
										startY: (number = y += 1),
										margin: {
											left: x + 5
										},
										tableWidth: 180,
										headStyles: {
											fillColor: [255, 255, 255],
											textColor: [0, 0, 0]
										},
										bodyStyles: {
											fillColor: [255, 255, 255],
											textColor: [0, 0, 0]
										},
										columnStyles: {
											0: cStyle.leftCell,
											1: cStyle.rightCell
										}
									});
									y = doc.lastAutoTable.finalY;
								}*/
                                if (existRoot.OtpItem) {
                                    y = y + 8;
                                    Qrows11 = [];
                                    doc.setFontStyle(metaData.textStyle.bold);
                                    doc.text("One-time payments", x + 5, y);
                                    doc.setFontStyle(metaData.textStyle.normal);
                                    existRoot.OtpItem.forEach(function(otpItem, otpIdx) {
                                        Column1 = otpItem.Name;
                                        Column2 = "$" + otpItem.Price;
                                        FurtherRow = [{
                                            value1: Column1,
                                            value2: Column2
                                        }];
                                        FurtherRow.forEach(element => {
                                            Furthertemp = [element.value1, element.value2];
                                            Qrows11.push(Furthertemp);
                                        }
                                        );
                                    });
                                    doc.autoTable("", Qrows11, {
                                        startY: (number = y += 1),
                                        margin: {
                                            left: x + 5
                                        },
                                        tableWidth: 180,
                                        headStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        bodyStyles: {
                                            fillColor: [255, 255, 255],
                                            textColor: [0, 0, 0]
                                        },
                                        columnStyles: {
                                            0: cStyle.leftCell,
                                            1: cStyle.rightCell
                                        }
                                    });
                                    y = doc.lastAutoTable.finalY;
                                }
                                if (scJson.QuoteHeader.RootItem.length != (rliIdx + 1)) {
                                    doc.setDrawColor(0, 0, 0);
                                    doc.line(x, y + 4, x + 157, y + 4);
                                }
                                y = doc.lastAutoTable.finalY;
                                console.log(existRoot.Id + "-->" + y);
                            }
                            //end of update check
                        });
                        //end of Existing Services Check
                    }
                }
                doc.setDrawColor(0, 0, 0);
                doc.line(x, y + 4, x + 190, y + 4);
                y = y + 4;
                console.log("after 1" + "-->" + y);
                doc.autoTable("", RQIrows2, {
                    startY: (number = y += 7),
                    margin: {
                        left: x
                    },
                    tableWidth: 200,
                    headStyles: {
                        fillColor: [255, 255, 255],
                        textColor: "black"
                    },
                    bodyStyles: {
                        fillColor: [255, 255, 255],
                        textColor: "black"
                    },
                    columnStyles: {
                        0: {
                            columnWidth: 170,
                            fillColor: [255, 255, 255],
                            fontStyle: "bold",
                            cellPadding: {
                                top: 1,
                                right: 0,
                                bottom: 0,
                                left: 2
                            }
                        },
                        1: {
                            columnWidth: 30,
                            fillColor: [255, 255, 255],
                            fontStyle: "bold",
                            cellPadding: {
                                top: 1,
                                right: 0,
                                bottom: 0,
                                left: 0
                            }
                        }
                    }
                });
                console.log("after 2" + "-->" + y);
                doc.addPage();
                doc.setFontSize(12);
                doc.setFontStyle(metaData.textStyle.bold);
                doc.text("Terms and conditions", x, 30);
                doc.setFontStyle(metaData.textStyle.normal);
                var footerText = "This price breakdown is based on what you have been provided by your Vodafone sales agent today and is used for indicative purposes only. All pricing included is subject to change. Ask your Vodafone sales agent in-store or call 1300 650 410 for more information. For Vodafone’s policies and full terms and conditions, please visit ";
                var wrappedFooterText = doc.splitTextToSize(footerText, doc.internal.pageSize.width - 20);
                doc.text(wrappedFooterText, 10, 40);
                doc.setTextColor(0, 0, 255);
                doc.textWithLink('https://www.vodafone.com.au/about/legal', 63, 54.5, {
                    url: 'https://www.vodafone.com.au/about/legal'
                });
                doc.setTextColor(0, 0, 0);
                doc.setFontStyle(metaData.textStyle.normal);
                doc.setFontSize(metaData.fontSize.ten);
                doc.setFontSize(12);
                doc.setFontStyle(metaData.textStyle.bold);
                /* commented until business confirmation
				if (SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "TPG" || SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "iiNet")
				{
                  //do nothing
				}
				*/

                doc.text("Trade-in credit:", x, 65);
                doc.setFontStyle(metaData.textStyle.normal);
                var footerText1 = "The Trade-in credit amount that has been provided in this quote is based off the device model and condition that was mentioned to your Vodafone sales agent. Final Trade-in credit will be determined on physical condition assessment of each specific device. For full terms and conditions on Trade-in, please visit ";
                var wrappedFooterText1 = doc.splitTextToSize(footerText1, doc.internal.pageSize.width - 20);
                doc.text(wrappedFooterText1, 10, 75);
                doc.setTextColor(0, 0, 255);
                doc.textWithLink('https://tradein.vodafone.com.au/', 33, 89.5, {
                    url: 'https://tradein.vodafone.com.au/'
                });

                doc.setTextColor(0, 0, 0);
                doc.setFontStyle(metaData.textStyle.normal);
                doc.setFontSize(metaData.fontSize.ten);
                doc.addImage(loadImage(), "PNG", x + 135, doc.internal.pageSize.height - 30, 14, 14);
                doc.setFontSize(22);
                doc.setFontStyle(metaData.textStyle.bold);
                doc.setTextColor(255, 0, 0);
                doc.text("vodafone", x + 153, doc.internal.pageSize.height - 20);
                doc.setFontSize(metaData.fontSize.ten);
                doc.setFontStyle(metaData.textStyle.normal);
                doc.setTextColor(0, 0, 0);
                console.log("after 3" + "-->" + y);
                y = doc.lastAutoTable.finalY;
                $("#pdf_preview_sc").attr("src", doc.output("datauristring"));
                doc.viewerPreferences({
                    "HideToolbar": true
                }, true);
                return doc;
            }
            ;
            var loadImage = function() {
                return "data:image/png;base64,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";
            };
            var vflogohz = function() {
                return "data:image/png;base64,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";
            }
            var vfaward = function() {
                return "data:image/png;base64,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";
            }

            var vfnetwork = function() {
                return "data:image/png;base64,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";
            }
            var vfroam = function() {
                return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozMWEzMWRmMi02YTBkLTQ5NzEtYmE3Ni03MmE1OGVkNjhlMDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODY5QURGM0M4OUI3MTFFOTk5MTlGREYyMzQyRTlFM0IiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODY5QURGM0I4OUI3MTFFOTk5MTlGREYyMzQyRTlFM0IiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpjNmVkMDI4Yy04NTcwLTRjNDQtYjdlMi0xMzNmNzcwMjE2NzUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzFhMzFkZjItNmEwZC00OTcxLWJhNzYtNzJhNThlZDY4ZTA1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";
            }
            VHANSASalesCalcUpgradePDFPR.prototype.EndLife = function() {
                SiebelAppFacade.VHANSASalesCalcUpgradePDFPR.superclass.EndLife.apply(this, arguments);
            }
            ;
            return VHANSASalesCalcUpgradePDFPR;
        }
        )();
        return "SiebelAppFacade.VHANSASalesCalcUpgradePDFPR";
    });
}
