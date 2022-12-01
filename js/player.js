class Player {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.velocity = 8;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	draw(mouseX, mouseY, ctx) {
		let playerAngle = Math.atan2(mouseY - this.y, mouseX - this.x);
		let perspective = 0.5 * Math.PI;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x + this.width * Math.cos(playerAngle) + perspective, this.y + this.width * Math.sin(playerAngle) + perspective);
		ctx.lineTo(
			this.x - this.width * Math.cos(playerAngle) - this.height * Math.sin(playerAngle),
			this.y - this.width * Math.sin(playerAngle) + this.height * Math.cos(playerAngle)
		);
		ctx.lineTo(
			this.x - this.width * Math.cos(playerAngle) + this.height * Math.sin(playerAngle),
			this.y - this.width * Math.sin(playerAngle) - this.height * Math.cos(playerAngle)
		);
		ctx.closePath();
		ctx.fill();
	}

	seek(target) {
		let desiredLocation = Math.atan2(target.y - this.y, target.x - this.x);
		let locationDistance = (Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)) ** 0.5;
		let arrivingRadius = 100;
		if (locationDistance > arrivingRadius) {
			this.x += Math.cos(desiredLocation) * this.velocity;
			this.y += Math.sin(desiredLocation) * this.velocity;
		} else {
			this.x += Math.cos(desiredLocation) * this.velocity * (locationDistance / arrivingRadius);
			this.y += Math.sin(desiredLocation) * this.velocity * (locationDistance / arrivingRadius);
		}
	}

	collide(target, game) {
		let collisionDistance = Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2) ** 0.5;
		if (collisionDistance < this.width + target.width) {
			game.finishedGame.style.visibility = 'visible';
			game.canvas.style.cursor = 'default';
			game.circleCursor.style.visibility = 'hidden';
			game.finalScoreValue.innerHTML = game.score;
			game.pastScores.push(game.score);
			let highScore = Math.max(...game.pastScores);
			game.finalHighScoreValue.innerHTML = 'High Score:&nbsp;' + highScore;
			game.gameOver = true;
		}
	}
}
