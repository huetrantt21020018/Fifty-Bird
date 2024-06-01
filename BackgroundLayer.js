
var BackgroundLayer = cc.Sprite.extend({
    active:true,
    bg1: null,
    bg2: null,
    ground1: null,
    ground2: null,
    _scale: null,

    ctor:function () {
        this._super();

        this.bg1 = new cc.Sprite(res.background_png);
        this.bg2 = new cc.Sprite(res.background_png);

        this.ground1 = new cc.Sprite(res.ground_png);
        this.ground2 = new cc.Sprite(res.ground_png);

        this._scale = winSize.height / this.bg1.height;

        this.bg1.attr({
            x: this.bg1.width / 2,
            y: cc.winSize.height / 2,
            scaleX: this._scale,
            scaleY: this._scale
        });
        this.bg2.attr({
            x: this.bg1.width + this.bg2.width / 2,
            y: cc.winSize.height / 2,
            scaleX: this._scale,
            scaleY: this._scale
        });

        this.ground1.attr({
            x: this.ground1.width / 2,
            y: this.ground1.height / 2,
            scaleX: this._scale,
            scaleY: this._scale
        });
        this.ground2.attr({
            x: this.ground1.width + this.ground2.width / 2,
            y: this.ground1.height / 2,
            scaleX: this._scale,
            scaleY: this._scale
        });

        this.addChild(this.bg1);
        this.addChild(this.bg2);
        this.addChild(this.ground1);
        this.addChild(this.ground2);

        this.scheduleUpdate();

        return true;
    },
    destroy:function () {
        this.visible = false;
        this.active = false;
    },

    update:function (dt) {
        if(MW.STATE != MW.GAME_STATE.PLAYING && MW.STATE != MW.GAME_STATE.STARTING) return;
        deltaX = GAME_SPEED * dt / 2;
        if(deltaX > 2) {
            // using power skill --> ease action
            var moveByBg1 = cc.moveBy(dt, cc.p(-deltaX, 0));
            var moveByBg2 = cc.moveBy(dt, cc.p(-deltaX, 0));
            var moveByG1 = cc.moveBy(dt, cc.p(-deltaX, 0));
            var moveByG2 = cc.moveBy(dt, cc.p(-deltaX, 0));

            this.bg1.runAction(moveByBg1);
            this.bg2.runAction(moveByBg2);
            this.ground1.runAction(moveByG1);
            this.ground2.runAction(moveByG2);
        } else {
            this.bg1.x -= deltaX;
            this.bg2.x -= deltaX;
            this.ground1.x -= deltaX;
            this.ground2.x -= deltaX;
        }

        if (this.bg1.x <= -this.bg1.width) {
            this.bg1.x = this.bg2.x + this.bg1.width * this._scale;
        }

        if (this.bg2.x <= -this.bg2.width) {
            this.bg2.x = this.bg1.x + this.bg2.width * this._scale;
        }

        if (this.ground1.x <= -this.ground1.width) {
            this.ground1.x = this.ground2.x + this.ground1.width * this._scale;
        }

        if (this.ground2.x <= -this.ground2.width) {
            this.ground2.x = this.ground1.x + this.ground2.width * this._scale;
        }
    },
});

BackgroundLayer.create = function () {
    var background = new BackgroundLayer();
    g_sharedGameLayer.addChild(background, -10);
    return background;
};
