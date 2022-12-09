import * as util from "./util.js"
import * as cb from "./celestialbodies.js"
import * as bg from "./background.js"
import * as vp from "./viewport.js"
import * as bd from "./bodydefinition.js"



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
app.renderer.plugins.interaction.autoPreventDefault = false;

//메인 앱 시작
let viewport = vp.setup(app);
bg.setup(viewport);
cb.setup(viewport);
vp.setFocusGraphic();

//행성 추가 - 항상 모천체부터 추가해야함.
//모천체가 없는 천체는 화면의 가운데에 위치함.

app.loader.baseUrl = "img/bodies";
app.loader
    .add("sun", "sun.png")
    .add("mercury", "mercury.png")
    .add("venus", "venus.png")
    .add("earth", "earth.png")
    .add("moon", "moon.png")
    .add("mars", "mars.png")
    .add("deimos", "deimos.png")
    .add("phobos", "phobos.png")
    .add("jupiter", "jupiter.png")
    .add("io", "io.png")
    .add("europa", "europa.png")
    .add("ganymede", "ganymede.png")
    .add("callisto", "callisto.png")
    .add("saturn", "saturn.png")
    .add("uranus", "uranus.png")
    .add("neptune", "neptune.png")
    .add("pluto", "pluto.png");
app.loader.onProgress.add(showLoading);
app.loader.onError.add(showError);
app.loader.onComplete.add(loadDone);
app.loader.load();


//애니메이션
function animate(){
    requestAnimationFrame(animate);
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

function loadDone(){
    
    bd.addAllBodies(app);

    
    animate();
    setTimeout(()=>{
        document.getElementById('splash').classList.add('invisible');
        document.getElementById('splash_text').classList.add('move');
        document.getElementById('myProgress').classList.add('move');
    }, 1000);

    //현재시간 기준으로 행성들의 위치를 설정
    const offset = 1000 * 60 * 60 * 9;      //한국시간으로 변환을 위한 오프셋
    let today = new Date((new Date()).getTime() + offset);

    let dateDiff = (today - new Date('2022-11-25'))/24/60/60/1000;
    cb.setPos(dateDiff);
    document.getElementById('options_date').value = today.toISOString().slice(0, 10);
    
    document.getElementById('body_details').innerHTML = "<h2 class='main_title'></h2><p class='whole_line_item'><p><table border='1' class='item'></table>";
}

function showLoading(e) {
    let elem = document.getElementById("myBar");
    elem.style.width = e.progress + "%";
}

function showError(e){
    console.log(e);
}


