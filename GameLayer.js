
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _bird:null,
    _pipes:[],
    _nextPipe: null,
    _lastPipe: null,
    _firstPipe: null,
    _numberOfPipe: 0,
    _score: 0,
    lbPause: null,
    lbScore: null,
    lbDash: null,
    lbPower: null,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        var backgroundLayer = new BackgroundLayer();
        this.addChild(backgroundLayer);

        MW.STATE = MW.GAME_STATE.STARTING;

        // Khởi tạo các cột trong trò chơi
        this._numberOfPipe = Math.ceil(MW.WIDTH / PIPE_DISTANCE_X) + 1;
        this._pipes = [];
        for(var i = 0, curX = MW.WIDTH + PIPE_WIDTH; i < this._numberOfPipe; i++) {
            var pipe = new Pipe(curX);
            this._pipes.push(pipe);
            this.addChild(pipe);
            curX += PIPE_DISTANCE_X + getRandomArbitrary(-25, 25);
        }
        this._nextPipe = 0;
        this._firstPipe = 0;
        this._lastPipe = this._numberOfPipe - 1;

        this._bird = new Bird();
        this._bird.attr({
            x: MW.WIDTH / 3,
            y: MW.HEIGHT / 2
        });
        this.addChild(this._bird);

        this.addKeyboardListener();
        this.scheduleUpdate();

        // score
        this.lbScore = new cc.LabelTTF("Score: 0", res.flappy_ttf, 24);
        this.lbScore.attr({
            x: 90,
            y: MW.HEIGHT - 40
        });
        this.addChild(this.lbScore, 10);

        // Dash
        this.lbDash = new cc.LabelTTF("DASH", res.flappy_ttf, 15);
        this.lbDash.attr({
            x: 90,
            y: MW.HEIGHT - 70
        });
        this.lbDash.setVisible(false);
        this.addChild(this.lbDash, 10);

        // Power
        this.lbPower = new cc.LabelTTF("POWER", res.flappy_ttf, 15);
        this.lbPower.attr({
            x: 90,
            y: MW.HEIGHT - 100
        });
        this.lbPower.setVisible(false);
        this.addChild(this.lbPower, 10);

        // pause
        this.lbPause = new cc.LabelTTF("PAUSED", res.flappy_ttf, 15);
        this.lbPause.attr({
            x:  90,
            y: MW.HEIGHT - 130
        });
        this.lbPause.setVisible(false);
        this.addChild(this.lbPause, 10);

        return true;
    },

    addKeyboardListener:function(){
        var self = this;
        cc.eventManager.addListener ({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                cc.audioEngine.playEffect(res.jump_wav);
                if(MW.STATE == MW.GAME_STATE.PLAYING) {
                    switch(keyCode) {
                        case cc.KEY.p:
                        case cc.KEY.P:
                            MW.STATE = MW.GAME_STATE.PAUSE;
                            self.lbPause.setVisible(true);
                            self._bird.pause();
                            break;

                        case cc.KEY.right:
                            self._bird.activateDashSkill();
                            break;

                        case cc.KEY.left:
                            self._bird.activatePowerSkill();
                            break;

                        case cc.KEY.space:
                            self._bird.changeDirection();
                            break;

                        default:
                            break;
                    }
                } else if(MW.STATE == MW.GAME_STATE.PAUSE && (keyCode == cc.KEY.p || keyCode == cc.KEY.P)) {
                    MW.STATE = MW.GAME_STATE.PLAYING;
                    self.lbPause.setVisible(false);
                    self._bird.resume();
                } else if(MW.STATE == MW.GAME_STATE.STARTING && keyCode == cc.KEY.space) {
                    MW.STATE = MW.GAME_STATE.PLAYING;
                    self._bird.changeDirection();
                }
            },
        }, this);
    },

    update:function (dt) {
        this.lbDash.setVisible(this._bird._dashStatus == MW.SKILL_STATUS.READY);
        this.lbPower.setVisible(this._bird._powerStatus == MW.SKILL_STATUS.READY);

        if (MW.STATE == MW.GAME_STATE.PLAYING) {
            this.updatePipesAndScore();
            if(this.checkIsOver()) {
                MW.STATE = MW.GAME_STATE.GAME_OVER;
                this.runAction(cc.sequence(
                    cc.delayTime(0.001),
                    cc.callFunc(this.onGameOver(), this)
                ));
            }
        }
    },

    updateScore: function () {
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.setMusicVolume(1);
        cc.audioEngine.playEffect(res.score_wav);
        cc.audioEngine.setMusicVolume(0.7);
        this._score += 1;
        this.lbScore.setString("Score: " + this._score);
    },

    updatePipesAndScore: function () {
        if(this._bird._powerStatus == MW.SKILL_STATUS.USING) {
            // Đang sử dụng power skill --> các pipe trên đường đi bị blow
            if (this._pipes[this._nextPipe].isBlew(this._bird.x, this._bird.y)) {
                this._pipes[this._nextPipe].blew();
                this._pipes[this._nextPipe].pass();
                this.updateScore();
                this._nextPipe = (this._nextPipe + 1) % this._numberOfPipe;
            }
        }

        // Kiểm tra đã vượt qua thêm cột gần nhất chưa?
        if(this._pipes[this._nextPipe].isPass(this._bird.x, this._bird.y)) {
            this._pipes[this._nextPipe].pass();
            this.updateScore();
            this._nextPipe = (this._nextPipe + 1) % this._numberOfPipe;
        }

        // Kiểm tra cột đầu tiên vượt ra ngoài màn hình -> đưa cột đầu tiên xuống cuối
        if(this._pipes[this._firstPipe].isOutOfScreen()) {
            this._pipes[this._firstPipe].init(this._pipes[this._lastPipe]._x + PIPE_DISTANCE_X + getRandomArbitrary(-10, 25));
            this._lastPipe = this._firstPipe;
            this._firstPipe = (this._firstPipe + 1) % this._numberOfPipe;
        }
    },

    checkIsOver:function () {
        if(MW.POWER_STATUS == MW.SKILL_STATUS.USING) return false;

        // Kiểm tra va chạm với cột gần nhất
        if(this._pipes[this._nextPipe].isCollide(this._bird.x, this._bird.y)) return true;

        // Kiểm tra con chim rơi xuống đất
        if(this._bird.hitTheGround()) return true;

        return false;
    },

    onGameOver:function () {
        var fall = cc.callFunc(function() {
            cc.audioEngine.stopAllEffects();
            cc.audioEngine.playEffect(res.hurt_wav);
            this._bird.fall();
        }, this);

        var delay = cc.delayTime(1.2);

        var switchScene = cc.callFunc(function() {
            this.unscheduleUpdate();
            this.removeAllChildren(true);
            cc.director.runScene(GameOver.scene(this._score));
        }, this);

        var sequence = cc.sequence(fall, delay, switchScene);
        this.runAction(sequence);
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer);
    return scene;
};