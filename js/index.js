import * as util from "./util.js"
import * as cb from "./celestialbodies.js"
import * as bg from "./background.js"
import * as vp from "./viewport.js"
import * as em from "./eventmanager.js"


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


//메인 앱 시작
let viewport = vp.setup(app);
bg.setup(viewport);
cb.setup(viewport);


//행성 추가 - 항상 모천체부터 추가해야함.
//모천체가 없는 천체는 화면의 가운데에 위치함.
let sun = cb.addBody({
    nameKor: '태양',
    nameEn: 'Sun',
    parent: null,
    texture: PIXI.Texture.from('./img/bodies/sun.png'),
    scale: 0.04,
    focusScale: 2,
    initialAngle: 0,

    majorAxis: 0,
    orbitRot: 0,
    eccentricity : 0,
    orbitalPeriod : 0,
});

let mercury = cb.addBody({
    nameKor: '수성',
    nameEn: 'Mercury',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/mercury.png'),
    scale: 0.01,
    focusScale: 10,
    initialAngle: 95,

    majorAxis: 77,
    orbitRot: 105,
    eccentricity : 0.20563,
    orbitalPeriod : 87,
});

let venus = cb.addBody({
    nameKor: '금성',
    nameEn: 'Venus',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/venus.png'),
    scale: 0.01,
    focusScale: 10,
    initialAngle: 105,

    majorAxis: 144,
    orbitRot: 0,
    eccentricity : 0.00677323,
    orbitalPeriod : 224,
});

let earth = cb.addBody({
    nameKor: '지구',
    nameEn: 'Earth',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/earth2.png'),
    scale: 0.01,
    focusScale: 10,
    initialAngle: 288,

    majorAxis: 200,
    orbitRot: 0,
    eccentricity : 0.0167086,
    orbitalPeriod : 365,
});
let moon = cb.addBody({
    nameKor: '달',
    nameEn: 'Moon',
    parent: earth,
    texture: PIXI.Texture.from('./img/bodies/moon.png'),
    scale: 0.004,
    focusScale: 25,
    initialAngle: 110,

    majorAxis: 20,
    orbitRot: 100,
    eccentricity : 0.0549006,
    orbitalPeriod : 27,
});

let mars = cb.addBody({
    nameKor: '화성',
    nameEn: 'Mars',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/mars.png'),
    scale: 0.01,
    focusScale: 10,
    initialAngle: 285,

    majorAxis: 304,
    orbitRot: 210,
    eccentricity : 0.094,
    orbitalPeriod : 686,
});

let jupiter = cb.addBody({
    nameKor: '목성',
    nameEn: 'Jupiter',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/jupiter.png'),
    scale: 0.05,
    focusScale: 2,
    initialAngle: 350,

    majorAxis: 520,
    orbitRot: 180,
    eccentricity : 0.048775,
    orbitalPeriod : 4332,
});

let saturn = cb.addBody({
    nameKor: '토성',
    nameEn: 'Saturn',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/saturn.png'),
    scale: 0.05,
    focusScale: 2,
    initialAngle: 40,

    majorAxis: 955,
    orbitRot: 0,
    eccentricity : 0.0167,
    orbitalPeriod : 10756,
});

let uranus = cb.addBody({
    nameKor: '천왕성',
    nameEn: 'Uranus',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/uranus.png'),
    scale: 0.05,
    focusScale: 2,
    initialAngle: 320,

    majorAxis: 1921.5,
    orbitRot: 0,
    eccentricity : 0.046381,
    orbitalPeriod : 30688,
});

let neptune = cb.addBody({
    nameKor: '해왕성',
    nameEn: 'Neptune',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/neptune.png'),
    scale: 0.05,
    focusScale: 2,
    initialAngle: 5,

    majorAxis: 3006.5,
    orbitRot: 0,
    eccentricity : 0.009456,
    orbitalPeriod : 60182,
});

let pluto = cb.addBody({
    nameKor: '명왕성',
    nameEn: 'Pluto',
    parent: sun,
    texture: PIXI.Texture.from('./img/bodies/pluto.png'),
    scale: 0.025,
    focusScale: 4,
    initialAngle: 60,

    majorAxis: 3800.5,
    orbitRot: 315,
    eccentricity : 0.24880766,
    orbitalPeriod : 90560,
});

//애니메이션 Tick
let nextAnimation;

function animate(){
    nextAnimation = requestAnimationFrame(animate.bind(this));
    bg.draw();
    cb.animate();
    cb.draw();
    vp.animate();
    util.frameCount();
}

function resize(){
    util.resize();
    app.renderer.resize(util.width, util.height);
    vp.resize();
    bg.resize();
    cb.resize();
}


window.onload = ()=>{
    requestAnimationFrame(animate.bind(this));
    document.getElementById('splash').classList.add('fadeOut');
    document.getElementById('splash_text').classList.add('move');
    setTimeout(()=>{
        document.getElementById('splash').classList.add('invisible'); 
        //em.bodyClicked(earth);
        //em.modalup();
    }, 1000);
}