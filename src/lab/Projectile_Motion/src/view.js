(function() {
    angular
        .module('users')
        .directive("experiment", directiveFunction)
})();

/** Variables declaraions */

var projectile_stage, tick, timer_interval, arc_line_container, bullet_move_frames, sec, exp_canvas;

var cannon_height, bullet_prev_x, bullet_prev_y, random_arc_clr, bullet_move_timer, meter;

var time_of_flight, max_height, horizontal_range, velocity_x_axis, distance, velocity_y_axis;

var prev_velocity_y_axis, prev_time, time, height, prev_height, y_line_y_prev, y_line_x_prev;

var bullet_moving_x, bullet_moving_y, bullet_moving_velocity, bullet_moving_theta, milli_sec;

var velocity_of_x, velocity_of_y, bullet_start_x, bullet_start_y, time_count, y_line_x, second;

var bullet_case_startx, bullet_case_starty, wheel_front_startx, wheel_front_starty, timer_delay;

var x_line, y_line, bullet_move_interval, arc_line, bullet_dummy, delay_timer, time_of_fly, square_root_time;

var height_box_top_initial_y, wheel_initial_y, bullet_initial_y, bullet_case_initial_y;

/** Arrays declarations */
var enviornment_array = help_array = arc_array = bullet_array = [];

/** Createjs shapes declarations */
var bullet_hit_line = new createjs.Shape();

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
            /** Initialisation of stage */
            projectile_stage = new createjs.Stage("demoCanvas");
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
			loadingProgress(queue, projectile_stage, exp_canvas.width)
            queue.on("complete", handleComplete, this);
			/** Preloading the images */
            queue.loadManifest([{
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "wheel_behind",
                src: "././images/wheel_behind.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "bullet",
                src: "././images/bullet.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "bullet_case",
                src: "././images/bullet_case.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "height_box_shadow",
                src: "././images/height_box_shadow.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "height_box",
                src: "././images/height_box.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "height_box_top",
                src: "././images/height_box_top.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "wheel_front",
                src: "././images/wheel_front.svg",
                type: createjs.LoadQueue.IMAGE
            }]);

            projectile_stage.enableDOMEvents(true);
            projectile_stage.enableMouseOver();
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */

            function handleComplete() {
                /** Initializing the variables */
                initialisationOfVariables(); 
				/**loading images, text and containers*/
                loadImages(queue.getResult("background"), "background", 0, -120, "", 0, projectile_stage, 1);
                arc_line_container = new createjs.Container(); /** Container for drawing arc */
                arc_line_container.name = "arc_line_container";
                projectile_stage.addChild(arc_line_container);
                loadImages(queue.getResult("height_box_shadow"), "height_box_shadow", 30, 640, "", 0, projectile_stage, 1);
                loadImages(queue.getResult("height_box"), "height_box", 29, 524, "", 0, projectile_stage, 1);
                loadImages(queue.getResult("height_box_top"), "height_box_top", 29, height_box_top_initial_y, "", 0, projectile_stage, 1);
                loadImages(queue.getResult("wheel_behind"), "wheel_behind", 30, wheel_initial_y, "", 0, projectile_stage, 1);
                loadImages(queue.getResult("bullet_case"), "case_separate", 60, bullet_case_initial_y, "", -10, projectile_stage, 1);
                loadImages(queue.getResult("wheel_front"), "wheel_separate", 28, wheel_initial_y, "", 0, projectile_stage, 1);
				loadImages(queue.getResult("bullet"), "bullet", 56, bullet_initial_y, "", -10, projectile_stage, 0.7);
                loadImages(queue.getResult("bullet_case"), "bullet_case", 60, bullet_case_initial_y, "", -10, projectile_stage, 1);
                loadImages(queue.getResult("wheel_front"), "wheel_front", 28, wheel_initial_y, "", 0, projectile_stage, 1);
                projectile_stage.getChildByName("case_separate").visible = true;
                projectile_stage.getChildByName("wheel_separate").visible = true;
                projectile_stage.getChildByName("wheel_front").visible = true;
                projectile_stage.getChildByName("bullet_case").visible = true;
				
				setText("heightText", 100, 100, "", "black", 1, projectile_stage); /** Label for height H */
				
                /** Bullet hit bottom side area */
                bullet_hit_line.graphics.beginFill("red").drawRect(20, 640, 680, 50);
                bullet_hit_line.alpha = 0.01;
                projectile_stage.addChild(bullet_hit_line);
				/** Initializing control side variables */
                initialisationOfControls(scope);
				/** Function call for images used in the apparatus visibility */
                initialisationOfImages(); 
				/** Translation of strings using gettext */
                translationLabels(); 
				/** Creating stopwatch for the experiment */
                createStopwatch(projectile_stage, 20, 20, timer_interval);
                /** Value calculation function */
                calculation(scope); 
            }

            /** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("Next"), _("Close")];
                scope.heading = _("Projectile Motion");
                scope.variables = _("Variables");
                scope.result = _("Result");
                scope.copyright = _("copyright");
                scope.choose_enviornment = _("Choose Environment:");
                scope.mpers = _("m/s");
                meter = _("m")
                scope.m = meter;
                sec = _("s");
                scope.earth = _("Earth");
                scope.velocity_lbl = _("Velocity:");
                scope.angle_of_projection_lbl = _("Angle of Projection:");
                scope.cannon_height_lbl = _("Cannon Height:")
                scope.fire_txt = _("Fire");
                scope.erase_txt = _("Erase");
                scope.show_result = _("Show Result");
                scope.time_of_flight_lbl = _("Time of Flight, T:");
                scope.max_height_lbl = _("Maximum Height, H:");
                scope.hor_range_lbl = _("Horizontal Range, R:");
                scope.enviornment_array = [{
                    enviornment: _('Earth'),
                    type: 9.8,
                    index: 0
                }, {
                    enviornment: _('Moon'),
                    type: 1.6,
                    index: 1
                }, {
                    enviornment: _('Uranus'),
                    type: 10.67,
                    index: 2
                }, {
                    enviornment: _('Saturn'),
                    type: 11.08,
                    index: 3
                }, {
                    enviornment: _('Jupiter'),
                    type: 25.95,
                    index: 4
                }];
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
    if (name == "bullet_case"|| name == "case_separate") {
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
    return projectile_stage.getChildByName(child_name); /** Returns the child element of stage */
}

/** Initialisation of all controls */
function initialisationOfControls(scope) {
    scope.Enviornment = 9.8; /** Initial enviornment */
    scope.velocity = 35; /** Initial mass of fly wheel */
    scope.angle_of_projection = 10; /** Initial diameter of fly wheel */
    scope.cannon_height = 0; /** Initial mass of rings */
}
 
/** All variables initialising in this function */
function initialisationOfVariables() {
    timer_interval = 1; /** Interval of the timer and clock to be execute */
    /** Initialisation of variables that used for calculation */
    cannon_height = time_of_flight = max_height = horizontal_range = velocity_x_axis = velocity_y_axis = distance = 0;
    prev_velocity_y_axis = prev_time = time = height = prev_height = time_count = time_of_fly = square_root_time = 0;
    bullet_case_startx = bullet_case_starty = wheel_front_startx = wheel_front_starty = 0;
    y_line_x = y_line_y_prev = y_line_x_prev = second = milli_sec = bullet_move_frames = 0;
    timer_delay = 12; /** Time interval of delay timer initial value */
    bullet_move_interval = 100; /** Bullet move timer time interval */ 
    bullet_moving_velocity = 60; /** Bullet's initial velocity */
    bullet_moving_theta = 15; /** Bullet's initial angle */
    height_box_top_initial_y = 630; /** Initial y position of image height box top */
    wheel_initial_y = 573; /** Initial y position of image wheel front and wheel behind */
    bullet_initial_y = 612; /** Initial y position of image bullet */
    bullet_case_initial_y = 618; /** Initial y position of image bullet case */
}

/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    getChild("height_box").scaleY = -0.1; /** Scaling of height box */
    getChild("height_box").y = 652; /** Height box initial y value */
    /** Initialisation of variables dat used for bullet animation calculation */
    bullet_moving_x = getChild("bullet").x; 
    bullet_moving_y = getChild("bullet").y;    
    bullet_start_x = bullet_moving_x;
    bullet_start_y = bullet_moving_y;
    calculateVelocity(); /** Velocity of bullet calculating in this function */
}

/** Stage updation function */
function updateTimer() {
    projectile_stage.update();
}