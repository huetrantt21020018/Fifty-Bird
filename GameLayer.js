
STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;
LAST_X_PIPE = 0;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    //_time:null,
    _bird:null,
    _pipes:[],
    _numberOfPipe: 0,
    _score: 0,
    /*_backSky:null,
    _backSkyHeight:0,
    _backSkyRe:null,
    _levelManager:null,
    _tmpScore:0,
    _isBackSkyReload:false,
    _isBackTileReload:false,
    lbScore:null,
    screenRect:null,
    explosionAnimation:[],
    _beginPos:cc.p(0, 0),
    _state:STATE_PLAYING,
    _explosions:null,
    _texOpaqueBatch:null,
    _texTransparentBatch:null,
*/
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
       // console.log("return init game layer");
        this._numberOfPipe = Math.ceil(cc.winSize.width / PIPE_DISTANCE_X) + 1;
        this._state = STATE_PLAYING;

        this.initBackGround();

        this._pipes = [];
        for(var i = 0, curX = cc.winSize.width; i < this._numberOfPipe; i++) {
            var pipe = new Pipe(curX);
            this._pipes.push(pipe);
            this.addChild(pipe);
            curX += PIPE_DISTANCE_X;
            LAST_X_PIPE = curX;
        }

        this._bird = new Bird();
        this._bird.attr({
            x: cc.winSize.width / 3,
            y: cc.winSize.height / 2
        });
        this.addChild(this._bird);

        this.addKeyboardListener();
        this.scheduleUpdate();

        /*cc.spriteFrameCache.addSpriteFrames(res.textureOpaquePack_plist);
        cc.spriteFrameCache.addSpriteFrames(res.b01_plist);*/

        // score
        this.lbScore = new cc.LabelTTF("Score: 0", "Arial", 32);
        this.lbScore.attr({
            anchorX: 1,
            anchorY: 0,
            x: cc.winSize.width - 10,
            y: cc.winSize.height - 50
        });
        this.addChild(this.lbScore, 10);

        /*
        if (MW.SOUND)
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.bgMusic_wav : res.bgMusic_mp3, true);
        */
        //g_sharedGameLayer = this;

        return true;
    },
    /*addTouchListener:function(){
        //Add code here
        var self = this;
        cc.eventManager.addListener ({
            prevTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved: function (touches, event) {
                var touch = touches[0];
                if(self.prevTouchId != touch.getID()) {
                    self.prevTouchId = touch.getID();
                } else {
                    if(self._state == STATE_PLAYING) {
                        var delta = touch.getDelta();
                        var curPos = cc.p(self._bird.x, self._bird.y);
                        curPos = cc.pAdd(curPos, delta);
                        curPos = cc.Clamp(curPos, cc.p(0, 0), cc.p(winSize.width, winSize.height));
                        self._bird.x = curPos.x;
                        self._bird.y = curPos.y;
                        curPos = null;
                    }
                }
            }
        }, this)
    },*/

    addKeyboardListener:function(){
        //Add code here
        // console.log("called addKeyboardListener");
        var self = this;
        var dt = 0.00000001;
        cc.eventManager.addListener ({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                MW.KEYS[keyCode] = true;
                //console.log("pressed space keyboard");
                self._bird.updateMove(dt);
            },
            onKeyReleased: function(keyCode, event) {
                MW.KEYS[keyCode] = false;
                self._bird.updateMove(dt);
            }
        }, this);
    },
    /* scoreCounter:function () {
        if (this._state == STATE_PLAYING) {
            this._time++;
            this._levelManager.loadLevelResource(this._time);
        }
    },*/


    initBackGround:function() {
        var loadingBG = new cc.Sprite(res.background_png);
        loadingBG.anchorX = 0;
        loadingBG.anchorY = 0;
        loadingBG.setScale(MW.SCALE);
        this.addChild(loadingBG, 0, 1);
    },

    update:function () {
        //this._testNode.update(dt);
        //console.log("update game layer: ", this._state);
        if (this._state == STATE_PLAYING) {
            this.checkIsOver();
            //this.removeInactiveUnit(dt);
            //this.checkIsReborn();
            //this.updateUI();
            //this._movingBackground(dt);
        }
    },

    updateScore: function () {
        this._score += 1; // Update the score based on your game logic
        this.lbScore.setString("Score: " + this._score);
    },

    checkIsOver:function () {
        //console.log("inside collide function");
        var isOver = false;
        for(var i = 0; i < this._pipes.length; i++) {
            console.log("pipe: ", this._pipes[i].x, this._pipes[i].y)
            if(this._pipes[i].isCollide(this._bird.x, this._bird.y)) {
                isOver = true;
            }
            if(this._pipes[i].isPass(this._bird.x, this._bird.y)) {
                this.updateScore();
            }
        }
        if(this._bird.y <= 0) isOver = true;
        if(isOver) {
            this._state = STATE_GAMEOVER;
            //this._bird = null;
            this.runAction(cc.sequence(
                cc.delayTime(0.001),
                cc.callFunc(this.onGameOver, this)
            ));
            //console.log("Game Over");
        }
    },
/*    removeInactiveUnit:function (dt) {
        var i, selChild, children = this._texOpaqueBatch.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }

        children = this._sparkBatch.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }

        children = this._texTransparentBatch.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }
    }, */
/*    checkIsReborn:function () {
        var locbird = this._bird;
        if (MW.LIFE > 0 && !locbird.active) {
            locbird.born();
        } else if (MW.LIFE <= 0 && !locbird.active) {
            this._state = STATE_GAMEOVER;
            // XXX: needed for JS bindings.
            this._bird = null;
            this.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(this.onGameOver, this)
            ));
        }
    }, */
    /*updateUI:function () {
        if (this._tmpScore < MW.SCORE) {
            this._tmpScore += 1;
        }
        this._lbLife.setString(MW.LIFE + '');
        this.lbScore.setString("Score: " + this._tmpScore);
    },*/
/*    collide:function (a, b) {
	    var ax = a.x, ay = a.y, bx = b.x, by = b.y;
        if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(ax, ay);
        var bRect = b.collideRect(bx, by);
        return cc.rectIntersectsRect(aRect, bRect);
    }, */

/*    moveTileMap:function () {
        var backTileMap = BackTileMap.getOrCreate();
        var ran = Math.random();
        backTileMap.x = ran * 320;
	    backTileMap.y = winSize.height;
        var move = cc.moveBy(ran * 2 + 10, cc.p(0, -winSize.height-backTileMap.height));
        var fun = cc.callFunc(function(){
            backTileMap.destroy();
        },this);
        backTileMap.runAction(cc.sequence(move,fun));
    },
*/
 /*   _movingBackground:function(dt){
        var movingDist = 16 * dt;       // background's moving rate is 16 pixel per second

        var locSkyHeight = this._backSkyHeight, locBackSky = this._backSky;
        var currPosY = locBackSky.y - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if(locSkyHeight + currPosY <= winSize.height){
             if(locBackSkyRe != null)
                throw "The memory is leaking at moving background";
            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.y = currPosY + locSkyHeight - 5;
        } else
            locBackSky.y = currPosY;

        if(locBackSkyRe){
            //locBackSkyRe
            currPosY = locBackSkyRe.y - movingDist;
            if(currPosY + locSkyHeight < 0){
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.y = currPosY;
        }
    },
*/

    onGameOver:function () {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        var gameOverScene = new cc.Scene();
        var gameOverLayer = new GameOver(this._score);
        gameOverScene.addChild(gameOverLayer);
        cc.director.runScene(new cc.TransitionFade(1.2, gameOverScene));
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};
/*
GameLayer.prototype.addEnemy = function (enemy, z, tag) {
    this._texTransparentBatch.addChild(enemy, z, tag);
};

GameLayer.prototype.addExplosions = function (explosion) {
    this._explosions.addChild(explosion);
};

GameLayer.prototype.addBulletHits = function (hit, zOrder) {
    this._texOpaqueBatch.addChild(hit, zOrder);
};

GameLayer.prototype.addSpark = function (spark) {
    this._sparkBatch.addChild(spark);
};

GameLayer.prototype.addBullet = function (bullet, zOrder, mode) {
    this._texOpaqueBatch.addChild(bullet, zOrder, mode);
};
*/