import * as util from "./util.js"
import {zoom as bgZoom} from "./background.js"
import {zoom as cbZoom} from "./celestialbodies.js" 

let viewport;

export let focused;
let lastModalTimeout = null;

let focusGraphic = new PIXI.Graphics();     //포커스된 천체 주변에 표시될 효과
let focusGraphicAngle = 0;

const focusAnimationTime = 1000; //포커스를 이동할 때 재생할 애니메이션의 길이
const modalAnimationTime = 600;

let viewportHeightRatio = 1;        //뷰포트 높이 비율 - 모달 팝업에 사용

const modalupViewportHeightRatio = 0.45;
const modalPosRatio = 4 / ((1 - modalupViewportHeightRatio) / 0.5);


export function setup(app){
    viewport = new pixi_viewport.Viewport({
        screenWidth: util.width,
        screenHeight: util.height,
        worldWidth: util.width,
        worldHeight: util.height,
        interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        ticker : app.ticker,
        passiveWheel: false,
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
        maxScale: 250,                 // maximum scale
    })


    viewport.on("zoomed", (e) => {
        bgZoom(e.viewport.scaled);
        cbZoom(e.viewport.scaled);
    });
    
    viewport.addChild(focusGraphic);

    return viewport;
}



/*~~~~~~~천체 포커스 진행 애니메이션~~~~~~~*/ 
export function setFocus(body){
    focused = body;
    window.navigator.vibrate(1);

    viewport.plugins.remove('follow');
    viewport.animate({
        time: focusAnimationTime,
        position: body.nextPos(focusAnimationTime),
        scale: body.focusScale,
        ease: 'easeOutCubic',
        callbackOnComplete: ()=>{
            viewport.follow(body.sprite);
            window.navigator.vibrate([3,75,1]);
        },
    });
    drawFocusGraphic();
}

export function releaseFocus(){
    focused = undefined;
                                                                                                                                                                                                                                                                                                                                            
    viewport.plugins.remove('follow');

    window.navigator.vibrate([1,75,3]);
    
    clearFocusGraphic();
}

function clearFocusGraphic(){
    focusGraphic.clear();
}

function drawFocusGraphic(){
    focusGraphic.clear();
        focusGraphic.lineStyle({
            color: 0xff5500,
            width: 40,
            cap: PIXI.LINE_CAP.ROUND,
        });

    for(let i = 0; i < 360; i += 15){
        let rad = i * Math.PI / 180;
        focusGraphic.moveTo(1100 * Math.cos(rad), 1100 * Math.sin(rad));
        focusGraphic.lineTo(1200 * Math.cos(rad), 1200 * Math.sin(rad));
    }

    focusGraphic.scale.set(util.screenMag * focused.scale);
    focusGraphic.position.x = focused.x;
    focusGraphic.position.y = focused.y;
}

export function resize(){
    let prevCenterX = viewport.center.x;
    let prevCenterY = viewport.center.y;
    viewport.resize(
        util.width,
        util.height * viewportHeightRatio,
        util.width,
        util.height,
    );
    
    if(focused){
        focusGraphic.scale.set(util.screenMag * focused.scale);
        viewport.scaled = focused.focusScale;
    }else{
        viewport.moveCenter(prevCenterX * util.changeRatioW, prevCenterY * util.changeRatioH);
    }
}

function modalAdjust(){
    viewport.resize(
        util.width,
        util.height * viewportHeightRatio,
        util.width,
        util.height,
    );
    
    if(focused){
        
        viewport.scaled = focused.focusScale;
    }
}


/*~~~~~~~천체 정보 창 애니메이션~~~~~~~*/ 
export function modalup(){

    if(!focused){
        viewportHeightRatio = modalupViewportHeightRatio;
        modalAdjust();
    }else{
        let nextPosition = focused.nextPos(modalAnimationTime);
        nextPosition.y += util.height / (modalPosRatio * focused.focusScale);

        viewport.animate({
            time: modalAnimationTime,
            position: nextPosition,
            scale: focused.focusScale,
            ease: 'easeInOutCubic',
            callbackOnComplete: ()=>{
                viewportHeightRatio = modalupViewportHeightRatio;
                modalAdjust();
                viewport.follow(focused.sprite);
            },
        });
        setTimeout(()=>{
            viewportHeightRatio = modalupViewportHeightRatio;
            modalAdjust();
        }, modalAnimationTime);
        viewport.plugins.remove('wheel');
        viewport.plugins.remove('pinch');
    }
    
}

export function modaldown(){
    
    if(!focused){
        viewportHeightRatio = 1;
        modalAdjust();
    }else{
        let nextPosition = focused.nextPos(modalAnimationTime);
        nextPosition.y -= util.height / (modalPosRatio * focused.focusScale);

        viewport.animate({
            time: modalAnimationTime,
            position: nextPosition,
            ease: 'easeInOutCubic',
            scale: focused.focusScale,
            callbackOnComplete: ()=>{
                viewportHeightRatio = 1;
                modalAdjust();
                if(focused)
                    viewport.follow(focused.sprite);
            },
        });

        
        setTimeout(()=>{
            viewportHeightRatio = 1;
            modalAdjust();
        }, modalAnimationTime);
        viewport.wheel().pinch();
    }
    
    
}





/*~~~~~~~천체 포커스 효과의 애니메이션~~~~~~~*/ 
export function animate(){
    animateFocusGraphic();
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



