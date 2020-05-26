function getColorTestPattern(x, y) {
  x = (x + 1) / 2;
  y = (y + 1) / 2;
  return vec3(x, 1-x, y);
}

var objects = [new Sphere(vec3(0,0,0), 0.5, vec3(1,0,0)),
			new Sphere(vec3(0,1,0), 0.2, vec3(1,0,1))];



var isSphere1;
var isSphere2;
var isPlane;

var backgroundColor = vec3(.75, .75, .9);
var eye = vec3(0, 0, 10); // screen is at z = 5
//var light = vec3(10, 0, 0);

/**
 * x and y are the normalized device coordinates (-1, -1) to (1, 1).
 * Return a vec3 with the color at this (normalized) pixel coordinate.
 */
function getColor(x, y) {
	// eye = vec3(0,0,10);
  // TODO
  isSphere1 = false;
  isSphere2 = false;
  isPlane = false;
  return trace(eye, vec3(x, y, -5), 0);
}

// returns a color
function trace(p, d, step){
	var local;
	var reflected = vec3(0, 0, 0);
	var ballColor = vec3(1.0, 0, 0);
	
	var intersectIndex;
	
	var realT = null;
	if(step > 3){ // halts recurrsion
		return backgroundColor;
	}
	for(var i = 0; i < objects.length; i++){
		var temp = objects[i].intersect(p, d);
		if(temp != null && temp > 0){
			console.log(temp);
		}
		if(temp != null && temp > 0 && (realT == null || temp < realT )){
			realT = temp;
			console.log(temp);
			intersectIndex = i;
		}
	}
	if(realT == null){
		return backgroundColor;
	}
	
	
	
	
	q = add(p, mult(realT, d));
	
	//return objects[intersectIndex].normal(q).map(Math.abs);
	var norm = objects[intersectIndex].normal(q);//.map(Math.abs);
	var col = objects[intersectIndex].color;
	
	var local = phong(p, q, norm, reflect(q, norm), col)
	
	//return objects[intersectIndex].color;
	return local;
	
	//var q = intersect(p, d); // get point where ray intersects
	// if(q == null){// No intersection
		// return backgroundColor;
	// } 
	// else{ // intersection
		// var n = vec3();
		// var r = vec3();


		// if(isSphere1 || isSphere2){
			// n = normal(q);// get the normal at this point. which for sphere will be q
			// if(isSphere2){
				// n = add(q, vec3(0, 1, 0));
			// }
			// r = reflect(q, n);
		// }
		// if(isPlane){
			// n = vec3(1, 0, 0);
			// r = mult(1, reflect(q, n));
		// }

		// local = phong(q, n, r);
		// reflected = trace(q, r, step + 1);
	// }
	//var retVal = add(mult(0.5, local), mult(0.5, reflected));

	//return retVal;
	return vec3(1,0,0);
	
}

// returns a point of intersection
// From page 586 from Angel et al Textbook
// function intersect(p, d){
	// // sphere1
	// var retVal;
	// var a;
	// var b;
	// var c;
	// // Equation from page 588
	// // Intersection checks 1st sphere, 2nd sphere and then plane
	// // I know this is wrong, but I am working on fixing other issues
	// a = dot(d, d);
	// b = dot(mult(2, d), subtract(p, vec3(0, 1, 0))); // looking to intersect sphere at 0,0,0...
	// c = dot(subtract(p, vec3(0, 1, 0)), subtract(p, vec3(0, 1, 0))) - .16; //..4 is radius
	// var discr = (b * b) - (4 * a * c);
	// if (discr < 0){
		// // sphere2
		// var a;
		// var b;
		// var c;
		// // Equation from page 588
		// a = dot(d, d);
		// b = dot(mult(2, d), subtract(p, vec3(0, -0.005, 0))); // looking to intersect sphere at 0,0,0...
		// c = dot(subtract(p, vec3(0, -0.005, 0)), subtract(p, vec3(0, -0.005, 0))) - .16; //..4 is radius
		// var discr = (b * b) - (4 * a * c);
		// if (discr < 0){ // Plane
			// // Equation from page 589
			// var q1 = vec3(-0.01, 0.0, 0.0);
			// var p1 = vec3(-0.01, -1.0, 0.0);
			// var n1 = vec3(1, 0, 0);
			// var te = -1 * (dot(subtract(p, q1), n1) / dot(d, n1));
			// if (te > 0)
			// {
				// var c = add(p, mult(te,d));
				// isPlane = true;
				// return c;
			// }
			// else return null;
		// }
		// discr = Math.sqrt(discr);
		// var t1 = (-1 * b + discr) / (2 * a);
		// var t2 = (-1 * b - discr) / (2 * a);
		
		// isSphere2 = true;
		// if(t1 < t2) // return the point with the smallest tValue
			// return add(p, mult(t1, d));
		// else
		// {
			// return add(p, mult(t2, d));
		// }
		// return null;
	// }
	
	// isSphere1 = true;
	// discr = Math.sqrt(discr)
	// var t1 = (-1 * b + discr) / (2 * a);
	// var t2 = (-1 * b - discr) / (2 * a);
	
	// if(t1 < t2) // return the point with the smallest tValue
		// return add(p, mult(t1, d));
	// else
	// {
		// return add(p, mult(t2, d));
	// }
// }

// This equation was given to us by Dr. Edwards
// way back when we were doing the billiards project
function reflect(u, v){
	return subtract(v, mult(2, mult(dot(u, v), u)));
}

// Normal for sphere centered at 0,0,0
function normal(u){
	return u;
}

// Phong shading equation, from the hierarchy example 
// by Dr. Edwards. Translated to Javascript (with MV.js)
// by Cody Bramlette
function phong(phongEye, q, n, r, objColor){
	 // Material properties
      // var ka = vec3(0.5, 0.0, 0.0);
      // var kd = vec3(0.5, 0.5, 0.5);
      // var ks = vec3(1.0, 1.0, 1.0);
	  var ka = objColor;
      var kd = objColor;
      var ks = objColor;
	  //return n.map(Math.abs);

	  // Different colored objects
	  // if(isPlane) {
		// ka = vec3(1.0, 0.0, 1.0);
	  // }
	  // if(isSphere2){
		  // ka = vec3(0.1, 0.1, 0.5);
	  // }

      // Light colors
      var La = vec3(1.0, 1.0, 1.0);
      var Ld = vec3(1.0, 1.0, 1.0);
      var Ls = vec3(1.0, 1.0, 1.0);

      // Set the light position
      var lightPosition = vec3(5, 5, 5);

      // Light direction in eye coordinates
      var l = subtract(lightPosition, q);
	  //var l = lightPosition;
      l = normalize(l);

      // normal in eye coordinates
      var na = n ;

      // specular values
      var alpha = 10;
      var v = normalize(subtract(phongEye, q));
      var ra = mult(Math.max(dot(l, n), 0.0), mult(n, vec3(2.0, 2.0, 2.0)));//, -l);

      var ambient = mult(ka, La);
	  
      var diffuse = mult(kd, mult(Ld, Math.max(dot(n, l), 0.0)));
	  //diffuse = mult(kd, Ld);
	  //var dotNandL = Math.max(dot(n, l), 0.0);
	  //diffuse = mult(diffuse, dotNandL);
	  //diffuse = vec3((n[0] + 1)/2, 0, 0);

	  var s1 = Math.pow(Math.max(dot(r,v), 0.0), alpha);

      var specular = mult(ks, mult(Ls, Math.max(s1, 0.0)));

      //var lcolor = add(ambient, add(diffuse, specular));
		lcolor = diffuse;
	  if(lcolor[0] > 1) lcolor[0] = 1;
	  if(lcolor[1] > 1) lcolor[1] = 1;
	  if(lcolor[2] > 1) lcolor[2] = 1;

	return lcolor;//vec3(1,0,0);
	return n.map(Math.abs);
	return l.map(Math.abs);
}
