(function() {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();

var environmentArray = environment_value_Array = help_array = [];

var ballistic_pendulam_stage, exp_canvas;

var tick, bullet_timer; /** Tick timer for stage updation */

var selected_environment,angle, stationery_pendulum_angle,ceiling,bullet_endpoint;

var block_mass, bullet_mass, bullet_velocity, pendulum_length, bottom_velocity, height_of_pendulum;

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
            ballistic_pendulam_stage = new createjs.Stage("demoCanvas");
            /** Preloading the images in a queue */
            queue = new createjs.LoadQueue(true);
            queue.installPlugin(createjs.Sound);
			loadingProgress(queue,ballistic_pendulam_stage,exp_canvas.width)
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "stationery_pendulum",
                src: "././images/stationary_pendulum.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "pendulum",
                src: "././images/pendulum.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "bullet",
                src: "././images/bullet.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "bullet_top",
                src: "././images/bullet_top.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
                id: "box_top",
                src: "././images/box_top.svg",
                type: createjs.LoadQueue.IMAGE
            }]);
            ballistic_pendulam_stage.enableDOMEvents(true);
            ballistic_pendulam_stage.enableMouseOver();
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
            function handleComplete() {
                maskRectangle = new createjs.Shape(); /** Used for masking the rectangle*/
                /** Loading all images in the queue to the stage */
                loadImages(queue.getResult("background"), "background", 0, 0, "", 0, 1, ballistic_pendulam_stage);
                loadImages(queue.getResult("stationery_pendulum"), "stationery_pendulum", 467.5, 261, "", 0, 1, ballistic_pendulam_stage);
                loadImages(queue.getResult("bullet"), "bullet", 276, 561, "", 0, 1, ballistic_pendulam_stage);
                loadImages(queue.getResult("bullet_top"), "bullet_top", 268, 561.5, "", 0, 1, ballistic_pendulam_stage);
                loadImages(queue.getResult("pendulum"), "pendulum", 455, 255, "", 0, 1, ballistic_pendulam_stage);
                ballistic_pendulam_stage.addChild(maskRectangle); /** Append weight container to the stage */
                /** Initializing the variables */
                initialisationOfVariables();
                /** Translation of strings using gettext */
                translationLabels();
                ballistic_pendulam_stage.update();
            }

            /** Add all the strings used for the language translation here.
			'_' is the short cut for calling the gettext function defined in the gettext-definition.js */
            function translationLabels() { /** Labels used in the experiment initialize here */
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("Next"), _("Close")];
                /** Experiment name */
				scope.heading = _("Ballistic Pendulum"); 
				/**Show Result checkbox label*/
                scope.show_result = _("Show Result");
				/**Mass of the block slider label*/				
                scope.change_mass = _("Mass of the block"); 
				/**Mass of the bullet slider label*/
                scope.change_bullet_mass = _("Mass of Bullet"); 
				/**velocity slider label*/
                scope.velocity_label = _("Velocity"); 
				/** 'Shoot' button label */
                scope.start_label = _("Shoot");
				/** 'Reset' button label */				
                scope.reset_label = _("Reset"); 
				/** velocity unit*/
                scope.vel_label = _("m/s"); 
				/**environment unit*/
                scope.ms_label = _("ms"); 
				/**mass unit*/
                scope.gm_label = _("g"); 
				/**height unit*/
				scope.cm_label = _("cm"); 
				/**environment dropdown value*/
                scope.earth = _("Earth(g=9.8 m/s²)"); 
				/**environment dropdown label*/
                scope.environment_types = _("Environment"); 
                /**array that shows different type of environment*/
                scope.environmentArray = [{
                    environment: _('Earth(g=9.8 m/s²)'),
                    type: 0
                }, {
                    environment: _('Moon(g=1.6 m/s²)'),
                    type: 1
                }, {
                    environment: _('Uranus(g=10.67 m/s²)'),
                    type: 2
                }, {
                    environment: _('Saturn(g=11.08 m/s²)'),
                    type: 3
                }, {
                    environment: _('Jupitor(g=25.95 m/s²)'),
                    type: 4
                }];
                /**label for values shown in the result part*/
                scope.result_label1 = _("Height of pendulum");
                scope.result_label2 = _("Maximum angle");
                scope.result_label3 = _("Velocity");
				scope.variables = _("Variables");
                scope.result = _("Result");
                scope.copyright = _("copyright");
                scope.$apply();
            }
        }
    }
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
    ballistic_pendulam_stage.update();
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize) {
    var text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
	/** Adding text to the stage */
    ballistic_pendulam_stage.addChild(text); 
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
	/**Setting registration point for pendulum*/
    if (name == "pendulum") {
        _bitmap.regX = image.width / 2;
        _bitmap.regY = image.height / 2 - 160;
    }
	/**Setting registration point for stationary pendulum*/
    if (name == "stationery_pendulum") {
        _bitmap.regX = 16;
        _bitmap.regY = 0;
	}
    container.addChild(_bitmap); /** Adding bitmap to the stage */
}

/** All variables initialising in this function */
function initialisationOfVariables() {
    /**array that stores different value for different environments in the dropdown  */
    environment_value_Array = [9.8, 1.6, 10.67, 11.08, 25.95];
	/**set initial value of earth from dropdown */
    selected_environment = 9.8; 
	/**Initialize length of the pendulum*/
    pendulum_length = 1; 
	/**Initialize end point of the bullet*/
	bullet_endpoint= 400;
}