
var GameOver = cc.Layer.extend({
    _score:0,

    ctor:function(score){
        this._super();
        this._score = score;
        this.init();
    },
    init:function () {
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
        var newGameText = new ccui.Text("Press Enter to Play Again", res.flappy_ttf, 20);

        var newGame = new cc.MenuItemLabel(newGameText, function () {
            this.onPlayAgain();
        }, this);

        newGame.scale = MW.SCALE;

        var menu = new cc.Menu(newGame);
        menu.alignItemsVerticallyWithPadding(15);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = winSize.height / 2 - 140;

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
        //cc.audioEngine.stopMusic();
        //cc.audioEngine.stopAllEffects();
        this.unscheduleAllCallbacks();
        this.removeAllChildren(true);
        cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
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
