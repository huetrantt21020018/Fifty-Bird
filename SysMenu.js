

var SysMenu = cc.Layer.extend({

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        //cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        winSize = cc.director.getWinSize();

        this.initBackGround();

        var nameGame = new ccui.Text();
        nameGame.attr({
	        string: "Fifty Bird",
	        font: res.flappy_ttf,
	        x: winSize.width  / 2,
	        y: 270,
	        fontSize: 30
        });
        this.addChild(nameGame, 1);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;
        var newGameText = new ccui.Text("Press Enter to Play", res.flappy_ttf, 20);

        var newGame = new cc.MenuItemLabel(newGameText, function () {
            this.onButtonEffect();
            this.onNewGame();
        }, this);


        newGame.scale = MW.SCALE;

        var menu = new cc.Menu(newGame);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 140;


        this.schedule(this.update, 0.1);

        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        }

        return true;
    },
    initBackGround:function()
    {
        var loadingBG = new cc.Sprite(res.background_png);
        loadingBG.anchorX = 0;
        loadingBG.anchorY = 0;
        loadingBG.setScale(MW.SCALE);
        this.addChild(loadingBG, 0, 1);
    },

    onNewGame:function (pSender) {
        //load resources
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        cc.director.runScene(new cc.TransitionFade(1.2, CountdownLayer.scene()));
    },
    update:function () {
        /*if (this._ship.y > 750) {
            this._ship.x = Math.random() * winSize.width;
	        this._ship.y = 10;
            this._ship.runAction(cc.moveBy(
                parseInt(5 * Math.random(), 10),
                cc.p(Math.random() * winSize.width, this._ship.y + 750)
            ));
        }*/
    },
    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.buttonEffet_wav : res.buttonEffet_mp3);
        }
    }
});

SysMenu.scene = function () {
    var scene = new cc.Scene();
    var layer = new SysMenu();
    scene.addChild(layer);
    return scene;
};
