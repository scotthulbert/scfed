function Molecule(gapNo,init_y,speed,angle) {
	
	this.gapNo = gapNo;
	
	this.image = molImage;
	
	this.speed = speed;
	
	this.size = MOL_SIZE;
	
	this.x = getGapCoords(gapNo) + 0.5*GAP_WIDTH - MOL_OFFSET;
	this.y = init_y;
			
	//STATE CONSTANTS
	const NORMAL = 0;
	const EXPLODING = 1;

	//STATE OF THE MOLECULE
	this.state = NORMAL;

	//ANIMATION RELATED VARIABLES
	var animationTimer = 0;
	var explosionImageIndex = 0;
		
	//COS(ANGLE) AND SIN(ANGLE) WILL NOT CHANGE SO NO NEED TO RECALCULATE EVERY FRAME
	var cosAngle = Math.cos(angle);
	var sinAngle = Math.sin(angle);
	
	this.update = function(dt) {
		
		if (this.state == EXPLODING) {
			animationTimer += dt;

			if (animationTimer > 1/ANIMATION_FPS) {
				animationTimer -= 1/ANIMATION_FPS;

				explosionImageIndex++;
				
				if (explosionImageIndex == explosionImages.length) {
					this.remove();
				}
				else {
					this.image = explosionImages[explosionImageIndex];
				}
			}
		}
		else if (this.state == NORMAL) {
			this.y += this.speed * cosAngle * dt;
			this.x += this.speed * sinAngle * dt;
				
			if (angle == 0 && this.y + 0.5*this.size >= CANVAS_HEIGHT - BOTTOM_BIT_HEIGHT - GAP_HEIGHT) {
				this.explode();
			}		
			else if (this.y + 0.5*this.size >= CANVAS_HEIGHT - BOTTOM_BIT_HEIGHT) {
				fillForm(this.gapNo);
				this.remove();
			}
		}
	};

	this.draw = function() {
		ctx.drawImage(
			this.image,
			this.x - 0.5*this.size,
			this.y - 0.5*this.size,
			this.size,
			this.size
		);
	};

	this.explode = function() {
		this.state = EXPLODING;
		this.image = explosionImages[explosionImageIndex];
	};

	this.remove = function() {
		molecules.splice(
			molecules.indexOf(this), 1
		);
	};
}
