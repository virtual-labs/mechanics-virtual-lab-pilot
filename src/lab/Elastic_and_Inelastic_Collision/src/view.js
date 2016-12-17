(function() {
	angular.module('users')
		.directive("experiment", directiveFunction)
})();
/**variable declarations*/
var collision_stage, exp_canvas,tick;
var help_array = [];
var timer_delay_var,initial_obj_a_pos,initial_obj_b_pos,final_obj_a_pos,final_obj_b_pos;
var object_ax,object_bx,current_x,start_flag,initial_a_rectpos,initial_b_rectpos;
var coeff_restitution,velocity_v1,mass_m1,velocity_v2,mass_m2,u1,u2,m1,m2,v1,v2,kinetic,elastic_v1,elastic_v2,inelastic_v1,inelastic_v2;
var selected_type,time_counter,hit_flag,center_point,center_initial,center_drag,u1_val,u2_val;
var momentum_before_a,momentum_before_b,momentum_after_a,momentum_after_b,momentum_before_a1,momentum_before_b1,momentum_after_a1,momentum_after_b1;
var kinetic_obja_before,kinetic_objb_before,kinetic_obja_after,kinetic_objb_after,kinetic_obja_before1,kinetic_objb_before1,kinetic_obja_after1,kinetic_objb_after1;
/**Rectangle for calculating x-position of the Object A */
var object_a_rect = new createjs.Shape();
/**Rectangle for calculating x-position of the Object B */
var object_b_rect = new createjs.Shape(); 
var object_a_container,object_b_container;
var dataplotarray_momentum_a=[],dataplotarray_momentum_b=[],dataplotarray_vel_a=[],dataplotarray_vel_b=[],dataplotarray_ke_a=[],dataplotarray_ke_b=[];
var chart,chart_velocity,chart_ke,rect_pos,rect_neg,rect_neg_val;
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
			collision_stage = new createjs.Stage("demoCanvas");
			/** Preloading the images in a queue */
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			loadingProgress(queue,collision_stage,exp_canvas.width)
			queue.on("complete", handleComplete, this);
			/** Container for placing Object A elements*/
			object_a_container = new createjs.Container(); 
			object_a_container.name = "object_a_container";
			/** Container for placing Object B elements*/
			object_b_container = new createjs.Container(); 
			object_b_container.name = "object_b_container";
			queue.loadManifest([{
				id: "background",
				src: "././images/background.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "object_a",
				src: "././images/object_a.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "object_a_wheel",
				src: "././images/object_a_wheel.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "wheel_shadow",
				src: "././images/wheel_shadow.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "object_b",
				src: "././images/object_b.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "object_b_wheel",
				src: "././images/object_b_wheel.svg",
				type: createjs.LoadQueue.IMAGE
			},{
				id: "center_point",
				src: "././images/center_point.svg",
				type: createjs.LoadQueue.IMAGE
			},]);
			collision_stage.enableDOMEvents(true);
			collision_stage.enableMouseOver();
			/** Stage update function in a timer */
			tick = setInterval(updateTimer, 100); 
			
			function handleComplete() {
				loadImages(queue.getResult("background"),"background",0,-60,"",0,1,collision_stage);
				loadImages(queue.getResult("object_a"),"object_a",50,102,"pointer",0,1,object_a_container);
				loadImages(queue.getResult("object_a_wheel"),"object_a_wheel1",80,133.5 ,"",0,1,object_a_container);
				loadImages(queue.getResult("object_a_wheel"),"object_a_wheel2",118,133.5,"",0,1,object_a_container);
				loadImages(queue.getResult("wheel_shadow"),"wheel_shadow_a1",55,142 ,"",0,1,object_a_container);
				loadImages(queue.getResult("wheel_shadow"),"wheel_shadow_a2",95,142,"",0,1,object_a_container);
				/**Adding Object A container to the stage*/
				collision_stage.addChild(object_a_container);
				loadImages(queue.getResult("object_b"),"object_b",350,102,"pointer",0,1,object_b_container);
				loadImages(queue.getResult("object_b_wheel"),"object_b_wheel1",379.5,133.5 ,"",0,1,object_b_container);
				loadImages(queue.getResult("object_b_wheel"),"object_b_wheel2",418.3,133.5,"",0,1,object_b_container);
				loadImages(queue.getResult("wheel_shadow"),"wheel_shadow_b1",354,142 ,"",0,1,object_b_container);
				loadImages(queue.getResult("wheel_shadow"),"wheel_shadow_b2",393,142,"",0,1,object_b_container);
				/**Adding Object B container to the stage*/
				collision_stage.addChild(object_b_container);
				loadImages(queue.getResult("center_point"),"center_point",240,110,"",0,1,collision_stage);
				/** Setting the all graph div display as block */
				document.getElementById("graphDiv").style.display = "block";
				document.getElementById("graphDiv1").style.display = "block";
				document.getElementById("graphDiv2").style.display = "block";
				drawRectangle();
				/**Initialise all variables to its default value*/
				initialisationOfVariables(scope); 
				/** Translation of strings using gettext */
				translationLabels(); 
				/**function for plotting the graph*/
				makeGraph();
				/**function for draging Object A*/
				dragObject(scope,object_a_container,initial_obj_a_pos,final_obj_a_pos);
				/**function for draging Object B*/
				dragObject(scope,object_b_container,initial_obj_b_pos,final_obj_b_pos);
				/**Initially the result table shows zero value */
				initialiseVariable(scope);
				collision_stage.update();
 			}
			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext 
			function defined in the gettext-definition.js */
			function translationLabels() {
				scope.show_menu = true;
				/** Labels used in the experiment initialize here */
				/** This help array shows the hints for this experiment */
				help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"),_("help6"),_("help7"),_("Next"), _("Close")];
				/**Experiment name*/
				scope.heading = _("Elastic and Inelastic Collision");
				scope.variables = _("Variables");
				/**label for select type*/
				scope.select_type = _("Select Type");
				/** label for Coeff of Restitution*/
				scope.restitution_label = _("Coeff of Restitution(k)");
				/** Object A label*/
				scope.object1_label=_("Object A");
				/** Object B label*/
				scope.object2_label=_("Object B");
				/**Velocity slider label for Object A*/
				scope.velocity1_label=_("Velocity(v1)");
				/**Mass slider label for Object A*/
				scope.mass1_label=_("Mass(m1)");
				/**Velocity slider label for Object B*/
				scope.velocity2_label=_("Velocity(v2)");
				/**Mass slider label for Object B*/
				scope.mass2_label=_("Mass(m2)");
				/**unit of mass*/
				scope.mass_unit = _("g");
				/**Label for start experiment button*/
				scope.start_exp = _("Start Experiment");
				/**Label for reset button*/
				scope.reset_exp = _("Reset");
				/**label for initial value of the type of collision in the combobox*/
				scope.type_selected = _("Elastic");
				/**label for values shown in the result part*/
				scope.before_collision=_("Before Collision");
				scope.after_collision=_("After Collision");
				scope.select_obj=_("Select an object");
				scope.rslt_object1=_("Object A");
				scope.rslt_object2=_("Object B");
				scope.objecta_label1=_("K.E");
				scope.objecta_label2=_("Velocity");
				scope.objecta_label3=_("Momentum");
				scope.mass_unit=_("kg");
				scope.vel_unit=_("m/sec");
				scope.result = _("Result");
				scope.copyright = _("copyright");
				scope.elastic = _("Elastic");
				scope.melting_pt = _("Melting Point");
				/** The substance array contains the type of collision selected for the experiment */
				scope.type_array = [{
					substance: _('Elastic'),
					type: 'elastic'
				}, {
					substance: _('InElastic'),
					type: 'inelastic'
				},];
				scope.$apply();
			}
		}
	}
}

/**function for drawing rectangle*/
function drawRectangle(){
	/**Adding rectangle to the stage for calculating the x position of Object A */
	collision_stage.addChild(object_a_rect);
	object_a_rect.x = object_a_rect.y = 100;
	object_a_rect.graphics.beginStroke("red").setStrokeStyle(3);
	object_a_rect.graphics.drawRect(0,0,50,50).command;
	object_a_rect.alpha=0;
	/**Adding rectangle to the stage for calculating the x position of Object B */
	collision_stage.addChild(object_b_rect);
	object_b_rect.x = 310;
	object_b_rect.y = 100;
	object_b_rect.graphics.beginStroke("blue").setStrokeStyle(3);
	object_b_rect.graphics.drawRect(0,0,50,50).command;
	object_b_rect.alpha=0;
}

/** Createjs stage updation happens in every interval */
function updateTimer() {
	collision_stage.update();
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
	collision_stage.addChild(text); 
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, rot,alpha_value,container) {
	var _bitmap = new createjs.Bitmap(image).set({});
	_bitmap.x = xPos;
	_bitmap.y = yPos;
	_bitmap.name = name;
	_bitmap.alpha = alpha_value;
	_bitmap.rotation = rot;
	_bitmap.cursor = cursor;
	if (name == "object_b_wheel1"||name == "object_b_wheel2"||name == "object_a_wheel1"||name == "object_a_wheel2") {
        _bitmap.regX = image.width / 2;
        _bitmap.regY = image.height / 2;
    }
	/** Adding bitmap to the stage */
	container.addChild(_bitmap);
}

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	/** Default value is set as initial*/
	/**interval of timer for moving the objects*/
	timer_delay_var=100;
	/**initial value for denoting the experiment is started or not*/
	start_flag=false;
	/**initial position for Object A in the stage*/
	initial_obj_a_pos=-50;
	/**initial position for Object B in the stage*/
	initial_obj_b_pos=-350;
	/**final position for Object A in the stage*/
	final_obj_a_pos=543;
	/**final position for Object B in the stage*/
	final_obj_b_pos=243;
	object_ax=0;
	object_bx=0;
	current_x=0;
	/**initialize positions for both Object A and Object B rectangles */
	initial_a_rectpos=100;
	initial_b_rectpos=310;
	/**initial value of  the collision type combo*/
	selected_type="elastic";
	/**variable for calculating the timer in each time interval*/
	time_counter=0;
	/**initial value for the center point*/
	center_point=0;
	center_initial=250;
	center_drag=32;
	/**initial value for detecting the objects are hitted or not*/
	hit_flag=false;
	rect_pos=45;
	rect_neg=30;
	rect_neg_val=10;
	/**set coeff of restitution as 1 by default and disable slider if collision type is elastic*/
	if(selected_type=="elastic"){
		scope.coeff_restitution = 1; 
		scope.restitution_disable=true;
	}
}