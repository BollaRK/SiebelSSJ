if (typeof(SiebelAppFacade.VHALFOrderReviewSSJPR) === "undefined") {

    SiebelJS.Namespace("SiebelAppFacade.VHALFOrderReviewSSJPR");
    define("siebel/custom/VHALFOrderReviewSSJPR", ["siebel/viewpr", "siebel/custom/VHASSJValidations"],
        function() {
            SiebelAppFacade.VHALFOrderReviewSSJPR = (function() {

                function VHALFOrderReviewSSJPR(pm) {
                    SiebelAppFacade.VHALFOrderReviewSSJPR.superclass.constructor.apply(this, arguments);
                }

                SiebelJS.Extend(VHALFOrderReviewSSJPR, SiebelAppFacade.ViewPR);
                var siebMsg;
                var quoteNum = "";
                var quoteId = "";
                var ExistingCustomerFlag = "N";
                var sCustomerIDEL = "";

                //function to check if we need to display list applet or not
                function displayListApplet(propSet, container) {
                    var isDisplay = false;
                    var childExist = propSet.GetChildByType(container);
                    if (childExist) {
                        var childCount = childExist.GetChildCount();
                        if (childCount > 0)
                            isDisplay = true;
                    }

                    var stockIndicator = propSet.GetProperty("StockIndicator");
                    if (container == "ListOfShippingDetails" && stockIndicator == "In Stock")
                        isDisplay = false;

                    return isDisplay;
                }

                function callStockAvailability($shippingDiv, quoteId) {
                    new Promise(function(resolve, reject) {
                        setTimeout(() => {
                            try {
                                var searchstring = "";
                                var sPostalCode = "";

                                var shipApplet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA SSJ Order Review Shipping Address Form Applet"];
                                if (shipApplet) {
                                    var addr = shipApplet.GetBusComp().GetFieldValue("Cal Full Address");
                                    var postalCodeMatch = addr.match(/\b\d{4}\b/);
                                    sPostalCode = postalCodeMatch ? postalCodeMatch[0] : "";
                                }

                                var finalOutput;
                                $shippingDiv.find("table tr:not(:first)").each(function() {
                                    var skuCod = $(this).attr("sku-code");
                                    var type = $(this).attr("device-type");
                                    var name = $(this).attr("device-name");
                                    var searchCombination = type + ":" + skuCod + ":" + name;
                                    if (searchstring == "")
                                        searchstring = searchCombination;
                                    else
                                        searchstring = searchstring + "||" + searchCombination;
                                });
                                //searchstring = 'Mobile:SM-A165FZKAATS:SAMSUNG GALAXY A16 4G BLACK';
                                var Options = {};
                                var inp = SiebelApp.S_App.NewPropertySet();
                                var resultSet = SiebelApp.S_App.NewPropertySet();
                                inp.SetProperty("PostalCode", sPostalCode);
                                inp.SetProperty("QuoteId", quoteId);
                                inp.SetProperty("SearchString", searchstring);
                                resultSet = VHAAppUtilities.CallBS("VF SSJ Order review Utilities BS", "callStockCheck", inp, Options);
                                var outSiebMsg = resultSet?.GetChildByType("SiebelMessage");
                                if (outSiebMsg != undefined && outSiebMsg != null)
                                    finalOutput = outSiebMsg?.childArray?.[0]?.childArray?.[0]?.childArray;
                                resolve(finalOutput);

                            } catch (e) {
                                reject(e);
                            }
                        }, 5000);
                    }).then(function(output) {
                        let stockMap = {};
                        let deliverydateMap = {};
                        let shipmentdateMap = {};
                        for (var i = 0; i < output.length; i++) {
                            var psList = output[i];
                            for (var j = 0; j < psList.GetChildCount(); j++) {
                                var childPS = psList.GetChild(j);
                                var sKUCode = childPS.GetProperty("SKU");
                                var errCode = childPS.GetProperty("ErrorCode");
                                var stockAvailability = childPS.GetProperty("StockAvailability");
                                var estDlvDt = childPS.GetProperty("EstDeliveryDt");
                                var estShipDt = childPS.GetProperty("EstShipmentDt");

                                if (errCode == "1001") {
                                    stockMap[sKUCode] = "Stock check failed";
                                    deliverydateMap[sKUCode] = "Unknown";
                                    shipmentdateMap[sKUCode] = "Unknown";
                                } else {
                                    stockMap[sKUCode] = stockAvailability;
                                    deliverydateMap[sKUCode] = estDlvDt;
                                    shipmentdateMap[sKUCode] = estShipDt;
                                }
                            }
                        }

                        var unknownFlg = "N";
                        for (var sku in stockMap) {
                            if (stockMap.hasOwnProperty(sku)) {
                                var $row = $shippingDiv.find("table tr[sku-code='" + sku + "']");
                                var stockAvailability = stockMap[sku];
                                var deliveryDate = deliverydateMap[sku];
                                var shippingDate = shipmentdateMap[sku];
                                var type = "Estimated delivery";
                                var dt = "";

                                if (stockAvailability == "Available" || stockAvailability == "Low Stock") {
                                    type = "Estimated delivery";
                                    if (deliveryDate == "" || deliveryDate == null)
                                        dt = "Unknown";
                                    else
                                        dt = deliveryDate;
                                } else if (stockAvailability == "Out of Stock" || stockAvailability == "Non-Orderable" || stockAvailability == "Back Order") {
                                    type = "Estimated shipping";
                                    if (shippingDate == "" || shippingDate == null)
                                        dt = "Unknown";
                                    else
                                        dt = shippingDate;
                                } else
                                    dt = "Unknown"

                                $row.find("td.type").text(type);
                                $row.find("td.date").text(dt);
                                $row.find("td.stockAvailability").text(stockAvailability);

                                if (dt == "Unknown")
                                    unknownFlg = "Y";
                            }
                        }
                        if (unknownFlg == "Y") {
                            $shippingDiv.find(".shipping_Info").show();
                            $shippingDiv.find(".shipping_Info .infoContent span").text("There are items in this order with an unknown shipping date. Customer will receive an SMS notification with the estimated shipping details once the fulfilment order has been submitted.");
                        }

                    }).catch(function(error) {

                    });
                }

                function attachPostInvokeMethod(appletName, MethodName) {
                    var pm, appletId, msg = "",
                        appletMap;
                    appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap()[appletName];

                    if (appletMap) {
                        appletId = appletMap.GetFullId();
                        appletId = "s_" + appletId + "_div";
                        pm = appletMap.GetPModel();
                        pm.AttachPostProxyExecuteBinding(MethodName, function(methodName, inputPS, outputPS) {
                            $("#" + appletId + " .vha-ssj-dialogbox_success").remove();
                            if (outputPS.GetProperty("Status") == "Completed") {
                                if (methodName == "GenerateContract") {
                                    if (pm.Get("GetRecordSet").length > 0)
                                        msg = "Contract generated";
                                } else if (methodName == "SendEmail")
                                    msg = "Email sent";

                                if (msg != "") {
                                    var html = `<div class="vha-ssj-dialogbox_success"><div id="vha-errmsg-ln" class="vha-errmsg-ln" >${msg}</div></div>`;
                                    $("#" + appletId + " .siebui-applet-content").before(html);
                                }
                            }
                        });
                    }
                }

                function getTnCApplet(siebMsg) {
                    var head = $(".customHeading2").text();
                    var name = head.split(" (")[0];
                    var html = `<div class='TnCApplet'>
					<div class='header'>Terms & conditions</div>

					<div class='infoContainer'>
					<div class='infoIcon'></div>
					<div class='infoContent'>
					<span>Reminder to review terms & conditions with customer.</span>
					<span class='link'><a href="">Terms & conditions in OneSource</a></span>
					</div>
					</div>
					<div class='content'>
					<span class='name'>` + name + `</span>
					<span class='text'>will receive the following Terms & Condition SMS</span>
					</div>

					<div class="existingContact">
					<span class='content'> Existing contacts </span>
					<div class='interactive'>
					<div class='input'>
					<select name="phoneNum" id="phoneNum">`;

                    for (var i = 0; i < siebMsg.GetChildCount(); i++) {
                        var node = siebMsg.GetChild(i);
                        html += `<option 
						value='` + node.GetProperty("phoneNumber") + `' 
						role='` + node.GetProperty("Role") + `'>
						+` + node.GetProperty("phoneNumber") + ` (` + node.GetProperty("Role") + `)</option>`;
                    }

                    html += `</select></div>
					<div class='button'>
					<button type="button">Send mandatory SMS now</button>
					</div>
					</div>
					</div>

					<table>
					<tbody>
					<tr>
					<th>Order type</th>
					<th>MSISDN</th>
					<th>Item in cart</th>
					<th>Included mandatory SMS</th>
					</tr>
					<tr>
					<td>Upgrade</td>
					<td>61441234569</td>
					<td>Small Plan</td>
					<td>T&C Small Plan $45
						<br/> Critical Information Summary
						<br/> VCA Speed Guide</td>
					</tr>
					</tbody>
					</table>
					</div>`;
                    return html;

                }

                function addExtraButton() {
                    var html = `<div class="orderReviewExtraButtons"><button type="button" id="PurchaseAndOfferDetails">Purchase & offer details</button><button type="button" id="editInCart">Edit in cart</button></div>`;
                    $(".customHeading1").before(html);
                    var Options = {};
                    $(".orderReviewExtraButtons #editInCart").off("click").on("click", function() {
                        SiebelApp.S_App.SetProfileAttr("FromResumeQuote", "Y");
                        SiebelApp.S_App.SetProfileAttr("SSJParentOrderId", quoteId);
                        SiebelApp.S_App.SetProfileAttr("SSJParentOrderId", quoteId);
                        SiebelApp.S_App.SetProfileAttr("FromProdConfig", quoteId);
                        SiebelApp.S_App.SetProfileAttr("BackToCartSSJ", "Y");
                        var inputPropSet = SiebelApp.S_App.NewPropertySet();
                        var outputPropSet = SiebelApp.S_App.NewPropertySet();
                        inputPropSet.SetProperty("View", "VHA Sales Calculator SSJ View");
                        inputPropSet.SetProperty("Business Component", "Order Entry - Orders");
                        inputPropSet.SetProperty("Row Id", quoteId);
                        outputPropSet = VHAAppUtilities.CallBS("Shopping Service", "GotoView", inputPropSet, Options);
                    });
                    $(".orderReviewExtraButtons button[id='PurchaseAndOfferDetails']").off("click").on("click", function() {
                        /* var inp = SiebelApp.S_App.NewPropertySet();
                        var out = SiebelApp.S_App.NewPropertySet();
                        inp.SetProperty("QuoteId", quoteId);
                        out = VHAAppUtilities.CallBS("VF SSJ Order review Utilities BS", "getHTML", inp, Options); 
						var popupHtml = out.GetProperty("FullHTML");*/

                      /*  var wfBSS = SiebelApp.S_App.GetService("Workflow Process Manager");
                        var wfInput = SiebelApp.S_App.NewPropertySet();
                        var wfOut = SiebelApp.S_App.NewPropertySet();
                        wfInput.SetProperty("ProcessName", "VHA SSJ Upsert Query Cart Details Process WF");
                        wfInput.SetProperty("Object Id", quoteId);
                        wfInput.SetProperty("Method", "Query");
                        wfInput.SetProperty("RecordType", "PurchaseOfferHTML");
                        wfOut = wfBSS.InvokeMethod("RunProcess", wfInput);
                        var popupHtml = wfOut?.GetChildByType("ResultSet")?.GetChild(0)?.GetChild(0)?.GetChild(0)?.GetProperty("CartDetails");
                        const overlayHtml = `<div id="customOverlay" class="customOverlay ui-widget-overlay"></div>`;
                        $('body').append(overlayHtml).append(popupHtml);
                        $('#customPopup #vha-orr-sec').addClass('no-padding-vha-orr'); //chandrika
                        $('#closePopup, #customOverlay').on('click', function() {
                            $('#customPopup #vha-orr-sec').removeClass('no-padding-vha-orr'); //chandrika
                            $('#customOverlay, #customPopup').remove();
							wfBSS = null;
							wfInput = null;
							wfOut = null;
							popupHtml = null;
                        });
						wfBSS = null;
						wfInput = null;
						wfOut = null;
						popupHtml = null; */
                    });
                }

                function bindOrderHeaderExpandCollapse() {
                    $(document).off("click.expanicon").on("click.expanicon", ".expanicon", function() {
                        var $icon = $(this);
                        var $container = $icon.closest("[id='orderReviewContainer']");
                        if (!$container.length) {
                            return;
                        }

                        var $innerSections = $container.children().not("#orderHeader");
                        var isCollapsed = !!$container.data("isCollapsed");
                        var $img = $icon.find("img");

                        if (isCollapsed) {
                            // Expand
                            var visibleSections = $container.data("visibleSectionsBeforeCollapse") || [];
                            $innerSections.hide();
                            if (visibleSections.length) {
                                $(visibleSections).show();
                            }
                            $container.data("isCollapsed", false);
                            $img.css("transform", "rotate(0deg)");
                        } else {
                            // Collapse
                            var currentlyVisible = $innerSections.filter(function() {
                                return $(this).css("display") !== "none";
                            }).toArray();
                            $container.data("visibleSectionsBeforeCollapse", currentlyVisible);
                            $innerSections.hide();
                            $container.data("isCollapsed", true);
                            $img.css("transform", "rotate(180deg)");
                        }
                    });
                }

                function getAppletId(appletMap, appletName) {
                    var applet = appletMap[appletName];
                    var appletId = "";
                    if (applet) {
                        var pm = applet.GetPModel();
                        appletId = pm.Get("GetFullId");
                        appletId = "s_" + appletId + "_div";
                    }
                    return appletId;
                }

                //function to get the entire SiebelMessage
                function getSiebelMessage(quoteNum, quoteId, ExistingCustomerFlag) {
                    var Options = {};
                    var inp = SiebelApp.S_App.NewPropertySet();
                    var out = SiebelApp.S_App.NewPropertySet();
                    inp.SetProperty("QuoteNum", quoteNum);
                    inp.SetProperty("ExtCust", ExistingCustomerFlag);
                    inp.SetProperty("QuoteId", quoteId);
                    inp.SetProperty("TotalAmount", sessionStorage.getItem("ReqMinPP"));
                    out = VHAAppUtilities.CallBS("VF SSJ Order review Utilities BS", "GetOrderHeader", inp, Options);
                    return (out);
                }


                function renderCheckbox(value) {
                    return `<input type="checkbox" ${value === "Y" ? "checked" : ""} disabled>`;
                }

                function getChildOrders(quoteNum) {
                    var Options = {};
                    var inp = SiebelApp.S_App.NewPropertySet();
                    var out = SiebelApp.S_App.NewPropertySet();

                    inp.SetProperty("QuoteNum", quoteNum);
                    out = VHAAppUtilities.CallBS("VF SSJ Order review Utilities BS", "GetChildOrders", inp, Options);
                    childOrders = out.propArray["OrderIds"];
                    return (childOrders);
                }

                //function to get the HeaderContent
                function generateHeaderContent(root) {
                    var isDFAFlow = VHAAppUtilities.isDFAFlow();
                    var dueToday = "";
                    var BillAmt = "";
                    var childOrders = "";

                    if (isDFAFlow) {
                        childOrders = getChildOrders(quoteNum);
                        var ser = SiebelApp.S_App.GetService("Workflow Process Manager");
                        var Inputs = SiebelApp.S_App.NewPropertySet();
                        var Outputs = SiebelApp.S_App.NewPropertySet();
                        Inputs.SetProperty("ProcessName", "VHA DFA Get Order Item Details Process WF");
                        Inputs.SetProperty("ParentOrderId", childOrders);
                        Outputs = ser.InvokeMethod("RunProcess", Inputs);
                        var Result = Outputs.GetChildByType("ResultSet");
                        var SiebelMsg = Result.GetChildByType('SiebelMessage');

                        dueToday = SiebelMsg.propArray["TotalDueToday"];

                        const filterDiscItemType = ["DeviceDiscount", "MSPDiscount", "CreditDiscount"];
                        var totals = {
                            "recurring": {
                                charge: 0,
                                discount: 0
                            }
                        };

                        var SiebMsgCnt = SiebelMsg.GetChildCount();
                        for (var i = 0; i < SiebMsgCnt; i++) {

                            var schild = SiebelMsg.GetChild(i);
                            if (!schild || !schild.propArray) continue;

                            var node = schild.propArray;

                            var itemType = node.ItemType || node["ItemType"];
                            var payType = (node["Type/Expiry"] || "").toLowerCase();
                            var recurring = parseFloat(node["RecurringCharge"] || 0);

                            if (!totals[payType]) continue;

                            // Normal charges
                            if (!filterDiscItemType.includes(itemType)) {
                                totals[payType].charge += recurring;
                            }

                            // Discount items
                            if (filterDiscItemType.includes(itemType)) {
                                totals[payType].discount += recurring;
                            }
                        }
                        BillAmt = Number(totals["recurring"]?.charge - totals["recurring"]?.discount).toFixed(2);
                    } else {
                        dueToday = sessionStorage.getItem("ReqMinPP");
                        dueToday = Number(dueToday);
                        BillAmt = root.GetProperty("MonthlyBill");
                    }
                    if (dueToday == 0 || dueToday == "")
                        dueToday = 0.00;
                    if (BillAmt == 0 || BillAmt == "")
                        BillAmt = 0.00;
                    var billingAccountStatus = (root.GetProperty("BillingAccountStatus") || "").trim();
                    /*var billingAccountStatusIcon = billingAccountStatus === "Active" ?
                        '<span class="order-value-img"></span> ' :
                        "";
                    var html = `<div id = "orderContent">
                    <div id="section">
                        <div class="details">
                            <div class="order-row billingAccount">
                                <div class="order-label">Billing account</div>
                                <div class="order-value">` + root.GetProperty("BillingAccount") + `</div>
                            </div>
                            <div class="order-row status">
                                <div class="order-label">Status</div>
                                <div class="order-value">` + billingAccountStatusIcon + billingAccountStatus + `</div>
                            </div>
                        </div>
                    </div>
                    <div id="section">
                        <div class="details">
                            <div class="order-row nextMontlyBill">
                                <div class="order-label" id="expected-bill">Next monthly bill</div>
                                <div class="order-value"> $` + BillAmt + `</div>
                            </div>*/
						
                        var billingAccountStatusIcon = billingAccountStatus === "Active" ?
                        '<span class="order-value-img"></span> ' : billingAccountStatus === "Overdue" ?
                        '<span class="order-value-overdue"></span> ' :
                        "";
						let ordValue = "";
                        let ordValueStat = "";
                        if(billingAccountStatus  === "Overdue"){
	                    ordValue = `<div class="order-value-od">` + root.GetProperty("BillingAccount") + `</div>`
	                    ordValueStat = `<div class="order-value-od">` + billingAccountStatusIcon + billingAccountStatus + `</div>`
                        }else{
	                    ordValue = `<div class="order-value">` + root.GetProperty("BillingAccount") + `</div>`
	                    ordValueStat = `<div class="order-value">` + billingAccountStatusIcon + billingAccountStatus + `</div>`
                        } 
 
                        var html = `<div id = "orderContent">
                        <div id="section">
                        <div class="details">
                        <div class="order-row billingAccount">
                        <div class="order-label">Billing account</div>
                        `+ ordValue +`
                        </div>
                        <div class="order-row status">
                        <div class="order-label">Status</div>
                        `+ ordValueStat +`
                        </div>
                        </div>
                        </div>
                        <div id="section">
                        <div class="details">
                        <div class="order-row nextMontlyBill">
                        <div class="order-label" id="expected-bill">Next monthly bill</div>
                        <div class="order-value"> $` + BillAmt + `</div>
                        </div>
							
                            <div class="order-row dueDate">
                                <div class="order-label">Due today</div>
                                <div class="order-value"> <span id='val'> $` + dueToday + ` </span><span id='infoIconImg'><img src="images/custom/get_info.svg" class="vha-ign-info"></span></div>
                            </div>
                        </div>
                    </div>
                    </div>
					<div class="BusinessRuleNote vha-ssj-bill-setup-txt vha-ssj-or-alrt1">
						<span class="vha-ssj-billsetup-info-icon"></span>
						<span class="rem-euip-lim"/> 
					</div>`;
                    return html;
                }

                //function to get the Info, Warning or Error block
                function generateInfoheader(block) {
                    var html = "";
                    if (block.toLowerCase().includes("Info".toLowerCase())) {
                        html = `<div class="infoContainer ` + block + ` BusinessRuleNote vha-ssj-bill-setup-txt vha-ssj-or-alrt1">
                        <div class="infoIcon vha-ssj-billsetup-info-icon">
                        </div>
                        <div class="infoContent"><span></span> </div>
                        </div>`;
                    } else if (block.toLowerCase().includes("Warning".toLowerCase())) {
                        html = `<div class="warningContainer ` + block + `">
                        <div class="warningIcon">
                        <img src="warningIcon.svg" />
                        </div>
                        <div class="warningContent"><span></span> </div>
                        </div>`;
                    } else if (block.toLowerCase().includes("Error".toLowerCase())) {
                        html = `<div class="errorContainer ` + block + `">
                        <div class="errorIcon">
                        <img src="errorIcon.svg" />
                        </div>
                        <div class="errorContent"><span></span> </div>
                        </div>`;
                    }
                    return html;
                }

                //function get the button
                function generateButton() {
                    var html = `<button type='button' id="fixedContactDetails">Fixed contact details</button>
                    <button type='button' id="fixedOrderDetails">Fixed order details</button>
                    <button type='button' id="fixedAppntDetails">Fixed appointment details</button>
					<button type='button' id="serviceAddressDetails">Service address details</button>`;
                    return html;
                }

                function generateOrderDetails(propSet) {
                    var orderType = propSet.GetProperty("OrderType");;
                    // var MSISDN = propSet.GetProperty("MSISDN");
                    // if (orderType == "Connect")
                    //     orderType = "New Connect";

                    // var html = `<div id="orderHeader">
                    // <span>` + orderType + ` | ` + MSISDN + `</span>
                    // </div>`;
                    // Defect CM-8721
                    var connectionType = propSet.GetProperty("ConnectionType");
                    var MSISDN = propSet.GetProperty("MSISDN");
                    var RMSISDN = propSet.GetProperty("RMSISDN"); //9310
                    var subType = theApplication().GetProfileAttr("sCOrderSubType") || "";
                    var stockInd = (propSet.GetProperty("StockIndicator") || "").trim() /*Defect 8894*/

                    /* if ((connectionType || "").toLowerCase() === "upgrade" || orderType === "Modify" || subType === "Modify" ) {
                    orderType = "Upgrade";
					} else if (orderType.toLowerCase() === "change proposition" && stockInd === "") { //Defect 8894
                        orderType = "Rate plan change"; //Defect 8894
                    } else if (orderType === "Connect") {
                    orderType = "New Connect";
                    } */
                    var hideForRPC = (orderType === "Rate plan change"); /*Defect 8894*/
					
					var headerText = "";
					
					if(MSISDN == "" || MSISDN == null || MSISDN == undefined)
						headerText = orderType;
					else
						headerText = orderType + " | " + MSISDN
                    
					//var headerText = (RMSISDN && RMSISDN.trim() !== "") ? (orderType + " | " + RMSISDN) : orderType;
					
					
                    var html = `<div id="orderHeader"><span>${headerText}</span><span class="expanicon" style="cursor:pointer;"><img src="images/custom/vha-ign-expaneded_20_20.svg" alt="toggle"></span></div>`; //end CM-8721


                    //var vNotificationMSISDN = (propSet.GetProperty("NotificationMSISDN") === "Y") ? "Checked" : "Unchecked"; /*11032026:RAJUD:added for CM-8023*/
                    var vNotificationMSISDN = propSet.GetProperty("NotificationMSISDN");
                    if (!hideForRPC) {
                        var infoHeader = generateInfoheader("OrderDetails_Info");
                        html += infoHeader;
                        html += `<div class="BusinessRuleNote vha-ssj-bill-setup-txt vha-ssj-or-alrt1 vhassjorinfomsg">
                    <span class="vha-ssj-billsetup-info-icon"></span>
                        Connect outstanding: This may require further action before the order can be completed. Order status will be set to pending until resolved.
					</div>`;
                    }
                    html += `
                    <div id = "buttonContainer"></div><div id="orderContent">
                    <div id="section" class="order-details-or">
                    	<div class="header">Order details</div>
                        <div class="details">
                            <div class="order-row lineItem">
                                <div class="order-label">Line item</div>
                                <div class="order-value">${propSet.GetProperty("LineItem") || "-"}</div>
                            </div>
                            <div class="order-row orderNum">
                                <div class="order-label">Order number</div>
                                <div class="order-value">${propSet.GetProperty("OrderNum") || "-"}</div>
                            </div>
                            <div class="order-row fulfilmentOrder">
                                <div class="order-label">Fulfilment order #</div>
                                <div class="order-value">${propSet.GetProperty("FullFillOrder") || "-"}</div>
                            </div>
                            <div class="order-row orderType">
                                <div class="order-label">Order type</div>
                                <div class="order-value">` + orderType + `</div>
                            </div>
                            <div class="order-row orderStatus">
                                <div class="order-label">Order status</div>
                                <div class="order-value">${propSet.GetProperty("OrderStatus") || "-"}</div>
                            </div>
							`;
                    if (!hideForRPC) {
                        html += `
                                <div class="order-row connectionDate">
                                <div class="order-label">Connection date</div>
                                <div class="order-value">${propSet.GetProperty("ConnectionDate") || "-"}</div>
                                </div>

                                <div class="order-row notificationMSISDN">
                                <div class="order-label">Notification MSISDN</div>
                                <div class="order-value">${vNotificationMSISDN}</div>
                                </div>

                                <div class="order-row eSIMCode">
                                <div class="order-label">eSIM confirmation code</div>
                                <div class="order-value">${propSet.GetProperty("eSIMConfirmationCode") || "-"}</div>
                                </div>
                                `;
                    }
                    html += `
                            <div class="order-row promoCode">
                                <div class="order-label">Promo code</div>
                                <div class="order-value">${propSet.GetProperty("PromoCode") || "-"}</div>
                            </div>
                        </div>
                    </div>
                    <div id="section" class="service-details-or">
                        <div class="header">Service details</div>
                        <div class="details">
                            <div class="order-row connectionType">
                                <div class="order-label">Connection type</div>
                                <div class="order-value">${propSet.GetProperty("ConnectionType") || "-"}</div>
                            </div>
                            <div class="order-row propositionName">
                                <div class="order-label">Proposition</div>
                                <div class="order-value">${propSet.GetProperty("Proposition") || "-"}</div>
                            </div>
                            <div class="order-row planName">
                                <div class="order-label">Plan</div>
                                <div class="order-value">${propSet.GetProperty("Plan") || "-"}</div>
                            </div>
                            <div class="order-row paymentTerm">
                                <div class="order-label">Payment term</div>
                                <div class="order-value">${propSet.GetProperty("PaymentTerm") || "-"}</div>
                            </div>
                        </div>
                    </div>
                    `;
                    if (!hideForRPC) {
                        html += `
                    <div id="section" class="order-management-or">
                        <div class="header">Order management</div>
                        <div class="details">
                            <div class="order-row qrCode">
                                <div class="order-label">QR code message</div>
                                <div class="order-value">${propSet.GetProperty("QRCodeMsg") || "-"}</div>
                            </div>
                            <div class="order-row portIn">
                                <div class="order-label">Port in</div>
                                <div class="order-value">${propSet.GetProperty("PortIn") || "-"}</div>
                            </div>
                            <div class="order-row SIM">
                                <div class="order-label">SIM</div>
                                <div class="order-value">${propSet.GetProperty("SIM") || "-"}</div>
                            </div>
                        </div>
                    </div>
                          `;
                    }
                    html += `
                       </div>
                   `;
                    return html;
                }

                function generateProductDetails(childPropSet) {
                    var html = `<div id="productdetails">
					<h1>Product details</h1>`;
                    var infoHeader = generateInfoheader("prodDetails_Info");
                    html += infoHeader;
                    html += `<table>
					<thead>
					<tr>
					<th class="type" col='0'>Type</th>
					<th class="product" col='1'>Product</th>
					<th class="monthlyDeviceCare" col='2'>Monthly device care</th>
					<th class="paymentTerm" col='3'>Payment term</th>
					<th class="contractAmount" col='4'>Contract amount</th>
					</tr>
					</thead>
					<tbody>` +
                        generateProductDetailsRows(childPropSet) +
                        `</tbody>
					</table>
					</div>`;
                    return html;
                }

                function generateProductDetailsRows(childPropSet) {
                    var html = "";
                    for (var i = 0; i < childPropSet.GetChildCount(); i++) {
                        var node = childPropSet.GetChild(i);
                        html += `<tr>
                        <td class="type" col='0'>` + node.GetProperty("ProductType") + `</td>
                        <td class="product" col='1'>` + node.GetProperty("ProductName") + `</td>
                        <td class="monthlyDeviceCare" col='2'>` + node.GetProperty("MonthlyDeviceCare") + `</td>
                        <td class="paymentTerm" col='3'>` + node.GetProperty("PaymentTerm") + `</td>
                        <td class="contractAmount" col='4'>` + node.GetProperty("RemainContractAmt") + `</td>
                        </tr>`;
                    }
                    return html;
                }

                function generateAddOn(childPropSet) {
                    var html = `<div id="AddOnSelected">
					<h1>Add ons selected</h1>`;
                    var infoHeader = generateInfoheader("AddOnDetails_Info");
                    html += infoHeader;
                    html += `<table>
					<thead>
					  <tr>
					  <th class="name" col='0'>Name</th>
					  <th class="type" col='1'>Type</th>
					  <th class="expiry" col='2'>Expiry</th>
					  <th class="activation" col='3'>Activation</th>
					  <th class="proRatedCredit" col='4'>Prorated credit</th>
					  </tr>
					</thead>
					<tbody>` +
                        generateAddOnRows(childPropSet) +
                        `</tbody>
					</table>
					</div>`;
                    return html;
                }

                function generateAddOnRows(childPropSet) {
                    var html = "";
                    for (var i = 0; i < childPropSet.GetChildCount(); i++) {
                        var node = childPropSet.GetChild(i);
                        html += `<tr>
                      <td class="name" col='0'>` + node.GetProperty("ProductName") + `</td>
                      <td class="type" col='1'>` + node.GetProperty("ProductType") + `</td>
                      <td class="expiry" col='2'>` + node.GetProperty("Expiry Date") + `</td>
					  <td class="activation" col='3'>` + node.GetProperty("Activation") + `</td>
					  <td class="proRatedCredit" col='4'>` + node.GetProperty("ProratedCredit") + `</td>
                      </tr>`;
                    }
                    return html;
                }

                function generateOfferSelected(childPropSet) {
                    var html = `<div id="OfferSelected">
						<h1>Offer selected</h1>`;
                    var infoHeader = generateInfoheader("OfferDetails_Info");
                    html += infoHeader;
                    html += `<table>
						<thead>
						  <tr>
						  <th class="offerCode" col='0'>Offer code</th>
						  <th class="offerName" col='1'>Offer name</th>
						  <th class="addOfferFlg" col='2'>Add offer flag</th>
						  <th class="coExistInd" col='3'>Co exist indicator</th>
						  <th class="offerDesc" col='4'>Offer description</th>
						  <th class="noOfService" col='5'>Number of services trigger</th>
						  <th class="mandatory" col='6'>Mandatory</th>
						  </tr>
						</thead>
						<tbody>` +
                        generateOfferSelectedRows(childPropSet) +
                        `</tbody>
						</table>
						</div>`;
                    return html;
                }

                function generateOfferSelectedRows(childPropSet) {
                    var html = "";
                    for (var i = 0; i < childPropSet.GetChildCount(); i++) {
                        var node = childPropSet.GetChild(i);
                        html += `<tr>
                      <td class="offerCode" col='0'>` + node.GetProperty("OfferCode") + `</td>
                      <td class="offerName" col='1'>` + node.GetProperty("OfferName") + `</td>
                      <td class="addOfferFlg checkBox" col='2'>` + renderCheckbox(node.GetProperty("AddOfferFlag")) + `</td>
                      <td class="coExistInd" col='3'>` + node.GetProperty("CoExistIndicator") + `</td>
                      <td class="offerDesc" col='4'>` + node.GetProperty("OfferDescription") + `</td>
                      <td class="noOfService" col='5'>` + node.GetProperty("NoofServicesTrigger") + `</td>
                      <td class="mandatory checkBox" col='6'>` + renderCheckbox(node.GetProperty("MandatoryIndicator")) + `</td>
                      </tr>`;
                    }
                    return html;
                }

                function generateCharges(childPropSet) {
                    var html = `<div id="charges">
                    <h1>Charges</h1>`;
                    var infoHeader = generateInfoheader("chargeDetails_Info");
                    html += infoHeader;
                    html += `<table>
                    <thead>
                      <tr>
                      <th class="chargeType" col='0'>Charge type</th>
                      <th class="description" col='1'>Description</th>
                      <th class="charge" col='2'>Charge</th>
                      <th class="discount" col='3'>Discount</th>
                      <th class="discountReason" col='4'>Discount reason</th>
                      <th class="netAmount" col='5'>Net amount</th>
                      <th class="relatedId" col='6'>Related ID</th>
                      <th class="EEF" col='7'>EEF/EUF rollover charges</th>
                      </tr>
                    </thead>
                    <tbody>` +
                        generateChargesRows(childPropSet) +
                        `</tbody>
                    </table>
                    </div>`;
                    return html;
                }

                function generateChargesRows(childPropSet) {
                    var html = "";
                    for (var i = 0; i < childPropSet.GetChildCount(); i++) {
                        var node = childPropSet.GetChild(i);
                        html += `<tr>
                      <td class="chargeType" col='0'>` + node.GetProperty("ChargeType") + `</td>
                      <td class="description" col='1'>` + node.GetProperty("Description") + `</td>
                      <td class="charge" col='2'>` + node.GetProperty("Charges") + `</td>
                      <td class="discount" col='3'>` + node.GetProperty("Discount") + `</td>
                      <td class="discountReason" col='4'>` + node.GetProperty("DiscountReason") + `</td>
                      <td class="netAmount" col='5'>` + node.GetProperty("NetAmount") + `</td>
                      <td class="relatedId" col='6'>` + node.GetProperty("RelatedID") + `</td>
                      <td class="EEF" col='7'>` + node.GetProperty("EEFCharges") + `</td>
                      </tr>`;
                    }
                    return html;
                }

                function generatePrepayment(childPropSet) {
                    var html = `<div id="prepayments">
                    <h1>Prepayments</h1>`;
                    var infoHeader = generateInfoheader("prePaymentDetails_Info");
                    html += infoHeader;
                    html += `<table>
                    <thead>
                      <tr>
                      <th class="totalPrepayment" col='0'>Total prepayment</th>
                      <th class="totalMPPPrepayment" col='1'>Total MPP prepayment</th>
                      <th class="totalAPPPrepayment" col='2'>Total APP prepayment</th>
                      </tr>
                    </thead>
                    <tbody>` +
                        generatePrepaymentRows(childPropSet) +
                        `</tbody>
                    </table>
                    </div>`;
                    return html;
                }

                function generatePrepaymentRows(childPropSet) {
                    var html = "";
                    for (var i = 0; i < childPropSet.GetChildCount(); i++) {
                        var node = childPropSet.GetChild(i);
                        html += `<tr>
                      <td class="totalPrepayment" col='0'>$` + node.GetProperty("TotalPrepaymentAmount") + `</td>
                      <td class="totalMPPPrepayment" col='1'>$` + node.GetProperty("TotalMPPPrepaymentAmount") + `</td>
                      <td class="totalAPPPrepayment" col='2'>$` + node.GetProperty("TotalAPPPrepaymentAmount") + `</td>
                      </tr>`;
                    }
                    return html;
                }

                function shippingDetails(childPropSet) {
                    var html = ` <div id="shippingDetails">
                    <h1>Shipping details
					<div class="performstockContainerMain">
					 <div class="performstockContainer">
						<div class="performstockButton">Perform stock check</div>
					  </div> </div>
					</h1>`;
                    var infoHeader = generateInfoheader("shipping_Info");
                    html += infoHeader;
                    html += `<table>
                    <thead>
                      <tr>
                      <th class="product" col='0'>Product</th>
                      <th class="type" col='1'>Type</th>
                      <th class="date" col='2'>Date</th>
                      <th class="stockAvailability" col='3'>Stock availability</th>
                      </tr>
                    </thead>
                    <tbody>` +
                        shippingDetailsRows(childPropSet) +
                        `</tbody>
                    </table>
                    </div>`;
                    return html;
                }

                function shippingDetailsRows(childPropSet) {
                    var html = "";
                    for (var i = 0; i < childPropSet.GetChildCount(); i++) {
                        var node = childPropSet.GetChild(i);
                        html += `<tr device-type='` + node.GetProperty("ProductType") + `' device-name='` + node.GetProperty("ProductName") + `' sku-code='` + node.GetProperty("productCode") + `'>
                        
						<td class="product" col='0'>` + node.GetProperty("ProductName") + `</td>
						<td class="type" col='1'></td>
						<td class="date" col='2'></td>
						<td class="stockAvailability" col='3'></td>
                        </tr>`;
                    }
                    return html;
                }

                function getOneOrderSection(propSet) {
                    var container = `<div id="orderReviewContainer" orderId = "` + propSet.GetProperty("Id") + `" orderNum = "` + propSet.GetProperty("OrderNum") + `" OrderHeaderId = "` + propSet.GetProperty("OrderHeaderId") + `" msisdn = "` + propSet.GetProperty("MSISDN") + `">`;
                    container += generateOrderDetails(propSet);

                    const ListApplets = [{
                            section: "ListOfProductDetails",
                            fn: generateProductDetails
                        },
                        {
                            section: "ListOfAddOn",
                            fn: generateAddOn
                        },
                        {
                            section: "ListOfOfferSelected",
                            fn: generateOfferSelected
                        },
                        {
                            section: "ListOfCharges",
                            fn: generateCharges
                        },
                        {
                            section: "ListOfShippingDetails",
                            fn: shippingDetails
                        }
                    ];

                    ListApplets.forEach(applet => {
                        var section = applet.section;

                        if (displayListApplet(propSet, section)) {
                            container += applet.fn(propSet.GetChildByType(section));
                        }
                    });
                    return container;
                }

                function getEquipmentLimit() /*created By Raju CM-8290*/ {
                    sCustomerIDEL = SiebelApp.S_App.GetProfileAttr("sCustId");
                    var newCustIDEL = $('input[aria-label="Customer Id:"]').val();
                    if (sCustomerIDEL == "" || sCustomerIDEL == null || sCustomerIDEL == undefined) {
                        sCustomerIDEL = newCustIDEL;
                    }

                    var InputsEL = SiebelApp.S_App.NewPropertySet();
                    var OutputEL = SiebelApp.S_App.NewPropertySet();
                    var serEL = SiebelApp.S_App.GetService("VF BS Process Manager");
                    InputsEL.SetProperty("Service Name", "VHA Query Order Details For Session Applet");
                    InputsEL.SetProperty("Method Name", "QueryOrderDetails");
                    InputsEL.SetProperty("sOrderNum", quoteNum);
                    InputsEL.SetProperty("sCustId", sCustomerIDEL);
                    InputsEL.SetProperty("sNewCustId", newCustIDEL);
                    OutputEL = serEL.InvokeMethod("Run Process", InputsEL);
                    var ResultSetEL = SiebelApp.S_App.NewPropertySet();
                    ResultSetEL = OutputEL.GetChildByType("ResultSet");
                    var sRemainingLimitEL = ResultSetEL.GetProperty("sRemainingLimit");
                    console.log(sRemainingLimitEL);
                    return sRemainingLimitEL;
                }

                VHALFOrderReviewSSJPR.prototype.Init = function() {
                    SiebelAppFacade.VHALFOrderReviewSSJPR.superclass.Init.apply(this, arguments);
                }

                VHALFOrderReviewSSJPR.prototype.ShowUI = function() {
                    SiebelAppFacade.VHALFOrderReviewSSJPR.superclass.ShowUI.apply(this, arguments);
                    quoteNum = SiebelApp.S_App.GetProfileAttr("Order Number");
                    quoteId = SiebelApp.S_App.GetProfileAttr("QuoteId");
                    sCustomerIDEL = SiebelApp.S_App.GetProfileAttr("sCustId");
                    ExistingCustomerFlag = SiebelApp.S_App.GetProfileAttr("ExistingCustomerFlag");
                    var ordersummaryview = SiebelApp.S_App.GetActiveView();
                    var ordersummaryview = SiebelApp.S_App.GetActiveView();
                    if (ordersummaryview) {
                        var ordersummaryapplet = ordersummaryview.GetApplet('VHA SSJ Order Entry - Order Form Applet OrdSum');
                        if (ordersummaryapplet) {
                            var ordersummaryappletId = ordersummaryapplet.GetFullId();
                            if (ordersummaryappletId) {
                                $('#s_' + ordersummaryappletId + '_div')
                                    .find('.CustomProfileContainer')
                                    .addClass('VHALForderSummary');
                            }
                        }
                    }

                    var appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap();

                    var appletId = getAppletId(appletMap, "VHA Order Review Details Applet - SSJ");

                    if (appletId != "") {
                        var mainContainer = "";
                        $("#" + appletId).append("<div id = 'mainOrderReviewContainer'></div>");
                        var root = getSiebelMessage(quoteNum, quoteId, ExistingCustomerFlag);
                        siebMsg = root.GetChildByType("OrderHeaderDetails");

                        mainContainer += generateHeaderContent(root);
                        mainContainer += generateInfoheader("mainHeader_Info");
                        mainContainer += generateInfoheader("mainHeader_Warning");
                        mainContainer += generateInfoheader("mainHeader_Error");

                        for (var i = 0; i < siebMsg.GetChildCount(); i++) {
                            mainContainer += getOneOrderSection(siebMsg.GetChild(i));
                        }

                        $("#mainOrderReviewContainer").html(mainContainer);

                        var $lastOrderReview = $("#mainOrderReviewContainer").find("div[id='orderReviewContainer']").last();
                        var prepaymentHTML = generatePrepayment(siebMsg.GetChild(0).GetChildByType("ListOfPrepayment"));
						
						if (displayListApplet(siebMsg.GetChild(0), "ListOfPrepayment")) {
                            $lastOrderReview.append(prepaymentHTML);
                        }
						
						
                        

                        $(document).on("click", ".performstockContainerMain", function() {
                            var $shippingDiv = $(this).closest("#shippingDetails");
                            callStockAvailability($shippingDiv, quoteId);
                        });
						
						//CM-10650
						$(".performstockContainerMain").each(function () {
							var $shippingDiv = $(this).closest("#shippingDetails");
                            callStockAvailability($shippingDiv, quoteId);
						});


                        //Defect 10072
                        // ✅ MSO-safe execution
                        setTimeout(function() {
                            $("#mainOrderReviewContainer #orderReviewContainer").each(function(idx) {
                                var $section = $(this);
                                var orderTypeText = $section
                                    .find(".order-row.orderType .order-value")
                                    .text()
                                    .trim()
                                    .toLowerCase();

                                if (orderTypeText === "rate plan change") {
                                    $section.find("#buttonContainer").remove();
									/* $('.order-row.planName .order-value').append(' - Plan'); */
									$('.order-row.connectionType .order-value').text('Rate plan change');
									$('#prepayments').hide();
                                    return;
                                }

                                if (idx === 0) {
                                    $section.find("#buttonContainer").html(generateButton());
                                } else {
                                    $section.find("#buttonContainer").remove();
                                }
                            });

                            $("#mainOrderReviewContainer #orderReviewContainer").each(function(idx) {
                                if (idx > 0) {
                                    $(this)
                                        .find(".BusinessRuleNote.vha-ssj-or-alrt1")
                                        .remove();
                                }
                            });

                        }, 0);
                        //Defect 10072
                        setTimeout(function() {
                            /*added by Raju CM-8290*/
                            var eqlimitval = getEquipmentLimit();
                            $('.rem-euip-lim').text("$" + eqlimitval + " Remaining equipment limit (To-Be)");
                        }, 5000);
                        bindOrderHeaderExpandCollapse();
                        addExtraButton();
                        var isDFAFlow = VHAAppUtilities.isDFAFlow();
                        if (isDFAFlow) { //vinay: added for DFA flow
                            $('#expected-bill').text("Expected bill");
                        }
                    }

                    /* var TnCAppletId = getAppletId(appletMap, "VHA Order Review Terms and Condition Applet - SSJ");
                     if (TnCAppletId != "") {
                         var TnChtml = getTnCApplet(root.GetChildByType("ListOfContactDetails"));
                         $("#" + TnCAppletId).append(TnChtml);
                     } */

                    var offerAppletId = getAppletId(appletMap, "VF All Offers Applet - TBUI");
                    if (offerAppletId != "")
                        $("#" + offerAppletId).hide();

                    var validationAppletId = getAppletId(appletMap, "VHA Two Way SMS Override Applet SSJ");
                    if (validationAppletId != "") {
                        $ele = $("#" + validationAppletId + " .vha-ssj-or-OST");
                        $ele.removeClass("FormItemVertical");
                        $ele.addClass("FormItemVerticalExist");

                        $ele = $("#" + validationAppletId).find('.FormItemVertical').css('padding-top', '16px');
                        $ele = $("#" + validationAppletId).find('.FormItemVerticalExist').css({
                            'padding-top': '16px',
                            'padding-bottom': '16px'
                        });

                        $("#" + validationAppletId + " .vha-sfj-C1-Row1").css({
                            padding: '0',
                            margin: '0',
                            border: 'none'
                        });
                        $("#" + validationAppletId + " h3").addClass('SFJHeading');
                        $("#" + validationAppletId + " button[data-display='Refresh']").css({
                            margin: '0'
                        })
                    }

                    var shipAppletId = getAppletId(appletMap, "VHA SSJ Order Review Shipping Address Form Applet");
                    if (shipAppletId != "") {
                        $("#" + shipAppletId + " .vha-sfj-C1-Row1").css({
                            padding: '0',
                            margin: '0',
                            border: 'none'
                        });
                    }

                    attachPostInvokeMethod("VF Order Entry Attachment List Applet TBUI SSJ", "GenerateContract");
                    attachPostInvokeMethod("VF Order Entry Attachment List Applet TBUI SSJ", "SendEmail");
                    var contractAppletId = getAppletId(appletMap, "VF Order Entry Attachment List Applet TBUI SSJ");
                    if (contractAppletId != "") {
                        setTimeout(function() {
                            $("#" + contractAppletId + " .ui-jqgrid-bdiv").attr('style', function(i, style) {
                                return (style || '').replace(/height\s*:\s*[^;]+/gi, 'height: auto !important;');
                            });
                            $("#" + contractAppletId + " .ui-jqgrid-view").css('height', 'auto');
                            var $generateBtn = $("#" + contractAppletId + " button.siebui-icon-generatecontract");
                            var $sendEmailBtn = $("#" + contractAppletId + " button.siebui-icon-sendemail");
                            var $dltBtnGenCon = $("#" + contractAppletId + " button.siebui-icon-deleterecord"); //19032026:Rajud:CM-9329
                            if ($generateBtn.length > 0 && $sendEmailBtn.length > 0 && !$generateBtn.parent().hasClass('vhassjgenerate')) {
                                $generateBtn.add($sendEmailBtn).add($dltBtnGenCon).wrapAll('<div class="vhassjgeneratebuttons"></div>');
                            }
                        }, 500);
                    }
                   /*  $("#serviceAddressDetails").off().on("click", function(e) {
                        var OrderHeaderId = $(this).closest('[ordernum]').attr('OrderHeaderId');
                        SiebelApp.S_App.SetProfileAttr("SSJSerAddOrderId", OrderHeaderId);
                        $('button[aria-label="Shipping address Form Applet:Service Address"]').trigger('click');
                    }); */
					 $('body').on("click", 'button[id="serviceAddressDetails"]', function () {
							var OrderHeaderId = $(this).closest('[ordernum]').attr('OrderHeaderId');
							SiebelApp.S_App.SetProfileAttr("SSJSerAddOrderId", OrderHeaderId);
							$('button[aria-label="Shipping address Form Applet:Service Address"]').click();
						});
					$('body').on("click", 'button[id="fixedContactDetails"]', function () {
						var OrderHeaderId = $(this).closest('[ordernum]').attr('OrderHeaderId');
						SiebelApp.S_App.SetProfileAttr("SSJSerAddOrderId", OrderHeaderId);
						$('button[aria-label="Shipping address Form Applet:FixedContDetails"]').click();
					});
					$('body').on("click", 'button[id="fixedOrderDetails"]', function () {
						var OrderHeaderId = $(this).closest('[ordernum]').attr('OrderHeaderId');
						SiebelApp.S_App.SetProfileAttr("SSJSerAddOrderId", OrderHeaderId);
						$('button[aria-label="Shipping address Form Applet:Fixed Address"]').click();
					});
					$('body').on("click", 'button[id="fixedAppntDetails"]', function () {
						var OrderHeaderId = $(this).closest('[ordernum]').attr('OrderHeaderId');
						SiebelApp.S_App.SetProfileAttr("SSJSerAddOrderId", OrderHeaderId);
						$('button[aria-label="Shipping address Form Applet:FixedAppDetails"]').click();
					});
					
					// Sivaraj - DFA Defects Alone
					setTimeout(function() {
						var sView1 = SiebelApp.S_App.GetActiveView().GetName();
						var isDFAFlow = SiebelApp.S_App.GetProfileAttr("VHANewOrg");
						if (sView1 === "VF New Connect MSO Order Summary View TBUI SSJ - eSIM Details" &&
							(isDFAFlow === "TPG" || isDFAFlow === "iiNet")) {
								// DFA Defect - 10397
								$(".siebui-icon-submittask").parent().addClass('VFLFDisplayNone'); 
								
								// DFA Defect - 10209
								$("input[aria-label='Paperless bypass reason']").closest(".FormItemVertical, .FormItemHorizontal").addClass("VFDisplayNone");
								// DFA Defect - 10205
								$(".vha-sfj-maincontainer.three-columns").addClass("DFAFulfilmentOrderReview");
						}
					}, 500);
					/*27042026:RAJUD:CM-10640*/
					$(document).ready(function () {
						let orreqMinPP = sessionStorage.getItem('ReqMinPP');
						let orformattedValue = '$0.00';
						if (orreqMinPP && !isNaN(orreqMinPP)) {
							orformattedValue = `$${parseFloat(orreqMinPP).toFixed(2)}`;
						}

						const ortooltipHtml = `
							<div class="orcustom-tooltip" style="display:none;">
								<div class="ortooltip-content">
									<span class="ortooltip-title">Prepayment amount</span>
									<span class="ortooltip-value">${orformattedValue}</span>
								</div>
							</div>
						`;
						if ($('.order-row.dueDate .orcustom-tooltip').length === 0) {
							$('.order-row.dueDate').append(ortooltipHtml);
						}
						let orhideTimer;
						$('#infoIconImg').on('mouseenter', function () {
							clearTimeout(orhideTimer);
							$('.orcustom-tooltip').fadeIn(150);
						});

						/* Keep open when hovering tooltip */
						$('.order-row.dueDate').on('mouseenter', '.orcustom-tooltip', function () {
							clearTimeout(orhideTimer);
						});

						/* Hide when mouse leaves */
						$('#infoIconImg, .orcustom-tooltip').on('mouseleave', function () {
							orhideTimer = setTimeout(function () {
								$('.orcustom-tooltip').fadeOut(150);
							}, 150);
						});

					});
					/*end-Rajud*/
					var vOrderTypevalues = [], vORMSISDNvals = [], vNewConnectMSISDNs = [], vRPCMSISDNs = [];
					$('#orderHeader span:first-child').each(function () {
						var textValue = $(this).text();
						var splitValues = textValue.split('|');
						if (splitValues.length >= 2) {
							var vOrderTypeval = splitValues[0].trim();
							var vORMSISDN = splitValues[1].trim();
							vOrderTypevalues.push(vOrderTypeval);
							vORMSISDNvals.push(vORMSISDN);
						}
					});
					for (var i = 0; i < vOrderTypevalues.length; i++) {
						if (vOrderTypevalues[i].toLowerCase() === 'rate plan change') {
							vRPCMSISDNs.push(vORMSISDNvals[i]);
						}
						if (vOrderTypevalues[i].toLowerCase() != 'rate plan change') {
							vNewConnectMSISDNs.push(vORMSISDNvals[i]);
						}
					}
					if(vRPCMSISDNs.length)
					{
						var totalCount = 0;
						vRPCMSISDNs.forEach(function (msisdn) {
							totalCount += $("div[msisdn='" + msisdn + "'] #productdetails table tbody tr")
								.filter(function () {
									var type = $(this).find("td.type").text().trim();
									return type === "Wearable" || type === "Accessory";
								}).length;
						});
					}
					if(totalCount==0 && vNewConnectMSISDNs.length==0)
					{
						var orOEAId=SiebelApp.S_App.GetActiveView().GetAppletMap()['VF Order Entry Attachment List Applet TBUI SSJ'].GetFullId();
						$("#" + orOEAId).addClass("VFDisplayNone");
					}
                }

                VHALFOrderReviewSSJPR.prototype.BindData = function(bRefresh) {
                    SiebelAppFacade.VHALFOrderReviewSSJPR.superclass.BindData.apply(this, arguments);
                }

                VHALFOrderReviewSSJPR.prototype.BindEvents = function() {
                    SiebelAppFacade.VHALFOrderReviewSSJPR.superclass.BindEvents.apply(this, arguments);
                }

                VHALFOrderReviewSSJPR.prototype.EndLife = function() {
                    SiebelAppFacade.VHALFOrderReviewSSJPR.superclass.EndLife.apply(this, arguments);
                }

                return VHALFOrderReviewSSJPR;
            }());
            return "SiebelAppFacade.VHALFOrderReviewSSJPR";
        })
}