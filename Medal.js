var Medal = cc.Sprite.extend({
    ctor:function (score) {
        if(!score) this._super();
        else if(score <= 5) this._super(res.bronze_medal_png);
        else if(score <= 10) this._super(res.sliver_medal_png);
        else this._super(res.gold_medal_png);
    },
});
