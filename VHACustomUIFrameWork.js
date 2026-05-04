(function() {
    var VFSPSCustomAlert = window.alert;
    window.alert = function(message) {
        /*Kovid:Added changes to avoid SFJ TBUI errors as popup*/
        var sViewName = SiebelApp.S_App.GetActiveView().GetName();
        var applet = SiebelApp.S_App.GetActiveView().GetAppletMap()["VHA Customer Navigation Applet - SSJ"];
        	 var isPickApplet = false;
        var isPopupApplet = false;
        var appletMap = SiebelApp.S_App.GetActiveView().GetAppletMap();
        
        // Check for pick applets or popup applets
        for (var appletName in appletMap) {
            if (appletMap.hasOwnProperty(appletName)) {
            var currentApplet = appletMap[appletName];
            if (currentApplet && currentApplet.GetBusComp) {
                var appletType = currentApplet.GetAppletType ? currentApplet.GetAppletType() : "";
                if (appletName.toLowerCase().indexOf("pick") > -1 || appletType === "Pick") {
                isPickApplet = true;
                }
                if (appletName.toLowerCase().indexOf("popup") > -1 || appletType === "Popup") {
                isPopupApplet = true;
                }
            }
            }
        }
        
        if ((sViewName == "VF Coverage Check Details - Postpay - SSJ" || sViewName == "VF SSJ RPC Sharing View TBUI" || sViewName == "VF SSJ Customer ID Details – Postpay TBUI" || sViewName == "VF Capture Customer Details – Postpay - SSJ" || sViewName == "VF Connection Wizard View - Credit Check – TBUI - SSJ" || sViewName == "VHA Connection Wizard View - Billing Detail - TBUI - SSJ" || sViewName == "VF Connection Wizard View - Credit Check – TBUI - SSJ Exist Customer" ||	sViewName == "VF SSJ Connection Wizard View – Shopping Cart – TBUI" || sViewName == "VF SSJ Prepayments View-TBUI" || sViewName == "VHA SSJ Prepayment Processing View" || sViewName == "VHA Connection Wizard View - Exist Billing Detail - TBUI - SSJ" || sViewName == "VF Capture Exst Customer Details Postpay TBUI - SSJ" || sViewName == "VF New Connect MSO Order Summary View TBUI SSJ - eSIM Details" || (applet && message === "Your task Connect Postpay has been automatically paused. To resume, locate and drill down on the task in your Inbox.")) && !isPopupApplet && !isPickApplet){
            const dialogBox = document.querySelector('.vha-ssj-dialogbox'); // Target container
            if (dialogBox) {
                dialogBox.style.display = 'block';
                dialogBox.innerHTML = `<div id="vha-errmsg-ln" class="vha-errmsg-ln" >${message}</div>`;
				focusDialogBox();
                // adde new message == "Id has been validated and updated" -- Juhi 9262 

                if (message == "Id has been validated and updated" || message == "Primary ID has been validated and updated" || message == "Secondary ID has been validated and updated")
                    $('.vha-ssj-dialogbox').addClass("vha-ssj-dialogbox_success");
                else
                    $('.vha-ssj-dialogbox').removeClass("vha-ssj-dialogbox_success");
			setTimeout(function() {
            focusDialogBox();
        }, 200);


            }
        } else {
            $("#VHAOpenModalAlert").remove();
            $("body").append(VHAAlertGetIDTemplate());
            $("#VHAOpenModalAlert #VHAAlertMessage").html("");
            $("#VHAOpenModalAlert #VHAAlertMessage").html(message);
            $("#VHAOpenModalAlert").removeClass("VHADisplayNone").addClass("VHADisplayBlock");
            $("#VHAOpenModalAlert").undelegate();
            $("#VHAOpenModalAlert").delegate(".VHADialogClose,.VHAAlertOKBtn", "click", {}, function(e) {
                $("#VHAOpenModalAlert").removeClass("VHADisplayBlock").addClass("VHADisplayNone")
            });
            console.log(message)
        }
    };

    function VHAAlertGetIDTemplate() {
        return (' <div id = "VHAOpenModalAlert" class = "VHAmodalDialogAlert VHADisplayNone">  								 <div>  								 <span  title = "Close" class = "VHADialogClose" ></span>  								 <h2 class="VHAAlertHeader"> System Alert </h2>  								 <div id="VHAAlertMessageParent">								 <div id = "VHAAlertMessage"> 								 </div>  								 </div>  								 <div class="VHAAlertOKBtn">Close</div>								 </div>  								 </div> ')
    }
})();
function focusDialogBox() {
    const dialogBox = document.querySelector('.vha-ssj-dialogbox');
    
    if (dialogBox && dialogBox.style.display !== 'none') {
        const errorMsg = document.querySelector('#vha-errmsg-ln');
        const targetElement = errorMsg || dialogBox;
        
        let parent = targetElement.parentElement;
        
        // Find the scrollable parent container
        while (parent) {
            const style = window.getComputedStyle(parent);
            const overflowY = style.overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
                break;
            }
            parent = parent.parentElement;
        }
        
        // Scroll to the dialog box
        if (parent) {
            parent.scrollTo({
                top: targetElement.offsetTop - 20,
                behavior: 'smooth'
            });
        } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Set focus on the target element
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
        dialogBox.classList.add('vha-ssj-bilaccbanner');
    }
}/*saib-CM-9679*/