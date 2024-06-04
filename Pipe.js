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
    _isFading: 0,
    _blowStatus: 0,

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

            this._isFading = 0;
            this._blowStatus = 0;
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

    /*
        blowStatus lưu lại thông tin cột nào bị va chạm và thổi bay
        bit 0 của blowStatus bằng 1 nếu cần thực hiện hiệu ứng thổi bay cho cột trên
        bit 1 của blowStatus bằng 1 nếu cần thực hiện hiệu ứng thổi bay cho cột dưới
        isFading tương tự lưu thông tin cột nào đã bị thổi bay rồi
        Chỉ cần thực hiện hiệu ứng trên cột nào có trạng thái bật bit ở blowStatus và tắt bit ở isFading
    */
    isBlew: function (x, y) {
        var birdRect = cc.rect(x - BIRD_WIDTH * 2.5, y - BIRD_HEIGHT * 2.5, BIRD_WIDTH * 5, BIRD_HEIGHT * 5);
        var topRect =  cc.rect(this._x - PIPE_WIDTH / 2, this.topPipe.y - PIPE_HEIGHT / 2, PIPE_WIDTH, PIPE_HEIGHT);
        var bottomRect = cc.rect(this._x - PIPE_WIDTH / 2, this.bottomPipe.y - PIPE_HEIGHT / 2, PIPE_WIDTH, PIPE_HEIGHT);
        this._blowStatus = (cc.rectIntersectsRect(birdRect, topRect) | (cc.rectIntersectsRect(birdRect, bottomRect) << 1));
        return this._blowStatus;
    },

    blew: function(direction) {
        if((this._isFading | this._blowStatus) == this._isFading) return;

        var topFade = cc.fadeOut(ANIMATION_TIME);
        var botFade = cc.fadeOut(ANIMATION_TIME);
        var topRotate = cc.rotateBy(ANIMATION_TIME, direction * 45);
        var botRotate = cc.rotateBy(ANIMATION_TIME, -direction * 45);

        if((~this._isFading & this._blowStatus) & 1) this.topPipe.runAction(cc.spawn(topFade, topRotate));
        if((~this._isFading & this._blowStatus) >> 1) this.bottomPipe.runAction(cc.spawn(botFade, botRotate));
        this._isFading |= this._blowStatus;
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

// suggest: background addChild pipe --> chỉ cần di chuyển background và pipe di chuyển theo
// pipe và background có tốc độ khác nhau --> nên áp dụng như thế nào ??
