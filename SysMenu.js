

var SysMenu = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        winSize = cc.director.getWinSize();

        this.initBackGround();

        var nameGame = new ccui.Text("Fifty Bird", res.flappy_ttf, 48);
        nameGame.attr({
	        x: winSize.width / 2,
	        y: winSize.height / 2,
        });
        nameGame.setVisible(true);
        this.addChild(nameGame, 10);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;

        var newGameText = new ccui.Text("Press Enter", res.flappy_ttf, 20);
        var newGame = new cc.MenuItemLabel(newGameText, function () {
            this.onNewGame();
        }, this);
        newGame.scale = MW.SCALE;

        var menu = new cc.Menu(newGame);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 140;

        /*cc.loader.load([res.marios_way], function (err, results) {
            if (err) {
                cc.log("Failed to load audio file: " + err);
            } else {
                cc.log("Audio file loaded successfully");
                cc.audioEngine.setMusicVolume(0.2);
                cc.audioEngine.playMusic(res.marios_way, true);
            }
        }); */

        this.addKeyboardListener();

        return true;
    },
    initBackGround:function()
    {
        var loadingBG = new cc.Sprite(res.background_png);
        loadingBG.anchorX = 0;
        loadingBG.anchorY = 0;
        loadingBG.setScale(MW.SCALE);
        this.addChild(loadingBG, 0, 1);

        var ground = new cc.Sprite(res.ground_png);
        ground.anchorX = 0;
        ground.anchorY = 0;
        ground.setScale(MW.SCALE);
        this.addChild(ground, 0, 1);
    },

    addKeyboardListener:function(){
        var self = this;
        cc.eventManager.addListener ({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                if(keyCode == cc.KEY.enter) {
                    self.onNewGame();
                    cc.audioEngine.playEffect(res.jump_wav);
                }
            }
        }, this);
    },

    onNewGame:function (pSender) {
        cc.audioEngine.stopAllEffects();
        cc.director.runScene(CountdownLayer.scene());
    },
});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};
