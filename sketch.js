var gameState="play"
var score = 0;
var life = 3;
var Odepth, Pdepth;


function preload() {
    bgImage = loadImage("background-1.jpg")
    
    platformImg1 = loadImage("Platform 2.png")
    platformImg2 = loadImage("Platform3.png")
    commandoImage = loadAnimation("Commando/commando 1.png","Commando/commando 2.png", "Commando/commando 3.png",
                                    "Commando/commando 4.png","Commando/commando 5.png","Commando/commando 6.png")
    commandoDImage = loadAnimation("cD.png");
    commandoJImage = loadAnimation("cJ.png");
    villian1Img = loadAnimation("v1.png","v2.png","v3.png","v4.png","v5.png");
    villian1DImg = loadAnimation("vD.png");
    villian1WImg = loadAnimation("v3.png");
    bulletImg = loadImage("bullet.png");
    playImg = loadImage("play.png");
    gameOverImg = loadImage("GameOver.png");
    restartImg = loadImage("restart.png");
}

function setup(){

    createCanvas(windowWidth, windowHeight);

  //  var villian = createSprite(250, height-200, 50,80)
   // villian.addAnimation("vill",villian1Img);

    bg = createSprite(385,200,width,height)
    bg.addImage(bgImage);
    bg.scale = 2.35;
    bg.velocityX = -5

    commando = createSprite(130, height-200, 50,80)
    commando.scale = 0.5;
    commando.addAnimation("commando_running", commandoImage);
    commando.addAnimation("dead", commandoDImage);
    commando.addAnimation("jump", commandoJImage);

    invisibleGround = createSprite(width/2, height-50, width+100, 10)
    invisibleGround.visible= false;

    bulletsGroup = new Group()
    platformsGroup = new Group() 
    obstaclesGroup = new Group()
    newObstaclesGroup = new Group()

    play = createSprite(width/2, height/2)
    play.addImage(playImg);
    play.scale = 0.5;
    gameOver = createSprite(width/2, height/2);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 1.7;
    restart = createSprite(width/2, height/2+120);
    restart.addImage(restartImg);
    restart.scale = 0.05;
    play.visible = false;
    gameOver.visible = false;
    restart.visible = false;
}

function draw(){
    background("#EFA588");
    drawSprites();

    bg.velocityX = -(5+Math.round(score/10));

    commando.x = camera.position.x-200;

    fill("black")
    textSize(30);
    text("Score: "+ score, camera.position.x+400,40);
    text("Life: "+ life, camera.position.x-600,40);

    if(bg.x < 350) {
        bg.x = width/2;
    }
    
if(gameState==="play"){

    if(keyDown("up")) {
                commando.velocityY += -2; 
        }
    
    commando.velocityY += 0.8;

    if(keyWentDown("up")) {
        commando.changeAnimation("jump", commandoJImage);
    }

    if(keyWentUp("up")) {
        commando.changeAnimation("commando_running", commandoImage);
    }

    if(commando.y > height+100) {
        commando.y = invisibleGround.y; 
    }

    
    
    if(keyWentDown("space")){
        bullet = createSprite(commando.x+90,commando.y-35, 10,10)
        bullet.addImage(bulletImg)
        bullet.scale = 0.015;
        bullet.velocityX= 10;
        bulletsGroup.add(bullet);

    }

    spawnPlatforms();

    if(bulletsGroup.isTouching(obstaclesGroup)){
            //obstaclesGroup.setRotationEach(90)
            changeObstacle(villian1DImg,-7,500);
            score+= 10;
    }

     if(obstaclesGroup.isTouching(commando)){
        changeObstacle(villian1WImg,0,-1);
        life -= 1;
        Odepth = newObstaclesGroup[0].depth
        Pdepth = platformsGroup[0].depth
        gameState="end";
     }
        }
        if(gameState==="end"){
            commando.changeAnimation("dead", commandoDImage);
            commando.scale = 0.7;
            commando.velocityY=0;
            commando.y = invisibleGround.y - 20;
            bg.velocityX=0;
            obstaclesGroup.setVelocityXEach(0);
            platformsGroup.setVelocityXEach(0);
            obstaclesGroup.setLifetimeEach(-1);
            platformsGroup.setLifetimeEach(-1);

        if(life !== 0) {
            play.visible = true;
            Odepth = Pdepth+1;
            play.depth = Odepth+5;
            fill("red")
            stroke(0);
            textSize(50);
            text("Remaining life: " + life, camera.position.x-200,height/2-200);
            text("Click On Play to Continue", camera.position.x-250,height/2-100);

            if(mousePressedOver(play)){
                commando.changeAnimation("commando_running", commandoImage);
                commando.scale = 0.5;
                gameState="play";
                obstaclesGroup.destroyEach();
                platformsGroup.destroyEach();
                newObstaclesGroup.destroyEach();
                play.visible = false;
            }
        }
        else {
            gameOver.visible= true;
            restart.visible = true;
            Odepth = Pdepth+1;
            gameOver.depth = Odepth+5;
            restart.depth = Odepth+6;

            if(mousePressedOver(restart)) {
                location.reload();
            }
        }
            
        }

commando.collide(invisibleGround)
commando.collide(platformsGroup)


}

function spawnPlatforms() {
    
    if(frameCount % 150 === 0) {
        var y = Math.round(random(200,500));
        platform = createSprite(width, y, 100, 20)
        platform.velocityX = -(7 + Math.round(score/10));
        platform.scale = 0.3;
        platform.lifetime=300;

        var vY;
        var rand =  Math.round(random(1,2));
        if(rand ===1) {
            platform.addImage(platformImg1);
            vY = 95;
        }
        if(rand ===2) {
            platform.addImage(platformImg2);
            vY = 120;
        }
        platformsGroup.add(platform);

        obstacle = createSprite(width+50,y-vY,30,100);
        obstacle.addAnimation("villian1", villian1Img);
        obstacle.scale =  0.25;
        obstacle.velocityX = platform.velocityX;
        obstacle.lifetime=300;
        obstaclesGroup.add(obstacle);
        }
}
function changeObstacle(image, velocity, lifetime) {
            var v;
            if(velocity === 0) {
                v = 0;  }
            else { v = -(7+Math.round(score/10)); }
            var Vx = obstaclesGroup[0].x;
            var Vy = obstaclesGroup[0].y;
            obstaclesGroup.removeSprites();
            var newObstacle = createSprite(Vx,Vy,30,100)
            newObstacle.addAnimation("dead",image);
            newObstacle.scale=0.25;
            newObstacle.velocityX = v;
            newObstacle.lifetime = lifetime;
            newObstaclesGroup.add(newObstacle);
        }
