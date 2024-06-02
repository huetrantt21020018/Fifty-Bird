

var SysMenu = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        winSize = cc.director.getWinSize();

        this.initBackGround();

        var nameGame = new cc.LabelTTF("Fifty Bird", "flappy", 48);
        nameGame.attr({
	        x: winSize.width / 2,
	        y: winSize.height / 3 * 2,
        });
        this.addChild(nameGame, 10);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;

        var newGame = new cc.LabelTTF("Press Enter", "flappy", 24);
        newGame.attr({
	        x: winSize.width / 2,
	        y: winSize.height / 3 * 2 - 50,
        });
        this.addChild(newGame, 10);

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
