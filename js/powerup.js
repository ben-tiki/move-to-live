class PowerUp {
	constructor(x, y, direction, type) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.yVelocity = 0.25;
		this.xVelocity = 0.25;
		this.type = type;
		this.width = 20;
		this.height = 20;
	}

	draw(ctx) {
		let powerUpIcon = new Image();
		switch (this.type) {
			case 'fire':
				powerUpIcon.src = '../img/powerup/round.png';
				break;
			case 'lightning':
				powerUpIcon.src = '../img/powerup/ligtning.png';
				break;
			case 'ice':
				powerUpIcon.src = '../img/powerup/ice.png';
				break;
		}
		ctx.drawImage(powerUpIcon, this.x, this.y, this.width, this.height);
	}

	bounce(powerUps) {
		for (let i = 0; i < powerUps.length; i++) {
			for (let j = 0; j < powerUps.length; j++) {
				if (i != j) {
					let powerUpDistance = (Math.pow(powerUps[i].x - powerUps[j].x, 2) + Math.pow(powerUps[i].y - powerUps[j].y, 2)) ** 0.5;
					if (powerUpDistance < powerUps[i].width) {
						powerUps[i].direction = Math.atan2(powerUps[i].y - powerUps[j].y, powerUps[i].x - powerUps[j].x);
						powerUps[j].direction = Math.atan2(powerUps[j].y - powerUps[i].y, powerUps[j].x - powerUps[i].x);

						powerUps[i].x += powerUps[i].xVelocity * Math.cos(powerUps[i].direction);
						powerUps[i].y += powerUps[i].yVelocity * Math.sin(powerUps[i].direction);

						powerUps[j].x += powerUps[j].xVelocity * Math.cos(powerUps[j].direction);
						powerUps[j].y += powerUps[j].yVelocity * Math.sin(powerUps[j].direction);
					}
				}
			}
		}
	}

	bounceWall() {
		if (this.x + this.width > canvas.width || this.x < 0) {
			this.direction = Math.PI - this.direction;

			this.x += this.xVelocity * Math.cos(this.direction);
			this.y += this.yVelocity * Math.sin(this.direction);
		}

		if (this.y + this.height > canvas.height || this.y < 0) {
			this.direction = -this.direction;

			this.x += this.xVelocity * Math.cos(this.direction);
			this.y += this.yVelocity * Math.sin(this.direction);
		}
	}

	move() {
		this.x += Math.cos(this.direction) * this.xVelocity;
		this.y += Math.sin(this.direction) * this.yVelocity;
	}

	fireExplostion(enemies) {
		let explosion = document.getElementById('explosion');
		explosion.style.visibility = 'visible';
		explosion.style.left = this.x + 'px';
		explosion.style.top = this.y + 'px';
		setTimeout(() => {
			explosion.style.visibility = 'hidden';
		}, 700);

		for (let i = 0; i < enemies.length; i++) {
			let enemyDistance = (Math.pow(this.x - enemies[i].x, 2) + Math.pow(this.y - enemies[i].y, 2)) ** 0.5;
			let enemyCount = 0;
			if (enemyDistance < 100) {
				enemies.splice(i, 1);
				enemyCount++;
				game.score += enemyCount * 100;
				game.enemiesDestroyed += enemyCount;
				game.scoreDisplayCombo.innerHTML = 'Score:&nbsp' + game.score;
				game.scoreDisplayValue.innerHTML = 'Dots Smashed:&nbsp' + game.enemiesDestroyed;
				i--;
			}
		}
	}

	consume(player, enemies, powerUps, game) {
		let powerUpDistance = (Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2)) ** 0.5;
		if (powerUpDistance < this.width + player.width) {
			this.fireExplostion(enemies, game);
			powerUps.splice(powerUps.indexOf(this), 1);
		}
	}
}
