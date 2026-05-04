function checkSpecialChar(fieldName, fieldValue) {
    var msg = "";
    var Options = {};
    var inp = SiebelApp.S_App.NewPropertySet();
    var out = SiebelApp.S_App.NewPropertySet();
    inp.SetProperty("String", fieldValue);
    out = VHAAppUtilities.CallBS("VHA Validate Special Character", "ValidateSpecialCharacter", inp, Options);
    var errmsg = out.GetProperty('ErrMsg');
    if (errmsg != '' && errmsg != undefined)
        msg = fieldName + " is having special character.Please remove the special character to save the record successfully";

    return msg;
}

function showError(ele, msg, id) {
    var errorHtml = "<p id = '" + id + "' style='color:red'>" + msg + "</p>";
    if (id == "ssj-emp-dur-yr_Label_Hd") {
        $(".FormItemVertical.ssj-cr-chk-emp-dur-res-mon").before(errorHtml);
    } else if (id == "vha-ssj-emp-addr-dur-yr_Label_Hd") {
        $(".FormItemVertical.vha-ssj-cr-chk-emp-addr-res").before(errorHtml);
    } else {
        $(ele).parent().find("p[id='" + id + "']").remove();
        $(ele).parent().append(errorHtml);
    }
}

function removeError(ele, id) {
    $(ele).parent().find("p[id='" + id + "']").remove();
}

function contactValidation(value, ele, areaLabbeldBy) {
    if (ele == "" || ele == null || ele == undefined) {

        ele = $(".FormItemVertical span").filter(function() {
            return $(this).text().trim().toLowerCase() === "Contact Number".trim().toLowerCase();
        }).parent().find("input");
        //ele = $(".FormItemVertical").find("span:contains('Contact Number')").parent().find('input');
        areaLabbeldBy = $(ele).attr("aria-labelledby");
        value = $(ele).val();
    }
    var msg = "";

    if (value === "") {
        msg = "Contact Number is required field.Please enter a value for the field.";
    } else if (/\s/.test(value)) {
        msg = "Contact Number must be entered with no spaces.";
    } else if (/[()]/.test(value)) {
        msg = "Contact Number must not be entered with no brackets.";
    } else if (!/^\d+$/.test(value)) {
        msg = "Contact Number must be numeric.";
    } else if (value.length !== 11) {
        msg = "Contact Number must be 11 digits.";
    } else if (!/^(612|613|614|617|618)/.test(value)) {
        msg = "Contact Number must start with 612, 613, 614, 617, or 618.";
    }
    if (msg != "")
        showError(ele, msg, areaLabbeldBy);
    else
        removeError(ele, areaLabbeldBy);
}

function emailValidation(value, ele, areaLabbeldBy) {
    if (ele == "" || ele == null || ele == undefined) {
        //ele = $(".FormItemVertical").find("span:contains('Email Address')").parent().find('input');
        ele = $(".FormItemVertical span").filter(function() {
            return $(this).text().trim().toLowerCase() === "Email Address".trim().toLowerCase();
        }).parent().find("input");

        areaLabbeldBy = $(ele).attr("aria-labelledby");
        value = $(ele).val();
    }
    var msg = "";
    //var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\.[A-Za-z]{2,})*$/;
    if (value === "") {
        msg = "Email Address is required field.Please enter a value for the field.";
    } else if (!regexEmail.test(value)) {
        msg = "Please enter a valid email address.";
    }
    if (msg != "")
        showError(ele, msg, areaLabbeldBy);
    else
        removeError(ele, areaLabbeldBy);
}

function reValidateSpecialChar() {
    var nameFields = ["First Name", "Last Name", "Middle Name"];
    nameFields.forEach(function(field) {

        var input = $(".FormItemVertical span").filter(function() {
            return $(this).text().trim().toLowerCase() === field.trim().toLowerCase();
        }).parent().find("input");
        var areaLabbeldBy = $(input).attr("aria-labelledby");
        var fieldValue = $(input).val();
        if (input.length > 0) {
            var msg = checkSpecialChar(field, fieldValue);
            if (msg != "") {
                showError(input, msg, areaLabbeldBy);
            }
        }
    });
}

function requiredValidation() {
    $('span[title="Required Field"]').each(function() {
        var id = $(this).attr('id');
        var name = $(this).text();
        if (name.trim() === "Title") {

        } else if (name.trim() === "Customer Type" && (SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "iiNet" || SiebelApp.S_App.GetProfileAttr("VHANewOrg") == "TPG")) {

        } else {
            var ele = $("input[aria-labelledby='" + id + "']");

            if (ele.length <= 0) {
                if (name == "Duration with employer") {
                    $("p[id='ssj-emp-dur-yr_Label_Hd']").remove();
                    ele = $("input[aria-labelledby^='VFYearswithCurrentEmployer']");
                } else if (name == "Duration at current address") {
                    $("p[id='vha-ssj-emp-addr-dur-yr_Label_Hd']").remove();
                    ele = $("input[aria-labelledby^='VFCurrentYearsatAddress']");
                }
            }

            $(ele).parent().find("p[id='" + id + "']").remove();
            if (id) {
                var fieldValue = $(ele).val();

                if ($(ele).is(":radio") || $(ele).find("input[type='radio']").length) {
                    fieldValue = $(ele).filter(":radio:checked").val() ||
                        $(ele).find("input[type='radio']:checked").val() ||
                        null;
                }

                if ($(ele).is(":checkbox") || $(ele).find("input[type='checkbox']").length) {
                    if (fieldValue == "N")
                        fieldValue = "";
                }

                if (fieldValue == "" || fieldValue == null || fieldValue == undefined) {
                    var msg = name + " is required field.Please enter a value for the field.";
                    if (name == "Discussed coverage check with customer")
                        msg = "Discussed Coverage check with Customer should be selected to proceed";
                   var sVal = $('[aria-label="Transfer type"]').val();
                    if(sVal !== "Belongs To Other" && name == ' When does the customer intend to connect the line?')
                    {}else{
                    showError(ele, msg, id);
                    }   
                }
            }
        }
    });
}

function validatePassportNumber(fieldValue, ele, areaLabbeldBy) {
    if (ele == "" || ele == null || ele == undefined) {
        //ele = $(".FormItemVertical").find("span:contains('Passport Number')").parent().find('input');
        ele = $(".FormItemVertical span").filter(function() {
            return $(this).text().trim().toLowerCase() === "Passport Number".trim().toLowerCase();
        }).parent().find("input");
        areaLabbeldBy = $(ele).attr("aria-labelledby");
        fieldValue = $(ele).val();
    }
    var msg = "";
    var passportRegex = /^[A-Za-z][A-Za-z0-9]{7}$/;

    if (!passportRegex.test(fieldValue)) {
        msg = "The Passport number you’ve entered is invalid. A Passport number should be 8 characters long, beginning with a letter. Please enter a valid Passport number.";
    }
    if (msg != "")
        showError(ele, msg, areaLabbeldBy);
    else
        removeError(ele, areaLabbeldBy);
}

function validateDLNumber(fieldValue, ele, areaLabbeldBy) {
    if (ele == "" || ele == null || ele == undefined) {
        //ele = $(".FormItemVertical").find("span:contains('License Number')").parent().find('input');
        ele = $(".FormItemVertical span").filter(function() {
            return $(this).text().trim().toLowerCase() === "License Number".trim().toLowerCase();
        }).parent().find("input");

        areaLabbeldBy = $(ele).attr("aria-labelledby");
        fieldValue = $(ele).val();
    }
    var msg = "";
    var sAlphaNumPattern = /[^A-Z0-9]/g; // Invalid characters (anything not uppercase or digit)
    var sLowercaseAlpha = /[a-z]/g; // Lowercase letters

    if (fieldValue.match(sAlphaNumPattern) || fieldValue.length > 10) {
        if (fieldValue.match(sLowercaseAlpha)) {
            msg = "Driver's Licence Number should not contain Lowercase";
        } else {
            msg = "The Driver’s Licence number you’ve entered is invalid. A valid Driver’s Licence number should be up to 10 characters. Please enter a valid Driver’s Licence number.";
        }
    }
    if (msg != "")
        showError(ele, msg, areaLabbeldBy);
    else
        removeError(ele, areaLabbeldBy);
}

function checkRecordCount(appletName) {
    var appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap()[appletName];
    var pm = appletMap.GetPModel();
    var recCount = pm.Get("GetRecordSet").length;
    if (recCount > 0)
        return true;
    else
        return false;
}

//Kovid: Added for Credit Check phone validation
function creditCheckphValidation(value, ele, areaLabbeldBy) {
    if (ele == "" || ele == null || ele == undefined) {
        //ele = $(".FormItemVertical").find("span:contains('Employee contact number')").parent().find('input');
        ele = $(".FormItemVertical span").filter(function() {
            return $(this).text().trim().toLowerCase() === "Employee contact number".trim().toLowerCase();
        }).parent().find("input");
        areaLabbeldBy = $(ele).attr("aria-labelledby");
        value = $(ele).val();
    }
    var msg = "";
    if (!/^(1800|13|02|04|612|613|614|617|618|6118|6113)/.test(value)) {
        msg = "Employer Contact Phone must be starting with digits 1800, 13, 02, 04, 612, 613, 614, 617, 618 , 6118 or 6113 for Work phone or Employer contact number";
    }
    if (msg != "")
        showError(ele, msg, areaLabbeldBy);
    else
        removeError(ele, areaLabbeldBy);
}

function validateSpeed() {
    var psInputs, psOutputs, sService, sOrderId = "";
    var resultSet, proceed = "Y";
    var UIMessage = "",
        sSBPop = "",
        sSBWarn = "",
        sNTDValError = "";
    sOrderId = SiebelApp.S_App.GetActiveBusObj().GetBusCompByName('VFDfa Order Entry Order Thin BC').GetFieldValue("Id");
    if (sOrderId != null && sOrderId != "" && sOrderId != undefined) {
        psInputs = SiebelApp.S_App.NewPropertySet();
        psOutputs = SiebelApp.S_App.NewPropertySet();
        sService = SiebelApp.S_App.GetService("Workflow Process Manager");
        psInputs.SetProperty("ProcessName", "VHA SSJ Speed Boost Validation WF");
        psInputs.SetProperty("OrderId", sOrderId);
        psOutputs = sService.InvokeMethod("RunProcess", psInputs);
        resultSet = psOutputs.GetChildByType("ResultSet");
        if (resultSet) {
            UIMessage = resultSet.GetProperty("SBUIMessage");
            sSBPop = resultSet.GetProperty("SBPop");
            sSBWarn = resultSet.GetProperty("SBWarn");
            sNTDValError = resultSet.GetProperty("NTDValError");

            if (sSBPop == "Y" && (UIMessage != "" && UIMessage != null)) //Daffi:Added for null Warning in SpeedBoostCR
            {
                if (confirm(UIMessage)) {

                } else {
                    proceed = "N";
                }
            }
            if (sSBWarn == "Y" && (UIMessage != "" && UIMessage != null)) //Daffi:Added for null Warning in SpeedBoostCR
            {
                alert(UIMessage);
                proceed = "N";
            }
            if (sNTDValError != "" && sNTDValError != null) {
                alert(sNTDValError);
                proceed = "N";
            }
        }
    }
    return proceed;
}

//VHA KT 27/02/26: Added for CM-7200
function validateNameLength() {
    var nameFields = ["First Name", "Last Name", "Middle Name"];

    nameFields.forEach(function(field) {

        var input = $(".FormItemVertical span")
            .filter(function() {
                return $(this).text().trim().toLowerCase() === field.trim().toLowerCase();
            })
            .parent()
            .find("input");

        if (input.length === 0) return;

        var value = input.val() ? String(input.val()).trim() : "";
        var areaLabelledBy = input.attr("aria-labelledby") || "";
        var msg = "";
        if (value.length > 50) {
            msg = field + " cannot be more than 50 characters.";
        }

        /* if (msg !== "") {
            showError(input, msg, areaLabelledBy);
        } else {
            // clear any previous error message for this input
            removeError(input, areaLabelledBy);
        } */
        if (msg !== "") {
            removeError(input, areaLabelledBy);
            showError(input, msg, areaLabelledBy);
        } /*19032026:RajuD:CM-9435*/
    });
}
function sCalcpaymtbtnvalidation() {//vinaykumar: added for CM-10277
     var isBtnclicked = SiebelApp.S_App.GetProfileAttr("calcpymtclick");
    if (isBtnclicked == "Not clicked"){
        $('input[aria-labelledby^="Ready_To_Pay_Upfront_Label"]').after("<p class='errorMsg' style='color:red'>Upfront amount field value is changed. please click calculate prepayment plan to proceed further.</p>");
    }
}

function validateSharing() {
    $('.errorMsg').remove();
    var sharingFlg = sessionStorage.getItem("sharingFlg");
    if (sharingFlg == "Y") {
        var setUpEle = $("input[aria-label='Setup sharing group (new/existing)']");
        var groupEle = $("input[aria-label='Select group']");

        var setUpFlg = $(setUpEle).val();
        var group = $(groupEle).val();

        if (setUpFlg != "Y")
            $(setUpEle).parent().find("span").after("<p class='errorMsg' style='color:red'>Setup Sharing Group must be ticked if you are creating a new sharing group. Please select Setup Sharing Group or select an existing group if you want to share with an existing group.</p>");
        else
            $(setUpEle).parent().find(".errorMsg").remove();

        if (group == null || group == "" || group == undefined || group == "undefined")
            $(groupEle).parent().parent().after("<p class='errorMsg' style='color:red'>Sharing Group Name is a mandatory field, please select from the list of suggested names or enter a custom name.</p>");
        else
            $(groupEle).parent().parent().nextAll('.errorMsg').first().remove();
    }
}