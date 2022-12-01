class Game {
	constructor() {
		this.score = 0;
		this.enemiesDestroyed = 0;
		this.gameOver = false;
		this.paused = false;
		this.countdownEnded = false;
		this.scoreDisplay = document.getElementById('current-score-display');
		this.scoreDisplayCombo = document.getElementById('current-score-total');
		this.scoreDisplayValue = document.getElementById('current-score-dots');
		this.finalScoreValue = document.getElementById('final-score-value');
		this.finalHighScoreValue = document.getElementById('high-score');
		this.pauseElement = document.getElementById('paused');
		this.circleCursor = document.getElementById('circle-cursor');
		this.playAgain = document.getElementById('play-again');
		this.finishedGame = document.querySelector('.game-over');
		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.pastScores = [];
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.mouseX;
		this.mouseY;
		this.player;
		this.enemies = [];
		this.powerUps = [];
	}

	setUp() {
		// set canvas size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		this.width = canvas.width;
		this.height = canvas.height;

		function resizeCanvas() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			this.width = canvas.width;
			this.height = canvas.height;
		}

		window.addEventListener('resize', resizeCanvas, false);

		// set mouse position
		this.mouseX = this.width / 2;
		this.mouseY = this.height / 2;

		window.addEventListener('mousemove', this.setMousePosition.bind(this), false);

		// listen to restart button
		if (this.playAgain) {
			this.playAgain.addEventListener('click', () => {
				this.restart();
			});
		}

		// listen to events for pause
		this.watchPause();
	}

	setMousePosition(e) {
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;

		this.circleCursor.style.left = e.clientX + 'px';
		this.circleCursor.style.top = e.clientY + 'px';
	}

	watchPause() {
		window.addEventListener('keydown', (e) => {
			if (e.code === 'Space' && this.countdownEnded) {
				if (this.gameOver) {
					return;
				}

				this.paused = !this.paused;
				if (this.paused) {
					this.pauseElement.style.visibility = 'visible';
				} else {
					this.pauseElement.style.visibility = 'hidden';
					this.draw();
				}
			}
		});

		window.addEventListener('click', () => {
			if (this.paused) {
				this.paused = false;
				this.pauseElement.style.visibility = 'hidden';
				this.draw();
			}
		});

		window.addEventListener('blur', () => {
			if (this.countdownEnded && !this.gameOver) {
				this.paused = true;
				this.pauseElement.style.visibility = 'visible';
			}
		});
	}

	countDown() {
		let i = 3;
		let wrap = document.getElementById('wrap');
		function countdown(game) {
			wrap.className = '';
			if (i === 0) {
				let wrap = document.getElementById('wrap');
				let introduction = document.getElementById('introduction');
				let fade = setInterval(function () {
					if (!wrap.style.opacity) {
						wrap.style.opacity = 1;
						if (introduction) {
							introduction.style.opacity = 1;
						}
					}
					if (wrap.style.opacity > 0) {
						wrap.style.opacity -= 0.025;
						introduction.style.opacity -= 0.025;
					} else {
						clearInterval(fade);
						wrap.parentNode.removeChild(wrap);
						introduction.parentNode.removeChild(introduction);
						game.countdownEnded = true;
						if (game.scoreDisplay) {
							game.scoreDisplay.style.visibility = 'visible';
						}
					}
				}, 25);
				return;
			}
			setTimeout(function () {
				wrap.classList.add('wrap-' + i);
				setTimeout(function () {
					i--;
					countdown(game);
				}, 1000);
			}, 600);
		}
		countdown(this);
	}

	start() {
		this.setUp();
		this.player = new Player(this.width / 2, this.height / 2, 10, 8, '#ffffff');
		this.player.draw(this.mouseX, this.mouseY, this.ctx);
	}

	spawnEnemies() {
		setInterval(() => {
			if (this.countdownEnded && this.paused === false) {
				let safetyRadius = 200;
				let x = Math.random() * canvas.width;
				let y = Math.random() * canvas.height;
				let spaceshipDistance = (Math.pow(x - this.player.x, 2) + Math.pow(y - this.player.y, 2)) ** 0.5;
				if (spaceshipDistance > safetyRadius) {
					this.enemies.push(new Enemy(x, y, 5, 5, '#f01e2c', 4));
				} else {
					this.enemies.push(new Enemy(x + safetyRadius, y + safetyRadius, 5, 5, '#f01e2c', 4));
				}
			}
		}, 1000);
	}

	spawnPowerUps() {
		setInterval(() => {
			if (this.countdownEnded && this.paused === false) {
				let powerUpTypes = ['fire', 'lightning', 'ice'];
				if (this.powerUps.length < 5) {
					let powerUp = new PowerUp(
						Math.random() * canvas.width,
						Math.random() * canvas.height,
						Math.random() * 2 * Math.PI,
						powerUpTypes[0]
					);
					this.powerUps.push(powerUp);
				}
			}
		}, 4000);
	}

	draw() {
		if (this.gameOver) {
			this.scoreDisplay.style.visibility = 'hidden';
			return;
		} else if (this.paused) {
			return;
		} else {
			this.ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.player.draw(this.mouseX, this.mouseY, this.ctx);

			if (this.mouseX && this.mouseY) {
				let target = {
					x: this.mouseX,
					y: this.mouseY,
				};
				this.player.seek(target);
			}

			this.enemies.forEach((enemy) => {
				enemy.draw(this.ctx);
				enemy.seek(this.player);
				enemy.avoidClipping(this.enemies);
				this.player.collide(enemy, this);
			});

			this.powerUps.forEach((powerUp) => {
				powerUp.draw(this.ctx);
				powerUp.bounce(this.powerUps);
				powerUp.bounceWall();
				powerUp.move();
				powerUp.consume(this.player, this.enemies, this.powerUps, this.ctx, this);
			});

			requestAnimationFrame(this.draw.bind(this));
		}
	}

	restart() {
		this.gameOver = false;
		this.paused = false;
		this.pauseElement.style.visibility = 'hidden';
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.player.x = this.width / 2;
		this.player.y = this.height / 2;
		this.enemies = [];
		this.powerUps = [];
		this.score = 0;
		this.enemiesDestroyed = 0;
		this.scoreDisplayCombo.innerHTML = 'Score:&nbsp' + this.score;
		this.scoreDisplayValue.innerHTML = 'Dots Smashed:&nbsp' + this.enemiesDestroyed;

		this.finishedGame.style.visibility = 'hidden';
		this.circleCursor.style.visibility = 'visible';
		this.canvas.style.cursor = 'none';
		this.scoreDisplay.style.visibility = 'visible';

		this.draw();
	}
}
