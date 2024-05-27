BIRD_WIDTH = 38;
BIRD_HEIGHT = 24;

var Bird = cc.Sprite.extend({
    speed:0,
    gravity: 10,
    direction: -1,
    active:false,
    /*bulletSpeed:MW.BULLET_SPEED.SHIP,
    HP:5,
    bulletTypeValue:1,
    bulletPowerValue:1,
    throwBombing:false,
    canBeAttack:true,
    isThrowingBomb:false,
    zOrder:3000,
    maxBulletPowerValue:4,
    appearPosition:cc.p(160, 60),
    _hurtColorLife:0,
    active:true,
    bornSprite:null,*/
    ctor:function () {
        this._super(res.bird_png);
        this.scheduleUpdate();
    },
    update:function (dt) {
        this.updateMove(dt);
        if(!this.active) return;
        this.speed += this.gravity;
        if(this.speed < 0) {
            this.speed = 0;
            this.gravity = 10;
            this.direction = -1;
        }
        this.y += this.speed * this.direction * dt;
        if(this.y < 0) this.y = 0;
        //console.log(this.y);

        /*if (this.HP <= 0) {
            this.active = false;
            this.destroy();
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
        }*/
    },
    updateMove:function(dt) {
        if ((MW.KEYS[cc.KEY.space])) {
            if(this.active) {
                //console.log("changed direction");
                this.speed = 240;
                this.gravity = -20;
                this.direction = 1;
            } else {
                this.active = true;
            }
        }
    },

    destroy:function () {
        /*MW.LIFE--;

        var explosion = Explosion.getOrCreateExplosion();
        explosion.x = this.x;
	    explosion.y = this.y;

        if (MW.SOUND) {
            cc.audioEngine.playEffect(cc.sys.os == cc.sys.OS_WINDOWS || cc.sys.os == cc.sys.OS_WINRT ? res.shipDestroyEffect_wav : res.shipDestroyEffect_mp3);
        }*/
    },

    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 2, w, h / 2);
    },
    initBornSprite:function () {
        /*this.bornSprite = new cc.Sprite("#ship03.png");
        this.bornSprite.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.bornSprite.x = this.width / 2;
	    this.bornSprite.y = this.height / 2;
        this.bornSprite.visible = false;
        this.addChild(this.bornSprite, 3000, 99999);*/
    },
    born:function () {
        //revive effect
        /*this.canBeAttack = false;
        this.bornSprite.scale = 8;
        this.bornSprite.runAction(cc.scaleTo(0.5, 1, 1));
        this.bornSprite.visible = true;
        var blinks = cc.blink(3, 9);
        var makeBeAttack = cc.callFunc(function (t) {
            t.canBeAttack = true;
            t.visible = true;
            t.bornSprite.visible = false;
        }.bind(this));
        this.runAction(cc.sequence(cc.delayTime(0.5), blinks, makeBeAttack));

        this.HP = 5;
        this._hurtColorLife = 0;
        this.active = true;*/
    }
});
