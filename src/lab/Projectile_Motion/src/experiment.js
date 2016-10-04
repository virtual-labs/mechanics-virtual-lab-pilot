/** Function for changing the dropdown menu */
function enviornmentChange(scope) {
    calculation(scope); /** Value calculation function */
}

/** Change function of the slider velocity */
function velocitySliderChange(scope) {
    bullet_moving_velocity = scope.velocity + 28;
    calculation(scope); /** Value calculation function */
    scope.erase_disable = true; /** Disable the erase button */
}

/** Change function of the slider angle of projection */
function angleOfProjectionChange(scope) {
    var bullet_case_tween = createjs.Tween.get(getChild("bullet_case")).to({
        rotation: (-(scope.angle_of_projection))
    }, 500); /** Tween rotation of bullet case, with respect to the slider angle value */
	var bullet_case_tween = createjs.Tween.get(getChild("case_separate")).to({
        rotation: (-(scope.angle_of_projection))
    }, 500); /** Tween rotation of bullet case, with respect to the slider angle value */
    bullet_moving_theta = scope.angle_of_projection + 10; /** Bullet moving angle */
    calculation(scope); /** Value calculation function */
    scope.erase_disable = true; /** Disable the erase button */
}

/** Change function of the slider cannon height */
function cannonHeightChange(scope) {
    cannon_height = scope.cannon_height;
    calculation(scope); /** Value calculation function */
    var height_box_tween = createjs.Tween.get(getChild("height_box")).to({
        scaleY: (-0.1 - cannon_height / 40)
    }, 500); /** Height box y scaling using tween */
    var height_box_top_tween = createjs.Tween.get(getChild("height_box_top")).to({
        y: (height_box_top_initial_y - (cannon_height * 3.2))
    }, 500); /** Height box top part y scaling using tween */
    var wheel_behind_tween = createjs.Tween.get(getChild("wheel_behind")).to({
        y: (wheel_initial_y - (cannon_height * 3.2))
    }, 500); /** Behind wheel y scaling using tween */
    var wheel_front_tween = createjs.Tween.get(getChild("wheel_front")).to({
        y: (wheel_initial_y - (cannon_height * 3.2))
    }, 500); /** Front wheel y scaling using tween */
    var bullet_tween = createjs.Tween.get(getChild("bullet")).to({
        y: (bullet_initial_y - (cannon_height * 3.2))
    }, 500); /** Bullet y scaling using tween */
    var bullet_case_tween = createjs.Tween.get(getChild("bullet_case")).to({
        y: (bullet_case_initial_y - (cannon_height * 3.2))
    }, 500); /** Bullet case y scaling tween */
	var wheel_front_tween = createjs.Tween.get(getChild("wheel_separate")).to({
        y: (wheel_initial_y - (cannon_height * 3.2))
    }, 500); /** Front wheel y scaling using tween */
	    var bullet_case_tween = createjs.Tween.get(getChild("case_separate")).to({
        y: (bullet_case_initial_y - (cannon_height * 3.2))
    }, 500); /** Bullet case y scaling tween */
				
    bullet_moving_x = getChild("bullet").x; /** Initial x position of bullet in a variable */
    bullet_moving_y = getChild("bullet").y; /** Initial y position of bullet in a variable */
    bullet_start_x = bullet_moving_x; /** Bullet x and y position changed in this function. So the startx and starty is changed */
    bullet_start_y = getChild("bullet").y;    
    scope.erase_disable = true; /** Disable the erase button */
}

/** Fire button event */
function fireButtonEvent(scope) {
    bullet_moving_velocity = scope.velocity + 28; /** Bullet moving velocity */
    bullet_moving_theta = scope.angle_of_projection + 10; /** Bullet moving theta */
    bullet_move_frames = 0;
    time_count = 0;
    timer_delay = 12;
    calculation(scope); /** Value calculation function */
    scope.control_disable = true; /** Disable the sliders while shootting */
    scope.fire_disable = true; /** Disable fire button */
    scope.erase_disable = true; /** Disable erase button */
    bullet_start_x = getChild("bullet").x; /** Setting the x and y positions of bullet and bullet case */
    bullet_start_y = getChild("bullet").y;
    bullet_case_startx = getChild("bullet_case").x;
    bullet_case_starty = getChild("bullet_case").y;
    wheel_front_startx = getChild("wheel_front").x;
    wheel_front_starty = getChild("wheel_front").y;
    resetWatch(); /** Resetting the watch */
    height = scope.cannon_height; /** Calculating the height */
    random_arc_clr = "#" + ((1 << 24) * Math.random() | 0).toString(16); /** Random colors for the arc line */
    bullet_prev_x = getChild("bullet").x; /** Bullet previous x position */
    bullet_prev_y = getChild("bullet").y; /** Bullet previous x position */
    bullet_move_interval = 100 - scope.velocity; /** Time interval for the bullet move timer */
    if ( (scope.velocity == 35) & (scope.angle_of_projection) == 10 & (scope.cannon_height == 0) ) {
        getChild("bullet").x = getChild("bullet").x+90;
        getChild("bullet").y = getChild("bullet").y-18;
        scope.erase_disable = false; /** Enable erase button */
    } else {
        bullet_move_timer = setInterval(function() {
            bulletMove(scope)
        }, bullet_move_interval); /** Bullet shootting timer */
        timer_delay = timer_delay - time_of_flight / 1.2; /** Time interval for the delay timer */       
        delay_timer = setInterval(function() {
            delayTimer(projectile_stage)
        }, timer_delay); /** Delay timer calling */
    }
    projectile_stage.getChildByName("heightText").text = ""; /** Set height text null */
}

/** Bullet moving function */
function bulletMove(scope) {
    y_line_y_prev = getChild("bullet").y;
    calculation(scope); /** Value calculation function */
    /** Bullet's changing x and y position calculation */
    bullet_moving_y = bullet_start_y - (velocity_of_y * bullet_move_frames - (1 / 2 * scope.Enviornment * Math.pow(bullet_move_frames, 2)));
    bullet_moving_x = bullet_start_x + velocity_of_x * bullet_move_frames; /** Calculating the bullet x movement */
    getChild("bullet").x = bullet_moving_x; /** Assigning the calculated x and y variable value to bullet */
    getChild("bullet").y = bullet_moving_y;
    arc_line = new createjs.Shape(); /** Line for plotting arc */
    projectile_stage.removeChild(x_line); /** Removing x and y line */
    projectile_stage.removeChild(y_line);
    x_line = new createjs.Shape(); /** x and y line */
    y_line = new createjs.Shape();
    arc_line_container.alpha = 1; /** Set alpha 1 of the container arc */
    /** Drawing of arc line */
    arc_line.graphics.moveTo(bullet_prev_x, bullet_prev_y).setStrokeStyle(3).beginStroke(random_arc_clr).lineTo(bullet_moving_x, bullet_moving_y);
    arc_line_container.addChild(arc_line);
    arc_array.push(arc_line); /** Push arc lines in to arc array */
    if (scope.Enviornment != 1.6) { /** If the enviornment is not moon */
        bullet_move_frames += .2;
    } else {
        bullet_move_frames += .15;
    }
    var hit_obj = bullet_hit_line.globalToLocal(getChild("bullet").x, getChild("bullet").y);
    if (scope.Enviornment != 1.6) { /** If the enviornment is not moon */
        if (y_line_y_prev < getChild("bullet").y & time_count == 0) { /** Finding the bullet reached the maximun height */
            time_count = 1;
            y_line_x = getChild("bullet").x;
            y_line_x_prev = getChild("bullet").y;
			projectile_stage.getChildByName("case_separate").visible = true;
            projectile_stage.getChildByName("wheel_separate").visible = true;
            projectile_stage.getChildByName("wheel_front").visible = false;
            projectile_stage.getChildByName("bullet_case").visible = false;
        }
        /** There is a line named bullet hit line, check whether the bullet is hit with the line */
        if (bullet_hit_line.hitTest(hit_obj.x, hit_obj.y)) {
            /** Create and add a dummy bullet circle */
            bullet_dummy = new createjs.Shape(); 
            bullet_dummy.graphics.beginRadialGradientFill(["#FFF", "#393838"], [0, .61], getChild("bullet").x + 9, getChild("bullet").y + 8, 0, getChild("bullet").x + 10, 655, 9).drawCircle(getChild("bullet").x + 10, 655, 9);
            projectile_stage.addChild(bullet_dummy);
            bullet_array.push(bullet_dummy); /** Push that in to bullet array */
            /** If the bullet is hit with the bullet hit line, all the images and timers resetting */
            resetEquipment(scope);
            /** The y axis line */
            y_line.graphics.moveTo(y_line_x, y_line_x_prev).setStrokeStyle(0.5).beginStroke("blue").lineTo(y_line_x, bullet_start_y); 
            projectile_stage.addChild(y_line);
            projectile_stage.getChildByName("heightText").text = "H"; /** Height text label and its x and y position */
            projectile_stage.getChildByName("heightText").x = y_line_x + 5;
            projectile_stage.getChildByName("heightText").y = bullet_start_y - ((bullet_start_y-y_line_x_prev)/2);
        }
    } else {
        if (time * 10 > time_of_flight) { /** If the stopwatch reading reaches time of flight value */
            /** If the stopwatch reading reaches time of flight value, all the images and timers resetting */
            resetEquipment(scope); 
        }
        /** There is a line named bullet hit line, check whether the bullet is hit with the line */
        if (bullet_hit_line.hitTest(hit_obj.x, hit_obj.y)) {
            /** Create and add a dummy bullet circle */
            bullet_dummy = new createjs.Shape(); 
            bullet_dummy.graphics.beginRadialGradientFill(["#FFF", "#393838"], [0, .61], getChild("bullet").x + 9, getChild("bullet").y + 8, 0, getChild("bullet").x + 10, 655, 9).drawCircle(getChild("bullet").x + 10, 655, 9);
            projectile_stage.addChild(bullet_dummy);
            bullet_array.push(bullet_dummy); /** Push that in to bullet array */
            /** If the stopwatch reading reaches time of flight value, all the images and timers resetting */
            resetEquipment(scope);
        }
    }
    bullet_prev_x = getChild("bullet").x; /** Bullet's previous x and y value to corresponding variable */
    bullet_prev_y = getChild("bullet").y;
}

/** Erase button event */
function eraseButtonEvent(scope) {
    scope.fire_disable = false; /** Enable fire button */
    scope.control_disable = false; /** Enable other all controls */
    clearInterval(bullet_move_timer); /** Bullet move timer clear interval */
    /** The arc lines are pushed in to an array. Erasing that lines from the array. */
    for (var i = 0; i < arc_array.length; i++) { 
        arc_line_container.removeChild(arc_array[i]);
        projectile_stage.removeChild(bullet_array[i]);
    }
    /** The bullets are pushed in to an array. Erasing that bullets from the array. */
    for (var j = 0; j < bullet_array.length; j++) {
        projectile_stage.removeChild(bullet_array[j]);
    }
    arc_array = bullet_array = []; /** Clearing of the arrays */
    /** Reset the bullet x and y position */
    getChild("bullet").x = bullet_start_x; 
    getChild("bullet").y = bullet_start_y;
    /** X and Y line removed from stage */
    projectile_stage.removeChild(x_line); 
    projectile_stage.removeChild(y_line);
    projectile_stage.getChildByName("heightText").text = ""; /** Erasing height text */
    resetWatch(); /** Resetting the stop watch */
}

/** Show result check box function */
function showResultFN(scope) {
    if (scope.resultValue == true) {
        scope.hide_show_result = true;
    } else {
        scope.hide_show_result = false;
    }
}

/** Calculating the velocity of bullet */
function calculateVelocity() {
    velocity_of_x = bullet_moving_velocity * Math.cos(bullet_moving_theta * Math.PI / 200);
    velocity_of_y = bullet_moving_velocity * Math.sin(bullet_moving_theta * Math.PI / 200);
}

/** If the stopwatch reading reaches time of flight value and the bullet is hit with the bullet hit line, 
all the images and timers resetting */
function resetEquipment(scope) {
    clearInterval(bullet_move_timer);
    clearInterval(delay_timer);
	/** Split the time of flight variable with decimal for display */
    second = time_of_flight.split('.'); 
    milli_sec = Math.round(parseInt(second[1]) / 10);
	/** Display time of flight in to the stop watch */
    initializeText(0, 0, second[0], milli_sec, projectile_stage);
    /** The x axis line */
    x_line.graphics.moveTo(62, bullet_start_y).setStrokeStyle(0.5).beginStroke("blue").lineTo(600, bullet_start_y);
    projectile_stage.addChild(x_line);
    scope.control_disable = false; /** Enable the dropdown and sliders */
    scope.fire_disable = false; /** Enable the fire button */
    scope.erase_disable = false; /** Enable the erase button */
    scope.$apply();
	/** Remove bullet, front wheel and bullet case and readd that in to the stage */
    projectile_stage.removeChild(getChild("bullet")); 
    projectile_stage.removeChild(getChild("wheel_front"));
    projectile_stage.removeChild(getChild("bullet_case"));
    loadImages(queue.getResult("bullet"), "bullet", bullet_start_x, bullet_start_y, "", -scope.angle_of_projection, projectile_stage, 0.7);
    loadImages(queue.getResult("bullet_case"), "bullet_case", bullet_case_startx, bullet_case_starty, "", -scope.angle_of_projection, projectile_stage, 1);
    loadImages(queue.getResult("wheel_front"), "wheel_front", wheel_front_startx, wheel_front_starty, "", 0, projectile_stage, 1);
}

/** Calculation starts here */
function calculation(scope) {
    prev_velocity_y_axis = velocity_y_axis;
    prev_time = time;
    prev_height = height;
    /** Time of fly = 2u Sinɵ/g */
    time_of_fly = (2 * scope.velocity * Math.sin(scope.angle_of_projection * 3.14 / 180) / scope.Enviornment).toFixed(3);
    /** Time of flight T = T/2 + √(v² sin²ɵ/2g² + h/g) * 2 */
    square_root_time = ((Math.pow(scope.velocity,2)*Math.pow(Math.sin(scope.angle_of_projection * 3.14 / 180),2))/(2*Math.pow(scope.Enviornment,2))) + (scope.cannon_height/scope.Enviornment);
    time_of_flight = ((time_of_fly/2) + Math.sqrt(square_root_time*2)).toFixed(3);
    scope.time_of_flight = time_of_flight + sec;
    /** Maximum height H = u² sin²ɵ/2g */
    max_height = ((Math.pow(scope.velocity, 2) * Math.pow(Math.sin(scope.angle_of_projection * 3.14 / 180), 2) / (2 * scope.Enviornment))+ scope.cannon_height).toFixed(3);
    scope.max_height = max_height + meter;
    /** Horizontal range R = V cosɵ T */
    horizontal_range = (scope.velocity*Math.cos(scope.angle_of_projection * 3.14 / 180)*time_of_flight).toFixed(3);
    scope.horizontal_range = horizontal_range + meter;
    velocity_x_axis = scope.velocity * Math.cos(scope.angle_of_projection * 3.14 / 180);
    distance = velocity_x_axis * milli;
    time = milli_sec / 1000;
    velocity_y_axis = prev_velocity_y_axis - scope.Enviornment * (time - prev_time);
    height = prev_height + velocity_y_axis * (time - prev_time);
    /** Calculating the velocity of bullet */
    calculateVelocity();
}
/** Calculation ends here */