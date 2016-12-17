(function() {
 angular
  .module('users')
  .directive("experiment", directiveFunction)
})();

/** Variables declaraions */

var collision_stage, tick;

var kilo_gram, pause_anim, start_anim, final_pos_direction_y, final_pos_object_y;

var obj_a_end_x, obj_a_end_y, obj_b_end_x, obj_b_end_y;

var angle_a, angle_b, collide_each_flag, collide_wall_flag, hit_timer, distance;

var ball_a, ball_b, ball_a_radius, ball_b_radius;

var ONEPX, BOUND_HEIGHT, BOUND_WIDTH, UNIT_LENGTH;

var velocity_of_objA, velocity_of_objB, objA_x_velocity, objA_y_velocity, objB_x_velocity, objB_y_velocity;

var objA_angle, objB_angle, coeff_restitution;

var ball_a_x, ball_a_y, ball_b_x, ball_b_y;

var TIME_INTERVAL, chart;

var ball_a_tween, collieded_side, minus_factor;
/** Arrays declarations */
var help_array = [];

/** Createjs shapes declarations */
var circle_a = new createjs.Shape();
var circle_b = new createjs.Shape();
var object_a_line = new createjs.Shape();
var object_b_line = new createjs.Shape();

var direction_arrow_a = new createjs.Shape();
var direction_arrow_b = new createjs.Shape();
var xy_surface = new createjs.Shape();

var obj_a_circle = new createjs.Shape();
var obj_b_circle = new createjs.Shape();

var objectList = [];
var border_hit = false;
var hit_flag = false;

var AB_distance = 150;
var flag_ballBY, flag_ballBX, flag_ballAY, flag_ballAX;
var radius_AB;
var start_flag;

var time_interval;
var kineticenergy_ball_A, kineticenergy_ball_B;
var mass_ball_a, mass_ball_b;
var angle_degree_a, angle_degree_b;
var collision;

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
   queue = new createjs.LoadQueue(true);
   queue.installPlugin(createjs.Sound);
    /** Initialisation of stage */
   collision_stage = new createjs.Stage("demoCanvas");
   collision_stage.enableDOMEvents(true);
   collision_stage.enableMouseOver();
   createjs.Touch.enable(collision_stage);
   loadingProgress(queue, collision_stage, exp_canvas.width)
   queue.on("complete", handleComplete, this);
   /** Preloading the images */
   queue.loadManifest([{
    id: "background",
    src: "././images/background.svg",
    type: createjs.LoadQueue.IMAGE
   }, {
    id: "ball_a",
    src: "././images/ball_a.svg",
    type: createjs.LoadQueue.IMAGE
   }, {
    id: "ball_b",
    src: "././images/ball_b.svg",
    type: createjs.LoadQueue.IMAGE
   }, {
    id: "centre_ball",
    src: "././images/centre_ball.svg",
    type: createjs.LoadQueue.IMAGE
   }]);
   tick = setInterval(updateTimer, 100); /** Stage update function in a timer */

   function handleComplete() { 
	scope.show_menu = true;   
    /** Initializing the variables */
    initialisationOfVariables();
    /**loading images, text and containers*/
    loadImages(queue.getResult("background"), "background", 0, 0, "", 0, collision_stage, 1.6);
    xy_surface.graphics.ss(1).s("balck").drawRect(0, 0, BOUND_WIDTH, BOUND_HEIGHT);
    collision_stage.addChild(xy_surface);
    collision_stage.addChild(obj_a_circle);
    obj_a_circle.x = 250;
    obj_a_circle.y = 250;
    obj_a_circle.graphics.beginFill("red").drawCircle(0, 0, 55).command;
    obj_a_circle.alpha = 0.001;

    collision_stage.addChild(obj_b_circle);
    obj_b_circle.x = 400;
    obj_b_circle.y = 250;
    obj_b_circle.graphics.beginFill("red").drawCircle(0, 0, 55).command;
    obj_b_circle.alpha = 0.001;
    loadImages(queue.getResult("centre_ball"), "centre_ball", 325, 250, "", 0, collision_stage, 0.5);
    loadImages(queue.getResult("ball_a"), "ball_a", 250, 250, "", 0, collision_stage, 0.5);
    loadImages(queue.getResult("ball_b"), "ball_b", 400, 250, "", 0, collision_stage, 0.5);
    getChild("ball_a").x = 250;
    getChild("ball_a").y = 250;
	getChild("ball_a").cursor = "move";
	getChild("ball_b").cursor = "move";

    collision_stage.addChild(circle_a);
    circle_a.x = getChild("ball_a").x;
    circle_a.y = getChild("ball_a").y;
    circle_a.graphics.beginFill("red").drawCircle(0, 0, 10).command;
    circle_a.alpha = 0.01;

    collision_stage.addChild(circle_b);
    circle_b.x = getChild("ball_b").x;
    circle_b.y = getChild("ball_b").y;
    circle_b.graphics.beginFill("red").drawCircle(0, 0, 13).command;
    circle_b.alpha = 0.01;

    drawDirectionObjA(circle_a, object_a_line, circle_a.x, circle_a.y, direction_arrow_a, scope);
    drawDirectionObjB(circle_b, object_b_line, circle_b.x, circle_b.y, direction_arrow_b, scope);
    dragObjectA(object_a_line, direction_arrow_a, scope);
    dragObjectB(object_b_line, direction_arrow_b, scope);
    objectList.push(getChild("ball_a"), getChild("ball_b"));
    /** Initializing control side variables */
    initialisationOfControls(scope);
    /** Function call for images used in the apparatus visibility */
    initialisationOfImages();
    /** Translation of strings using gettext */
    translationLabels();
    /** Value calculation function */
    calculation(scope);
    makeGraph();
    collision_stage.update();
   }
   /** Add all the strings used for the language translation here. '_' is the short cut for 
   calling the gettext function defined in the gettext-definition.js */
   function translationLabels() {
    /** This help array shows the hints for this experiment */
    help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("Next"), _("Close")];
    scope.heading = _("Collision Balls");
    scope.variables = _("Variables");
    scope.result = _("Result");
    scope.copyright = _("copyright");
    scope.restitution_lbl = _("Coeff of Restitution:");
    kilo_gram = _("kg")
    scope.kg = kilo_gram;
    scope.mass_of_objA_lbl = _("Mass of Object A:");
    scope.mass_of_objB_lbl = _("Mass of Object B:")
    scope.show_centre_mass = _("Show Centre of Mass");
    pause_anim = _("Pause Animation");
    scope.reset_experiment = _("Reset");
    scope.pause_animation = pause_anim;
    start_anim = _("Start");
    scope.start_animation = start_anim;
    scope.objectA = _("Object A");
    scope.Velocity = _("Velocity, v");
    scope.kineticEnergy = _("kineticEnergy, KE:");
    scope.objectB = _("Object B");
    scope.$apply();
   }
  }
 }
}

/** All the texts loading and added to the natural_convection_stage */
function setText(name, textX, textY, value, color, fontSize, container) {
 var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
 _text.x = textX;
 _text.y = textY;
 _text.textBaseline = "alphabetic";
 _text.name = name;
 _text.text = value;
 _text.color = color;
 container.addChild(_text); /** Adding text to the container */
}
/** All the images loading and added to the natural_convection_stage */
function loadImages(image, name, xPos, yPos, cursor, rot, container, scale) {
 var _bitmap = new createjs.Bitmap(image).set({});
 if (name == "ball_a" || name == "ball_b" || name == "centre_ball") {
  _bitmap.regX = _bitmap.image.width / 2;
  _bitmap.regY = _bitmap.image.height / 2;
 }
 _bitmap.x = xPos;
 _bitmap.y = yPos;
 _bitmap.scaleX = _bitmap.scaleY = scale;
 _bitmap.name = name;
 _bitmap.alpha = 1;
 _bitmap.rotation = rot;
 _bitmap.cursor = cursor;
 container.addChild(_bitmap); /** Adding bitmap to the container */
}

/** Function to return child element of stage */
function getChild(child_name) {
 return collision_stage.getChildByName(child_name); /** Returns the child element of stage */
}

/** Initialisation of all controls */
function initialisationOfControls(scope) {
 scope.coeff_restitution = 0.5; /** Initial mass of fly wheel */
 scope.mass_of_a = 1; /** Initial diameter of fly wheel */
 scope.mass_of_b = 1; /** Initial mass of rings */
}
/** All variables initialising in this function */
function initialisationOfVariables() {
 final_pos_direction_y = 440;
 final_pos_obj_left = 30;
 final_pos_obj_right = 670;
 final_pos_obj_top = 30;
 final_pos_obj_bottom = 415;
 obj_a_end_x = obj_a_end_y = 250;
 obj_b_end_x = 400;
 obj_b_end_y = 250;
 coeff_restitution = 0.5;
 angle_a = angle_b = distance = 0;
 collide_each_flag = collide_wall_flag = false;
 ONEPX = 1.43 /** One pixel consider as 1.43 centemeter */
 BOUND_HEIGHT = 442; /** Height of xy plane*/
 BOUND_WIDTH = 700; /** Width of xy plane*/
 UNIT_LENGTH = 70; /** 70 pixel consider as one meter*/
 ball_a = new createjs.Point(obj_a_end_x, obj_a_end_y);
 ball_b = new createjs.Point(obj_b_end_x, obj_b_end_y);
 ball_a_radius = ball_b_radius = 18;
 velocity_of_objA = 1; /** Initial value of ball A*/
 velocity_of_objB = 1; /** Initial value of ball B*/
 ball_a_x = 0; /** x-axis postion of ball A */
 ball_a_y = 0; /** y-axis postion of ball A */
 ball_b_x = 0; /** x-axis postion of ball B */
 ball_b_y = 0; /** y-axis postion of ball B */
 TIME_INTERVAL = 0.05;
 minus_factor = 1;
 mass_ball_a = 1;
 mass_ball_b = 1;
 AB_distance = 150;
 flag_ballBY = true;
 flag_ballBX = true;
 flag_ballAY = true;
 flag_ballAX = true;
 radius_AB = 36;
 time_interval = 1;
 start_flag = false;
 flag_ballBY = true;
 flag_ballBX = true;
 flag_ballAY = true;
 flag_ballAX = true;
 collision = false;
 kineticenergy_ball_A = kineticenergy_ball_B = 0
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
 getChild("centre_ball").visible = false;
}

/** Stage updation function */
function updateTimer() {
 collision_stage.update();
}
var direction_b_flag = false;