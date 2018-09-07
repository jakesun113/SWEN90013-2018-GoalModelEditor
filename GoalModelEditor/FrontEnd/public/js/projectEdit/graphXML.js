function sendXML() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/xml/" + userId + "/" + modelId;

    let xml = parseToXML(graph);
    $.ajax(url, {
        // the API of upload pictures
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ xml: xml }),
        async: true,
        headers: { Authorization: "Bearer " + token },
        success: function() {
            $("#success-alert").html("Graph successfully Saved.");
            $("#success-alert")
                .slideDown()
                .delay(3000)
                .slideUp();
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}

function getXML() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/xml/" + userId + "/" + modelId;

    $.ajax(url, {
        // the API of upload pictures
        type: "GET",
        headers: { Authorization: "Bearer " + token },
        success: function(xmlFile) {
            renderFromXML(xmlFile.xml);
            $('#loadingModal').modal('toggle');
        }
    }).fail(function(jqXHR) {
        $('#loadingModal').modal('toggle');
    }); // end ajax
}

/**
 * Parses the graph to XML, to be saved/loaded in a differenct session.
 */
function parseToXML(graph) {
    let encoder = new mxCodec();
    let node = encoder.encode(graph.getModel());
    let xml = mxUtils.getPrettyXml(node);
    return xml;
}

/**
 * Renders the graph from a (saved) XML file.
 */
function renderFromXML(xml) {
    // console.log(xml);
    let doc = mxUtils.parseXml(xml);
    // console.log(doc);
    let codec = new mxCodec(doc);
    let elt = doc.documentElement.firstChild;
    let cells = [];

    // console.log(codec);
    while (elt != null) {
        // console.log(elt);
        cells.push(codec.decode(elt));
        elt = elt.nextSibling;
    }

    graph.addCells(cells);
}

/**
 * Can only be called when the svg is rendered onto the screen!!!!!!
 */
function exportImage() {
    let svg = document.getElementsByTagName("svg")[0];
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
    // console.log(svg.outerHTML);

    let serializer = new XMLSerializer();
    let ser = serializer.serializeToString(svg);
    let w = window.open();

    w.document.open();

    w.document.write("<h1>Preview:</h1><br>");
    // 1. Create the button
    let button = w.document.createElement("button");
    button.innerHTML = "Export";

    // 2. Append 
    let body = w.document.getElementsByTagName("body")[0];
    body.appendChild(button);
    w.document.write(ser);

    // 3. Add event handler
    button.addEventListener ("click", function() {
        let file = new Blob([svg.outerHTML], {type: "text/plain"});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            let a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = "a.svg";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    });
    w.document.close();
}

$("#Export").click(function (evt) {
    saveJSON();
    exportImage();
});

$("#saveXML").click( evt => {
    evt.preventDefault();
    sendXML();
});