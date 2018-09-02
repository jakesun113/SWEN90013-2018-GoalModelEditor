function sendXML() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/xml/" + userId + "/" + modelId;

    let encoder = new mxCodec();
    let node = encoder.encode(graph.getModel());
    let xml = mxUtils.getXml(node);
    $.ajax(url, {
        // the API of upload pictures
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ xml: xml }),
        async: true,
        headers: { Authorization: "Bearer " + token },
        success: function() {}
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
    console.log(xml);
    let doc = mxUtils.parseXml(xml);
    console.log(doc);
    let codec = new mxCodec(doc);
    let elt = doc.documentElement.firstChild;
    let cells = [];

    console.log(codec);
    while (elt != null) {
        console.log(elt);
        cells.push(codec.decode(elt));
        elt = elt.nextSibling;
    }

    graph.addCells(cells);
}
