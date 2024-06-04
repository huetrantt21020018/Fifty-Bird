
var GameOver = cc.Layer.extend({
    _score:0,


    ctor:function(score){
        this._super();
        this._score = score;
        this.init();
    },
    init:function () {
        this.initBackGround();

        var lostGame = new cc.LabelTTF("Oof! You lost!", "flappy", 48);
        lostGame.attr({
	        x: winSize.width / 2,
	        y: winSize.height / 4 * 3,
        });
        this.addChild(lostGame, 10);

        var lbScore = new cc.LabelTTF("Score: " + this._score, "flappy", 24);
        lbScore.attr({
	        x: this._score ? winSize.width / 2 + 60 : winSize.width / 2,
	        y: winSize.height / 3 * 2 - 50,
        });
        this.addChild(lbScore, 10);

        var medal = new Medal(this._score);
        medal.attr({
	        x: winSize.width / 2 - 60,
	        y: winSize.height / 3 * 2 - 68,
	        scaleX: 0.1,
	        scaleY: 0.1,
        });
        this.addChild(medal, 9);

        var newGame = new cc.LabelTTF("Press Enter to Play Again!", "flappy", 24);
        newGame.attr({
	        x: winSize.width / 2,
	        y: winSize.height / 4,
        });
        this.addChild(newGame, 10);

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
                    self.onPlayAgain();
                }
            }
        }, this);
    },

    onPlayAgain:function (pSender) {
        cc.audioEngine.playEffect(res.jump_wav);
        cc.director.runScene(CountdownLayer.scene());
    }
});

GameOver.scene = function (score) {
    var scene = new cc.Scene();
    var layer = new GameOver(score);
    scene.addChild(layer);
    return scene;
};
