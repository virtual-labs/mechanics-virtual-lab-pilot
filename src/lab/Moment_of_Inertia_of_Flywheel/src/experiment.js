function releaseHold(scope) { /** This function will execute while start/pause the rotaiotn of fly wheel */
    scope.control_disable = true;
    temp_scope.btn_disabled = true;
    reset_flag = false;
    tick = setInterval(function(){updateTimer();}, 200); /** Stage update function in a timer */
    calculations(); /** Function to calculate angular acceleration(alpha) */
    if ( !rolling ) { /** To check whether it is first time rotation of fly wheel or not (this block will not execute if the fly wheel restarted after pause state) */
        preCalcultion(scope); /** Function to calculate time taken for each rotation of fly wheel */
        string_intrl = time_slots[0]/200;
        releaseWound(556 - (no_of_wound-1) * 30); /** Releasing of string wounded over axle of fly wheel */
    }
    rotation_speed = wheel_rotation_speed = time_slots[rotation]/4; /** Initial speed of first rotation of fly wheel */
    wheelRolling(); /** Function to motion of fly wheel */
    lineRotation(); /** Function to motion of line over fly wheel */
    digitRotation(); /** Function to execute rotaion counter */
    startWatch(stage); /** Function to start the timer clock */
    woundReleas(time_slots[rotation]); /** Function will execute the motion of weight */
    scope.mInertia_lbl = _("Moment of Inertia of Flywheel: ");
    scope.mInertia_val = moment_of_inertia_of_flywheel.toFixed(4);
    rolling = true;
}
function wheelRolling(){ /** Function to execute the rotaion of fly wheel */
    createjs.Tween.get(getChildName("texture")).to({y: 310},rotation_speed*speed_correction).call(function(){getChildName("texture").y = -231;});
    createjs.Tween.get(getChildName("texture_1")).to({y: -54},rotation_speed*speed_correction).call(function(){
        createjs.Tween.get(getChildName("texture_1")).to({y:132},rotation_speed*speed_correction).call(function(){
            createjs.Tween.get(getChildName("texture_1")).to({y:310},rotation_speed*speed_correction).call(function(){getChildName("texture_1").y = -231;});
            createjs.Tween.get(getChildName("texture")).to({y:-54},rotation_speed*speed_correction).call(function(){
                createjs.Tween.get(getChildName("texture")).to({y:132},rotation_speed*speed_correction).call(function(){
                    wheelRolling();
                });
            });
        });
    });
}
function wheelRollingEnd(){ /** Function to execute the last rotaion of fly wheel */
    var _wheel_to_move = (last_rotation_angle*3.6);
    if ( (last_rotation_angle*3.6) <= 180 ) {
        createjs.Tween.get(getChildName("texture")).to({y: 130+_wheel_to_move},rotation_speed);
        createjs.Tween.get(getChildName("texture_1")).to({y: -230+_wheel_to_move},rotation_speed).call(function(){
        });
    } else {        
        var last_time_slot = time_slots[time_slots.length-2];
        createjs.Tween.get(getChildName("texture")).to({y: 310},(last_time_slot/_wheel_to_move)*180).call(function(){getChildName("texture").y = -231;});
        createjs.Tween.get(getChildName("texture_1")).to({y: -54},(last_time_slot/_wheel_to_move)*180).call(function(){
            createjs.Tween.get(getChildName("texture_1")).to({y:_wheel_to_move-234},last_time_slot - (last_time_slot/_wheel_to_move)*180);
        });

    }
}

function drawLine(){ /** Function to draw line over fly wheel */
    line = new createjs.Shape();
    line.graphics.setStrokeStyle(2).beginStroke("#ADCEE8").moveTo(320,225).lineTo(380,225);
    line.graphics.endStroke();
    line.name = "line"
    container.addChild(line); /** Adding shape object to stage */
    stage.update();
}

function lineRotation(){
    createjs.Tween.get(getChildName("line")).to({y:270},rotation_speed*3).call(function(){ /** Moving line from initial position to 270(3/4 rotation of fly wheel) pixel down to represnt the rotation of fly wheel */
        getChildName("line").y = -90; /** Repostion of line to start remaining 1/4 rortion of fly wheel */
        createjs.Tween.get(getChildName("line")).to({y:0},rotation_speed).call(function(){ /** To complete one rotaion of fly wheel */
            rotation++; /** Variable to keep number of rotation */
            if ( rotation < no_of_wound ) { /** To check whether the number of rotation is less than total number of wound */
                wound.graphics.clear(); /** To clear all wound objects */
                itration = 0; /** This variable used to show the increment  of line height while releasing the thread */
                x_decrement = 0; /** Starting postion of wound over fyl wheel */
                string_intrl = time_slots[rotation]/200;
                releaseWound(556 - (no_of_wound-rotation-1) * 30);
            }
            wound.graphics.clear(); /** To clear all wound objects */
            for ( i = 385; i <= 385 + (no_of_wound - rotation-2) * 3; i = i + 3 ) { /** Block of code to draw total number of wound */
                wound.graphics.setStrokeStyle(1).beginStroke("#fdfdfd").moveTo(i,215).lineTo(i,230);
                wound.graphics.endStroke();
            }
            if ( rotation == no_of_wound ) { /** This block will execute things after releasing the thread and weights */
                clearTimeout(clr_string_intrl); /** To stop the increment of length of string */
                stage.update();
                long_string.graphics.alpha = 0;
                stage.getChildByName("weights").alpha = 1; /** To visible falling weight after releasing weights from axle */
                weights_anim_clr = createjs.Tween.get(stage.getChildByName("weights")).to({y:624},50);
                thread_anim_clr = setInterval(function stringAnim(){threadRotationAnimation();},30); /** To execute animation of falling of thread */
                stage.getChildByName("weight_container").alpha = 0; /** To hide visibility of weights */
            }     
            rotation_decimal = 0; 
            getChildName("hundred").text = parseInt(rotation/100);
            getChildName("ten").text = rotation < 100 ? parseInt(rotation/10) : parseInt(rotation / 10) % 10; /** Counter digit in place value ten */
            getChildName("one").text = rotation % 10;
            if ( rotation < time_slots.length-2 ) { /** To set speed of each rotation of fly wheel and perform all rotations */
                rotation_speed = wheel_rotation_speed = time_slots[rotation]/4;
                lineRotation();
            } else { /** Block to execute after completing all rotation */
                final_rotation = true;
                if ( last_rotation_angle * 3.6 > 270 ) {
                    rotation_speed = wheel_rotation_speed = time_slots[rotation]/4;
                } else {
                    rotation_speed = time_slots[rotation];
                    wheel_rotation_speed = time_slots[rotation] + (100 - last_rotation_angle)*5;
                }
                if ( last_rotation_angle != 0 ) {
                    createjs.Tween.removeTweens(getChildName("texture"));
                    createjs.Tween.removeTweens(getChildName("texture_1"));
                    getChildName("texture").y = 130; /** Texture image set to initial position  */
                    getChildName("texture_1").y = -231; /** Texture image set to initial postion */
                    wheelRollingEnd();
                    lastLineRotation(last_rotation_angle * 3.6);/** Number of pixel for 1degree(angle) = 360 / 100 = 3.6*/
                } else {
                    endOfCounter();
                }
            }
            if ( rotation < no_of_wound ) {  
                woundReleas(time_slots[rotation]); 
            }
        });  
    });
}

function lastLineRotation(line_pos){
    var _lTime = rotation_speed / 90; /** Time taken to one pixel movement */
    if ( line_pos > 270 ) {
        var _lPart = line_pos - 270;/** Number of pixel were the line to move in fourth circular quarter */
         _lTime = _lPart * _lTime; /** Time taken to move lin in fourth circular quarter */
        _lPart = _lPart - 90; /** 'y' position of line from starting point(-90px) */
        createjs.Tween.get(getChildName("line")).to({y:270},rotation_speed*3).call(function(){ /** Moving line from initial position to 270(3/4 rotation of fly wheel) pixel down to represnt the rotation of fly wheel */
            getChildName("line").y = -90; /** Repostion of line to start remaining 1/4 rortion of fly wheel */
            createjs.Tween.get(getChildName("line")).to({y:_lPart},_lTime).call(function(){ /** To complete one rotaion of fly wheel */
                endOfCounter();
            });
        });
    } else {
        createjs.Tween.get(getChildName("line")).to({y:line_pos},rotation_speed).call(function(){
            endOfCounter();
        });
    }     
}

function endOfCounter(){
    createjs.Tween.removeAllTweens (); /** To stop rotaion of fly wheel, line over fly wheel, thread animation */
    pauseWatch(); /** To stop timer clock */
    clearTimeout(rotation_in); /** To stop the counter, which count the total number of rotaion */
    if ( clockContainer.getChildByName("play").hasEventListener("click") ) { /** To remove the event listner from play button in clok */
        clockContainer.getChildByName("play").off("click",listner_play);
        clockContainer.getChildByName("play").off("click",play_event);
    }
    temp_scope.$apply();
}

function digitRotation(){ /** To display the counter, which count the total number of rotation of fly wheel */
    rotation_decimal < 99 ? rotation_decimal++ : rotation_decimal = 0;
    getChildName("decimal_one").text = parseInt(rotation_decimal/10);
    getChildName("decimal_ten").text = rotation_decimal%10;
    var _height =  (no_of_wound - rotation)* 2 - (parseFloat((rotation_decimal/50).toFixed(1)) );
    if ( rotation < no_of_wound ) {
        getChildName("height_txt").text =  _height.toFixed(1) + "cm";
    } else if ( rotation == no_of_wound ) {
        getChildName("height_txt").text = "0.0cm";
    }
    var ROT_COUNT = 100;
    if ( last_rotation_angle * 3.6 < 270 && final_rotation ) {
        ROT_COUNT = last_rotation_angle;
        rotation_speed = time_slots[rotation] / 4;
    }
    rotation_in = setTimeout(function(){digitRotation();}, (rotation_speed*4)/ROT_COUNT); /** To call back the function itself */
}

/** Fly wheel rotation animation function */
function threadRotationAnimation() {
    long_string.graphics.clear();
    thread_anim_frame++; /** Animation frame increment */
    if ( thread_anim_frame <= 21 ) {
        thread_anim_object.visible = true;
        thread_anim_object.x = thread_anim_object.x - thread_anim_width; /** Changing of animation object x position */                     
     } else {
        thread_anim_frame=22;
        clearInterval(thread_anim_clr);
        angular_acceleration = -10; /** After falling the chord the angular acceleration will be -10 */
    }
}

function generateWound(x_pos){ /** Function to create wounds over axle */
   wound.graphics.setStrokeStyle(1).beginStroke("#fdfdfd").moveTo(x_pos,215).lineTo(x_pos,230);
   wound.graphics.endStroke();
   container.addChild(wound);
   stage.update();
}

function drawLongString(x_pos){ /** Function to draw long string */
    long_string.graphics.clear();
    var _string_length = 556 - ((x_pos - 385) / 3) * 30; /** Calculate the length of string */
    long_string.graphics.setStrokeStyle(1).beginStroke("#fdfdfd").moveTo(x_pos,215).lineTo(x_pos,_string_length); /** Drawing line */ 
    stage.update();
}

function releaseWound(x_pos){
    string_x_pos = x_pos + 0.3;/** Horizontal position of string wounded over axle */
    var _x_point = 385 + (no_of_wound - rotation - 1) * 3; /** Horizontal position of long string */
    x_decrement += 0.03;
    itration++; /** This variable used to show the increment  of line height while releasing the thread */
    long_string.graphics.clear(); /** Clearing string objects */
    var _string_length = 556 - ((string_x_pos - 385) / 3) * 30; /** To calculate the length of string */
    long_string.graphics.setStrokeStyle(1).beginStroke("#fdfdfd").moveTo(_x_point-x_decrement,215).lineTo(_x_point-x_decrement,string_x_pos+50);
    stage.update();
    if ( itration != 100 && rotation < no_of_wound ) { /** Block will execute 100 times */
        clr_string_intrl = setTimeout(function(){if(!reset_flag){releaseWound(string_x_pos)}},string_intrl); /** To perform the increment of length of string */
    } else {
        clearTimeout(clr_string_intrl); /** To cancel the iteration */
        itration = 0;
    }
}

function noOfWoundsChange(scope){ /** Function to number of wounds on UI */
   total_rotation = no_of_wound * 360; /** Total angular distance */
    wound.graphics.clear(); /** Clearing shape object to redraw wound */
    for(i = 385; i < 385 + (scope.no_of_wound - 1) * 3; i = i + 3){ /** Loop to draw total number of wounds */
        generateWound(i);
    }
    drawLongString(385 + (scope.no_of_wound - 1) * 3);
    weight_container.y = (scope.no_of_wound - 1) * 30 * -1; /** Positioning the weights */
    weight_container.x = (scope.no_of_wound - 1) * 3; /** Positioning the weights */
    line_mask.y = weight_obj.y;
    getChildName("height_txt").text = (no_of_wound < 5 ? '0' : '') + no_of_wound * 2 + "cm";
    stage.update();
}

function woundReleas(speed){ /** To release wound over axle */ 
    var _string_leng = 556 + ((weight_obj.x - 385) / 3) * 30; /** Calculate length of string */
    createjs.Tween.get(weight_obj).to({y:weight_obj.y + 30,x:weight_obj.x - 3},speed);
    createjs.Tween.get(line_mask).to({y:weight_obj.y + 30},speed);
}

function massOfRingsChange(scope){ /** Function to show the weight change in UI */
    var _weight = scope.mass_of_rings/100; /** To calculate total weight */
    for ( i = _weight + 2;i <= 10;i = i + 2 ) { /** Hiding weights based on the weights selected by user */
        weight_container.getChildByName("weight_"+i).alpha = 0;
        weight_container_temp.getChildByName("weights_"+i).alpha = 0;
    }
    for ( j = 4;j <= _weight;j = j + 2 ) { /** Showing weights based on the weights selected by user */
        weight_container.getChildByName("weight_"+j).alpha = 1;
        weight_container_temp.getChildByName("weights_"+j).alpha = 1;
    }
    stage.update();
}

function calculations(){ /** Function to calculate angular acceleration(alpha) */
    var _radius = diameter_of_axle / 200; /** Diameter of axle */
    var _mass = mass_of_rings / 1000; /** Mass of rings(weights) */
    moment_of_inertia_of_flywheel = ( mass_of_flywheel * Math.pow((diameter_of_flywheel / 200),2) ) / 2; /** Mass of fly wheel */
    alpha = (_radius * _mass * gravity) / moment_of_inertia_of_flywheel;
    alpha = (alpha * 180) / 3.14;
}

function preCalcultion(scope){
    var _time=0,angular_dis=0,pre_rot=0,number_of_rot=0;
    var _first_flag =true,angular_velo=0; 
    var _temp_time_slots =[];
    do {
        _time = _time + INTERVAL; /** To calculate time */
        angular_dis = angular_dis + angular_velo * INTERVAL + 0.5 * alpha * Math.pow(INTERVAL,2); /** To calculate angular distance of fly wheel */
        pre_rot = parseInt(number_of_rot); /** Initial number of rotation */
        number_of_rot = angular_dis / 360; /** Total number of rotation = angular distance / 360 */
        if ( angular_dis >= total_rotation ) { /** Alpha value set to -10 when there is no angular acceleration */
            if ( _first_flag ) {
                _first_flag = false;
            } else {
                alpha = -10;
            }
        }
        angular_velo = angular_velo + alpha * INTERVAL < 0 ? 0 :angular_velo + alpha * INTERVAL; /** To calculate angular velocity */
        if ( parseInt(number_of_rot) > pre_rot ) { /** To idenfify each rotation through calculation */
            _temp_time_slots[time_slot_indx] = parseInt(_time.toFixed(1)) * 1000 + ( (parseFloat(_time.toFixed(1)) * 10) % 10 ) * 100; /** Calculate each time taken to complete each rotation */
            time_slot_indx++;
        }
        if ( angular_velo == 0 ) { /** To get final time to complete rotation of fly wheel */
            _temp_time_slots[_temp_time_slots.length] = parseInt(_time.toFixed(1)) * 1000 + ( (parseFloat(_time.toFixed(1)) * 10) % 10 ) * 100;
            var _sum = 0;
            time_slots[0] = _temp_time_slots[0];
            for ( i=0;i<_temp_time_slots.length;i++ ) {
                time_slots[i+1] = _temp_time_slots[i+1] - _temp_time_slots[i];
                _sum += time_slots[i];
            }
            scope.mInertia_val = moment_of_inertia_of_flywheel.toFixed(4);
            last_rotation_angle = parseFloat( (number_of_rot % 1).toFixed(2) ) * 100;/** To get decimal portion of number of rotation*/ 
        }
    }
    while(angular_velo > 0);
}
function resetExperiment(scope){ /** Function to reset all functionality and UI of simulation */
    scope.release_hold_txt = btn_lbls[0];
    scope.Enviornment = scope;
    scope.control_disable = false;
    thread_anim_object.x = 298;
    createjs.Tween.removeAllTweens ();
    itration = 0;
    reset_flag = true;
    clearTimeout(rotation_in);
    clearInterval(tick);
    clearTimeout(clr_string_intrl);
    clearInterval(thread_anim_clr);
    wound.graphics.clear();
    initialisationOfImages();
    initialisationOfControls(scope);
    initialisationOfVariables();
    weight_obj.alpha = 1;
    weight_obj.y = 0;
    weight_obj.x = 0;
    thread_anim_object.x = 298;
    getChildName("texture").y = 130;
    getChildName("texture_1").y = -231;
    stage.update();
    stage.getChildByName("weights").alpha = 0;
    getChildName("decimal_one").text = "0";
    getChildName("decimal_ten").text = "0";
    getChildName("hundred").text = 0;
    getChildName("ten").text = 0;
    getChildName("one").text = 0;
    rotation_decimal = 0;
    getChildName("line").y = 0;
    scope.mInertia_lbl = _("First start experiment..!");
    scope.mInertia_val = "";
    resetWatch();
    drawLongString(385);
    stage.update();
    if ( !clockContainer.getChildByName("play").hasEventListener("click") ) { /** To remove the event listner from play button in clok */
        play_event = clockContainer.getChildByName("play").on("click",function(){ /** Click event added to play button on timer */
            releaseHold(scope); /** Function to start the experiment and rotation of flywheel */
            scope.$apply();
        });
    }
}
