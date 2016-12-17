/** Function to change the slider value of coefficient of restitution */
function coffRestitution(scope) {
 coeff_restitution = scope.coeff_restitution;
}
/** Change function of the slider mass of object a */
function massOfObjAChange(scope) {
 mass_ball_a = scope.mass_of_a;
 getChild("ball_a").scaleX = 0.5 + (scope.mass_of_a - 1) / 20;
 getChild("ball_a").scaleY = 0.5 + (scope.mass_of_a - 1) / 20;
 ball_a_radius = (getChild("ball_a").image.height * getChild("ball_a").scaleY) / 2;
}
/** Change function of the slider mass of object b */
function massOfObjBChange(scope) {
 mass_ball_b = scope.mass_of_b;
 getChild("ball_b").scaleX = 0.5 + (scope.mass_of_b - 1) / 20;
 getChild("ball_b").scaleY = 0.5 + (scope.mass_of_b - 1) / 20;
 ball_b_radius = (getChild("ball_b").image.height * getChild("ball_b").scaleY) / 2;
}

/** Show result check box function for showing the center of the mass*/
function showCenterBall(scope) {
 getChild("centre_ball").visible = scope.centreMass;
}

/**Arrow from object A to the space position*/
function drawDirectionObjA(shapeName, line, xPos, yPos, arrow, scope) {
 shapeName.cursor = "pointer";
 shapeName.name = "objA";
 shapeName.on("pressmove", function(evt) {
  this.x = evt.stageX;
  this.y = evt.stageY;
  line.graphics.clear();
  if (this.y > final_pos_direction_y) {
   this.y = final_pos_direction_y;
  }
  line.graphics.moveTo(xPos, yPos).setStrokeStyle(5).beginStroke("red").lineTo(this.x, this.y);
  collision_stage.addChild(line);
  scope.start_disable = false;
  objDirectionArrow(arrow, this.x, this.y, xPos, yPos, "objA");
 })
}

/**Arrow from object B to the space position*/
function drawDirectionObjB(shapeName, line, xPos, yPos, arrow, scope) {
 shapeName.cursor = "pointer";
 shapeName.on("pressmove", function(evt) {
  this.x = evt.stageX;
  this.y = evt.stageY;
  line.graphics.clear();
  if (this.y > final_pos_direction_y) {
   this.y = final_pos_direction_y;
  }
  line.graphics.moveTo(xPos, yPos).setStrokeStyle(5).beginStroke("red").lineTo(this.x, this.y);
  collision_stage.addChild(line);
  scope.start_disable = false;
  obj_b_end_x = this.x;
  obj_b_end_y = this.y;
  direction_b_flag = true;
  objDirectionArrow(arrow, obj_b_end_x, obj_b_end_y, xPos, yPos, "objB");
  scope.$apply();
 });
}
/**Arrow shape for ball Ans B with arrow head*/
function objDirectionArrow(arrow, end_x, end_y, xPos, yPos, obj) {
 var headLength = 15;
 arrow.graphics.clear();
 var degrees_of_x = 225 * Math.PI / 180;
 var degrees_of_y = 135 * Math.PI / 180;
 var headLength = 15;
 /** Calculation of the angle of the direction line */
 var dx = end_x - xPos;
 var dy = end_y - yPos;
 var angle = Math.atan2(dy, dx);
 /** Calculation of arrow head points */
 var start_x = end_x + headLength * Math.cos(angle + degrees_of_x);
 var start_y = end_y + headLength * Math.sin(angle + degrees_of_x);
 var arrow_x = end_x + headLength * Math.cos(angle + degrees_of_y);
 var arrow_y = end_y + headLength * Math.sin(angle + degrees_of_y);

 /** Draw partial arrow head at 225 degrees */
 arrow.graphics.setStrokeStyle(5).beginStroke("red").moveTo(end_x + 1, end_y - 1);
 arrow.graphics.setStrokeStyle(5).beginStroke("red").lineTo(start_x, start_y);
 /** Draw partial arrow head at 135 degrees */
 arrow.graphics.setStrokeStyle(5).beginStroke("red").moveTo(end_x - 1, end_y + 1);
 arrow.graphics.setStrokeStyle(5).beginStroke("red").lineTo(arrow_x, arrow_y);
 collision_stage.addChild(arrow);
 //Angle for ball a
 if (obj == "objA") {
  /** Calculate the distance between ball position and end of arrow using (x-a)2 +(y-b)2 = r2 ,
  by dividing by 10 we can noprmalize the value*/
  velocity_of_objA = (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) / 10;
  objA_angle = angle < 0 ? angle * -1 : 3.14159 + (3.14159 - angle);
  /**radian = Φ × (180/π)*/
  angle_degree_a = objA_angle * (180 / 3.14);
  /**velocity X of ball A = velocity of A × cos(Φ)*/
  objA_x_velocity = velocity_of_objA * Math.cos(objA_angle);
  /**velocity Y of ball A = velocity of A × sin(Φ)*/
  objA_y_velocity = velocity_of_objA * Math.sin(objA_angle);
 } else { //Angle for ball B		 
  velocity_of_objB = (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) / 10;
  objB_angle = angle < 0 ? angle * -1 : 3.14159 + (3.14159 - angle);
  /**velocity X of ball B = velocity of B × cos(Φ)*/
  objB_x_velocity = velocity_of_objB * Math.cos(objB_angle);
  /**velocity Y of ball B = velocity of B × sin(Φ)*/
  objB_y_velocity = velocity_of_objB * Math.sin(objB_angle);
  /**radian = Φ × (180/π)*/
  angle_degree_b = objB_angle * (180 / 3.14);
 }
}

/**calculate the velocity of the object Ball A and B, along with the angle in degree and radians*/
function calculation(scope) {
 /** Calculate the distance between ball position and end of arrow using (x-a)2 +(y-b)2 = r2 */
 velocity_of_objA = Math.sqrt(Math.pow(0 / UNIT_LENGTH, 2) + Math.pow(0 / UNIT_LENGTH, 2));
 objA_angle = 0;
 /**velocity X of ball A = velocity of A × cos(Φ)*/
 objA_x_velocity = velocity_of_objA * Math.cos(objA_angle);
 /**velocity Y of ball A = velocity of A × sin(Φ)*/
 objA_y_velocity = velocity_of_objA * Math.sin(objA_angle);
 /**radian = Φ × (180/π)*/
 angle_degree_a = objA_angle * (180 / 3.14);
 /** Calculate the distance between ball position and end of arrow using (x-a)2 +(y-b)2 = r2 */
 velocity_of_objB = Math.sqrt(Math.pow(0 / UNIT_LENGTH, 2) + Math.pow(0 / UNIT_LENGTH, 2));
 objB_angle = 0;
 /**velocity X of ball B = velocity of B × cos(Φ)*/
 objB_x_velocity = velocity_of_objB * Math.cos(objB_angle);
 /**velocity Y of ball B = velocity of B × sin(Φ)*/
 objB_y_velocity = velocity_of_objB * Math.sin(objB_angle);
 /**radian = Φ × (180/π)*/
 angle_degree_b = objB_angle * (180 / 3.14);
}
/**drag the ball A to any position in the space for finding the velocity */
function dragObjectA(arrow, line, scope) {

 getChild("ball_a").on("pressmove", function(evt) {
   /**calculation function for finding the velocity and angle*/
   calculation(scope);
   arrow.graphics.clear();
   line.graphics.clear();
   evt.target.x = evt.stageX;
   evt.target.y = evt.stageY;
   if (evt.target.y > BOUND_HEIGHT - ball_a_radius) {
    evt.target.y = BOUND_HEIGHT - ball_a_radius - 1;
   } else if (evt.target.y < ball_a_radius) {
    evt.target.y = ball_a_radius + 1;
   }
   if (evt.target.x > BOUND_WIDTH - ball_a_radius) {
    evt.target.x = BOUND_WIDTH - 1 - ball_a_radius;
   } else if (evt.target.x < ball_a_radius) {
    evt.target.x = ball_a_radius + 1;
   }
   ball_a = new createjs.Point(getChild("ball_a").x, getChild("ball_a").y);
   circle_a.x = getChild("ball_a").x;
   circle_a.y = getChild("ball_a").y;
   drawDirectionObjA(circle_a, object_a_line, circle_a.x, circle_a.y, direction_arrow_a, scope);
   getChild("centre_ball").x = (getChild("ball_a").x + getChild("ball_b").x) / 2;
   getChild("centre_ball").y = (getChild("ball_a").y + getChild("ball_b").y) / 2;
   var hit_obj = obj_b_circle.globalToLocal(obj_a_circle.x, obj_a_circle.y);
   if (obj_b_circle.hitTest(hit_obj.x, hit_obj.y)) {
    circle_b.x = getChild("ball_b").x;
    circle_b.y = getChild("ball_b").y;
    if ((getChild("ball_b").x > getChild("ball_a").x) & (getChild("ball_b").x < final_pos_obj_right)) {
     getChild("ball_b").x = getChild("ball_b").x + 5;
    } else if (getChild("ball_b").x > final_pos_obj_left) {
     getChild("ball_b").x = getChild("ball_b").x - 5;
    }
    if ((getChild("ball_b").y > getChild("ball_a").y) & (getChild("ball_b").y < final_pos_obj_bottom)) {
     getChild("ball_b").y = getChild("ball_b").y + 5;
    } else if (getChild("ball_b").y > final_pos_obj_top) {
     getChild("ball_b").y = getChild("ball_b").y - 5;
    }
   }  
 });
}
/**drag the ball A to any position in the space for finding the velocity */
function dragObjectB(arrow, line, scope) {
 getChild("ball_b").on("pressmove", function(evt) {
   /**calculation function for finding the velocity and angle*/
   calculation(scope);
   arrow.graphics.clear();
   line.graphics.clear();
   evt.target.x = evt.stageX;
   evt.target.y = evt.stageY;
   if (evt.target.y > BOUND_HEIGHT - ball_b_radius) {
    evt.target.y = BOUND_HEIGHT - ball_b_radius - 1;
   } else if (evt.target.y < ball_b_radius) {
    evt.target.y = ball_b_radius + 1;
   }
   if (evt.target.x > BOUND_WIDTH - ball_b_radius) {
    evt.target.x = BOUND_WIDTH - 1 - ball_b_radius;
   } else if (evt.target.x < ball_b_radius) {
    evt.target.x = ball_b_radius + 1;
   }
   ball_b = new createjs.Point(getChild("ball_b").x, getChild("ball_b").y);
   circle_b.x = getChild("ball_b").x;
   circle_b.y = getChild("ball_b").y;
   obj_a_end_x = obj_a_circle.x = getChild("ball_a").x;
   obj_a_end_y = obj_a_circle.y = getChild("ball_a").y;
   obj_b_end_x = obj_b_circle.x = getChild("ball_b").x;
   obj_b_end_y = obj_b_circle.y = getChild("ball_b").y;
   drawDirectionObjB(circle_b, object_b_line, circle_b.x, circle_b.y, direction_arrow_b, scope);
   getChild("centre_ball").x = (getChild("ball_a").x + getChild("ball_b").x) / 2;
   getChild("centre_ball").y = (getChild("ball_a").y + getChild("ball_b").y) / 2;
   var hit_obj = obj_a_circle.globalToLocal(obj_b_circle.x, obj_b_circle.y);
   if (obj_a_circle.hitTest(hit_obj.x, hit_obj.y)) {
    circle_a.x = getChild("ball_a").x;
    circle_a.y = getChild("ball_a").y;
    if ((getChild("ball_a").x > getChild("ball_b").x) & (getChild("ball_a").x < final_pos_obj_right)) {	
     getChild("ball_a").x = getChild("ball_a").x + 5;
    } else if (getChild("ball_a").x > final_pos_obj_left) {
     getChild("ball_a").x = getChild("ball_a").x - 5;
    }
    if ((getChild("ball_a").y > getChild("ball_b").y) & (getChild("ball_a").y < final_pos_obj_bottom)) {
     getChild("ball_a").y = getChild("ball_a").y + 5;
    } else if (getChild("ball_a").y > final_pos_obj_top) {
     getChild("ball_a").y = getChild("ball_a").y - 5;
    }
   }  
 });
}
/**Start the movement of the ball with the calculated velocity and angle*/
function startAnimation(scope) {
 object_a_line.graphics.clear();
 object_b_line.graphics.clear();
 direction_arrow_a.graphics.clear();
 direction_arrow_b.graphics.clear();
 scope.control_disable = true;
 scope.pause_disable = false;
 start_flag = true;
 getChild("ball_a").mouseEnabled = false;
 getChild("ball_b").mouseEnabled = false;  
 circle_a.alpha = circle_b.alpha = obj_a_circle.alpha = obj_b_circle = 0;
 /**radius of the ball, the total distance of two collided balls is the sum of their radius*/
 radius_AB = (ball_a_radius + ball_b_radius);
 hit_timer = setInterval(function() {
  circleOnEnterFrame(scope)
 }, 10);
}
/**timer function for the ball movements and bouncing*/
function circleOnEnterFrame(scope) {
 if (!scope.pauseFlag) {
  time_interval++;
  /**the x and Y position of each ball can be calculated b y their respective velocity × timer intervel,
  here the time interval assume to be 0.1*/
  getChild("ball_a").x += (objA_x_velocity * TIME_INTERVAL);
  getChild("ball_a").y -= (objA_y_velocity * TIME_INTERVAL);
  getChild("ball_b").x += (objB_x_velocity * TIME_INTERVAL);
  getChild("ball_b").y -= (objB_y_velocity * TIME_INTERVAL);

  /**Velocity of ball A = √(v1²+v2²)*/
  var velocity_a = Math.sqrt(((objA_x_velocity * objA_x_velocity) + (objA_y_velocity * objA_y_velocity)));
  /**Velocity of ball A = √(v1²+v2²)*/
  var velocity_b = Math.sqrt(((objB_x_velocity * objB_x_velocity) + (objB_y_velocity * objB_y_velocity))); 
  /**Kineric Energy = (1/2*mv²)*/
  kineticenergy_ball_A = parseFloat((0.5 * mass_ball_a * velocity_a));
  kineticenergy_ball_B = parseFloat((0.5 * mass_ball_b * velocity_b));

  scope.ke_ball_a = kineticenergy_ball_A.toFixed(3);
  scope.ke_ball_b = kineticenergy_ball_B.toFixed(3);
  scope.velocity_a = velocity_a.toFixed(3);
  scope.velocity_b = velocity_b.toFixed(3);
  scope.$apply();
  ////	X position of Ball A collide with wall
  if (flag_ballAX) {
   if ((getChild("ball_a").x - ball_a_radius) <= 2 || (getChild("ball_a").x + ball_a_radius) >= 698) {
    objA_x_velocity = -1 * objA_x_velocity * (coeff_restitution);
    objA_y_velocity = objA_y_velocity * (coeff_restitution);
   }
  }
  if ((getChild("ball_a").x - ball_a_radius) > 2 && (getChild("ball_a").x + ball_a_radius) < 698) {
   flag_ballAX = true;
  } else {
   flag_ballAX = false;
  }

  ////	Y position of Ball A collide with wall
  if (flag_ballAY) {
   if ((getChild("ball_a").y - ball_a_radius) <= 2 || (getChild("ball_a").y + ball_a_radius) >= 442) {
    objA_y_velocity = -1 * objA_y_velocity * (coeff_restitution);
    objA_x_velocity = objA_x_velocity * (coeff_restitution);
   }
  }
  if ((getChild("ball_a").y - ball_a_radius) > 2 && (getChild("ball_a").y + ball_a_radius) < 442) {
   flag_ballAY = true;
  } else {
   flag_ballAY = false;
  }

  ////	X position of Ball B collide with wall
  if (flag_ballBX) {
   if ((getChild("ball_b").x - ball_a_radius) <= 2 || (getChild("ball_b").x + ball_a_radius) >= 698) {
    objB_x_velocity = -1 * objB_x_velocity * (coeff_restitution);
    objB_y_velocity = objB_y_velocity * (coeff_restitution);
   }
  }
  if ((getChild("ball_b").x - ball_a_radius) > 2 && (getChild("ball_b").x + ball_a_radius) < 698) {
   flag_ballBX = true;
  } else {
   flag_ballBX = false;
  }
  ////	Y position of Ball A collide with wall
  if (flag_ballBY) {
   if ((getChild("ball_b").y - ball_b_radius) <= 2 || (getChild("ball_b").y + ball_b_radius) >= 442) {
    objB_y_velocity = -1 * objB_y_velocity * (coeff_restitution);
    objB_x_velocity = objB_x_velocity * (coeff_restitution);
   }
  }
  if ((getChild("ball_b").y - ball_b_radius) > 2 && (getChild("ball_b").y + ball_b_radius) < 442) {
   flag_ballBY = true;
  } else {
   flag_ballBY = false;
  }
  /**distance = √(x2²-x1²)+(x2²-x1²)*/
  //collide two ball each other	
  AB_distance = Math.sqrt((Math.pow((getChild("ball_a").x - getChild("ball_b").x), 2)) + (Math.pow((getChild("ball_a").y - getChild("ball_b").y), 2)));
     var temp_Ax_velocity = objA_x_velocity;
   var temp_Ay_velocity = objA_y_velocity;
   var temp_Bx_velocity = objB_x_velocity;
   var temp_By_velocity = objB_y_velocity;
  if(collision){
	  if (radius_AB >= AB_distance) { 
		   /**	v1x=(C*m2*(v2x-v1x)+m1*v1x+m2*v2x)/(m1+m2)*/
		   objA_x_velocity = (coeff_restitution * mass_ball_b * (temp_Bx_velocity - temp_Ax_velocity) + mass_ball_a * temp_Ax_velocity + mass_ball_b * temp_Bx_velocity) / (mass_ball_a + mass_ball_b);
		   /**	v1y=(C*m2*(v2y-v1y)+m1*v1y+m2*v2y)/(m1+m2)*/
		   objA_y_velocity = ((coeff_restitution * mass_ball_b * (temp_By_velocity - temp_Ay_velocity) + mass_ball_a * temp_Ay_velocity + mass_ball_b * temp_By_velocity) / (mass_ball_a + mass_ball_b));
		   /**	v2x=(C*m1*(v2x-v1x)+m1*v1x+m2*v2x)/(m1+m2)*/
		   objB_x_velocity = (coeff_restitution * mass_ball_a * (temp_Ax_velocity - temp_Bx_velocity) + mass_ball_a * temp_Ax_velocity + mass_ball_b * temp_Bx_velocity) / (mass_ball_a + mass_ball_b);
		   /**	v2y=(C*m1*(v2y-v1y)+m1*v1y+m2*v2y)/(m1+m2)*/
		   objB_y_velocity = ((coeff_restitution * mass_ball_a * (temp_Ay_velocity - temp_By_velocity) + mass_ball_a * temp_Ay_velocity + mass_ball_b * temp_By_velocity) / (mass_ball_a + mass_ball_b));
	  }
  }
  if (radius_AB < AB_distance){
	collision=true;
  }
  else{
	collision=false;
  }
  
  /* Add a new dataPoint to dataPoints*/
  chart.options.data[0].dataPoints.push({
   x: time_interval,
   y: kineticenergy_ball_A
  });
  /* Add a new dataPoint to dataPoints*/
  chart.options.data[1].dataPoints.push({
   x: time_interval,
   y: kineticenergy_ball_B
  });
  chart.render();
 }
 if (scope.centreMass) {
  var new_x = (getChild("ball_a").x + getChild("ball_b").x) / 2;
  var new_y = (getChild("ball_a").y + getChild("ball_b").y) / 2;
  getChild("centre_ball").x = new_x;
  getChild("centre_ball").y = new_y;
 }
}

/** Draws a chart in canvas js for making graph plotting */
function makeGraph() {
 chart = new CanvasJS.Chart("graphDiv", {
  axisX: {
   title: _("Time"),
   titleFontSize: 14,
   valueFormatString: " ", //space
  },
  axisY: {
   title: _("KE"),
   titleFontSize: 14,
   valueFormatString: " ", //space
  },
  data: [{
   color: "red",
   type: "line",
   markerType: "circle",
   lineThickness: 2,
   axisYindex: 0, //defaults to 0			
   /** Array contains kinetic energy for Object A */
   dataPoints: [],
  }, {
   color: "blue",
   type: "line",
   markerType: "circle",
   axisYType: "secondary",
   lineThickness: 2,
   axisYindex: 1, //defaults to 0
   /** Array contains kinetic energy for Object A */
   dataPoints: [],
  }, ]
 });
 /** Rendering the graph for momentum */
 chart.render();
}