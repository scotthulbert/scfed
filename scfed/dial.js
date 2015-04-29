var knobImage = new Image();
knobImage.src = "knob.png";
var angle = 0;
var canvasctx;

/**
 * Re-draw the dial, private, leave it alone.
 */
function dialredraw()
{
	this.canvasctx.clearRect(0, 0, 200, 600);
	this.canvasctx.translate(100, 513);
	this.canvasctx.rotate(this.angle);
	this.canvasctx.drawImage(knobImage, -32, -32);
	this.canvasctx.rotate(-this.angle);
	this.canvasctx.translate(-100, -513);
	
	this.canvasctx.beginPath();
	this.canvasctx.strokeStyle = "#ffffff";
	this.canvasctx.rect(68, 10, 64, 461);
	this.canvasctx.stroke();
	
	this.canvasctx.beginPath();
	this.canvasctx.fillStyle = this.fillStyle;

	var height = this.getValue(461);
	this.canvasctx.rect(68, 471 - height, 64, height);
	this.canvasctx.fill();
};

/**
 * Don't call this function, it's private.
 */
function dialMoveDial(x, y)
{	
	// get the coordinates relative to the center of the knob
	var relX = x - 68 - 32;
	var relY = y - 481 - 32;

	this.angle = Math.atan2(relY, relX) + (0.5 * Math.PI);
	this.redraw();
};

function dialMoveBar(y)
{
	this.angle = ((461-(y-10))/461) * (2 * Math.PI);
	if (this.angle < 0) this.angle = 0;
	if (this.angle > (2 * Math.PI)) this.angle = 2 * Math.PI;
	this.redraw();
};

/**
 * Change the style of the display bar. There will be a bottom color and a top color, with a smooth
 * transistion inbetween.
 */
function dialSetFillStyle(bottomColor, topColor)
{
	this.fillStyle = this.canvasctx.createLinearGradient(68, 10, 68, 471);
	this.fillStyle.addColorStop(0, topColor);
	this.fillStyle.addColorStop(1, bottomColor);
};

/**
 * Get the value of the dial.
 * \param scale The maximum value (minimum is 0.
 */
function dialGetValue(scale)
{
	var normAngle = this.angle;
	while (normAngle < 0) normAngle += (2 * Math.PI);
	while (normAngle > (2 * Math.PI)) normAngle -= (2 * Math.PI);
	var value = (scale * normAngle / (2 * Math.PI));
	return value;
};

function dialDebugLog(msg)
{
	//document.getElementById("log").innerHTML += msg + "<br>";
};

/**
 * \param canvasID The ID of the canvas element.
 */
function Dial(canvasID)
{
	this.canvaselement = document.getElementById(canvasID);
	this.canvasctx = this.canvaselement.getContext("2d");
	this.angle = 0;
	this.redraw = dialredraw;
	this.moveDial = dialMoveDial;
	this.moveBar = dialMoveBar;
	this.setFillStyle = dialSetFillStyle;
	this.getValue = dialGetValue;
	this.debugLog = dialDebugLog;

	//this.setFillStyle("#000055", "#8888ff");
	var bottomColor = this.canvaselement.getAttribute("data-bottom-color");
	var topColor = this.canvaselement.getAttribute("data-top-color");
	this.setFillStyle(bottomColor, topColor);
	
	/**
	 * 0 = mouse not down
	 * 1 = mouse down on the dial
	 * 2 = mouse down on the bar
	 */
	this.mouseDown = 0;
	
	var dialObject = this;
	this.canvaselement.addEventListener("mousedown", function(event){
		//alert(dialObject.canvaselement.offsetLeft);
		var x = event.pageX - dialObject.canvaselement.offsetLeft;
		var y = event.pageY - dialObject.canvaselement.offsetTop;
		if ((x > 68) && (x < 132) && (y > 481) && (y < 545))
		{
			dialObject.mouseDown = 1;
			dialObject.moveDial(event.pageX-dialObject.canvaselement.offsetLeft, event.pageY-dialObject.canvaselement.offsetTop);
		}
		else if ((y > 10) && (y < 471))
		{
			dialObject.mouseDown = 2;
			dialObject.moveBar(event.pageY-dialObject.canvaselement.offsetTop);
		};
	});
	this.canvaselement.addEventListener("mouseup", function(event){
		dialObject.mouseDown = 0;
	});
	this.canvaselement.addEventListener("mousemove", function (event){
		if (dialObject.mouseDown == 1)
		{
			dialObject.moveDial(event.pageX-dialObject.canvaselement.offsetLeft, event.pageY-dialObject.canvaselement.offsetTop);
		}
		else if (dialObject.mouseDown == 2)
		{
			dialObject.moveBar(event.pageY-dialObject.canvaselement.offsetTop);
		};
	});
	this.canvaselement.addEventListener("touchstart", function (event){
		if (event.touches.length != 1) return;
		event.preventDefault();
		var finger = event.touches[0];
		var x = finger.pageX - dialObject.canvaselement.offsetLeft;
		var y = finger.pageY - dialObject.canvaselement.offsetTop;
		dialObject.debugLog("touchstart: (" + x + ", " + y + ")");
		
		if ((x > 68) && (x < 132) && (y > 481) && (y < 545))
		{
			dialOjbect.mouseDown = 1;
			dialObject.moveDial(x, y);
		}
		else if ((y > 10) && (x < 471))
		{
			dialObject.mouseDown = 2;
			dialObject.moveBar(y);
		};
	});
	this.canvaselement.addEventListener("touchleave", function (event){
		event.preventDefault();
		dialObject.mouseDown = 0;
		dialObject.debugLog("touchleave");
	});
	this.canvaselement.addEventListener("touchend", function (event){
		event.preventDefault();
		dialObject.mouseDown = 0;
		dialObject.debugLog("touchend");
	});
	this.canvaselement.addEventListener("touchcancel", function (event){
		event.preventDefault();
		dialObject.mouseDown = 0;
		dialObject.debugLog("touchcancel");
	});
	this.canvaselement.addEventListener("touchmove", function (event){
		if (event.touches.length != 1) return;
		event.preventDefault();
		var finger = event.touches[0];
		var x = finger.pageX - dialObject.canvaselement.offsetLeft;
		var y = finger.pageY - dialObject.canvaselement.offsetTop;
		
		if (dialObject.mouseDown == 1)
		{
			dialObject.moveDial(x, y);
		}
		else if (dialObject.mouseDown == 2)
		{
			dialObject.moveBar(y);
		};
	});
	
	// finally paint the dial once initialised.
	this.redraw();
};

var dialTest;
function loadDial()
{
	dialTest = new Dial("canvas");
	//dialTest.redraw();
};

function mouseClick(event)
{
	dialTest.click(event);
	document.getElementById("dispval").innerHTML = "Value: " + dialTest.getValue(100) + "%";
};