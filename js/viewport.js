import * as util from "./util.js"
import {zoom} from "./background.js"

let viewport;

let focused;
let lastTimeout = null;

const focusAnimationTime = 1000; //포커스를 이동할 때 재생할 애니메이션의 길이

export function setup(app){
    viewport = new pixi_viewport.Viewport({
        screenWidth: util.width,
        screenHeight: util.height,
        worldWidth: util.width,
        worldHeight: util.height,
        interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        ticker : app.ticker
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
        maxScale: 20,                 // minimum scale
    })


    viewport.on("zoomed", (e) => {
        zoom(e.viewport.scaled);
    });

    return viewport;
}


export function setFocus(body){
    
    window.navigator.vibrate(1);
    if(body == focused){
        focused = undefined;
        viewport.plugins.remove('follow');
    }else{
        focused = body;

        if(lastTimeout){
            clearTimeout(lastTimeout);
            lastTimeout = null;
        }
        
        viewport.plugins.remove('follow');
        viewport.animate({
            time: focusAnimationTime,
            position: body.nextPos(focusAnimationTime),
            scale: body.focusScale,
            ease: 'easeOutCubic',
        });
        
        lastTimeout = setTimeout(()=>{
            viewport.follow(body.sprite);
            window.navigator.vibrate([2,50,1]);
        }, focusAnimationTime);

        
    }

    
}

export function resize(){
    viewport.resize(
        util.width,
        util.height,
        util.width,
        util.height,
    );
}





