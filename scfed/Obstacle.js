function Obstacle(init_x,init_y,init_radius,init_xvel) {
	this.x = init_x;
	this.y = init_y;
	this.radius = init_radius;

	this.xvel = init_xvel;

	this.draw = function() {
		ctx.drawImage(obsImage,this.x-this.radius,this.y-this.radius,2*this.radius,2*this.radius);
	};

	this.update = function(dt) {
		this.x += this.xvel * dt;

		if (this.x + 2*this.radius < 0) {
			this.x = CANVAS_WIDTH;
		}
		else if (this.x - 2*this.radius > CANVAS_WIDTH) {
			this.x = -2*this.radius;
		}
	};
	
	this.isTouchingMolecule = function(mol) {
		return Math.abs(this.x - mol.x) <= 0.5*mol.size + this.radius && Math.abs(this.y - mol.y) <= 0.5*mol.size + this.radius;
	}; 
}
