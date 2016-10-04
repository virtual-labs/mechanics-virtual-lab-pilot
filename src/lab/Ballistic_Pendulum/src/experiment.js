/**Event handling functions starts here*/
/** Click event of 'Shoot' button, experiment starts here */
function startExperiment(scope) {
    /** Disable rest of the controls used in the experiment */
    scope.result_disable = false;
    scope.slider_disable = true;
    scope.startbtn_disable = true;
    scope.dropdown_disable = true;
    /**call the calculation function which is used to calculate the angle */
    calculationFn(scope);
	ballistic_pendulam_stage.update(); /** Updating the stage */
}
/**function used for changing the environment*/
function setEnvironmentTypeFn(scope) {
    /**set selected environment variable according to selection from the dropdown*/
    selected_environment = environment_value_Array[scope.types_environment]
	if(selected_environment==1.6){
		scope.velocity_max=182;
	}
}

/**Event handling functions ends here*/

/**calculations starts here*/
function calculationFn(scope) {
    /**take mass of the block from slider and convert to kilogram*/
    block_mass = (scope.mass) / 1000;
    /**take mass of the bullet from slider and convert to kilogram*/
    bullet_mass = (scope.bullet_mass) / 1000;
    /**select velocity from velocity slider*/
    bullet_velocity = scope.velocity;
    /**velocity of the bottom of the swing is calculated using the formula v= mv/((M+m)),
	where m is mass of the bullet,v is velocity of the bullet and M is mass of the block*/
    bottom_velocity = (bullet_mass * bullet_velocity / (block_mass + bullet_mass)).toFixed(6);
    /**angle of the pendulum is calculated using the formula θ=〖cos〗^(-1) [1-V^2/2gL],
	where V is the velocity of the bottom of the swing,g is selected environment value 
	and L is length of the	pendulum*/
    angle = (Math.acos(1 - Math.pow(bottom_velocity, 2) / (2 * selected_environment * pendulum_length)) * 180 / 3.14).toFixed(5);
    /**pendulum height is calculated using h=L(1-cos(θ)), where L is the length of the 
	pendulum and θ is the angle of the pendulum */
	height_of_pendulum = ((pendulum_length * (1 - Math.cos(angle * 3.14 / 180))) * 100).toFixed(5);
    /**the values shown in the result part*/
	scope.pendulum_height = height_of_pendulum;
    scope.max_angle = angle;
	/**assigning values to the variables for making movement of the pendulum*/
    stationery_pendulum_angle = parseInt(angle);
    ceiling = parseInt(angle);
	/**calling timer function that is used to move the bullet*/
    bullet_timer = setInterval(function() {
        bulletMove(scope);
    }, 1);
}

/**function used for moving the bullet*/
function bulletMove(scope) {
	/**when bullet reaches near pendulum the bullet become disabled*/
    if (getChild("bullet").x >= bullet_endpoint) {
        getChild("bullet").alpha = 0;
		/**clear the interval used to move the bullet*/
        clearInterval(bullet_timer);
		/**moves the stationary pendulum according to calculated angle*/
        rotatePendulumContinuous(getChild("stationery_pendulum"), -stationery_pendulum_angle);
        /**call oscillation function used for oscillating the pendulum*/
		oscillation();
    } 
	/**bullet moves till reaching near pendulum*/
	else {
		getChild("bullet").x += 3;
	}
}

/**function used to decrease the oscillation rate*/
function setCallBack() {
    if (ceiling > 0) {
        ceiling -= 1;
        oscillation();
    } else {
        rotatePendulumContinuous(getChild("pendulum"), 0)
    }
}

/**function used to oscillate the pendulum*/
function oscillation() {
	/**Initially pendulum moves up to the positive angle,then call the callback function. 
	In callback function value of the ceiling will be decremented and pendulum moves upto
	negative angle*/
    createjs.Tween.get(getChild("pendulum"), {
        loop: false
    }).to({
        rotation: -1 * ceiling
    }, 500, createjs.Ease.getPowInOut(1)).to({
        rotation: ceiling
    }, 1000, createjs.Ease.getPowInOut(1)).to({
        rotation: 0
    }, 500, createjs.Ease.getPowInOut(1)).call(setCallBack);
}

/**function used for rotating the pendulum*/
function rotatePendulumContinuous(object, rot) {
    createjs.Tween.get(object).to({
        rotation: rot
    }, 500, createjs.Ease.getPowInOut(1));
}

/** function to Reset the experiment */
function reset(scope) {
    window.location.reload();
}

/** Check box function for show or hide the result */
function showresultFN(scope) {
    if (scope.resultValue == true) {
        scope.hide_show_result = false;
    } else {
        scope.hide_show_result = true;
    }
}
/**end calculation*/

function getChild(name){
	return ballistic_pendulam_stage.getChildByName(name);
}