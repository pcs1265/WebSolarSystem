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