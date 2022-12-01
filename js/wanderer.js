class Wanderer {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.velocity = 4.5;
		this.wandererwidth = 12;
		this.wandererheight = 8;
		this.color = color;
		this.wanderPoint = {
			x: 0,
			y: 0,
		};
		this.wanderTheta = Math.PI / 2;
		this.seekPositionX;
		this.seekPositionY;
	}

	draw(ctx) {
		let playerAngle = Math.atan2(this.y - this.wanderPoint.y, this.x - this.wanderPoint.x) + Math.PI;
		let perspective = 0.5 * Math.PI;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(
			this.x + this.wandererwidth * Math.cos(playerAngle) + perspective,
			this.y + this.wandererwidth * Math.sin(playerAngle) + perspective
		);
		ctx.lineTo(
			this.x - this.wandererwidth * Math.cos(playerAngle) - this.wandererheight * Math.sin(playerAngle),
			this.y - this.wandererwidth * Math.sin(playerAngle) + this.wandererheight * Math.cos(playerAngle)
		);
		ctx.lineTo(
			this.x - this.wandererwidth * Math.cos(playerAngle) + this.wandererheight * Math.sin(playerAngle),
			this.y - this.wandererwidth * Math.sin(playerAngle) - this.wandererheight * Math.cos(playerAngle)
		);
		ctx.closePath();
		ctx.fill();
	}

	wander() {
		this.wanderTheta += (Math.random() * 0.4 - 0.2) / 2;
		this.wanderPoint.x = this.x + 20 * Math.cos(this.wanderTheta);
		this.wanderPoint.y = this.y + 20 * Math.sin(this.wanderTheta);

		this.seekPositionX = this.wanderPoint.x - this.x;
		this.seekPositionY = this.wanderPoint.y - this.y;

		let distance = (this.seekPositionX * this.seekPositionX + this.seekPositionY * this.seekPositionY) ** 0.5;

		this.seekPositionX /= distance;
		this.seekPositionY /= distance;

		this.seekPositionX *= this.velocity;
		this.seekPositionY *= this.velocity;

		this.x += Math.round(this.seekPositionX);
		this.y += Math.round(this.seekPositionY);
	}

	travelAcrossWall() {
		if (this.x < 0) {
			this.x = canvas.width;
		} else if (this.x > canvas.width) {
			this.x = 0;
		}

		if (this.y < 0) {
			this.y = canvas.height;
		} else if (this.y > canvas.height) {
			this.y = 0;
		}
	}
}

class MenuWanderer {
	constructor() {
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
	}

	setup() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		this.wanderer;

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}

		window.addEventListener('resize', resizeCanvas, false);
	}

	start() {
		this.wanderer = new Wanderer(canvas.width / 2, canvas.height / 2, 20, 10, '#ffffff');
	}

	draw() {
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.wanderer.draw(this.ctx);
		this.wanderer.wander();
		this.wanderer.travelAcrossWall();
		requestAnimationFrame(this.draw.bind(this));
	}
}
