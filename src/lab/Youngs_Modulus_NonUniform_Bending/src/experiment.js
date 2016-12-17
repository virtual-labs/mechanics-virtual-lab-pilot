/** --------Controls and all functionalities of experiments defined here------- */

/** Function to set the environment and its respective value*/
function changeEnviornment(scope){
	gravity_g = parseFloat(scope.environment);
	calculation();
}

/** Function to set the thickness of ruler */
function thicknessOfBar(scope){
	ruler_thicknes = parseFloat(scope.thickness);
	calculation();
} 

/** Function to set the material used for experiment */
function changeMaterial(scope){
	material_value = parseFloat(scope.material);
	scope.breadth = 1;
	/** Initialy hide all material for each material selection */
	getChild("ruler_wood").alpha = getChild("ruler_aluminium").alpha = getChild("ruler_copper").alpha = getChild("ruler_steel").alpha = 0;
	switch(material_value){
		case 1.1: /** This case execute when selected material is wood */
			getChild("ruler_over_material").scaleY = getChild("ruler_wood").scaleY = 1; /** To set breadth of material to initial state while breadth was changed */
			getChild("ruler_wood").alpha = 1; /** To display selected material */
			scope.material_index = 0;  /** This value used to selected string of selected material from array and it uses in RESULT section */
			break;
		case 6.9:  /** This case execute when selected material is aluminium */
			getChild("ruler_over_material").scaleY = getChild("ruler_aluminium").scaleY = 1; /** To set breadth of material to initial state while breadth was changed */
			getChild("ruler_aluminium").alpha = 1; /** To display selected material */
			scope.material_index = 1;  /** This value used to selected string of selected material from array and it uses in RESULT section */
			break;
		case 11.7:  /** This case execute when selected material is copper */
			getChild("ruler_over_material").scaleY = getChild("ruler_copper").scaleY = 1; /** To set breadth of material to initial state while breadth was changed */
			getChild("ruler_copper").alpha = 1; /** To display selected material */
			scope.material_index = 2;  /** This value used to selected string of selected material from array and it uses in RESULT section */
			break;
		case 20:  /** This case execute when selected material is steel */
			getChild("ruler_over_material").scaleY = getChild("ruler_steel").scaleY = 1; /** To set breadth of material to initial state while breadth was changed */
			getChild("ruler_steel").alpha = 1; /** To display selected material */
			scope.material_index = 3;  /** This value used to selected string of selected material from array and it uses in RESULT section */
			break;
	}
	calculation();
	stage.update();
}

/** Function to change the breadth of material */
function breadthOfBar(scope){
	ruler_breadth = parseFloat(scope.breadth).toPrecision(2);
	
	switch(material_value){
		case 1.1:   /** To change the breadth of wood */
			getChild("ruler_over_material").scaleY = getChild("ruler_wood").scaleY = 1 + ((ruler_breadth-1)/10);
			break;
		case 6.9:   /** To change the breadth of aluminium */
			getChild("ruler_over_material").scaleY = getChild("ruler_aluminium").scaleY = 1 + ((ruler_breadth-1)/10);
			break;
		case 11.7:   /** To change the breadth of copper */
			getChild("ruler_over_material").scaleY = getChild("ruler_copper").scaleY = 1 + ((ruler_breadth-1)/10);
			break;
		case 20:   /** To change the breadth of steel */
			getChild("ruler_over_material").scaleY = getChild("ruler_steel").scaleY = 1 + ((ruler_breadth-1)/10);
			break;
	}
	calculation();
	stage.update();
}

/** To set the mass on weight hanger */
function massOfWeight(scope){
	mass = parseFloat(scope.mass);
	for(i = 100; i <= mass; i = i + 50){ /** To show the number of weights */
		weight_container.getChildByName("weight_"+i).alpha = 1;
	}
	for(i = mass + 50 ; i <= 500; i = i + 50){ /** To hide the number of weight */
		weight_container.getChildByName("weight_"+i).alpha = 0;
	}
	calculation();
	stage.update();
}

/** To set the distance between edge of two blades */
function distanceOfBlade(scope) {
	blade_distance = parseFloat(scope.blade_distance);  /** This statment will set the distance between the edge of bladed */
	getChild("stand_right").x = 272 + blade_distance * 4.5;  /** To set the postion of right side blade */
	getChild("stand_left").x = 272 - blade_distance * 4.5;  /** To set the postion of left side blade */
	calculation();
	stage.update();
}

/** Function to execute while in zoom-in effect of scale */
function scaleZoomIn(evt){
	zoom_container.cursor = "none"; /** To hide curesor */
	stage.getChildByName("zoom_container").alpha = 1; /** To display the zoom effect of scale */
	stage.update();
}

/** Function to execute while in zoom-ot effect of scale */
function scaleZoomOut(evt){
	stage.getChildByName("zoom_container").alpha = 0; /** Function to hide zoom-in effect of scale */
	
}

/** A fadout/fadin effect to get an interaction of right arrow click */
function rightDown(evt){
	getChild("arrow_right").alpha = 0.7; /** Adjust the transparancy of arrow to get a click effect */
	stage.update();
}
function rightUp(evt){
	getChild("arrow_right").alpha = 1; /** Adjust the transparancy of arrow to get a click effect */
	stage.update();
}

/** A fadout/fadin effect to get an interaction of left arrow click */
function leftDown(evt){
	getChild("arrow_left").alpha = 0.7;  /** Adjust the transparancy of arrow to get a click effect */
	stage.update();
}
function leftUp(evt){
	getChild("arrow_left").alpha = 1;  /** Adjust the transparancy of arrow to get a click effect */
	stage.update();
}

/** Function to handle events related to right arrow */
function arrowRightClick(evt){
	if(total_rotation<=500){
		total_right_click++; /** To get the total number of right arrow click */
	    if(right_click){  /** This block of code will execute only if first right arrow click after the left arrow click */
	        total_rotation = 0; /** To get the total number of right and left and left arrow click */
	        needle_last_y = getChild("needle_zoom").y; /** current position of needle and it used as next initial position of needle */
	        zoom_rooler_initial_y = zoom_container.getChildByName("zoom_scale_ruler").y; /** current position of zoom scale and it used as next initial position of zoom scale */
	        right_click = false; 
	        left_click = true;
	    }
	    total_rotation++; 
	    /** 
		    * To reposition the zoom needle and
			* 1.4 = 14/10 here we consider 1mm is equal to 14px
			* 10 arrow click is equal to 1mm in needle movement
	    */
	    getChild("needle_zoom").y =  needle_last_y + (total_rotation * 1.4); 
	     /** 
		    * To reposition the zoom scale and
			* 0.7 = 14/20 here we consider 1mm is equal to 14px
			* 20 arrow click is equal to 1mm in zoom scale movement
	    */
	    zoom_container.getChildByName("zoom_scale_ruler").y =  zoom_rooler_initial_y + (total_rotation * 0.7);
	    getChild("device_portion_3").y = lense_down_initial-(total_rotation * 0.14); /** To move lense of microscope upward/downward direction */
	    getChild("device_portion_5").y = lense_down_initial-(total_rotation * 0.14); /** To move lense of microscope upward/downward direction */
	    needle_y_value = needle_y_at_controls;//getChild("needle_zoom").y;
	    lense_up_initial = getChild("device_portion_5").y;
    }
}

/** Function to handle events related to right arrow */
function arrowLeftClick(evt){
	if(total_right_click > -50){
        total_right_click--;
        if(left_click){ /** This block of code will execute only if first left arrow click after the right arrow click */
            total_rotation = 0;
            needle_last_y = getChild("needle_zoom").y;
            zoom_rooler_initial_y = zoom_container.getChildByName("zoom_scale_ruler").y;
            left_click = false;
            right_click = true;
        }
        total_rotation++;
        /** 
		    * To reposition the zoom scale and
			* 1.4 = 14/10 here we consider 1mm is equal to 14px
			* 10 arrow click is equal to 1mm in scale movement
	    */
        getChild("needle_zoom").y =  needle_last_y - (total_rotation * 1.4);
         /** 
		    * To reposition the zoom scale and
			* 0.7 = 14/20 here we consider 1mm is equal to 14px
			* 20 arrow click is equal to 1mm in zoom scale movement
	    */
        zoom_container.getChildByName("zoom_scale_ruler").y =  zoom_rooler_initial_y - (total_rotation * 0.7);
        needle_y_value = getChild("needle_zoom").y;
        getChild("device_portion_3").y = lense_up_initial + (total_rotation * 0.14); /** To move lense of microscope upward/downward direction */
    	getChild("device_portion_5").y = lense_up_initial + (total_rotation * 0.14); /** To move lense of microscope upward/downward direction */
    	lense_down_initial = getChild("device_portion_5").y;
    }
}
/** Function to show zoom-in and zoom-out images and related actions */
function mouseMovement(evt){
	if(evt.stageX > 5 && evt.stageX < 695 && evt.stageY > 5 && evt.stageY < 695){
        zoom_container.getChildByName("zoom_minus").alpha = 1;
    }else{
        zoom_container.getChildByName("zoom_minus").alpha = 0; 
    }
    zoom_container.getChildByName("zoom_minus").x = evt.stageX - 10;
    zoom_container.getChildByName("zoom_minus").y = evt.stageY - 10;
    if(evt.stageX > 360 && evt.stageX < 400 && evt.stageY > 240 && evt.stageY < 465){
        scale_zoom_area.cursor  = "none";
        getChild("zoom_pluse").alpha = 1;
        getChild("zoom_pluse").x = evt.stageX - 10;
        getChild("zoom_pluse").y = evt.stageY - 10;
        
    }else{
        getChild("zoom_pluse").alpha = 0;
    }
    stage.update();
}
function calculation(){
	/**
	 * Calculation of expression, e
	 * 𝑒=(𝑚𝑔𝑙^3)/(4𝑏𝑑^3 𝑌)
	*/
	expression_e = ((mass/1000) * gravity_g * Math.pow((blade_distance/100),3)) / (4 * (ruler_breadth/100) * Math.pow( (ruler_thicknes/100),3 ) * (material_value * Math.pow(10,10) ) )
	expression_e = expression_e * 1000;
	getChild("needle_zoom").y =  needle_y_value - (expression_e * 10);
	needle_y_at_controls = needle_last_y = getChild("needle_zoom").y;
	stage.update();
}
                               
function resetExperiment(scope){
	initialisationOfControls(scope); /** Reset all variable to initial state */
	getChild("stand_left").x = 227;  /** Set to initial position of right side blade */
	getChild("stand_right").x = 317;  /** Set to initial positon of left side blade */
	stage.getChildByName("zoom_container").alpha = 0;   /** To hide zoom view of scale */
	  /** To set all materials to invisible except wood */
	getChild("ruler_steel").alpha = 0;
	getChild("ruler_copper").alpha = 0;
	getChild("ruler_aluminium").alpha = 0;
	getChild("ruler_wood").alpha = 1;
	stage.update();

}