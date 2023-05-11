import * as util from "./util.js"
import {zoom} from "./background.js"

let viewport;

let focused;
let lastTimeout = null;


const focusAnimationTime = 1000; //포커스를 이동할 때 재생할 애니메이션의 길이
const modalAnimationTime = 600;

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
        direction: 'all',
        underflow: 'center',
    });

    viewport.clampZoom({
        minScale: 1,                 // minimum scale
        maxScale: 20,                 // minimum scale
    })


    viewport.on("zoomed", (e) => {
        zoom(e.viewport.scaled);
    });
    
    viewport.addChild(focusGraphic);

    return viewport;
}

let focusGraphic = new PIXI.Graphics();

export function setFocus(body){
    
    
    if(body == focused){
        focused = undefined;
        viewport.plugins.remove('follow');
        window.navigator.vibrate([1,75,3]);
        
        clearFocusGraphic();

        if(lastTimeout){
            clearTimeout(lastTimeout);
            lastTimeout = null;
        }
    }else{
        focused = body;
        window.navigator.vibrate(1);

        if(lastTimeout){
            clearTimeout(lastTimeout);
            lastTimeout = null;
        }

        viewport.plugins.remove('follow');
        
        lastTimeout = setTimeout(()=>{
            viewport.follow(body.sprite);
            window.navigator.vibrate([3,75,1]);
        }, focusAnimationTime);

        viewport.animate({
            time: focusAnimationTime,
            position: body.nextPos(focusAnimationTime),
            scale: body.focusScale,
            ease: 'easeOutCubic',
        });
        

        drawFocusGraphic();
    }
}

function clearFocusGraphic(){
    focusGraphic.clear();
}

function drawFocusGraphic(){
    focusGraphic.clear();
        focusGraphic.lineStyle({
            color: 0xf36e4c,
            width: 40,
            cap: PIXI.LINE_CAP.ROUND,
        });
    //focusGraphic.drawRect(-1000, -1000, 2000, 2000);

    for(let i = 0; i < 360; i += 15){
        let rad = i * Math.PI / 180;
        
        focusGraphic.moveTo(1100 * Math.cos(rad), 1100 * Math.sin(rad));
        focusGraphic.lineTo(1200 * Math.cos(rad), 1200 * Math.sin(rad));
    }


    focusGraphic.scale.set(util.screenMag * focused.scale);
    
    focusGraphic.position.x = focused.x;
    focusGraphic.position.y = focused.y;
}




let modalEnabled = false;

export function resize(){
    if(modalEnabled){
        viewport.resize(
            util.width,
            util.height / 2,
            util.width,
            util.height,
        );
    }else{
        viewport.resize(
            util.width,
            util.height,
            util.width,
            util.height,
        );
    }
    
}

export function modalup(){

    if(!focused){
        viewport.resize(
            util.width,
            util.height / 2,
            util.width,
            util.height,
        );
    }else{
        // let nextPosition = focused.nextPos(modalAnimationTime);
        // nextPosition.y += util.height / (4 * focused.focusScale);

        // if(lastTimeout){
        //     clearTimeout(lastTimeout);
        //     lastTimeout = null;
        // }

        // //viewport.plugins.remove('follow');
        // lastTimeout = setTimeout(()=>{
        //     viewport.resize(
        //         util.width,
        //         util.height / 2,
        //         util.width,
        //         util.height,
        //     );
            
        //     viewport.follow(focused.sprite);
        // }, modalAnimationTime);

        // viewport.animate({
        //     time: modalAnimationTime,
        //     position: nextPosition,
        //     scale: focused.focusScale,
        //     ease: 'easeInOutCubic',
        // });
        modalUpTransition = true;

    }
    modalEnabled = true;

}

export function modaldown(){
    if(!focused){
        viewport.resize(
            util.width,
            util.height,
            util.width,
            util.height,
        );
    }else{
        // let nextPosition = focused.nextPos(modalAnimationTime);
        // nextPosition.y -= util.height / (4 * viewport.scaled);
        
        // if(lastTimeout){
        //     clearTimeout(lastTimeout);
        //     lastTimeout = null;
        // }

        // //viewport.plugins.remove('follow');

        // lastTimeout = setTimeout(()=>{
        //     viewport.resize(
        //         util.width,
        //         util.height,
        //         util.width,
        //         util.height,
        //     );
            
        //     viewport.follow(focused.sprite);
            
        // }, modalAnimationTime);

        // viewport.animate({
        //     time: modalAnimationTime,
        //     position: nextPosition,
        //     ease: 'easeInOutCubic',
        // });

        modalDownTransition = true;
    }

    modalEnabled = false;
}

let modalUpTransition = false;
let modalDownTransition = false;
let transitionState = 1;
let transitonPerFrame = 2 / util.currentFPS;

let focusGraphicAngle = 0;
export function animate(){
    if(modalUpTransition){
        modalUpTrans();
    }
    if(modalDownTransition){
        modalDownTrans();
    }

    animateFocusGraphic();
}

function modalUpTrans(){
    transitionState += 2 / util.currentFPS;
    if(transitionState < 2){
        viewport.resize(
            util.width,
            util.height / transitionState,
            util.width,
            util.height,
        );
    }else{
        modalUpTransition = false;
        viewport.resize(
            util.width,
            util.height / 2,
            util.width,
            util.height,
        );
        transitionState = 2;
    }
    console.log('모달 업 중');
}

function modalDownTrans(){
    transitionState -= 2 / util.currentFPS;
    if(transitionState > 1){
        viewport.resize(
            util.width,
            util.height / transitionState,
            util.width,
            util.height,
        );
    }else{
        modalDownTransition = false;
        viewport.resize(
            util.width,
            util.height,
            util.width,
            util.height,
        );
        transitionState = 1;
    }
}

function animateFocusGraphic(){
    if(focused){
        focusGraphic.position.x = focused.x;
        focusGraphic.position.y = focused.y;
        focusGraphicAngle += 10 / util.referenceFPS * util.animateSpeed;
        if(focusGraphicAngle > 360){
            focusGraphicAngle -= 360;
        }
        focusGraphic.angle = focusGraphicAngle;
    }
}



