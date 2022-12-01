class Enemy {
	constructor(x, y, width, height, color, velocity) {
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
		this.color = color;
		this.agressionRadius = 100;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(Math.round(this.x), Math.round(this.y), this.width, 0, Math.PI * 2);
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 3.5;
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}

	seek(target) {
		let desiredLocation = Math.atan2(target.y - this.y, target.x - this.x);
		let locationDistance = (Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)) ** 0.5;
		if (locationDistance > this.agressionRadius) {
			this.x += Math.cos(desiredLocation) * this.velocity;
			this.y += Math.sin(desiredLocation) * this.velocity;
		} else {
			this.x += Math.cos(desiredLocation) * this.velocity * ((locationDistance / this.agressionRadius) * 2);
			this.y += Math.sin(desiredLocation) * this.velocity * ((locationDistance / this.agressionRadius) * 2);
		}
	}

	avoidClipping(enemies) {
		for (let i = 0; i < enemies.length; i++) {
			for (let j = 0; j < enemies.length; j++) {
				if (i != j) {
					let otherEnemyDistance = (Math.pow(enemies[i].x - enemies[j].x, 2) + Math.pow(enemies[i].y - enemies[j].y, 2)) ** 0.5;
					if (otherEnemyDistance < enemies[i].width + enemies[j].width) {
						enemies[i].x += Math.cos(Math.atan2(enemies[i].y - enemies[j].y, enemies[i].x - enemies[j].x)) * 0.5;
						enemies[i].y += Math.sin(Math.atan2(enemies[i].y - enemies[j].y, enemies[i].x - enemies[j].x)) * 0.5;
					}
				}
			}
		}
	}
}
