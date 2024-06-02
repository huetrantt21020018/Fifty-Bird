BIRD_WIDTH = 36;
BIRD_HEIGHT = 24;
UP_SPEED = 270;
UP_GRAVITY = -600;
DOWN_GRAVITY = 400;
MAX_ANGLE = 40;
MIN_ANGLE = -30;
MIN_BIRD_Y = BIRD_HEIGHT / 2;
MAX_BIRD_Y = MW.HEIGHT - BIRD_HEIGHT / 2;
MIN_BIRD_POWER_Y = BIRD_HEIGHT * 2.5;
MAX_BIRD_POWER_Y = MW.HEIGHT - BIRD_HEIGHT * 2.5;

var Bird = cc.Sprite.extend({
    _speed:0,
    _gravity: 0,
    _direction: 0,
    _active:false,
    _angle: 0,
    idleAction: null,
    _dashStatus: MW.SKILL_STATUS.READY,
    _powerStatus: MW.SKILL_STATUS.READY,

    ctor:function () {
        this._super(res.bird_png);
        this.scheduleUpdate();

        var moveUp = cc.moveBy(0.5, cc.p(0, 20)).easing(cc.easeInOut(3));
        var moveDown = cc.moveBy(0.5, cc.p(0, -20)).easing(cc.easeInOut(3));
        this.idleAction = cc.repeatForever(cc.sequence(moveUp, moveDown));
        this.runAction(this.idleAction);
    },

    activateDashSkill: function() {
        if(this._dashStatus != MW.SKILL_STATUS.READY) return;

        var activateDash = cc.callFunc(function() {
            this._dashStatus = MW.SKILL_STATUS.USING;
            GAME_SPEED = DASH_SPEED;
            this._speed = 0;
        }, this);

        var usingDash = cc.delayTime(0.24);

        var deactivateDash = cc.callFunc(function() {
             this._dashStatus = MW.SKILL_STATUS.NONE;
             GAME_SPEED = INIT_SPEED;
        }, this);

        var cooldown = cc.delayTime(10);

        var readyDash = cc.callFunc(function() {
            this._dashStatus = MW.SKILL_STATUS.READY;
        }, this);

        var sequence = cc.sequence(activateDash, usingDash, deactivateDash, cooldown, readyDash);
        this.runAction(sequence);
    },

    activatePowerSkill: function() {
        if(this._powerStatus != MW.SKILL_STATUS.READY) return;

        var activatePower = cc.callFunc(function() {
            this._powerStatus = MW.SKILL_STATUS.USING;
            GAME_SPEED = POWER_SPEED;

            var zoomOutAction = cc.scaleTo(0.2, 5);
            this.runAction(zoomOutAction);
        }, this);

        var usingPower = cc.delayTime(5);

        var deactivatePower = cc.callFunc(function() {
            this._powerStatus = MW.SKILL_STATUS.NONE;
            GAME_SPEED = INIT_SPEED;

            var zoomInAction = cc.scaleTo(0.2, 1);
            this.runAction(zoomInAction);
        }, this);

        var cooldown = cc.delayTime(30);

        var readyPower = cc.callFunc(function() {
            this._powerStatus = MW.SKILL_STATUS.READY;
            this.setScale(1);
        }, this);

        var sequence = cc.sequence(activatePower, usingPower, deactivatePower, cooldown, readyPower);
        this.runAction(sequence);
    },

    update:function (dt) {
        if(!this._active || MW.STATE != MW.GAME_STATE.PLAYING) return;

        this._speed += this._gravity * dt;
        if(this._speed < 0) {
            // Đạt độ cao lớn nhất có thể và rơi xuống
            this._speed = 0;
            this._gravity = DOWN_GRAVITY;
            this._direction = DIRECTION.DOWN;
        }

        // Tính góc quay của con chim
        this._angle = Math.max(MIN_ANGLE, Math.min( this._speed * this._direction / (-7), MAX_ANGLE));
        this.setRotation(this._angle);

        // Tọa độ y mới của con chim
        var newY = this.y + this._speed * this._direction * dt;
        if(this._powerStatus != MW.SKILL_STATUS.USING) newY = Math.min(newY, MAX_BIRD_Y);
        else newY = Math.max(Math.min(newY, MAX_BIRD_POWER_Y), MIN_BIRD_POWER_Y);
        this.y = newY;
    },

    changeDirection: function() {
        if(!this._active) {
            this._active = true;
            this.stopAction(this.idleAction);
        }
        this._speed = UP_SPEED;
        this._gravity = UP_GRAVITY;
        this._direction = DIRECTION.UP;
    },

    fall:function () {
        var rotateTo = cc.rotateTo(0.1, MAX_ANGLE);
        this.runAction(rotateTo);
        var fallAction = cc.moveTo(1, cc.p(this.x, Math.min(MIN_BIRD_Y, this.y))).easing(cc.easeExponentialIn());
        this.runAction(fallAction);
    },

    hitTheGround: function () {
        if(this._powerStatus == MW.SKILL_STATUS.USING) return false;
        return (this.y <= MIN_BIRD_Y);
    }
});
