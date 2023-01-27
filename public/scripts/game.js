var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    zoom: 1,
    dom: {
        createContainer: true
    },
    plugins: {
        scene: [{
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
        },],
    },
    scene: [mainMenuSceneConfig, worldSceneConfig],
    parent: "gamecanvas",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
            //debug: true,
        },
    },
};

var game = new Phaser.Game(config);
