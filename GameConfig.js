var MW = MW || {};
MW.HEIGHT = 432;
MW.WIDTH = 720;

//game state
MW.GAME_STATE = {
    PLAYING:0,
    GAME_OVER:1,
    PAUSED:2,
    STARTING: 3,
};
MW.STATE = MW.GAME_STATE.GAME_OVER;


//sound
MW.SOUND = true;

MW.SCALE = 1.5;

MW.SKILL_TYPE = {
    NONE:0,
    DASH:1,
    POWER:2,
};

MW.SKILL_STATUS = {
    USING: 1,
    READY: 2,
    NONE: 0,
}

DIRECTION = {
    UP: 1,
    DOWN: -1,
    CHANGE: 0,
}

INIT_SPEED = 60;
DASH_SPEED = 500;
POWER_SPEED = 100;
GAME_SPEED = INIT_SPEED;
NORMAL_SPEED = 2;

ANIMATION_TIME = 0.2
/*
TODO:
1. Đổi font chữ
*/