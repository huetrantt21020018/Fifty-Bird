PIPE_DISTANCE_X = 150;
PIPE_DISTANCE_Y = 120;
PIPE_HEIGHT = 288;
PIPE_WIDTH = 70;
TOP_MAX_Y = cc.winSize.height / 2 + PIPE_HEIGHT / 2;
TOP_MIN_Y = - cc.winSize.height / 2 + PIPE_HEIGHT / 2 + PIPE_DISTANCE_Y;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

var Pipe = cc.Sprite.extend({
    topPipe: null,
    bottomPipe: null,
    _isPassed: false,

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
        TOP_MAX_Y = Math.min(3 * PIPE_HEIGHT / 2 + PIPE_DISTANCE_Y, cc.winSize.height + PIPE_HEIGHT / 2);
        TOP_MIN_Y = cc.winSize.height - PIPE_HEIGHT / 2;

    //   console.log("TOP_MAX_Y: ", TOP_MAX_Y);
    //   console.log("TOP_MIN_Y: ", TOP_MIN_Y);

        this.topPipe.setPosition(x, getRandomArbitrary(TOP_MIN_Y, TOP_MAX_Y));
        this.bottomPipe.setPosition(x, this.topPipe.y - PIPE_HEIGHT - PIPE_DISTANCE_Y);
        this.isPassed = false;

     //   console.log("topPipe: ", this.topPipe.y);
      //  console.log("bottomPipe: ", this.bottomPipe.y);
    },
    update:function () {
        this.topPipe.x--;
        this.bottomPipe.x--;
        if(this.topPipe.x + PIPE_WIDTH < 0) {
            this.init(LAST_X_PIPE - cc.winSize.width - PIPE_WIDTH);
        }
    },

    isCollide:function (x, y) {
        var birdRect = cc.rect(x, y, BIRD_WIDTH, BIRD_HEIGHT);
        var topRect =  cc.rect(this.topPipe.x - PIPE_WIDTH / 2 + 10, this.topPipe.y - PIPE_HEIGHT / 2 + 10, PIPE_WIDTH - 20, PIPE_HEIGHT - 20);
        var bottomRect = cc.rect(this.bottomPipe.x - PIPE_WIDTH / 2 + 10, this.bottomPipe.y - PIPE_HEIGHT / 2 + 10, PIPE_WIDTH - 20, PIPE_HEIGHT - 20);
        if(cc.rectIntersectsRect(birdRect, topRect)) {
            console.log("collide top pipe");
            return true;
        }
        if(cc.rectIntersectsRect(birdRect, bottomRect)) {
            console.log("collide bottom pipe");
            console.log(x, y);
            console.log(this.bottomPipe.x, this.bottomPipe.y);
            return true;
        }
        return false;
    },

    isPass:function (x, y) {
        if(this._isPassed) return false;
        this._isPassed = (x > this.topPipe.x + PIPE_WIDTH / 2 - 10);
        return this._isPassed;
    }
});
