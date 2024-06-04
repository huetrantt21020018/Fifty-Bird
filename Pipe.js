PIPE_DISTANCE_X = 180;
PIPE_DISTANCE_Y = 140;
PIPE_HEIGHT = 288;
PIPE_WIDTH = 78;
PADDING_X = 6;
PADDING_Y = 12;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomSlightly() {
    return getRandomArbitrary(-20, 20);
}

var Pipe = cc.Sprite.extend({
    topPipe: null,
    bottomPipe: null,
    _x: null,
    _isPassed: false,
    _isFading: false,

    ctor:function (x) {
        this._super();

        this.topPipe = new cc.Sprite(res.pipe_png);
        this.topPipe.setScaleY(-1);
        this.addChild(this.topPipe);

        this.bottomPipe = new cc.Sprite(res.pipe_png);
        this.addChild(this.bottomPipe);

        this.init(x);

        this.scheduleUpdate();
    },

    init:function (x) {
        var gap = PIPE_DISTANCE_Y + getRandomSlightly();
        TOP_MAX_Y = Math.min(3 * PIPE_HEIGHT / 2 + gap, MW.HEIGHT + PIPE_HEIGHT / 2) - 20;
        TOP_MIN_Y = MW.HEIGHT - PIPE_HEIGHT / 2 + 20;

        this.topPipe.setPosition(x, getRandomArbitrary(TOP_MIN_Y, TOP_MAX_Y));
        this.bottomPipe.setPosition(x, this.topPipe.y - PIPE_HEIGHT - gap);
        this._isPassed = false;
        this._x = this.topPipe.x;

        if(this._isFading) {
            this.topPipe.stopAllActions();
            this.topPipe.setRotation(0);
            this.topPipe.setOpacity(255);

            this.bottomPipe.stopAllActions();
            this.bottomPipe.setRotation(0);
            this.bottomPipe.setOpacity(255);

            this._isFading = false;
        }
    },
    update:function (dt) {
        if(MW.STATE != MW.GAME_STATE.PLAYING) return;
        var deltaX = dt * GAME_SPEED;
        if(deltaX > NORMAL_SPEED) {
            // using dash skill --> ease action
            var moveByT = cc.moveBy(dt, cc.p(-deltaX, 0));
            var moveByB = cc.moveBy(dt, cc.p(-deltaX, 0));
            this.topPipe.runAction(moveByT);
            this.bottomPipe.runAction(moveByB);
        } else {
            this.topPipe.x -= deltaX;
            this.bottomPipe.x -= deltaX;
        }
        this._x = this.topPipe.x;
    },

    isBlew: function (x, y) {
        if(this._isFading) return false;
        var birdRect = cc.rect(x - BIRD_WIDTH * 2.5, y - BIRD_HEIGHT * 2.5, BIRD_WIDTH * 5, BIRD_HEIGHT * 5);
        var pipeRect =  cc.rect(this._x - PIPE_WIDTH / 2, 0, PIPE_WIDTH, MW.HEIGHT);
        if(cc.rectIntersectsRect(birdRect, pipeRect)) {
            return true;
        }
        return false;
    },

    blew: function(direction) {
        this._isFading = true;

        var topFade = cc.fadeOut(ANIMATION_TIME);
        var botFade = cc.fadeOut(ANIMATION_TIME);
        var topRotate = cc.rotateBy(ANIMATION_TIME, direction * 45);
        var botRotate = cc.rotateBy(ANIMATION_TIME, -direction * 45);

        this.topPipe.runAction(cc.spawn(topFade, topRotate));
        this.bottomPipe.runAction(cc.spawn(botFade, botRotate));
    },

    isCollide:function (x, y) {
        if(this._isFading) return false;

        var birdRect = cc.rect(x - BIRD_WIDTH / 2 + PADDING_X, y - BIRD_HEIGHT / 2, BIRD_WIDTH - 2 * PADDING_X, BIRD_HEIGHT);
        var topRect =  cc.rect(this._x - PIPE_WIDTH / 2, this.topPipe.y - PIPE_HEIGHT / 2, PIPE_WIDTH, PIPE_HEIGHT);
        var bottomRect = cc.rect(this._x - PIPE_WIDTH / 2, this.bottomPipe.y - PIPE_HEIGHT / 2, PIPE_WIDTH, PIPE_HEIGHT);

        if(cc.rectIntersectsRect(birdRect, topRect) || cc.rectIntersectsRect(birdRect, bottomRect)) {
            return true;
        }
        return false;
    },

    pass: function() {
        this._isPassed = true;
    },

    isPass:function (x, y) {
        if(this._isPassed) return false;
        return (x > this._x + PIPE_WIDTH / 2);
    },

    isOutOfScreen:function (x, y) {
        return (this._x + PIPE_WIDTH < 0);
    }
});
