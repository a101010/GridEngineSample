var mainMenuSceneConfig  = {
    key: mainMenueSceneKey,
    active: true,
    preload: mainMenuPreload,
    create: mainMenuCreate,
};

function mainMenuPreload(){
    this.load.html('mainmenu', 'html/mainmenu.html');
}

function mainMenuCreate(){
    let element = this.add.dom(400, 600).createFromCache('mainmenu');
    let game = this.game;

    element.addListener('click');
    element.on('click', function(event){
        game.scene.stop('mainmenu');
        if (event.target.id === 'continueBtn'){
            initData = {mapKey: 'aa', initPos: {x: 10, y: 15 }};
            game.scene.start('world', initData);
        }
    });

    this.tweens.add({
        targets: element,
        y: 300,
        duration: 3000,
        ease: 'Power3'
    });
}
