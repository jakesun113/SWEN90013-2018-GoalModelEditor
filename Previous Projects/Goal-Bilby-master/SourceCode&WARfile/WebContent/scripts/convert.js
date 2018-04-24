/**
     * Expands and collapses the input tree in the sidebar
     */
var inputTree = 0;
function showInputTree() {
  var inputTreeDiv = document.getElementById("inputTree");
  var drawingPanDiv = document.getElementById("drawingPan");
  if (inputTree == 0) {
    drawingPanDiv.style.display = "none";
    inputTreeDiv.style.display = "block";
    inputTree = 1;
  } else {
    inputTreeDiv.style.display = "none";
    drawingPanDiv.style.display = "block";
    inputTree = 0;
  }
}

$(document).ready(function() {
  $("#showInputTree").click(showInputTree);
});

var data;
/**
    * Displays the items from the JSON object to the canvas. 
    */
function displayJSONOnCanvas() {
  var text = data;
  //var text = '{"name":"User", "goal":"Improve Hearing", "emotion1":"Trusted","emotion2":"Respected","quality1":"Professional","quality2":"Accessible"}';
  //data = text;
  var obj = JSON.parse(text);

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  //Displays the rectangle
  ctx.lineWidth = 1.0;
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(80, 60, 100, 20);
  ctx.strokeRect(80, 60, 100, 20); //TODO Hi Haris, why is there two same lines? -Zheping

  //Displays the actor
  var imageActor = new Image();
  imageActor.src = "Images/ActorCanvas.gif";
  ctx.drawImage(imageActor, 250, 20, 40, 40);

  //Displays the heart
  var imageHeart = new Image();
  imageHeart.src = "Images/CanvasTestHeart.png";
  ctx.drawImage(imageHeart, 180, 42, 70, 50);

  //Displays the quality cloud
  var imageQuality = new Image();
  imageQuality.src = "Images/CanvasTestQuality.png";
  ctx.drawImage(imageQuality, 10, 70, 85, 60);

  //Displays the Text in Actor
  ctx.font = "12px Times New Roman";
  ctx.fillText(obj.name, 260, 70);

  //Displays the Text in Goal
  ctx.font = "12px Times New Roman";
  ctx.fillText(obj.goal, 90, 75);

  //Displays the Text in heart
  ctx.font = "12px Times New Roman";
  ctx.fillText(obj.emotion1 + ",", 190, 65);
  ctx.fillText(obj.emotion2, 190, 75);

  //Displays the Text in quality
  ctx.font = "12px Times New Roman";
  ctx.fillText(obj.quality1 + ",", 25, 95);
  ctx.fillText(obj.quality2, 25, 105);
}


