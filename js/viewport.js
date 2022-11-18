import * as util from "./util.js"

let viewport;

let focused;

export function setup(app){
    viewport = new pixi_viewport.Viewport({
        screenWidth: util.width,
        screenHeight: util.height,
        worldWidth: util.width,
        worldHeight: util.height,
        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });
    app.stage.addChild(viewport);

    viewport
    .drag()
    .pinch()
    .wheel()
    .decelerate();

    viewport.clamp({
        left: false,                // whether to clamp to the left and at what value
        right: false,               // whether to clamp to the right and at what value
        top: false,                 // whether to clamp to the top and at what value
        bottom: false,              // whether to clamp to the bottom and at what value
        direction: 'all',           // (all, x, or y) using clamps of [0, viewport.worldWidth / viewport.worldHeight]; replaces left / right / top / bottom if set
        underflow: 'center',	       // where to place world if too small for screen (e.g., top - right, center, none, bottomleft)
    });

    viewport.clampZoom({
        minScale: 1,                 // minimum scale
        maxScale: 50,                 // minimum scale
    })

    return viewport;
}


export function setFocus(body){
    
    if(body == focused){
        focused = undefined;
        viewport.plugins.remove('follow');
    }else{
        focused = body;
        let pos = new PIXI.Point(body.x, body.y);
        viewport.plugins.remove('follow');
        viewport.animate({
            time: 200,
            position: pos,
            scale: body.focusScale
        });
        setTimeout(()=>{
            viewport.follow(body.sprite);
        }, 200);
        
    }

    
}

export function resize(){
    viewport.resize(
        util.width,
        util.height,
        util.width,
        util.height,
    );

    viewport.screenWidth = util.width;
    viewport.screenHeight = util.height;
    viewport.worldWidth = util.width;
    viewport.worldHeight = util.height;
}




