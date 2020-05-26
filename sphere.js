var Sphere = function(center, radius, color){
	this.center = center;
	this.radius = radius;
	this.color = color;
}

Sphere.prototype.intersect = function(p, d){
	var retVal;
	var a;
	var b;
	var c;
	// Equation from page 588
	// Intersection checks 1st sphere, 2nd sphere and then plane
	// I know this is wrong, but I am working on fixing other issues
	a = dot(d, d);
	b =  2 * dot(d, subtract(p, this.center)); 
	c = dot(subtract(p, this.center), subtract(p, this.center)) - (this.radius * this.radius);
	var discr = (b * b) - (4 * a * c);
	if (discr < 0){
		return null;
	}
	
	//isSphere1 = true;
	discr = Math.sqrt(discr)
	var t1 = (-1 * b + discr) / (2 * a);
	var t2 = (-1 * b - discr) / (2 * a);
	
	if(t1 < t2) // return the point with the smallest tValue
		//return add(p, mult(t1, d));
		return t1;
	else
	{
		return t2;
		//return add(p, mult(t2, d));
	}

}

Sphere.prototype.normal = function(p){
	return normalize(subtract(p, this.center));
}