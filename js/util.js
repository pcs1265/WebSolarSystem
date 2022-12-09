export let width = document.body.clientWidth;
export let height = document.body.clientHeight;

export let centerW = width / 2;
export let centerH = height / 2;

export let screenMag = 0.15 * Math.min(width, height) / 1080;
export let screenMagH = Math.max(height / width, 1) / 0.15;

export let changeRatioW = 1;
export let changeRatioH = 1;

let prevWidth = document.body.clientWidth;
let prevHeight = document.body.clientHeight;

export function resize(){
    if(document.body.clientWidth >= 100 && document.body.clientHeight >= 100){
        width = document.body.clientWidth;
        height = document.body.clientHeight;
        changeRatioW = width / prevWidth;
        changeRatioH = height / prevHeight;
        prevWidth = width;
        prevHeight = height;
        centerW = width / 2;
        centerH = height / 2;
        screenMag = 0.15 * Math.min(width, height) / 1080;
        screenMagH = Math.max(height / width, 1) / 0.15;
    }
}


let frameCounter = 0;
let lastFrame = Date.now();
let frametimeCounter = 0;
let fpsIndicator = document.getElementById("fps_indicator");

setInterval(showFPS, 1000);

export const referenceFPS = 75;
export const referenceFrametime = 1000 / 75;

export let animateSpeed = 1;
export let currentFPS = 0;
export let avgFrametime = 0;

const frameTimeSamples = 10;
let currSamples = 0;

export function frameCount(){
    frameCounter++;
    if(currSamples < frameTimeSamples){
        frametimeCounter += Date.now() - lastFrame;
        avgFrametime = frametimeCounter / (currSamples + 1);
        currSamples++;
    }else{
        frametimeCounter += Date.now() - lastFrame - avgFrametime;
        avgFrametime = frametimeCounter / frameTimeSamples;
    }
    let prevAnimateSpeed = animateSpeed;
    animateSpeed = (avgFrametime / referenceFrametime);
    if(animateSpeed == NaN || animateSpeed == Infinity){
        animateSpeed = prevAnimateSpeed;
    }
    lastFrame = Date.now();
}

function showFPS(){
    fpsIndicator.innerText = frameCounter;
    currentFPS = frameCounter;
    frameCounter = 0;
}

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'visible') {
        currSamples = 0;
        frametimeCounter = 0;
        lastFrame = Date.now();
    } else {
        frameCounter = 0;
    }
  });
