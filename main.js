// variables
var shoot = document.getElementById("shoot");
var guard = document.getElementById("guard");
var reload = document.getElementById("reload");
var shotgun = document.getElementById("shotgun");

var messageText = document.getElementById("textboard-text");
var gamescreen = document.getElementById("container");
var winnerText = document.getElementById("winner");
var roundText = document.getElementById("round-text");
var roundNumber = document.getElementById("round");
	
var round = 1;

var test = true;


// objects
function Player(name, lastMove, ammo, won, turn, ammobelt) {
	this.name = name;
	this.lastMove = lastMove; // 0 = no move, 1 = shoot, 2 = guard, 3 = reload, 4 = shotgun
	this.ammo = ammo;
	this.won = won;	
	this.turn = turn;
 	this.ammobelt = document.getElementById(ammobelt);

	this.nextMove = function() {
		var nextMove = Math.floor((Math.random() * 4) + 1);
		
		switch(nextMove) {
			case 1:
				if (this.ammo > 0 && this.ammo < 3) {
					this.lastMove = 1;
					break;
				}
			case 2:
				if (player.ammo > 0 && this.ammo != 3) {
					this.lastMove = 2;
					break;
				}
			case 3:
				if (this.ammo < 3) {
					this.lastMove = 3;
					break;
				}
			case 4:
				if (this.ammo >= 3) {
					this.lastMove = 4;
					break;	
				}
				else {
					this.nextMove();
			}
		}
	}

	this.reload = function() {
		game.ammoGraphic(this);
	
		if (this.turn) {
			game.print(this.name + " reloaded. +1 ammo.");
		}
	}	

	this.shoot = function(opponent) {
		if (this.turn) {
			this.ammo--;
			this.ammobelt.removeChild(this.ammobelt.lastChild);	

			if (opponent.lastMove != 2 && opponent.lastMove != 1 && opponent.lastMove != 4) { // spelet över om andra inte skyddar sig
				this.won = true;
				game.print(this.name + " shot " + opponent.name + ". " + this.name + " won!");
				setTimeout(function() {
					game.gameOver();
				}, 1000);
			}
			if (opponent.lastMove == 1) {
				game.print(this.name + " and " + opponent.name + " both shoot. Both lose a bullet!");
			}
			if (opponent.lastMove == 2) {
				game.print(this.name + " shot " + opponent.name + ". " + opponent.name + " guarded the shot!");
			}
		}
	}

	this.shotgun = function(opponent) {
		if (this.turn) {
			if(opponent.lastMove != 4) {
				for (i = 0; i < 3; i++){ 
					this.ammo--;
					this.ammobelt.removeChild(this.ammobelt.lastChild); 
				}	
				this.won = true;
				game.print(this.name + " shot " + opponent.name + " with the Shotgun! " + this.name + " won!");
				setTimeout(function() {
					game.gameOver();
				}, 1000);
			}
			else {
				this.ammo--;
				this.ammobelt.removeChild(this.ammobelt.lastChild);
				game.print("Both used Shotgun! Both lose a bullet!");
			}
		}
	}	

	this.guard = function() {
		if (this.turn) {
			game.print(this.name + " guarded");
		}
	}
}

function Graphic() {
	this.print = function(text) {
		text = text.replace(/AI/g, "<span style=\"color:red\">AI</span>");
		text = text.replace(/You/g, "<span style=\"color:green\">You</span>");

		if (player.won == false || ai.won == false) {	
			messageText.innerHTML = "<span style=\"opacity: 0.7\">" + messageText.innerHTML + "</span>";
			messageText.innerHTML = text + "<br>" + messageText.innerHTML;
		}
		else {
			messageText.innerHTML = text;
		}
	}

	this.ammoGraphic = function(current) {
		var ammoImg = document.createElement("img"); //Skapa bild
		var imgStyle = ammoImg.style;
		
		if(current.turn) {
			current.ammo++;
			current.ammobelt.appendChild(ammoImg); // lägg in bilden i ammobelt
			
			for (var i = 0; i < current.ammo; i++) {	
				if (player.turn) { 
					imgStyle.top = i * 22 + "px";
				}
				if (ai.turn) { 
					imgStyle.bottom = i * 22 + "px";
				}
			}		
		}

		ammoImg.src = "img/ammo.png"; // vilken bild
		return imgStyle;
	}

	this.actionOpacity = function() {
		if (player.ammo >= 3) {
			shotgun.style.opacity = 1;
		}
		else {
			shotgun.style.opacity = 0.3;	
		}

		if (player.ammo > 0) {
			shoot.style.opacity = 1;
		}
		else {
			shoot.style.opacity = 0.3;
		}
	}

	this.gameOver = function() {
		gamescreen.style.opacity = 0;
		let i = 0;

		let loop = setInterval(function() {
			gamescreen.style.opacity = i;
			i += 0.01;

			if (i == 0.2) {
				clearInterval(loop);
			}
		}, 20);

		gamescreen.style.pointerEvents = "auto";
			
		if (player.won) {
			winnerText.innerHTML = "<span style=\"color:green; top: 0;\">You</span> won! Click anywhere to play again!"
		}
		if (ai.won) {
			winnerText.innerHTML = "<span style=\"color:red; top: 0;\">AI</span> won. Click anywhere to play again!"
		}
	}
}




// initialize objects
var player = new Player("You", 0, 0, false, true, "ammobelt");
var ai = new Player("AI", 0, 0, false, false, "ammobelt-ai");
var game = new Graphic();



// Onclick listeners
shoot.onclick = function() {
	if (player.ammo >= 1) {	
		player.lastMove = 1;
		newRound();
	}
	else {
		game.print("Not enough ammo!");
	}
};

guard.onclick = function() {		
	player.lastMove = 2;
	newRound();
};

reload.onclick = function() {
	player.lastMove = 3;
	newRound();
};

shotgun.onclick = function() {
	if (player.ammo >= 3) {
		player.lastMove = 4;
		newRound();
	}
	else {
		game.print("Not enough ammo! (3 required)");
	}
}

gamescreen.onclick = function() {
	location.reload();
}


// Functions
function newRound() {
	roundNumber.innerHTML = round;
	messageText.innerHTML = "";
	ai.nextMove();

		player.turn = true;
		ai.turn = false;
		if (ai.won == false) {
			switch (player.lastMove) {
				case 1:
					player.shoot(ai);
					break;
				case 2:
					player.guard();
					break;
				case 3:
					player.reload();
					break;
				case 4:
					player.shotgun(ai);
					break;	
			}			
			game.actionOpacity(); 
		}
				
		player.turn = false;
		ai.turn = true;
		if (player.won == false) {
			switch (ai.lastMove) {
				case 1:
					ai.shoot(player);
					break;
				case 2:
					ai.guard();
					break;
				case 3:
					ai.reload();
					break;
				case 4:
					ai.shotgun(player);
					break;	
			}			
		}

	player.lastMove = 0;
	ai.lastMove = 0;
	round++;
}