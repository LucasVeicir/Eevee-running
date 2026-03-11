let eve;
let eveRunning;
let edges;
let ground1, ground2;
let groundImage;
let invisibleGround;
let cloud;
let cloudImage;
let obstacle1
let score = 0;
let obstaclesGroup;
let cloudsGroup;
const PLAY = 1;
const END = 0;
let gameState = PLAY;
let restart;
let restartImg;
let gameOver;
let gameOverImg;
let jumpSound;
let checkpointSound;
let dieSound;

const GROUNDYOFFSET=74
function preload(){
    eveRunning=loadAnimation("pixil-frame-0.png", "pixil-frame-1.png", "pixil-frame-2.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    obstacle1 = loadImage("pixilart-drawing.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");
    jumpSound = loadSound("jump.mp3");
    checkpointSound = loadSound("checkPoint.mp3");
    dieSound = loadSound("die.mp3");
}
function setup(){
    createCanvas(windowWidth,windowHeight);
    eve = createSprite(50, height - 120, 20, 50);
    eve.addAnimation("running", eveRunning);
    eve.x=50;
    ground1=createSprite(width/2,height-GROUNDYOFFSET)
    ground1.addImage(groundImage);
    ground2 = createSprite(width/2+groundImage.width,height-GROUNDYOFFSET);
    ground2.addImage(groundImage)
    edges=createEdgeSprites();
    obstaclesGroup = new Group();
    cloudsGroup = new Group();
    invisibleGround = createSprite(width/2,height -GROUNDYOFFSET + 4,width*2,10);
    invisibleGround.visible = false;
    eve.setCollider("rectangle", 0, 0, 40, eve.height);
    gameOver = createSprite(width/2, height/2);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;
    restart = createSprite(width/2, height/2 +40);
    restart.addImage(restartImg);
    restart.scale = 0.5;
}
function draw(){
    background("white");

    text("Pontuação: "+score, width -200,100);
   
    if(gameState === PLAY){
        score += Math.max(1, Math.floor(getFrameRate()/ 60));
        if(score>0 && score% 1000 ===0){
            checkpointSound.play();
        }
        ground1.velocityX= -(4+3*score/100);
        ground2.velocityX = ground1.velocityX;

        if (ground1.x < -groundImage.width /2){
            ground1.x = ground2.x + groundImage.width;
        }

        if(ground2.x < -groundImage.width /2){
            ground2.x = ground1.x + groundImage.width;
        }
        if((touches.length>0 || keyDown("space")) && eve.collide(invisibleGround)){
            eve.velocityY= -12;
            jumpSound.play();
            touches = [];
        }
        eve.velocityY= eve.velocityY +0.8;
    
        spawnClouds();
        spawnObstacles(); 

        gameOver.visible = false;

        restart.visible = false;

        if(obstaclesGroup.isTouching(eve)){
            gameState = END;
            dieSound.play();
        }
    }
    else if(gameState === END){
        ground1.velocityX = 0;
        ground2.velocityX = 0;

        obstaclesGroup.setVelocityXEach(0);
        obstaclesGroup.setLifetimeEach(-1);

        cloudsGroup.setVelocityXEach(0);
        cloudsGroup.setLifetimeEach(-1);
        eve.velocityY = 0;
        gameOver.visible = true;
        restart.visible = true;

        if(touches.length > 0 || mousePressedOver(restart)){
        console.log("reiniciar o jogo")
        reset();
        touches = [];
        }
    }
   
    eve.collide(invisibleGround)

    drawSprites();
}

function spawnClouds(){
    if(frameCount % 60 === 0){
        cloud = createSprite(width, 100, 40, 10);
        cloud.addImage(cloudImage);
        cloud.y = Math.round(random(10,60));
        cloud.scale = 0.4;
        cloud.velocityX = -3;
        cloud.lifetime = width/6;

        cloud.depth = eve.depth;
        eve.depth = eve.depth + 1;

        cloudsGroup.add(cloud)
    }

}

function spawnObstacles(){
     if(frameCount % 120 === 0){
        obstacle = createSprite(width, height-100, 40, 10);
        obstacle.addImage(obstacle1);
        obstacle.y = Math.round(random(height-80,height-100));
        obstacle.velocityX = -3;
        obstacle.lifetime = width/6;

        obstacle.depth = eve.depth;
        eve.depth = eve.depth + 1;

        obstaclesGroup.add(obstacle)
    }

       
}
function reset(edges){
   gameState = PLAY;
   gameOver.visible = false;
   restart.visible = false;

   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();

   eve.changeAnimation("running", eveRunning);

   score = 0;

}

function windowResized(){
    resizeCanvas (windowWidth, windowHeight);
    ground.y = height - GROUNDYOFFSET;
    invisibleGround.y = height - GROUNDYOFFSET + 4
}

