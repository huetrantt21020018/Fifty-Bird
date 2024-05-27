
var GameOver = cc.Layer.extend({
    _score:0,

    ctor:function(score){
        this._super();
        this._score = score;
        this.init();
    },
    init:function () {
        //cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        winSize = cc.director.getWinSize();

        this.initBackGround();

        var loseGame = new ccui.Text();
        loseGame.attr({
	        string: "OOF! YOU LOSE!",
	        font: res.flappy_ttf,
	        x: winSize.width  / 2,
	        y: 270,
	        fontSize: 30
        });
        this.addChild(loseGame, 1);

        var scoreLabel = new ccui.Text();
        scoreLabel.attr({
	        font: res.flappy_ttf,
	        x: winSize.width  / 2,
	        y: winSize.height / 2,
	        fontSize: 24
        });
        scoreLabel.setString("Score: " + this._score);
        this.addChild(scoreLabel);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;
        var newGameText = new ccui.Text("Press Enter to Play again", res.flappy_ttf, 20);

        var newGame = new cc.MenuItemLabel(newGameText, function () {
            //console.log("Play Game clicked");
            this.onButtonEffect();
            this.onPlayAgain();
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

    onButtonEffect:function(){
        if (MW.SOUND) {
            var s = cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.buttonEffet_wav : res.buttonEffet_mp3);
        }
    },

    onPlayAgain:function (pSender) {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        cc.director.runScene(new cc.TransitionFade(1.2, CountdownLayer.scene()));
    }
});

GameOver.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameOver();
    scene.addChild(layer);
    return scene;
};
