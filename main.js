(function() {
  var template;

  template = function(bookmarkletJS, jqueryVersion) {
    var templatePlain, templateWithJquery;
    templateWithJquery = "var v = \"##jquery_version##\";\nif (window.jQuery === undefined || window.jQuery.fn.jquery < v) {\n    var done = false;\n    var script = document.createElement(\"script\");\n    script.src = \"//ajax.googleapis.com/ajax/libs/jquery/\" + v + \"/jquery.min.js\";\n    script.onload = script.onreadystatechange = function(){\n        if (!done && (!this.readyState || this.readyState == \"loaded\" || this.readyState == \"complete\")) {\n            done = true;\n            initMyBookmarklet();\n        }\n    };\n    document.getElementsByTagName(\"head\")[0].appendChild(script);\n} else {\n    initMyBookmarklet();\n}\n\nfunction initMyBookmarklet() {\n    (window.myBookmarklet = function() {\n        ##bookmarklet_js##\n    })();\n}";
    templatePlain = "(function() {\n    ##bookmarklet_js##\n})();";
    if (jqueryVersion != null) {
      templateWithJquery = templateWithJquery.replace("##jquery_version##", jqueryVersion);
      return templateWithJquery = templateWithJquery.replace("##bookmarklet_js##", bookmarkletJS);
    } else {
      return templatePlain = templatePlain.replace("##bookmarklet_js##", bookmarkletJS);
    }
  };

  $(function() {
    var codeMirror;
    codeMirror = CodeMirror($("#code")[0], {
      value: "console.log(\"Hello World!\");",
      mode: "javascript",
      lineNumbers: true
    });
    $("#languageJavascript, #languageCoffeescript").change(function() {
      if ($(this).attr("id") === "languageJavascript") {
        codeMirror.setOption("mode", "javascript");
        return codeMirror.setValue("console.log(\"Hello World!\");");
      } else {
        codeMirror.setOption("mode", "coffeescript");
        return codeMirror.setValue("console.log \"Hello World!\"");
      }
    });
    return $("#generate").click(function() {
      var outputCode;
      outputCode = codeMirror.getValue();
      if ($("#includeJquery").prop("checked")) {
        outputCode = template(outputCode, $("#jqueryVersion").val());
      } else {
        outputCode = template(outputCode);
      }
      $("#output").html($("#name").val() === "" ? "Awesome Bookmarklet" : $("#name").val());
      $("#outputContainer").show();
      return $("#output").prop("href", "javascript:" + outputCode);
    });
  });

}).call(this);
