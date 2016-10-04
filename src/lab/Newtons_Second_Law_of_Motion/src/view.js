(function() {
 angular.module('users')
  .directive("experiment", directiveFunction)
})();

var newton_law_stage, exp_canvas, mask_rectangle, carrier_container, weight_container;

var timer, tick; /** Tick timer for stage updation */

var dataplot_array = help_array = [];

var weight_cart, carrier_x, start_flag, distance, time_taken, carrier_x_move;

var initial_right_x, initial_weight_bottom, destination_point, end_time,initial_pointer_pos,final_pointer_pos;

var friction_var, cart_weight_var, hanging_weight_var, acceleration, point_pos, reaching_time;

var line_right = new createjs.Shape(); /**Adding line from cart to destination position */

var line_down = new createjs.Shape(); /**Adding line to hanging weight */

var distance_indication_line1 = new createjs.Shape(); /**Adding line show the distance from cart to end point */

var distance_indication_line2 = new createjs.Shape(); /**Adding line show the distance from cart to end point */

function directiveFunction() {
	return {
		restrict: "A",
		link: function(scope, element, attrs) {
		/** Variable that decides if something should be drawn on mouse move */
			var experiment = true;
			if (element[0].width > element[0].height) {
				element[0].width = element[0].height;
				element[0].height = element[0].height;
			} else {
				element[0].width = element[0].width;
				element[0].height = element[0].width;
			}
			if (element[0].offsetWidth > element[0].offsetHeight) {
				element[0].offsetWidth = element[0].offsetHeight;
			} else {
				element[0].offsetWidth = element[0].offsetWidth;
				element[0].offsetHeight = element[0].offsetWidth;
			}
			exp_canvas = document.getElementById("demoCanvas");
            exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;
			/** Stage initialization */
			newton_law_stage = new createjs.Stage("demoCanvas");
			/** Preloading the images in a queue */
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			loadingProgress(queue,newton_law_stage,exp_canvas.width)
			queue.on("complete", handleComplete, this);
			queue.loadManifest([{
				id: "background",
				src: "././images/background.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "table",
				src: "././images/table.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "carrier",
				src: "././images/carrier.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "ball",
				src: "././images/ball.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "weight",
				src: "././images/weight.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "weight_bottom",
				src: "././images/weight_bottom.svg",
				type: createjs.LoadQueue.IMAGE
			}, {
				id: "arrow",
				src: "././images/arrow.svg",
				type: createjs.LoadQueue.IMAGE
			}]);
			newton_law_stage.enableDOMEvents(true);
			newton_law_stage.enableMouseOver();
			createjs.Touch.enable(newton_law_stage);
			tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
			carrier_container = new createjs.Container(); /** Container for moving carrier and weight*/
			carrier_container.name = "carrier_container";
			weight_container = new createjs.Container(); /** Container for moving carrier and weight*/
			weight_container.name = "weight_container";

			function handleComplete() {
				mask_rectangle = new createjs.Shape(); /** Used for masking the rectangle*/
				/** Loading all images in the queue to the stage */
				loadImages(queue.getResult("background"), "background", 0, 0, "", 0, 1, newton_law_stage);
				loadImages(queue.getResult("table"), "table", 2, 110, "", 0, 1, newton_law_stage);
				loadImages(queue.getResult("ball"), "ball1", 176, 91, "", 0, 1, carrier_container);
				loadImages(queue.getResult("ball"), "ball2", 189, 91, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball3", 201, 91, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball4", 213, 91, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball5", 182, 80, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball6", 194, 80, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball7", 206, 80, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball8", 188, 69, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball9", 200, 69, "", 0, 0, carrier_container);
				loadImages(queue.getResult("ball"), "ball10", 194, 58, "", 0, 0, carrier_container);
				loadImages(queue.getResult("carrier"), "carrier", 155, 100, "", 0, 1, carrier_container);
				newton_law_stage.addChild(carrier_container); /** Append carrier container to the stage */
				loadImages(queue.getResult("weight"), "weight", 571, 150, "", 0, 1, weight_container);
				loadImages(queue.getResult("arrow"), "arrow", 245, 30, "pointer", 0, 1, newton_law_stage);
				/** Add rect for masking the images */
				mask_rectangle.name = "mask_rectangle";
				mask_rectangle.graphics.beginFill("red").drawRect(568, 144, 50, 30);
				mask_rectangle.alpha = 0;
				weight_container.addChild(mask_rectangle); /** Append weight container to the stage */
				/** Add rect for masking the images */
				weight_container.getChildByName("weight").mask = mask_rectangle;
				loadImages(queue.getResult("weight_bottom"), "weight_bottom", 571, 173, "", 0, 1, weight_container);
				newton_law_stage.addChild(weight_container);
				/** Initializing the variables */
				initialisationOfVariables();
				/** Adding stopwatch */
				createStopwatch(newton_law_stage, 450, 530, timer_interval);
				/** Translation of strings using gettext */
				translationLabels();
				/** Graph plotting function */
				makeGraph();
				/**function used to drag the pointer*/
				dragPointer(scope);
				/**Adding line from cart to destination position */
				lineDraw(line_right, "#cccccc", 240, 115, 563, 115);
				/**Adding line to hanging weight*/
				lineDraw(line_down, "#cccccc", 587, 135, 587, 155);
				/**Adding distance indicator line*/
				lineDraw(distance_indication_line1, "#808080", 245, 20, 375, 20);
				lineDraw(distance_indication_line2, "#808080", 425, 20, 550, 20);
				/**Adding text for distance indicator line*/
				setText("cathodeTxt", 380, 23, "100 " + _("cm"), "#cccccc", 0.8, 1);
				/**drawing arrow at the end of distance indicator line*/
				drawArrow(Math.atan2((210 - 390), (90 - 50)), 550, 20, 0);
				drawArrow(Math.atan2((210 - 390), (90 - 50)), 245, 20, 420);
				newton_law_stage.update();
			}
			/** Labels used in the experiment initialize here 
			Add all the strings used for the language translation here. '_' is the shortcut
			for calling the gettext function defined in the gettext-definition.js */
			function translationLabels() { 
				/** This help array shows the hints for this experiment */
				help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("help8"), _("Next"), _("Close")];
				scope.heading = _("Newton's Second Law"); /** Experiment name */
				scope.variables = _("Variables");
				scope.result = _("Result");
				scope.copyright = _("copyright");
				/**label for values shown in the result part*/
				scope.time_pointer_label = _("Time taken to reach pointer");
				scope.pointer_distance_label = _("Pointer Distance");
				scope.accelaration_label = _("Acceleration");
				scope.show_result = _("Show Result"); /**Show Result checkbox label*/
				scope.change_friction = _("Change Friction:"); /**Change Friction slider label*/
				scope.hanging_weight = _("Change Hanging Weight"); /**Change Hanging Weight slider label*/
				scope.cart_weight = _("Change Cart Weight"); /**Change Cart Weight slider label*/
				scope.pointer_position = _("Change the Pointer Position:"); /**Change the Pointer Position slider label*/
				scope.start_label = _("Start"); /** 'Start' button label */
				scope.reset_label = _("Reset"); /** 'Reset' button label */
				scope.sec_label = _("s");
				scope.cm_label = _("cm");
				scope.ms_label = _("ms");
				scope.gm_label = _("g");
				scope.$apply();
			}
		}
	}
}
/**function for drawing line for indicating distance*/
function lineDraw(name, color, initial_x, initial_y, final_x, final_y) {
	name.graphics.clear();
	name.graphics.setStrokeStyle(1).beginStroke(color).moveTo(initial_x, initial_y).lineTo(final_x, final_y).endStroke();
	name.name = "name";
	newton_law_stage.addChild(name);
}

/**function for drawing arrow at the end of the line*/
function drawArrow(radian, x, y, angle) {
	var _arrow = new createjs.Shape();
	_arrow.graphics.beginStroke(createjs.Graphics.getRGB(128, 128, 128)).moveTo(-5, +5).lineTo(0, 0).lineTo(-5, -5);
	var _degree = radian / Math.PI * angle;
	_arrow.x = x;
	_arrow.y = y;
	_arrow.rotation = _degree;
	newton_law_stage.addChild(_arrow);
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
	newton_law_stage.update();
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize) {
	var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
	_text.x = textX;
	_text.y = textY;
	_text.textBaseline = "alphabetic";
	_text.name = name;
	_text.text = value;
	_text.color = color;
	newton_law_stage.addChild(_text); /** Adding text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot, alpha_value, container) {
	var _bitmap = new createjs.Bitmap(image).set({});
	_bitmap.x = xPos;
	_bitmap.y = yPos;
	_bitmap.name = name;
	_bitmap.alpha = alpha_value;
	_bitmap.rotation = rot;
	_bitmap.cursor = cursor;
	container.addChild(_bitmap); /** Adding bitmap to the stage */
}

/** All variables initialising in this function */
function initialisationOfVariables() {
	timer_interval = 1; /** Interval of the timer and clock to be execute */
	weight_cart = 1; /**Initializing weight in the cart*/
	carrier_x = 0; /**Initializing x position of the cart */
	acceleration = 0; /**Initializing value for accelaration */
	initial_weight_bottom = 173; /**Initializing y position of the bottom of the
	hanging weight image */
	initial_right_x = 240; /**Initial value of the line from cart*/
	start_flag = false /**used to identify whether the experiment is started or not*/
	destination_point = 310; /**destination point value to stop the cart*/
	end_time = 0; /**Initialize the ending time*/
	initial_pointer_pos=245;
	final_pointer_pos=535;
}
