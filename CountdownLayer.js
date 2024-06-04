

var CountdownLayer = cc.Layer.extend({
    _countdown: 5,
    _countdownLabel: null,

    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        winSize = cc.director.getWinSize();

        this.initBackGround();

        this._countdownLabel = new cc.LabelTTF(this._countdown.toString(), "flappy", 100);
        this._countdownLabel.setPosition(winSize.width / 2, winSize.height / 2);
        this.addChild(this._countdownLabel);

        this.schedule(this.updateCountdown, 1.0);

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

        var ground = new cc.Sprite(res.ground_png);
        ground.anchorX = 0;
        ground.anchorY = 0;
        ground.setScale(MW.SCALE);
        this.addChild(ground, 0, 1);
    },

    onNewGame:function (pSender) {
        this.unscheduleAllCallbacks();
        this.removeAllChildren(true);
        cc.director.runScene(GameLayer.scene());
    },
});

CountdownLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new CountdownLayer();
    scene.addChild(layer);
    return scene;
};
