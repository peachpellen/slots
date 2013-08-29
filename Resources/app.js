// require Platino
var platino = require("co.lanica.platino");

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// Create a new window and make the app landscape
var gameWindow = Ti.UI.createWindow({
	backgroundColor:'blue',
	orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]
});

// create game view
var game = platino.createGameView();

// create a game scene
var scene = platino.createScene();

//add your scene to game view
game.pushScene(scene);
/////////////////////////////
// Add transform for the lever
var transform  = platino.createTransform();
transform.duration = 1000;
transform.y = 50

// User is allowed to spin
var canSpin = true

// Variable for the original Y of the lever
var oY

// Variable for keeping track of coins
var coins = 100

// Background
var bg = platino.createSprite({image:"graphics/bg.png"})
scene.add(bg)

// Reel spritesheets
var reel1 = platino.createSpriteSheet({image:"graphics/reelSpin.png", x:28, y:5, height:338, width:116})
scene.add(reel1)
var reel2 = platino.createSpriteSheet({image:"graphics/reelSpin.png", x:144, y:5, height:338, width:116})
scene.add(reel2)
var reel3 = platino.createSpriteSheet({image:"graphics/reelSpin.png", x:260, y:5, height:338, width:116})
scene.add(reel3)

// Dimmers at top and bottom of screen
var borders = platino.createSprite({image:"graphics/mask.png"})
scene.add(borders)

// Add the lever
var lever = platino.createSprite({image:"graphics/ball.png", x:404, y:50})
scene.add(lever)

// Add coin text
var coinText = platino.createTextSprite({text:"Coins: "+coins, fontSize:20, width:150, height:50, x:25,y:10})
scene.add(coinText)

// Add spin text and light
var spinText = platino.createTextSprite({text:"Spin:", fontSize:20, width:150, height:50, x:300, y:10})
scene.add(spinText)
var spinLight = platino.createSpriteSheet({image:"graphics/greenLight.png", width:35, height:35, x:350, y:5})
scene.add(spinLight)

// Function to check reels
checkReel = function(reel){
	if(reel.frame==0 || reel.frame==6 || reel.frame==8){
		reel.item = "cherry"
	}
	else if(reel.frame==2){
		reel.item = "bar"
	}
	else if(reel.frame==4){
		reel.item = "bell"
	}
	else if(reel.frame==10){
		reel.item = "melon"
	}
	else if(reel.frame==12){
		reel.item = "7"
	}
};

// Check reels, show particle effect if winning spin, allow user to spin again
checkWin = function(){
	checkReel(reel1)
	checkReel(reel2)
	checkReel(reel3)
	
	if(reel1.item==reel2.item&&reel1.item==reel3.item){
	var particle  = platino.createParticles({image:'graphics/coinBurst.pex'});
	scene.add(particle)
	particle.move(240, 160);
		// Award coins depending on match
		if(reel1.item=="cherry"){
			coins = coins + 50
		}
		else if(reel1.item=="melon"){
			coins = coins + 150
		}
		else if(reel1.item=="bell"){
			coins = coins + 350
		}
		else if(reel1.item=="bar"){
			coins = coins + 700
		}
		else if(reel1.item=="7"){
			coins = coins + 1000
		}
	// Update coin text	
	coinText.text = "Coins: "+coins
	}
	// If coins > 4 then user will be able to spin again
	if(coins>4){
		canSpin = true
		spinLight.frame = 0
	}
}

var frames =[0,2,4,6,8,10,12]
// Stop the reels one by one, then check if user has won
endRoll = function(){
	// Random values to stop at
	var reel1Random =  Math.floor((Math.random()*7))*2;
	var reel2Random =  Math.floor((Math.random()*7))*2;
	var reel3Random =  Math.floor((Math.random()*7))*2;
	reel1.pauseAt(reel1Random)
	setTimeout(function(){
		reel2.pauseAt(reel2Random)
	},500)
	setTimeout(function(){
		reel3.pauseAt(reel3Random)
	},1000)

	setTimeout(checkWin, 1250)
};

// Spin function
spin = function(){
	// If user is allowed to spin, spin the reels
	if(canSpin==true){
	canSpin = false
	spinLight.frame = 1
	reel1.animate(0, 13, 50, -1);
	reel2.animate(0, 13, 70, -1);
	reel3.animate(0, 13, 90, -1);
	
	// Stop the reels randomly between .8 and 2.5 seconds
	var ranVal =  Math.floor((Math.random()*2500)+800);
	setTimeout(endRoll, ranVal)
	
	// Deduct coins
	coins = coins - 5
	coinText.text = "Coins: "+coins
	}
};

////////////
game.addEventListener("touchstart", function(e){
	if(lever.contains(e.x,e.y)&&lever.y>45&&lever.y<245){
		oY = lever.y - e.y
	}
});
game.addEventListener("touchmove", function(e){
	if(lever.contains(e.x,e.y)&&lever.y>45&&lever.y<245){
		lever.y = e.y+oY
	}
});
////////////
// Listener to spin
game.addEventListener("touchend", function(e) {
	if(lever.y>230){
		spin()
	}
	transform.duration = lever.y*1.5
	lever.transform(transform)
});
////////////////////////////

game.addEventListener("onload", function(e) {
    
    game.TARGET_SCREEN = {width:480, height:320};
  // set screen size for your game (TARGET_SCREEN size)
        var screenScale = game.size.height / game.TARGET_SCREEN.height;
        game.screen = {width:game.size.width / screenScale, height:game.size.height / screenScale};
    
        game.touchScaleX = game.screen.width  / game.size.width;
        game.touchScaleY = game.screen.height / game.size.height;
    
    // Start the game
    game.start();
});

// Add objects and open game window
gameWindow.add(game);
gameWindow.open({fullscreen:true, navBarHidden:true});