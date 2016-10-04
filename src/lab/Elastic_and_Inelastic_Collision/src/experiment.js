/**Event handling functions starts here*/
/** Click event of start experiment button, experiment starts here */
function startExperiment(scope) {
	/**After starting the experiment set mouse enable functionality as false*/
	object_a_container.mouseEnabled = false;	
	object_b_container.mouseEnabled = false;	
	if ( !start_flag ) {
		/**denote experiment is started*/ 
		start_flag = true;	
		/** Disable rest of the controls used in the experiment */
		scope.controls_disable = true;
		/**after starting the experiment label for start button as pause*/
		scope.start_exp = _("Pause");
		/** The movement of objects will starts in the timer */	
		timer = setInterval(function() { moveobject(scope); }, timer_delay_var);
		/**calling calculation function*/
		calculation(scope);	
		/**disable restitution slider */
		scope.restitution_disable=true;
		makeGraph();
	} else {	
		scope.start_exp = _("Start Experiment");
		clearInterval(timer);
		start_flag=false;
		
	}
	
}
/**function for dragging Object A and Object B*/
function dragObject(scope,objectname,initial_pos,final_pos) {
	if (start_flag==false) {
		/** The pressmove event is dispatched when the mouse moves after a mousedown on the 
		target until the mouse is released. */
		objectname.on("mousedown", function(evt) {
			this.offset = {
				x: this.x - evt.stageX
			};
		});
		objectname.on("pressmove", function(evt) {
			/**adjust the center point to attain the middle position while dragging the objects */
			center_point= (object_a_rect.x+object_b_rect.x)/2;
			center_point=center_point+center_drag;
			collision_stage.getChildByName("center_point").x=center_point;	
			/**set dragging become enabled before starting the experiment*/		
			/**Set maximum dragging limit for both object A & B,so that the objects does not overlap each other */
			/**set dragging position for Object A*/
			if(objectname.name=="object_a_container"){
				if(evt.stageX<object_b_rect.x-50){
					this.x = evt.stageX + this.offset.x;
				}
			}
			else{
				/**set dragging position for Object B*/
				if(evt.stageX>object_a_rect.x+100){
					this.x = evt.stageX + this.offset.x;
				}
			}
			/**when objects reaching the initial and final position then the movement will become ceased */
			if (this.x > final_pos) {
				this.x = final_pos;
			} else if (this.x < initial_pos) {
				this.x = initial_pos;
			}
			/**Adjust the position of rectangles with respect to dragging position of the objects*/
			if(objectname==object_a_container) {
				object_ax=this.x;
				object_a_rect.x=initial_a_rectpos+this.x;
			}else if(objectname==object_b_container) {
				object_bx=this.x;
				object_b_rect.x=initial_b_rectpos+this.x;
			}
			current_x = object_ax - object_bx;
		});
	}
	scope.$apply();
}

/**Function for the select type combo box*/
function selectTypeFn(scope){
	/**the selected type of collision is stored in a variable*/
	selected_type=scope.type_selected;
	/**if the selected type is in elastic then enable the coeff of restitution slider*/
	if(selected_type=="inelastic"){
		scope.coeff_restitution = 0; 
		scope.restitution_disable=false;
	}
}

/**Function for checking which radio button is selected*/
function resultCheck(scope){
	/**Enable the sliders for corresponding objects*/
	/**Object A slider*/
	if(scope.temp.data=="obj1"){
		scope.showObjectA=false;
		scope.showObjectB=true;
	}
	/**Object B slider*/
	else{
		scope.showObjectA=true;
		scope.showObjectB=false; 
	}
}

/** Reset the experiment */
 function resetFn(scope){
	window.location.reload(); 
 }

/**Event handling functions ends here*/

/**Calculation function starts here*/

function calculation(scope){
	/**take coeff restitution according to coeff restitution slider movement*/
	coeff_restitution=scope.coeff_restitution;
	/**take velocity of Object A from velocity(v1) slider */
	u1=scope.velocity1_val;
	/**take mass of Object A from mass(m1) slider */
	m1=scope.mass1_val;
	/**take velocity of Object B from velocity(v2) slider */
	u2=scope.velocity2_val;
	/**take mass of Object A from mass(m2) slider */
	m2=scope.mass2_val;
	/**Check whether the type of collision selected is elastic or in elastic,	if it is  elastic call the 
	elasticCollisionCalculation() otherwise call the inelasticCollisionCalculation()*/
	if(selected_type=="elastic"){
		elasticCollisionCalculation(scope);
	}
	else{
		inelasticCollisionCalculation(scope);
	}
}

/**function for calculating the elastic collision*/
function elasticCollisionCalculation(scope)
{
	/**v1 is calculated using the formula v1=(Cm2(u2-u1)+m1u1+m2u2)/(m1+m2), here c is the coeff of restitution and is 
	taken as 1 by default,u1 is the velocity of Object A,	u2 is the velocity of Object B,m1 is the mass of Object A and 
	m2 is the mass of Object B*/
	elastic_v1=(1*m2*(u2-u1)+(m1*u1)+(m2*u2))/(m1+m2);
	/**v2 is calculated using the formula v2=(Cm1(u1-u2)+m1u1+m2u2)/(m1+m2), here c is the coeff of restitution,and is 
	taken as 1 by default,u1 is the velocity of Object A,	u2 is the velocity of Object B,m1 is the mass of Object A and 
	m2 is the mass of Object B*/
	elastic_v2=(1*m1*(u1-u2)+(m1*u1)+(m2*u2))/(m1+m2);
	/**kinetic energy of the objects is calculated using the formula K.E=1/2mv^2, here m is the mass of both objects 
	and v is the velocity of the objects respectively*/
	kinetic_obja_before=0.5*m1*Math.pow(u1,2);
	kinetic_objb_before=0.5*m2*Math.pow(u2,2);
	kinetic_obja_after=0.5*m1*Math.pow(elastic_v1,2);
	kinetic_objb_after=0.5*m2*Math.pow(elastic_v2,2);
	/**Momentum of the objects is calculated using the formula P=m*v, here m is the mass of the objects and v is its velocity 	of the objects*/
	momentum_before_a=u1*m1;
	momentum_before_b=u2*m2;
	momentum_after_a=elastic_v1*m1;
	momentum_after_b=elastic_v2*m2;
	/**the values shown in the result part before collision */
	scope.ke1=(kinetic_obja_before).toFixed(1);
	scope.velocity1=(u1).toFixed(1);
	scope.momentum1=(momentum_before_a).toFixed(1);
	scope.ke2=(kinetic_objb_before).toFixed(1);
	scope.velocity2=(u2).toFixed(1);
	scope.momentum2=(momentum_before_b).toFixed(1);
}

/**initialize the table values as zero when starting the experiment*/
function initialiseVariable(scope){
	scope.ke1=0;
	scope.velocity1=0;
	scope.momentum1=0;
	scope.ke2=0;
	scope.velocity2=0;
	scope.momentum2=0;
	scope.ke3=0;
	scope.velocity3=0;
	scope.momentum3=0;
	scope.ke4=0;
	scope.velocity4=0;
	scope.momentum4=0;
	scope.$apply();
}

/**function for calculating the inelastic collision*/
function inelasticCollisionCalculation(scope){
	/**v1 is calculated using the formula v1=(Cm2(u2-u1)+m1u1+m2u2)/(m1+m2), here c is the coeff of restitution,
	u1 is the velocity of Object A,	u2 is the velocity of Object B,m1 is the mass of Object A and 
	m2 is the mass of Object B*/
	inelastic_v1=(coeff_restitution*m2*(u2-u1)+(m1*u1)+(m2*u2))/(m1+m2);
	/**v2 is calculated using the formula v2=(Cm1(u1-u2)+m1u1+m2u2)/(m1+m2), here c is the coeff of restitution,
	u1 is the velocity of Object A,	u2 is the velocity of Object B,m1 is the mass of Object A and 
	m2 is the mass of Object B*/
	inelastic_v2=(coeff_restitution*m1*(u1-u2)+(m1*u1)+(m2*u2))/(m1+m2);
	/**kinetic energy of the objects is calculated using the formula K.E=1/2mv^2, here m is the mass of both objects and v is 	the velocity of the objects respectively*/
	kinetic_obja_before1=0.5*m1*Math.pow(u1,2);
	kinetic_objb_before1=0.5*m2*Math.pow(u2,2);
	kinetic_obja_after1=0.5*m1*Math.pow(inelastic_v1,2);
	kinetic_objb_after1=0.5*m2*Math.pow(inelastic_v2,2); 
	/**Momentum of the objects is calculated using the formula P=m*v, here m is the mass of the objects and v is its velocity 	of the objects*/
	momentum_before_a1=u1*m1;
	momentum_before_b1=u2*m2;
	momentum_after_a1=inelastic_v1*m1;
	momentum_after_b1=inelastic_v2*m2;
	/**the values shown in the result part before collision */
	scope.ke1=(kinetic_obja_before1).toFixed(1);
	scope.velocity1=(u1).toFixed(1);
	scope.momentum1=(momentum_before_a1).toFixed(1);
	scope.ke2=(kinetic_objb_before1).toFixed(1);
	scope.velocity2=(u2).toFixed(1);
	scope.momentum2=(momentum_before_b1).toFixed(1);
}

/**function for moving Object A and Object B*/
function moveobject(scope){
	calculation(scope);
	/**variables for setting velocity value*/
	var _u1_val=u1/2;
	var _u2_val=u2/2;
	time_counter++;
	if(selected_type=="elastic"){
		var _cur_vel1=elastic_v1;
		var _cur_vel2=elastic_v2;
		/**if collision type is elastic,if objects are hitted then call elasticBeforeHit() otherwise elasticAfterHit()*/
		if(hit_flag==false){
			elasticBeforeHit(_u1_val,_u2_val);
		}
		else{
			elasticAfterHit(scope);
		}
	}
	else{
		var _cur_vel1=inelastic_v1;
		var _cur_vel2=inelastic_v2;
		/**if collision type is inelastic,if objects are hitted then call inelasticBeforeHit() otherwise inelasticAfterHit()*/
		if(hit_flag==false){
			inelasticBeforeHit(_u1_val,_u2_val);
		}
		else{
			center_initial=240;
			inelasticAfterHit(scope);
		}
	}
	/**when Object A is active and Object B is in idle mode*/
	if(u1>0&&u2==0){
		if(object_a_rect.x>=object_b_rect.x){
			hit_flag=true;
			object_b_container.x+=_cur_vel2;
			object_a_container.x+=_cur_vel1;
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);
		}
		else{
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",u1);
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",u2);
		}
	}
	/**when Object A is idle and Object B is active mode*/
	else if(u1==0&&u2<0){		
		if(object_a_rect.x>=object_b_rect.x-10){
			hit_flag=true;
			object_a_container.x+=_cur_vel1;
			object_b_container.x+=_cur_vel2;
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
		} 
		else{
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",u2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",u1);
		}
	}
	/**when both objects are in opposite direction*/
	else if(u1>0&&u2<0)	{
		if(object_b_rect.x<=object_a_rect.x+2){
			hit_flag=true;
			object_b_container.x+=_cur_vel2;
			object_a_container.x+=_cur_vel1;
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);
		}
		else{
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",u2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",u1);
		}
		
	}
	/**when both objects are in same direction*/
	else if(u1>0&&u2>0){
		if((object_a_rect.x>=object_b_rect.x - rect_pos)&& selected_type=="inelastic" ){
			hit_flag=true;
			object_b_container.x+=_cur_vel2;
			object_a_container.x+=_cur_vel1;
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);			
		}
		else if(object_a_rect.x>=object_b_rect.x){
			hit_flag=true;
			object_b_container.x+=_cur_vel2;
			object_a_container.x+=_cur_vel1;
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);
		}
		else{
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",u2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",u1);
		}
	}
	else if(u1<0&&u2<0){
		if((object_a_rect.x>=object_b_rect.x-rect_neg)&& selected_type=="inelastic"){
			hit_flag=true;
			object_a_container.x+=_cur_vel1;
			object_b_container.x+=_cur_vel2;	
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);
		}
		else if(object_a_rect.x>=object_b_rect.x-rect_neg_val){
			hit_flag=true;
			object_a_container.x+=_cur_vel1;
			object_b_container.x+=_cur_vel2;
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",_cur_vel2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",_cur_vel1);
		} 
		else{
			tween(scope,object_b_container,"object_b_wheel1","object_b_wheel2",u2);
			tween(scope,object_a_container,"object_a_wheel1","object_a_wheel2",u1);
		}	
	}
	/**calculate the center point position according to the objects position*/
	center_point= (object_a_container.x+object_b_container.x)/2;
	/**set the center point movement based on the object movement */
	center_point=center_initial+center_point;
	collision_stage.getChildByName("center_point").x=center_point;	
	/**calling function used to move the wheels of the cart*/
}

/**function used for moving wheels of the cart*/
function tween(scope,container,obj_name1,obj_name2,angle){
	container.getChildByName(obj_name1).rotation+=angle;
	container.getChildByName(obj_name2).rotation+=angle;
}

function elasticBeforeHit(u1_val,u2_val){
	object_a_container.x+=u1;
	object_a_rect.x+=u1;
	object_b_container.x+=u2;
	object_b_rect.x=initial_b_rectpos+object_b_container.x;
	/**In elastic collision,check whether the objects are hitted or not ,if it is not hitted push values 
	accordingly to the array and plot graph based on this*/
	dataplotarray_momentum_a.push({x:time_counter,y:momentum_before_a})
	dataplotarray_momentum_b.push({x:time_counter,y:momentum_before_b});
	dataplotarray_vel_a.push({x:time_counter,y:u1});
	dataplotarray_vel_b.push({x:time_counter,y:u2});
	dataplotarray_ke_a.push({x:time_counter,y:kinetic_obja_before});
	dataplotarray_ke_b.push({x:time_counter,y:kinetic_objb_before});
	chart.render();
	chart_velocity.render(); 
	chart_ke.render(); 
}
function elasticAfterHit(scope){
	/**In elastic collision,check whether the objects are hitted or not ,if it is hitted push values 
	accordingly to the array and plot graph based on this*/
	dataplotarray_momentum_a.push({x:time_counter,y:momentum_after_a})
	dataplotarray_momentum_b.push( {x:time_counter,y:momentum_after_b});
	dataplotarray_vel_a.push({x:time_counter,y:elastic_v1});
	dataplotarray_vel_b.push({x:time_counter,y:elastic_v2});
	dataplotarray_ke_a.push({x:time_counter,y:kinetic_obja_after});
	dataplotarray_ke_b.push({x:time_counter,y:kinetic_objb_after});
	/**the values shown in the result part after collision */
	scope.ke3=(kinetic_obja_after).toFixed(1);
	scope.velocity3=(elastic_v1).toFixed(1);
	scope.momentum3=(momentum_after_a).toFixed(1);
	scope.ke4=(kinetic_objb_after).toFixed(1);
	scope.velocity4=(elastic_v2).toFixed(1);
	scope.momentum4=(momentum_after_b).toFixed(1);
	scope.$apply();
	chart.render();
	chart_velocity.render(); 
	chart_ke.render(); 
}
function inelasticBeforeHit(u1_val,u2_val){
	object_a_container.x+=u1_val;
	object_a_rect.x+=u1_val;
	object_b_container.x+=u2_val;
	object_b_rect.x+=u2_val;
	object_b_rect.x=initial_b_rectpos+object_b_container.x;
	/**In inelastic collision,check whether the objects are hitted or not ,if it is not hitted push values 
	accordingly to the array and plot graph based on this*/
	dataplotarray_momentum_a.push({x:time_counter,y:momentum_before_a1})
	dataplotarray_momentum_b.push({x:time_counter,y:momentum_before_b1});
	dataplotarray_vel_a.push({x:time_counter,y:inelastic_v1});
	dataplotarray_vel_b.push({x:time_counter,y:inelastic_v2});
	dataplotarray_ke_a.push({x:time_counter,y:kinetic_obja_before1});
	dataplotarray_ke_b.push({x:time_counter,y:kinetic_objb_before1});
	chart.render(); 
	chart_velocity.render(); 
	chart_ke.render();
}
function inelasticAfterHit(scope)
{
	/**In inelastic collision,check whether the objects are hitted or not ,if it is hitted push values accordingly to the array and  
	plot graph based on this*/
	dataplotarray_momentum_a.push({x:time_counter,y:momentum_after_a1})
	dataplotarray_momentum_b.push( {x:time_counter,y:momentum_after_b1});
	dataplotarray_vel_a.push({x:time_counter,y:inelastic_v1});
	dataplotarray_vel_b.push({x:time_counter,y:inelastic_v2});
	dataplotarray_ke_a.push({x:time_counter,y:kinetic_obja_after1});
	dataplotarray_ke_b.push({x:time_counter,y:kinetic_objb_after1});
	/**the values shown in the result part after collision */
	scope.ke3=(kinetic_obja_after1).toFixed(1);
	scope.velocity3=(inelastic_v1).toFixed(1);
	scope.momentum3=(momentum_after_a1).toFixed(1);
	scope.ke4=(kinetic_objb_after1).toFixed(1);
	scope.velocity4=(inelastic_v2).toFixed(1);
	scope.momentum4=(momentum_after_b1).toFixed(1);
	scope.$apply();
	chart.render(); 
	chart_velocity.render(); 
	chart_ke.render(); 	
}
/**Calculation function ends here*/

/** Draws a chart in canvas js for making graph plotting */
function makeGraph(){
	
	chart= new CanvasJS.Chart("graphDiv", {
		axisX: {
			title: _("Time"),
			titleFontSize: 14,
		},
		axisY: {
			title: _("P"),
			titleFontSize: 14,
		},
		data: [{
			color: "red",
			type: "line",
			markerType: "none",
			lineThickness: 2,
			 /** Array contains momentum data for Object A */
			dataPoints: dataplotarray_momentum_a  
		},{
			color: "blue",
			type: "line",
			axisYType: "secondary",
			markerType: "none",
			lineThickness: 2,
			 /** Array contains momentum data for Object B */
			dataPoints:dataplotarray_momentum_b}]
	});
	 /** Rendering the graph for momentum */	 
	chart.render(); 
	
	/**Velocity graph  */
	chart_velocity= new CanvasJS.Chart("graphDiv1", {
		axisX: {
			title: _("Time"),
			titleFontSize: 14,
		},
		axisY: {
			title: _("V"),
			titleFontSize: 14,
		},
		data: [{
			color: "red",
			type: "line",
			markerType: "none",
			lineThickness: 2,
			 /** Array contains velocity data for Object A  */
			dataPoints: dataplotarray_vel_a 
		},{
			color: "blue",
			type: "line",
			axisYType: "secondary",
			markerType: "none",
			lineThickness: 2,
			 /** Array contains velocity data for Object B  */
			dataPoints:dataplotarray_vel_b}]
	});
	/** Rendering the graph for velocity */
	chart_velocity.render();  

	/**kinetic Energy graph  */
	chart_ke= new CanvasJS.Chart("graphDiv2", {
		axisX: {
			title: _("Time"),
			titleFontSize: 14,
		},
		axisY: {
			title: _("KE"),
			titleFontSize: 13,
		},
		data: [{
			color: "red",
			type: "line",
			markerType: "none",
			lineThickness: 2,
			 /** Array contains Kinetic Energy data for Object A  */
			dataPoints: dataplotarray_ke_a  
		},{
			color: "blue",
			type: "line",
			axisYType: "secondary",
			markerType: "none",
			lineThickness: 2,
			/** Array contains Kinetic Energy data for Object B  */
			dataPoints:dataplotarray_ke_b}]
	});
	/** Rendering the graph for Kinetic Energy */
	chart_ke.render();  
  }
