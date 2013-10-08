# Fill the template js
template = (bookmarkletJS, jqueryVersion) ->
    templateWithJquery = """
        var v = "##jquery_version##";
        if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
            var done = false;
            var script = document.createElement("script");
            script.src = "//ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
            script.onload = script.onreadystatechange = function(){
                if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                    done = true;
                    initMyBookmarklet();
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            initMyBookmarklet();
        }
        
        function initMyBookmarklet() {
            (window.myBookmarklet = function() {
                ##bookmarklet_js##
            })();
        }
    """
    templatePlain = """
        (function() {
            ##bookmarklet_js##
        })();
    """
    if jqueryVersion?
        templateWithJquery = templateWithJquery.replace "##jquery_version##", jqueryVersion
        return templateWithJquery = templateWithJquery.replace "##bookmarklet_js##", bookmarkletJS
    else
        templatePlain = templatePlain.replace "##bookmarklet_js##", bookmarkletJS

$ ->
    # Init the codemirror editor
    codeMirror = CodeMirror $("#code")[0],
        value: "console.log(\"Hello World!\");"
        mode: "javascript"
        lineNumbers: true

    # Switch the codemirror settings between javascript and coffeescript
    $("#languageJavascript, #languageCoffeescript").change ->
        if $(this).attr("id") == "languageJavascript"
            codeMirror.setOption "mode", "javascript"
            codeMirror.setValue "console.log(\"Hello World!\");"
        else
            codeMirror.setOption "mode", "coffeescript"
            codeMirror.setValue "console.log \"Hello World!\""

    $("#generate").click ->
        outputCode = codeMirror.getValue()

        # Add jquery if the box is checked
        if $("#includeJquery").prop "checked"
            outputCode = template outputCode, $("#jqueryVersion").val()
        else
            outputCode = template outputCode

        # Set the title
        $("#output").html if $("#name").val() == "" then "Awesome Bookmarklet" else $("#name").val()

        # Show the output
        $("#outputContainer").show()
        $("#output").prop "href", "javascript:" + outputCode
