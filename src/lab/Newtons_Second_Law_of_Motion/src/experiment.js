/**Event handling functions starts here*/
/** Click event of power on button, experiment starts here */
function startExperiment(scope) {
	/** Disable rest of the controls used in the experiment */
	scope.result_disable = false;
	scope.slider_disable = true;
	scope.startbtn_disable = true;
	/**indicate the experiment started*/
	start_flag = true;
	/**When experiment starts the pointer image will become freeze*/
	newton_law_stage.getChildByName("arrow").cursor = "default";
	Object.freeze(newton_law_stage.getChildByName("arrow"));
	/** The calculateAccelaration function will call in the timer and work until it
	reaches the destination point */
	timer = setInterval(function() {
		calculateAccelaration(scope);
	}, 1);
}

/** function to Reset the experiment */
function reset(scope) {
	window.location.reload();
}

/** Check box function for show or hide the result */
function showResultFn(scope) {
	if (scope.resultValue == true) {
		scope.hide_show_result = false;
	} else {
		scope.hide_show_result = true;
	}
}

/**function for cart weight slider*/
function cartWeightSliderFn(scope) {
	/**store the number of weight in the cart according to slider movement*/
	var _weight = scope.weight1 / 10;
	/**check the number of weight is greater than initial weight, then displaying
	the selected cart weights */
	if (weight_cart < _weight) {
		cartWeightArrangement(1,_weight,1);
	}
	/**otherwise, hiding the previously displayed cart weights */
	else {
		cartWeightArrangement( _weight + 1,weight_cart,0);
	}
	/**Assigning previous value as current weight value*/
	weight_cart = _weight;
}

/**function for hanging weight slider*/
function hangingWeightSliderFn(scope) {
	/**Adjust mask rectangle movement basaed on the hanging weight slider value*/
	mask_rectangle.graphics.clear();
	mask_rectangle.graphics.beginFill("red").drawRect(568, 144, 50, 30 + (scope.weight / 2));
	weight_container.getChildByName("weight_bottom").y = initial_weight_bottom + (scope.weight / 2);
}

/**function for pointer position slider*/
function pointerPositionSliderFn(scope) {
	/**initial position can be added with current pointer position and pass it to 
	pointerPositionChange function ,here 2.9 is the difference between final position 
	and initial position of the pointer image/100*/
	pointerPositionChange(initial_pointer_pos + parseFloat(scope.point_position * 2.9));
}

/**function used to drag the movement of pointer image between initial and final position*/
function dragPointer(scope) {
	var _arrow_x;
	newton_law_stage.getChildByName("arrow").on("mousedown", function(evt) {
		this.offset = {
			x: this.x - evt.stageX
		};
	});
	/** The pressmove event is dispatched when the mouse moves after a mousedown on the 
	target until the mouse is released. */
	newton_law_stage.getChildByName("arrow").on("pressmove", function(evt) {
	if (start_flag == false) {
		this.x = evt.stageX + this.offset.x;
	}
	if (this.x > final_pointer_pos) {
		this.x = final_pointer_pos;
	} else if (this.x < initial_pointer_pos) {
		this.x = initial_pointer_pos;
	}
	_arrow_x = this.x;
	scope.point_position = Math.round((_arrow_x - initial_pointer_pos) / 2.9);
	pointerPositionChange(_arrow_x);
	scope.$apply();
	});
}
/**Event handling functions ends here*/

/**function for the movement of pointer image*/
function pointerPositionChange(x_pos) {
	/**setting the image movement based on the changing slider value*/
	newton_law_stage.getChildByName("arrow").x = x_pos;
}

/**Function for arranging cart weight*/
function cartWeightArrangement(initial_pos,final_pos,alpha_value){
	for (var i = initial_pos; i <= final_pos; i++) {
		carrier_container.getChildByName("ball" + i).alpha = alpha_value;
	}	
}

/** Draws a chart in canvasjs for making graph plotting in which x axis 
contains time in seconds and y axis contains distance in meter*/
function makeGraph() {
	chart = new CanvasJS.Chart("graphDiv", {
		axisX: {
			title: _("time (s)"),
			titleFontSize: 16,
			labelFontSize: 10,
			minimum: 0,
			maximum: 5,
			interval: 1,
		},
		axisY: {
			title: _("distance (m)"),
			titleFontSize: 16,
			minimum: 0,
			maximum: 1,
			interval: 0.2,
			labelFontSize: 10
		},
			data: [{
			color: "blue",
			type: "line",
			markerType: "none",
			lineThickness: 3,
			dataPoints: dataplot_array /**Array contains the data used to plot the graph*/
		}]
	});
	chart.render(); /** Rendering the graph */
}

/** Graph plotting function */
function plotGraph(xAxis, yAxis) {
	dataplot_array.push({
		/** x time in seconds */
		x: (xAxis),
		/** y distance in meter */
		y: (yAxis) 
	});
	/** Rendering the canvasjs chart */
	chart.render(); 
}

/**calculations starts here*/
function calculateAccelaration(scope) {
	/**actual time calculation will done using delay timer function*/
	delayTimer(newton_law_stage); 
	/**take value from millisecond to calculate distance*/
	var _mil = milli_sec / 100;
	/**take friction value from change friction slider*/
	friction_var = scope.friction; 
	/**take cart weight value from change cart weight slider*/
	cart_weight_var = scope.weight1; 
	/**take hanging weight value from change hanging weight slider*/
	hanging_weight_var = scope.weight; 
	/**take pointer position value from change pointer position slider*/
	point_pos = scope.point_position; 
	/**accelaration can be calculated  a=((mg-µMg))⁄((M+m)), where M is the hangingweight , 
	µ is the friction, g is the gravity, m is the cart weight*/  
	acceleration = (hanging_weight_var - (friction_var * cart_weight_var)) * 9.8 / (hanging_weight_var + cart_weight_var);
	/**End time and time taken can be calculated according to the pointer movement*/
	end_time = Math.sqrt(2 * 100 * Math.pow(10, -2) / acceleration);
	time_taken = Math.sqrt(2 * point_pos * Math.pow(10, -2) / acceleration)
	/**distance can be calculated s=1/2at^2 ,where a is acceleration ,s is displacement of the 
	cart, t is time for the cart to travel distance s*/
	distance = ((acceleration * Math.pow(_mil, 2)) / 2 * 100).toFixed(5);
	/**plot graph function is called for plotting the graph,here millisecond is taken as 
	x axis and distance is taken as y axis*/
	plotGraph(_mil, distance / 100);
	/**function used for moving the cart based on the distance calculated*/
	carrierMove(scope, distance);
	/**the values shown in the result part*/
	scope.pointer_time = (time_taken).toFixed(3);
	scope.pointer_distance = point_pos;
	scope.accelaration = (acceleration).toFixed(3);
	scope.$apply();
}

/**function used for moving the cart*/
function carrierMove(scope, distance_cart) {
	/**new x position can be calculated based on the distance,initial position of the cart 
	and destination position*/
	carrier_x_move = carrier_x + (distance_cart * 3.1);
	/**checking each point of the carrier reaches the destination point or not*/ 
	if (carrier_container.x < destination_point) { 
		/**in each step move container from initial position to calculated position*/
		carrier_container.x = carrier_x_move; 
		/**redraw the line based on the cart movement*/
		lineDraw(line_right, "#cccccc", carrier_container.x + initial_right_x, 115, 563, 115)
		lineDraw(line_down, "#cccccc", 587, 135, 587, 155 + carrier_x_move / 1.2)
		weight_container.y = carrier_x_move / 1.2;
	} else {  
		/**after reaching the destination point stop watch will pause*/
		pauseWatch();
		var _s = Math.floor(end_time);
		var _ms = parseInt(Number(String(end_time.toFixed(2)).split('.')[1] || 0));
		/**Initialize second and millisecond according to the calculated value of endtime  */
		initializeText(timer_hr, timer_min, _s, _ms, newton_law_stage);
		/**Clearing the timer interval */
		clearInterval(timer); 
		dataplot_array.pop();
	}
}
/**end calculation*/