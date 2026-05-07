if (typeof (SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR) === "undefined") {
  SiebelJS.Namespace("SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR");
  define("siebel/custom/VHASSJBillAccntAddrListAppletTBUIPR", ["siebel/jqgridrenderer"], function () {
    SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR = (function () {
      function VHASSJBillAccntAddrListAppletTBUIPR(pm) {
        SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.constructor.apply(this, arguments);
      }

      SiebelJS.Extend(VHASSJBillAccntAddrListAppletTBUIPR, SiebelAppFacade.JQGridRenderer);

      function applyGridSettings(renderer) {
        try {
          var jqGrid = renderer.GetGrid && renderer.GetGrid();
          if (!jqGrid || !jqGrid.jqGrid) return;

          jqGrid.jqGrid("setGridParam", { shrinkToFit: true });

          [
            ["Attention_to", 150],
            ["Street_Address", 150],
            ["Street_Address_2", 150],
            ["City_no_star_AU", 150],
            ["Postal_Code_no_star_AU", 150],
            ["Country", 150],
            ["Start_Date_no_star1", 100],
            ["End_Date", 100],
            ["SSA_Primary_Field", 100]
          ].forEach(function (c) {
            try {
              jqGrid.jqGrid("setColProp", c[0], { widthOrg: c[1] });
            } catch (e) {
              // ignore
            }
          });

          // Use container width instead of fixed width (prevents distortion on reflow)
          var $wrap = jqGrid.closest(".ui-jqgrid");
          var w = ($wrap.parent().width() || $wrap.width());
          if (w) jqGrid.jqGrid("setGridWidth", w);

          setTimeout(function () {
            try {
              $(window).trigger("resize");
            } catch (e) {
              // ignore
            }
          }, 0);
        } catch (e) {
          if (window.console && console.warn) console.warn("SSJ list grid init skipped:", e);
        }
      }

      VHASSJBillAccntAddrListAppletTBUIPR.prototype.ShowUI = function () {
        SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.ShowUI.apply(this, arguments);
        var self = this;
        setTimeout(function () { applyGridSettings(self); }, 0);
        setTimeout(function () { applyGridSettings(self); }, 250);
      };

      VHASSJBillAccntAddrListAppletTBUIPR.prototype.BindData = function (bRefresh) {
        SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR.superclass.BindData.apply(this, arguments);
        var self = this;
        setTimeout(function () { applyGridSettings(self); }, 0);
      };

      return VHASSJBillAccntAddrListAppletTBUIPR;
    }());

    return "SiebelAppFacade.VHASSJBillAccntAddrListAppletTBUIPR";
  });
}
