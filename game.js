let canvas = document.getElementById( "game" );
let context = canvas.getContext( "2d" ); // get access to html 

canvas.addEventListener("mousemove", function(event){
	ship.x = event.offsetX-25;
	ship.y = event.offsetY-13;
});

let background_img = new Image();
background_img.src = "background.png";
let asteroid = new Image();
asteroid.src = "asteroid.png";
let ship_img = new Image();
ship_img.src = "ship.png";
let firing_img = new Image();
firing_img.src = "firing.png";
let expl_img = new Image();
expl_img.src = "expl_sprite1.png";

let fire = [];
let ast = [];
let expl=[];
let timer = 0;
let ship={x:100, y:100};

background_img.onload = function () {
game();
}

function game() {
	update();
	render();
	requestAnimationFrame(game);
}

function update() { //physics
	timer++;
	//explosion animation
	for (i in expl){
		expl[i].animx=expl[i].animx+0.5;
		if (expl[i].animx>4) {expl[i].animy++; expl[i].animx=0}
		if (expl[i].animy>4)
		expl.splice(i,1);
	}
	if (timer%10 == 0){ //spawn asteroids
		ast.push({
		x:Math.random()*600, 
		y:-50, 
		dx:Math.random()*5-1, 
		dy:Math.random()*2+2,
		del:0});
	}
	for (i in ast){ //asteroids moving
	ast[i].x += ast[i].dx;
	ast[i].y += ast[i].dy;  
	
 	if (ast[i].x >= 550 || ast[i].x < 0) ast[i].dx =- ast[i].dx; //border and reflection
	if (ast[i].y >= 620) ast.splice(i,1);	
	
	//clash check
	for (j in fire){
		if (Math.abs(ast[i].x+25-fire[j].x-15)<50 && Math.abs(ast[i].y-fire[j].y)<25){
			expl.push({x:ast[i].x-25, y:ast[i].y-25, animx:0, animy:0}); //happened
			ast[i].del=1;
			fire.splice(j,1);break;
		}
	}
	if (ast[i].del == 1) ast.splice(i,1);
	}
	
	if (timer%30 == 0){ 	// firing
		fire.push({x:ship.x+10, y:ship.y, dx: 0, dy: -5.2});
		fire.push({x:ship.x+10, y:ship.y, dx: 0.5, dy: -5});
		fire.push({x:ship.x+10, y:ship.y, dx: -0.5, dy: -5});
	}
	for (i in fire){ //firing moving 
		fire[i].x += fire[i].dx;
		fire[i].y += fire[i].dy;
		if (fire[i].y < -30) fire.splice(i,1);
	}
}

function render() {  //drawing
	context.drawImage(background_img, 0,0,600,600);
	context.drawImage(ship_img, ship.x, ship.y);
	for (i in fire) context.drawImage(firing_img, fire[i].x, fire[i].y, 30, 30);
	for (i in ast) context.drawImage(asteroid, ast[i].x, ast[i].y, 50, 50);
	for (i in expl) context.drawImage(expl_img, 100*Math.floor(expl[i].animx),100*Math.floor(expl[i].animy),100, 100, expl[i].x, expl[i].y, 80, 80);
	}

let requestAnimationFrame = (function(){
	return window.requestAnimationFrame 	||
		window.webkitRequestAnimationFrame  ||
		function(callback){
			window.setTimeout(callback, 1000/20);
		};
})();