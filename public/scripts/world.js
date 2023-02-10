var worldSceneConfig = {
    key: worldSceneKey,
    active: false,
    init: function(data) {
        this.initData = data;
    },
    preload: worldPreload,
    create: worldCreate,
    update: noCursorUpdate,
};


function parseMapActionLayer(scene, key) {
    let textData = scene.cache.text.get(key);
    let jsonData = JSON.parse(textData);
    jsonData.layers.forEach(layer => {
        if(layer.name === 'actions') {
            scene.mapActionLayer[key] = layer;
        }
    });
    scene.doorsprites = [];
    scene.mapActionLayer[key].objects.forEach(obj => {
        obj.properties.forEach(prop => {
            switch(prop.name){
                case "teleportTo" : {
                    let teleportTo = mapActionParser.teleportTo(prop);
                    let {x, y} = mapActionParser.objectCoordinates(obj);
                    let doorsprite = scene.physics.add.sprite(obj.x + 7, obj.y - 8, 'tiles', 820);
                    doorsprite.teleportTo = teleportTo;
                    doorsprite.setSize(12, 12, true);
                    doorsprite.setDepth(-1); // send to the back, we don't care what it looks like
                    scene.doorsprites.push(doorsprite);
                    console.log("found door at (" + x +", " + y + "): " + prop.value);
                }
                break;
            }
        });
    });
}


const aaMapKey = 'aa';
const aaMapUrl = 'maps/aa.json';
const bbMapKey = 'bb';
const bbMapUrl = 'maps/bb.json';
const ccMapKey = 'cc';
const ccMapUrl = 'maps/cc.json';

const mapActionParser = {
    teleportTo: function(property) { 
        const val = property.value.split(":");
        const coords = val[1].split(",");
        return {
            type: "teleportTo",
            mapKey: val[0],
            pos: { x: parseInt(coords[0]), y: parseInt(coords[1])},
        };
    },
    objectCoordinates: function (object) {
        return {
            x: Math.round(object.x / object.width), 
            y: Math.round(object.y / object.height),
        }
    },
};

function worldPreload(){
    if('preloadComplete' in this.initData && this.initData.preloadComplete) {
        return;
    }
    this.mapActionLayer = {};
    this.load.spritesheet('tiles', 'tilesets/tileset.png', {frameWidth: 16, frameHeight: 16} );
    
    this.load.tilemapTiledJSON(aaMapKey, aaMapUrl);
    this.load.text(aaMapKey, aaMapUrl);
    this.load.tilemapTiledJSON(bbMapKey, bbMapUrl);
    this.load.text(bbMapKey, bbMapUrl);
    this.load.tilemapTiledJSON(ccMapKey, ccMapUrl);
    this.load.text(ccMapKey, ccMapUrl);
    this.load.atlas('player', 'sprites/hero.png', 'sprites/hero.json');
    console.log("worldPreload done");
}

function worldCreate(){
    const scene = this;
    const game = this.game;
    this.cameras.main.fadeIn(2000);
    console.log("worldCreate");
    const { initPos, mapKey } = this.initData;
    console.log("mapKey: " + mapKey);
    console.log('makeTilemap');
    this.tileMap = this.make.tilemap({key: mapKey});
    console.log('addTilesetImage');
    this.tileMap.addTilesetImage("tileset", "tiles");
    
    console.log("create tilemap layers");
    for(let i = 0; i < this.tileMap.layers.length; i++){
        const layer = this.tileMap.createLayer(i, "tileset", 0, 0);
    }
    console.log("end create tilemap layers");

    parseMapActionLayer(this, mapKey);

    console.log("parsed the action layer");

    const playerWalkCycleAnimationRate = 6; // fps

    let playerIdleDownFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_idle_down_',
        start: 1,
        end: 1,
        zeroPad: 2
    });
    this.anims.create({
        key: "player_idle_down",
        frames: playerIdleDownFrames,
        repeat: -1,
    });

    let playerWalkingDownFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_walking_down_',
        start: 1,
        end: 2,
        zeroPad: 2
    });
    playerWalkingDownFrames.splice(1, 0, playerIdleDownFrames[0]);
    playerWalkingDownFrames.push(playerIdleDownFrames[0]);
    this.anims.create({
        key: "player_walking_down",
        frames: playerWalkingDownFrames,
        repeat: -1,
        frameRate: playerWalkCycleAnimationRate,
    });

    let playerIdleUpFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_idle_up_',
        start: 1,
        end: 1,
        zeroPad: 2
    });
    this.anims.create({
        key: "player_idle_up",
        frames: playerIdleUpFrames,
        repeat: -1,
    });


    let playerWalkingUpFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_walking_up_',
        start: 1,
        end: 2,
        zeroPad: 2
    });
    playerWalkingUpFrames.splice(1, 0, playerIdleUpFrames[0]);
    playerWalkingUpFrames.push(playerIdleUpFrames[0]);
    this.anims.create({
        key: "player_walking_up",
        frames: playerWalkingUpFrames,
        repeat: -1,
        frameRate: playerWalkCycleAnimationRate,
    });

    let playerIdleRightFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_idle_right_',
        start: 1,
        end: 1,
        zeroPad: 2
    });
    this.anims.create({
        key: "player_idle_right",
        frames: playerIdleRightFrames,
        repeat: -1,
    });

    let playerWalkingRightFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_walking_right_',
        start: 1,
        end: 2,
        zeroPad: 2
    });
    playerWalkingRightFrames.splice(1, 0, playerIdleRightFrames[0]);
    playerWalkingRightFrames.push(playerIdleRightFrames[0]);
    this.anims.create({
        key: "player_walking_right",
        frames: playerWalkingRightFrames,
        repeat: -1,
        frameRate: playerWalkCycleAnimationRate,
    });

    let playerIdleLeftFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_idle_left_',
        start: 1,
        end: 1,
        zeroPad: 2
    });
    this.anims.create({
        key: "player_idle_left",
        frames: playerIdleLeftFrames,
        repeat: -1,
    });

    let playerWalkingLeftFrames = this.anims.generateFrameNames('player', {
        prefix: 'hero_walking_left_',
        start: 1,
        end: 2,
        zeroPad: 2
    });
    playerWalkingLeftFrames.splice(1, 0, playerIdleLeftFrames[0]);
    playerWalkingLeftFrames.push(playerIdleLeftFrames[0]);
    this.anims.create({
        key: "player_walking_left",
        frames: playerWalkingLeftFrames,
        repeat: -1,
        frameRate: playerWalkCycleAnimationRate,
    });

    this.playerSprite = this.physics.add.sprite(400, 300, 'hero').play("player_idle_down");
    this.playerSprite.setSize(16, 16, true);
    this.playerSprite.lastDirection = "down";

    console.log("added player character sprite");

    this.physics.add.collider(this.playerSprite, this.doorsprites, function(playerSprite, doorsprite) {
        if(!scene.posChanged) {
            return;
        }
        var initData = {
            mapKey: doorsprite.teleportTo.mapKey, 
            initPos: doorsprite.teleportTo.pos,
        };
        scene.cameras.main.fadeOut(2000);
        game.scene.stop("world");
        //game.scene.remove("world");
        //game.scene.add("world", worldSceneConfig, true, initData);
        game.scene.start("world", initData);
        console.log("Exited through door to " 
            + initData.mapKey 
            + " (" + initData.initPos.x + "," + initData.initPos.y +")");
    });

    console.log("added collider");


    this.cameras.main.startFollow(this.playerSprite, true);

    this.lastPos = initPos;

    console.log("getting ready to create gridengine");

    const gridEngineConfig = {
        characters: [
            {
                id: 'player',
                sprite: this.playerSprite,
                startPosition: initPos,
            },
        ]
    };

    this.gridEngine.create(this.tileMap, gridEngineConfig);

    console.log("created grid engine");

    this.lastTime = Date.now();
    this.lastPosUpdateTime = this.lastTime;
    this.posChanged = false;

    //this.cursors = this.input.keyboard.createCursorKeys();
}

function worldUpdate(){
    let currentTime = Date.now();
    let pos = this.gridEngine.getPosition("player");
    let posChanged = pos.x !== this.lastPos.x || pos.y !== this.lastPos.y;
    this.posChanged = posChanged;
    let isNotMoving = !this.gridEngine.isMoving("player");
    
    // only let a new animation play if either position changed or not moving
    if (this.cursors.left.isDown && (isNotMoving || posChanged)) {
        if(this.playerSprite.anims.getName() !== "player_walking_left"){
            this.playerSprite.play("player_walking_left");
        }
        this.gridEngine.move("player", "left");
        this.playerSprite.lastDirection = "left";
    } else if (this.cursors.right.isDown && (isNotMoving || posChanged)) {
        if(this.playerSprite.anims.getName() !== "player_walking_right"){
            this.playerSprite.play("player_walking_right");
        }
        this.gridEngine.move("player", "right");
        this.playerSprite.lastDirection = "right";
    } else if (this.cursors.up.isDown && (isNotMoving || posChanged)) {
        if(this.playerSprite.anims.getName() !== "player_walking_up"){
            this.playerSprite.play("player_walking_up");
        }
        this.gridEngine.move("player", "up");
        this.playerSprite.lastDirection = "up";
    } else if (this.cursors.down.isDown && (isNotMoving || posChanged)) {
        if(this.playerSprite.anims.getName() !== "player_walking_down"){
            this.playerSprite.play("player_walking_down");
        }
        this.gridEngine.move("player", "down");
        this.playerSprite.lastDirection = "down";
    } else if (isNotMoving) {
        this.playerSprite.play("player_idle_" + this.playerSprite.lastDirection);
    }
    // else keep playing movement animation until sprite is not moving
    this.lastPos = pos; 
    this.lastTime = currentTime;
}

function noCursorUpdate(){
    this.playerSprite.anims.play("player_walking_down");
    this.gridEngine.move("player", "down");
}
