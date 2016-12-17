(function(){
  angular
       .module('users')
	   .directive("experiment",directiveFunction)
})();

var stage,exp_canvas,stage_width,stage_height,zoom_container;

var container,weight_container;

var IMG_INDX,right_click,left_click;

var gravity_g,material_value, ruler_breadth,ruler_thicknes;

var zoom_area,scale_zoom_area,total_right_click;

var expression_e,mass,blade_distance,needle_y_value;

var needle_last_y,total_rotation,zoom_rooler_initial_y;

var lense_down_initial,lense_up_initial;

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
            /** Array to store all file name of images used in experiment and it used to create each image objects */
            images_array = ["background","stand_left","stand_right","ruler_steel","ruler_copper","ruler_aluminium","ruler_wood",
            "ruler_over_material","device_portion_1","device_portion_2","device_portion_3","device_portion_4","device_portion_5","device_portion_6",
            "weight_hanger","weight","needle_small","arrow","needle_zoom","zoom_bg",
            "zoom_minus","zoom_pluse","zoom_scale","zoom_scale_ruler"];
            /** To get a canvas element*/
			exp_canvas = document.getElementById("demoCanvas");
			exp_canvas.width = element[0].width;
			exp_canvas.height = element[0].height;
            /** To create new canvas elements */            
    		stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);
            zoom_area = new createjs.Shape();
            scale_zoom_area = new createjs.Shape();
            zoom_scale_mask = new createjs.Shape();
			queue.installPlugin(createjs.Sound);
			loadingProgress(queue, stage, exp_canvas.width);
			queue.on("complete", handleComplete, this);
            var queue_obj = [];/** Array to store object of each images */
            for(i = 0; i < images_array.length; i++){/** Creating object of each element */
                queue_obj[i] = {id: images_array[i],src: "././images/"+images_array[i]+".svg",type: createjs.LoadQueue.IMAGE};
            }
			queue.loadManifest(queue_obj);			
			stage.enableDOMEvents(true);
			stage.enableMouseOver();
            container = new createjs.Container(); /** Creating the circular coil container */
            container.name = "container";
            stage.addChild(container); /** Append it in the stage */
            weight_container = new createjs.Container(); /** Creating the circular coil container */
            weight_container.name = "weight_container";
            weight_container.x = 304;
            weight_container.y = 118;
            stage.addChild(weight_container); /** Append it in the stage */
            zoom_container = new createjs.Container(); /** Creating the circular coil container */
            zoom_container.name = "zoom_container";
			function handleComplete(){				
				initialisationOfVariables(); /** Initializing the variables */ 
                scope.show_menu = true;                   
                for(i = 0; i <= 13; i++){
                    if(images_array[i] == "stand_left"){/** adding mercury solution behind the thermometer */
                        loadImages(images_array[1],"stand_left",227, 121, "", 0, container,1);/** center point between knife edge is 272 and 1cm = 9px*/
                    }else if(images_array[i] == "stand_right"){
                        loadImages(images_array[2],"stand_right",317, 121, "", 0, container,1);/** center of knife edge is 272 */
                        loadImages(images_array[19],"zoom_bg",0, 100, "", 0, container,1);
                        loadImages(images_array[18],"needle_zoom",93.3, -20, "", 0, container,1);
                        zoom_area.graphics.beginStroke("").drawCircle(100,384.5,92);
                        stage.addChild(zoom_area);
                        stage.update();
                    }else{/** Loading all images into the canvas */
                        loadImagesMin(images_array[i]);
                    }                     
                }
                var _weight = 500; /** Variable used to naming each weight */
                for(i = 84; i >= 52; i = i - 4){
                    loadImages(images_array[IMG_INDX],"weight_"+_weight,0, i, "", 0, weight_container,0);
                    _weight -= 50;
                }
                loadImages(images_array[14],"weight_hanger", 0, 0, "", 0, weight_container,1);
                loadImages(images_array[16],"needle_small", 7, -27, "", 0, weight_container,1);
                loadImages(images_array[17],"arrow_right",387, 165, "pointer", 0, container,1);
                loadImages(images_array[17],"arrow_left",376, 165, "pointer", 180, container,1);
                scale_zoom_area.graphics.beginFill("white");
                scale_zoom_area.graphics.beginStroke("white").drawRect(360,240,40,225);
                scale_zoom_area.graphics.endFill();
                scale_zoom_area.alpha = 0.01;
                stage.addChild(scale_zoom_area);
                loadImages(images_array[21],"zoom_pluse",200, 0, "", 0, container,0);
                stage.addChild(zoom_container); /** Append it in the stage */
                loadImages(images_array[22],"zoom_scale",0, 0, "", 0, zoom_container,1);
                loadImages(images_array[23],"zoom_scale_ruler",421, -511.5, "", 0, zoom_container,1);
                zoom_scale_mask.graphics.beginStroke("white").drawRect(385,81,210,552 );// 
                zoom_container.addChild(zoom_scale_mask);
                zoom_scale_mask.alpha = 0;
                loadImages(images_array[20],"zoom_minus",10, 0, "", 0, zoom_container,1);
                stage.getChildByName("zoom_container").alpha = 0;
                stage.update();
                /** Functions to get an indication to user about right and left arrow click */
                getChild("arrow_right").on("mousedown", function(evt){rightDown(evt)});
                getChild("arrow_right").on("pressup", function(evt){rightUp(evt)});
                getChild("arrow_left").on("mousedown", function(evt){leftDown(evt)});
                getChild("arrow_left").on("pressup", function(evt){leftUp(evt)});

                getChild("arrow_right").addEventListener("click", function(evt){arrowRightClick(evt)});
                getChild("arrow_left").addEventListener("click", function(evt){arrowLeftClick(evt)});
                scale_zoom_area.addEventListener("click", function(evt){scaleZoomIn(evt)});
                zoom_container.addEventListener("click", function(evt){scaleZoomOut(evt)});
                stage.on("stagemousemove", function(evt) {mouseMovement(evt)});

                initialisationOfControls(scope);				
				translationLabels(); /** Translation of strings using gettext */
                
			}
            
			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */	
			function translationLabels(){
                /** This help array shows the hints for this experiment */
				helpArray = [_("Next"),_("Close"),_("help1"),_("help2"),_("help3"),_("help4"),_("help5"),_("help6"),_("help7"),_("help8"),_("help9"),_("help10")];
                scope.heading = _("Young's Modulus-NonUniform Bending");
				scope.variables = _("Variables");                 
				scope.result = _("Result");  
				scope.copyright = _("copyright"); 
				scope.environment_lbl = _("Select Environment");
				scope.material_lbl = _("Select Material");
				scope.mass_lbl = _("Mass of weight hanger : ");
				scope.material_lbl = _("Select Material");
				scope.unit_gram = _("g");
				scope.unit_cm = _("cm");
				scope.breadth_lbl = _("Breadth of bar(b) : ");
                scope.thickness_lbl = _("Thickness of bar(d) : ");
                scope.blade_distance_lbl = _("Knife edge distance : ");
                scope.reset = _("Reset");
				scope.result_txt = _("Young's Modulus of ");
				scope.environment_array = [{
                    environment: _('Earth, g=9.8m/s'),
                    value: 9.8
                }, {
                    environment: _('Moon, g=1.63m/s'),
                    value: 1.63
                }, {
                    environment: _('Uranus, g=10.67m/s'),
                    value: 10.67
                }, {
                    environment: _('Saturn, g=11.08m/s'),
                    value: 11.08
                }];
                scope.material_array = [{
                    material: _('Wood'),
                    value: 1.1
                }, {
                    material: _('Aluminium'),
                    value: 6.9
                }, {
                    material: _('Copper'),
                    value: 11.7
                }, {
                    material: _('Steel'),
                    value: 20
                }];

                scope.$apply();				
			}
		}
	}
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container){
    var text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
    container.addChild(text); /** Adding text to the container */
    stage.update();
}
function loadImagesMin(name){
    var _bitmap = new createjs.Bitmap(queue.getResult(name)).set({});
    _bitmap.x = 0;
    _bitmap.y = 0;
    _bitmap.name = name;
    _bitmap.alpha = 1;   
    _bitmap.cursor = "";
    if(name == "ruler_steel" || name == "ruler_copper" || name == "ruler_aluminium"){
        _bitmap.regY = 130;_bitmap.image.height/4;
        _bitmap.y = 130;
    }else if(name == 'ruler_wood' || name == 'ruler_over_material'){
        _bitmap.regY = 130;_bitmap.image.height/4;
        _bitmap.y = 130;
    }
    container.addChild(_bitmap);    
    stage.update();
}

/** All the images loading and added to the stage */
function loadImages(element,name, xPos, yPos, cursor, rot, container,alpha){
    var _bitmap = new createjs.Bitmap(queue.getResult(element)).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    //_bitmap.scaleX=_bitmap.scaleY=scale;
    _bitmap.name = name;
    _bitmap.alpha = alpha;
    _bitmap.rotation = rot;   
    _bitmap.cursor = cursor; 
    if ( name == "needle_zoom" || name == "zoom_bg" ) {
        _bitmap.mask = zoom_area; /** Adding mask to zoom portion of lense */ 
    }else if(name == "zoom_scale_ruler") {
        _bitmap.mask = zoom_scale_mask;
    }
    if(name == "arrow_left"){
        _bitmap.scaleY = -1;
    }
    container.addChild(_bitmap); /** Adding bitmap to the container */ 
    stage.update();
}

/** function to return chiled element of container */
function getChild(chldName){
    return container.getChildByName(chldName);
}
function initialisationOfControls(scope){
    scope.mass = 50; /** Initial value of mass of weight hanger */
    scope.breadth = 1; /** Initial value of breadth of bar */
    scope.thickness = 0.4; /** Initial value of thickness of bar */
    scope.blade_distance = 10; /** Initial value of distance between blades */
    scope.material = 1.1;  /** Initial value of material(y) */
    scope.environment = 9.8;  /** Initial value of environment */
    scope.material_index = 0;  /** Index value of material list */
    massOfWeight(scope); /** To reset weights on hanger to initial state */
    distanceOfBlade(scope); /** To reset needle position  to initial state */
}
/** All variables initialising in this function */
function initialisationOfVariables() {
   IMG_INDX = 15 ; /** Array index of weight image */
   gravity_g = 9.8 /** Initial value of 'g' is 9.8(earth) */
   material_value = 1.1 /** Initial value of wooden material is 1.1 */
   mass = 50 /** Initial value of mass(weight hanger) */
   ruler_breadth = 1 /** Initial value of breadth of ruler */
   ruler_thicknes = 0.4 /** Initial value of thickness of ruler */
   blade_distance = 10 /** Initial value of distance between blades */
   needle_y_value = -20; /** Y position of needle while needle moving based on each clik on arrows */
   needle_last_y = -20; /** To get the current y value of zoom needle only during arrow click */
   needle_y_at_controls = -20; /** To get curretn y value of zoom needle only during the slider change */
   total_rotation = 0;   /** Iinitia value of scale moved count */
   total_right_click = 0;/** Iinitia value of total arrow click */
   zoom_rooler_initial_y = -511.5; /** Iinitia value zoom rooler over zoom scale */
   right_click = true;
   left_click = true;
   lense_down_initial = lense_up_initial = 0;/** Initial value of lense in each arrow click */
}

