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
    name: 'SUN',
    parent: null,
    texture: PIXI.Texture.from('./img/bodies/sun.png'),
    scale: 0.1,
    focusScale: 2,
    incAngle: 0,
    initialAngle: 0,

    majorAxis: 0,
    orbitRot: 0,
    eccentricity : 0,
    orbitalPeriod : 0,
});

let earth = cb.addBody({
    name: 'EARTH',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/mars.png'),
    scale: 0.01,
    focusScale: 10,
    incAngle: 0.013,
    initialAngle: 0,

    majorAxis: 200,
    orbitRot: 0,
    eccentricity : 0,
    orbitalPeriod : 365,
});

let moon = cb.addBody({
    name: 'MOON',
    parent: earth,
    texture: PIXI.Texture.from('./img/bodies/moon2.png'),
    scale: 0.005,
    focusScale: 20,
    initialAngle: 0,

    majorAxis: 20,
    orbitRot: 100,
    eccentricity : 0.0167,
    orbitalPeriod : 27,
});

let saturn = cb.addBody({
    name: 'SATURN',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/saturn.png'),
    scale: 0.05,
    focusScale: 10,
    initialAngle: 0,

    majorAxis: 400,
    orbitRot: 0,
    eccentricity : 0.0167,
    orbitalPeriod : 10756,
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
    util.frameCount();
    nextAnimation = requestAnimationFrame(animate.bind(this));
}

function resize(){
    util.resize();
    app.renderer.resize(util.width, util.height);
    vp.resize();
    bg.resize();
    cb.resize();
}


function modalup(){
    document.getElementById('modal').classList.add('modal-open');
    console.log('모달 팝업');
}

function modaldown(){
    document.getElementById('modal').classList.remove('modal-open');
    console.log('모달 사라짐');
}

let openbtn = document.getElementById('openbtn');

let modalEnabled = false;
openbtn.addEventListener('click', () => {
    if(!modalEnabled){
        modalup();
        vp.modalup();
        modalEnabled = true;
    }else{
        modaldown();
        vp.modaldown();
        modalEnabled = false;
    }
});


window.addEventListener('load', () => {
    document.getElementById('splash').classList.add('fadeOut');
    setTimeout(()=>{
        document.getElementById('splash').classList.add('invisible');
    }, 1000);
});