

var CountdownLayer = cc.Layer.extend({
    _countdown: 3, // Starting countdown number
    _countdownLabel: null,

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        //cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);

        winSize = cc.director.getWinSize();

        this.initBackGround();

        this._countdownLabel = new cc.LabelTTF(this._countdown.toString(), "Arial", 64);
        this._countdownLabel.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(this._countdownLabel);

        this.schedule(this.updateCountdown, 1.0);

        /*
        if (MW.SOUND) {
            cc.audioEngine.setMusicVolume(0.7);
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        }*/

        return true;
    },

    updateCountdown: function() {
        if (this._countdown > 0) {
            this._countdown--;
            this._countdownLabel.setString(this._countdown.toString());
        } else {
            this.unschedule(this.updateCountdown);
            this.onNewGame();
        }
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
        // cc.audioEngine.stopMusic();
        // cc.audioEngine.stopAllEffects();
        cc.director.runScene(new cc.TransitionFade(1.2, GameLayer.scene()));
    },
});

CountdownLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new CountdownLayer();
    scene.addChild(layer);
    return scene;
};
