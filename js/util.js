export let width = document.body.clientWidth;
export let height = document.body.clientHeight;

export let centerW = width / 2;
export let centerH = height / 2;

export let screenMag = Math.min(width, height) / 1080;
export let DPR = window.devicePixelRatio;

export function resize(){
    width = document.body.clientWidth;
    height = document.body.clientHeight;
    centerW = width / 2;
    centerH = height / 2;
    screenMag = Math.min(width, height) / 1080;
}


let frameCounter = 0;
let lastFrame = Date.now();
let frametimeCounter = 0;
let fpsIndicator = document.getElementById("fps_indicator");
let handleFPS = setInterval(showFPS.bind(this), 1000);

export const referenceFPS = 75;

export let animateSpeed = 1;
export let currentFPS = 0;
export let avgFrametime = 0;
export function frameCount(){
    frameCounter++;
    frametimeCounter += Date.now() - lastFrame;
    avgFrametime = frametimeCounter / frameCounter;
    let prevAnimateSpeed = animateSpeed;
    animateSpeed = (referenceFPS / currentFPS);
    if(animateSpeed == NaN || animateSpeed == Infinity){
        animateSpeed = prevAnimateSpeed;
    }
    lastFrame = Date.now();
}

function showFPS(){
    fpsIndicator.innerHTML = frameCounter;
    currentFPS = frameCounter;
    frametimeCounter -= avgFrametime * frameCounter;
    frameCounter = 0;
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        clearInterval(handleFPS);
        handleFPS = setInterval(showFPS.bind(this), 1000);
        lastFrame = Date.now();
        console.log('활성화');
    } else {
        currentFPS = 0;
        clearInterval(handleFPS);
        console.log('비활성화');
    }
  });
