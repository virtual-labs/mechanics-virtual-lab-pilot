(function(){
  angular
       .module('users')
       .directive("experiment",directiveFunction)
})();

var stage,exp_canvas,queue,stage_width,stage_height,tick;

var btn_lbls, time_slots, time_slot_indx;

var rotation_speed, speed_correction;

var line, rotation_in, time_slots;

var thread_anim_object, thread_anim_frame, thread_anim_width;

var wound, weight_container, thread_anim_clr, weight_container_temp;

var alpha, gravity, mass_of_flywheel, diameter_of_flywheel, mass_of_rings, diameter_of_axle, no_of_wound;

var rolling, INTERVAL, angular_velocity, angular_distance, total_rotation, number_of_rotation, clr_string_intrl;

var line_mask, weight_obj, play_event, final_rotation, string_x_pos, itration, x_decrement, moment_of_inertia_of_flywheel;

var rotation, rotation_decimal, last_rotation_angle, reset_flag, wheel_rotation_speed;

var thread_anim_rect = new createjs.Shape();

var long_string = new createjs.Shape();

function directiveFunction(){
    return {
        restrict: "A",
        link: function(scope, element,attrs){
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if ( element[0].width > element[0].height ) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }  
            if ( element[0].offsetWidth > element[0].offsetHeight ) {
                element[0].offsetWidth = element[0].offsetHeight;           
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
            exp_canvas = document.getElementById("demoCanvas"); /** Initialization of canvas element */
            exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;            
            stage = new createjs.Stage("demoCanvas"); /** Initialization of stage element */
            queue = new createjs.LoadQueue(true); /** Initialization of queue objet */
            queue.installPlugin(createjs.Sound);
            loadingProgress(queue, stage, exp_canvas.width); /** Preloader function */
            queue.on("complete", handleComplete, this);
            queue.loadManifest([ /** Loading all images into queue */
                {
                    id: "background",
                    src: "././images/background.png",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "texture",
                    src: "././images/texture.png",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "light_gradient",
                    src: "././images/light_gradient.png",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "scale",
                    src: "././images/scale.svg",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "weight_with_hook",
                    src: "././images/weight_with_hook.svg",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "weight",
                    src: "././images/weight.svg",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "thread_falling_anim",
                    src: "././images/thread_falling_anim.svg",
                    type: createjs.LoadQueue.IMAGE
                },
                {
                    id: "popup_height",
                    src: "././images/popup_height.svg",
                    type: createjs.LoadQueue.IMAGE
                }
            ]);
            stage.enableDOMEvents(true); /** Activates mouse listeners on the stage */
            stage.enableMouseOver();
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
            container = new createjs.Container(); /** Creating new container */
            container.name = "container"; /** Assigning name to container */
            stage.addChild(container); /** Append it in the stage */
            weight_container = new createjs.Container(); /** Creating new container to keep weights and weight holder together */
            weight_container.name = "weight_container"; /** Assigning name to container */
            stage.addChild(weight_container); /** Adding container to stage */
            weight_container_temp = new createjs.Container();/** Creating new container to keep weights together while the weights falls from fly wheel */
            weight_container_temp.name = "weights"; /** Assigning name to container */
            stage.addChild(weight_container_temp); /** Adding container to stage */
            
            function handleComplete(){  /** Loading all preloaded images to canvas */               
                loadImages(queue.getResult("texture"),"texture",318,130,"",0,container,1);          
                loadImages(queue.getResult("texture"),"texture_1",318,-231,"",0,container,1);
                loadImages(queue.getResult("light_gradient"),"light_gradient",327,130,"",0,container,1);            
                drawLine(); /** Function to draw lines over fly wheel*/
                loadImages(queue.getResult("background"),"background",0,0,"",0,container,1);
                loadImages(queue.getResult("weight_with_hook"),"weight_with_hook",369,553,"",0,weight_container,1);
                loadImages(queue.getResult("weight"),"weight_4",370.5,592,"",0,weight_container,1);
                loadImages(queue.getResult("weight"),"weight_6",370.5,584,"",0,weight_container,1);
                loadImages(queue.getResult("weight"),"weight_8",370.5,576,"",0,weight_container,1);
                loadImages(queue.getResult("weight"),"weight_10",370.5,568,"",0,weight_container,1);
                container.addChild(long_string); /** Adding shape object to container */
                loadImages(queue.getResult("thread_falling_anim"),"thread_falling_anim",298,230,"",0,container,1);
                loadImages(queue.getResult("weight"),"weights_4",0,24,"",0,weight_container_temp,1);
                loadImages(queue.getResult("weight"),"weights_6",0,16,"",0,weight_container_temp,1);
                loadImages(queue.getResult("weight"),"weights_8",0,8,"",0,weight_container_temp,1);
                loadImages(queue.getResult("weight"),"weights_10",0,0,"",0,weight_container_temp,1);
                loadImages(queue.getResult("scale"),"scale",430,483,"",0,container,1);
                loadImages(queue.getResult("popup_height"),"popup_height",470,610,"",0,container,1); 
                setText("hundred",120,231,0,"white",2,container); /** Text for place value ten in counter */           
                setText("ten",142,231,0,"white",2,container); /** Text for place value ten in counter */
                setText("one",164,231,0,"white",2,container); /** Text for place value one in counter */
                setText("period",186,231,".","white",2,container); /** To show period in  counter */
                setText("decimal_one",201,231,0,"white",2,container); /** Text for place value one after decimal point in counter */
                setText("decimal_ten",223,231,0,"white",2,container); /** Text for place value ten after decimal point in counter */
                setText("height_txt",485,629,'02cm',"black",1.1,container);
                initialisationOfVariables(); /** Initializing the variables */
                initialisationOfControls(scope); /** Initialization of control side variables */
                thread_anim_rect.graphics.beginStroke("").drawRect(320,200,180,490); /** Rectangle for mask thread animation */
                initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */
                createStopwatch(stage, 20, 500, 1); /** To load and generate stop watch */
                stage.update(); /** Function to update stage */
                setTimeout(function(){clearInterval(tick)},200); /** Clearing stage update after 200 milli seconds */
                play_event = clockContainer.getChildByName("play").on("click",function(){ /** Click event added to play button on timer */
                    releaseHold(scope); /** Function to start the experiment and rotation of fly wheel */
                    scope.$apply();
                });
                clockContainer.getChildByName("pause").off("click",listner_pause) /** Click event removed from pause button */ 
                clockContainer.getChildByName("reset").on("click",function(){ /** Click event added to reset button on timer */
                    resetExperiment(scope); /** This function will rest simulstion */
                    scope.$apply();
                });

            }
            
            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */   
            function translationLabels(){
                /** This help array shows the hints for this experiment */
                helpArray=[_("Next"),_("Close"),_("help1"),_("help2"),_("help3"),_("help4"),_("help5")];
                scope.heading=_("Moment of Inertia of Flywheel");
                scope.variables=_("Variables");                 
                scope.result=_("Result");  
                scope.copyright=_("copyright"); 
                scope.choose_enviornment = _("Choose Environment:");
                cm = _(" cm");
                scope.kg = _("kg");
                scope.cm = cm;
                scope.gm = _("gm");
                scope.earth = _("Earth, g=9.8m/s");
                scope.mass_of_fly_wheel_lbl = _("Mass of fly wheel:");
                scope.dia_of_fly_wheel_lbl = _("Diameter of fly wheel:");
                scope.mass_of_rings_lbl = _("Mass of rings:");
                scope.axle_diameter_lbl = _("Diameter of axle:");
                scope.no_of_wound_lbl = _("No. of wound of chord:");
                scope.mInertia_lbl = _("First start experiment..!");
                scope.mInertia_val = "";
                btn_lbls = [_("Release fly wheel"),_("Hold fly wheel")];
                scope.release_hold_txt = btn_lbls[0];
                scope.reset = _("Reset");
                scope.enviornment_array = [{
                    enviornment: _('Earth, g=9.8m/s'),
                    type: 9.8
                }, {
                    enviornment: _('Moon, g=1.63m/s'),
                    type: 1.63
                }, {
                    enviornment: _('Uranus, g=10.5m/s'),
                    type: 10.5
                }, {
                    enviornment: _('Saturn, g=11.08m/s'),
                    type: 11.08
                }, {
                    enviornment: _('Jupiter, g=25.95m/s'),
                    type: 25.95
                }];
                scope.$apply();             
            }
        }
    }
}
/** Createjs stage updation happens in every interval */
function updateTimer(){
    stage.update();    
}
/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container){
    var text = new createjs.Text(value, + fontSize + "em Tahoma, Geneva, sans-serif", color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
    stage.addChild(thread_anim_rect);
    container.addChild(text); /** Adding text to the container */
    stage.update();
}
/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot, container,scale){
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX=_bitmap.scaleY=scale;
    _bitmap.name = name;
    _bitmap.alpha = 1;
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor; 
    if ( name == "thread_falling_anim" ) {
        _bitmap.mask = thread_anim_rect; /** Adding mask to thread animation */ 
    }  
    container.addChild(_bitmap); /** Adding bitmap to the container */ 
    stage.update();
}
/** Function to return chiled element of container */
function getChildName(chldName){
    return container.getChildByName(chldName);
}
function initialisationOfControls(scope){
    scope.mass_of_fly_wheel = 5; /** Initial mass of flywheel */
    scope.dia_of_fly_wheel = 10; /** Initial diametere of flywheel */
    scope.mass_of_rings = 200; /** Initial mass of ring */
    scope.axle_diameter = 2; /** Initial diameter of axle */
    scope.no_of_wound = 1; /** Initial wound of chord */
    massOfRingsChange(scope); /** Hide all weights */
    scope.control_disable = false; /** Variable to disable controls */
    scope.btn_disabled = false; /** Variable to disable 'Release Fly Wheel' button */
    scope.mInertia_val = 0.0063;
}
/** All variables initialising in this function */
function initialisationOfVariables() {
    gravity = 9.8; /** Initial graviational value of environmetn */
    mass_of_flywheel = 5; /** Initial mass of fly wheel */
    diameter_of_flywheel = 10; /** Initial diameterof fly wheel */
    mass_of_rings = 200; /** Initial mass of hanging weight */
    diameter_of_axle = 2; /** Initial diameter of axl of fly wheel */
    no_of_wound = 1; /** Initial number of wounds on fly wheel */
    rotation_speed = wheel_rotation_speed = 33600/4; /** Initially speed rate of fly wheel in milli seconds */
    speed_correction = 2.0001; /** Speed correction value for adjusting the speed of fly wheel */
    thread_anim_frame = 0; /** First frame of thread animation image */
    time_slots =[]; /** Array store the time taken for each rotation */
    time_slot_indx = 0; /** Index of time slot array */
    line_mask = new createjs.Shape();
    line_mask.name = "line_mask";
    rotation = 0;
    rotation_decimal = 0;
    line_mask.graphics.drawRect(300, 0, 200, 555);
    line_mask.y = 0;
    long_string.mask = line_mask;
    thread_anim_width = 199.869; /** Variable to indicate the width of each frame of thread animation image */
    wound = new createjs.Shape(); /** Shape object to create wound over axl of fly wheel */
    string_x_pos = 0; /** Initial position of string wounded over axl of fly wheel */
    itration = 0; /** Variable to increment the length of long string while releasing string */
    x_decrement = 0; /** Variable to set the horizontal position of long string whilw releasing the string */
    drawLongString(385); /** Function to draw hanging string */
    rolling = false; /** Variable to indicate that strating of fly wheel rotation, and it used to differentiate initial wheel rotation and wheel rotation after pause */
    INTERVAL = 0.2; /** Basic time interval of simulation(200 milli second) */
    total_rotation = 360; /** One roation of fly wheel */
    angular_velocity = 0; /** Initial value of angular velocity */
    angular_distance = 0; /** Initial value of angular distance */
    number_of_rotation = 0; /** Initial value of number of rotation */
    final_rotation = false;
    getChildName("height_txt").text = "02cm";
}
/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
    thread_anim_object = getChildName("thread_falling_anim");
    weight_obj = stage.getChildByName("weight_container");
    thread_anim_object.visible = false; /** Initial visibility of thread animation */
    stage.getChildByName("weights").x = 366.5; /** Initial horizontal postion of weights */
    stage.getChildByName("weights").y = 600; /** Initial vertical postion of weights */
    stage.getChildByName("weights").alpha = 0; /** Initial visibility of weights */
}