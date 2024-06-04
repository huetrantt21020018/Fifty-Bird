

var res = {
    explosion_wav : 'res/Music/explosion.wav',
    hurt_wav : 'res/Music/hurt.wav',
    jump_wav : 'res/Music/jump.wav',
    score_wav : 'res/Music/score.wav',
    marios_way: 'res/Music/marios_way.mp3',

    pipe_png : 'res/pipe.png',
    ground_png : 'res/ground.png',
    bird_png : 'res/bird.png',
    background_png : 'res/background.png',

    gold_medal_png : 'res/gold_medal.png',
    sliver_medal_png : 'res/sliver_medal.png',
    bronze_medal_png : 'res/bronze_medal.png',

    flappy_ttf : 'res/fonts/flappy.ttf',
    font_ttf : 'res/fonts/font.ttf',
};

var g_mainmenu = [
    res.bird_png,
    res.ground_png,
    res.pipe_png,
    res.background_png,
    res.flappy_ttf,
    res.font_ttf,
];

var g_maingame = [
    res.background_png,
    res.bird_png,
    res.ground_png,
    res.pipe_png,

    res.font_ttf,
    res.flappy_ttf,
];

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}