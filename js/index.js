import * as util from "./util.js"
import * as cb from "./celestialbodies.js"
import * as bg from "./background.js"
import * as vp from "./viewport.js"


let app = new PIXI.Application({
    width: util.width,
    height: util.height,
    antialias: true,
    transparent: false,
    resolution: window.devicePixelRatio,
    autoDensity: true,
    powerPreference: "high-performance",
    backgroundColor: 0x000000,
});
    
app.view.id = 'stage'; 
document.getElementById('container').appendChild(app.view);

window.addEventListener('resize', resize.bind(this), false);


//메인 앱 시작 로직
let viewport = vp.setup(app);
bg.setup(viewport);
cb.setup(viewport);

// let sunTexture = PIXI.Texture.from('./img/bodies/sun.png');
// let sun = cb.addBody(null, sunTexture, 0.1 * util.screenMag, 0, 2);

// let earthTexture = PIXI.Texture.from('./img/bodies/earth.png');
// cb.addBody(sun, earthTexture, 0.1 * util.screenMag, 200 * util.screenMag, 4);

console.log("alive");

let sun = cb.addBody({
    parent: null,
    texture: PIXI.Texture.from('./img/bodies/sun.png'),
    scale: 0.1,
    orbitRadius: 0,
    focusScale: 2,
    incAngle: 0,
    initialAngle: 0,
});

setTimeout(vp.setFocus(sun), 1000);

let earth = cb.addBody({
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/earth.png'),
    scale: 0.1,
    orbitRadius: 200,
    focusScale: 4,
    incAngle: 0.013,
    initialAngle: 0,
});

let moon = cb.addBody({
    parent: earth,
    texture: PIXI.Texture.from('./img/bodies/moon.png'),
    scale: 0.01,
    orbitRadius: 50,
    focusScale: 10,
    incAngle: 0.17,
    initialAngle: 0,
});


//
// let circle = new PIXI.Graphics();

// circle.lineStyle({
//     color : 0xFFFFFF,
//     width: 4,
//     alignment: 0 
// })
// circle.drawCircle(util.centerW, util.centerH, util.screenMag * 100);

// app.stage.addChild(circle);
//this.sprite.interactive = true;
//this.sprite.on('pointerdown', (event) => { alert('clicked : ' + this.num);});
//this.icon.on("pointerdown", this.toggle.bind(this))




//애니메이션 Tick
let nextAnimation = requestAnimationFrame(animate.bind(this));
function animate(){
    bg.draw();
    cb.animate();
    cb.draw();
    frameCounter++;
    nextAnimation = requestAnimationFrame(animate.bind(this));
}


let frameCounter = 0;
let fpsIndicator = document.getElementById("fps_indicator");
setInterval(showFPS.bind(this), 1000);

function showFPS(){
    fpsIndicator.innerHTML = frameCounter;
    frameCounter = 0;
}

function resize(){
    util.resize();
    app.renderer.resize(util.width, util.height);
    vp.resize();
    bg.resize();
    cb.resize();
}
