
function sendXML(isTemplate) {

    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/xml/" + userId + "/" + modelId;
    if (isTemplate) {
        let templateId = Cookies.get("TID");
        url = "/template/" + userId + "/" + templateId;
    }

    let xml = parseToXML(graph);
    $.ajax(url, {
        // the API of upload pictures
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({xml: xml}),
        async: true,
        headers: {Authorization: "Bearer " + token},
        success: function () {
            $("#success-alert").html("Graph successfully Saved.");
            $("#success-alert")
                .slideDown()
                .delay(3000)
                .slideUp();
        }
    }).fail(function (jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}

let isXMLExisted = false;

function getXML() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/xml/" + userId + "/" + modelId;

    $.ajax(url, {
        // the API of upload pictures
        type: "GET",
        headers: {Authorization: "Bearer " + token},
        success: function (xmlFile) {
            isXMLExisted = true;
            renderFromXML(xmlFile.xml);
            $('#loadingModal').modal('toggle');
        }
    }).fail(function (jqXHR) {
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
function exportModel() {
    recentreView();
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let export_url = "/goal_model/exportToPng/" + userId + "/" + modelId;

    let svg = document.getElementsByTagName("svg")[0];
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

    let style = svg.getAttribute("style").split(";")
    let width = style[3].split(":")[1];
    let height = style[4].split(":")[1];
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);


    let serializer = new XMLSerializer();
    let ser = serializer.serializeToString(svg);
    $.ajax(export_url, {
        type: "POST",
        headers: {Authorization: "Bearer " + token},
        contentType: "application/json",
        data: JSON.stringify({svg: ser}),

        success: function (res) {
            console.log(res.png.data);
            let data = new Uint8Array(res.png.data);
            let pngFile = new Blob([data], {type: "image/png"});
            console.log(pngFile);
            if (window.navigator.msSaveOrOpenBlob) // IE10+
            {
                window.navigator.msSaveOrOpenBlob(pngFile, Filename);
            } else { // Others
                let a = document.createElement("a"),
                    url = URL.createObjectURL(pngFile);
                a.href = url;
                a.download = "model.png";
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            }

        }
    }).fail(function (jqXHR) {
        warningMessageSlide(
            jqXHR.responseJSON.message + "<br>Please try again."
        );
    });
}


// let w = window.open();
//
// w.document.open();
//
// w.document.write("<h1>Preview:</h1><br>");
// // 1. Create the button
// let svgButton = w.document.createElement("button");
// svgButton.innerHTML = "Export as SVG";
//
// let pdfButton = w.document.createElement("button");
// pdfButton.innerHTML = "Export as png";
// // 2. Append
// let body = w.document.getElementsByTagName("body")[0];
// body.appendChild(svgButton);
// body.appendChild(pdfButton);
//
// w.document.write(ser);
//
// // 3. Add event handler
// svgButton.addEventListener("click", function () {
//
//     let file = new Blob([svg.outerHTML], {type: "text/plain"});
//     if (window.navigator.msSaveOrOpenBlob) // IE10+
//     {
//         window.navigator.msSaveOrOpenBlob(file, filename);
//     } else { // Others
//         let a = document.createElement("a"),
//             url = URL.createObjectURL(file);
//         a.href = url;
//         a.download = "a.svg";
//         document.body.appendChild(a);
//         a.click();
//         setTimeout(function () {
//             document.body.removeChild(a);
//             window.URL.revokeObjectURL(url);
//         }, 0);
//     }
// });
//
// pdfButton.addEventListener("click", function () {
//
//     // let img = svg.getElementsByTagName('image');
//     // console.log(img);
//     // Array.from(img).forEach(setRef);
//     //
//     // function setRef(value) {
//     //     console.log("set");
//     //     let ref=value.getAttribute("xlink:href");
//     //     if (ref.includes("Function"))
//     //         value.setAttribute("xlink:href", "function");
//     //
//     //     else if(ref.includes("Heart"))
//     //         value.setAttribute("xlink:href", "heart");
//     //     else if (ref.includes("Risk"))
//     //         value.setAttribute("xlink:href", "risk");
//     //     else if (ref.includes("Cloud"))
//     //         value.setAttribute("xlink:href", "cloud");
//     //     else if (ref.includes("Stakeholder"))
//     //         value.setAttribute("xlink:href", "stakeholder");
//     // }
//     // let serializer = new XMLSerializer();
//     // let ser = serializer.serializeToString(svg);
//
//     $.ajax(export_url, {
//         type: "POST",
//         headers: {Authorization: "Bearer " + token},
//         contentType: "application/json",
//         data: JSON.stringify({svg: ser}),
//
//         success: function (res) {
//             console.log(res.png.data);
//             // var base64str = res.pdf;
//             // // decode base64 string, remove space for IE compatibility
//             // var binary = atob(base64str.replace(/\s/g, ''));
//             // var len = binary.length;
//             // var buffer = new ArrayBuffer(len);
//             // var view = new Uint8Array(buffer);
//             // for (var i = 0; i < len; i++) {
//             //     view[i] = binary.charCodeAt(i);
//             // }
//             let data = new Uint8Array(res.png.data);
//             let pngFile = new Blob([data], {type: "image/png"});
//             console.log(pngFile);
//             if (window.navigator.msSaveOrOpenBlob) // IE10+
//             {
//                 window.navigator.msSaveOrOpenBlob(pngFile, Filename);
//             } else { // Others
//                 let a = document.createElement("a"),
//                     url = URL.createObjectURL(pngFile);
//                 a.href = url;
//                 a.download = "a.png";
//                 document.body.appendChild(a);
//                 a.click();
//                 setTimeout(function () {
//                     document.body.removeChild(a);
//                     window.URL.revokeObjectURL(url);
//                 }, 0);
//             }
//
//         }
//     }).fail(function (jqXHR) {
//         warningMessageSlide(
//             jqXHR.responseJSON.message + "<br>Please try again."
//         );
//     });
//
// });
//
// w.document.close();
// }

$("#Export").click(function (evt) {
    saveJSON();
    exportModel();
});

$("#saveXML").click(evt => {
    evt.preventDefault();
    sendXML(false);
});

$("#saveTemplateXML").click(evt => {
    evt.preventDefault();
    sendXML(true);
});