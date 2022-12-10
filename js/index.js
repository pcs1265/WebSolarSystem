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



//메인 앱 시작
let viewport = vp.setup(app);
bg.setup(viewport);
cb.setup(viewport);
vp.setFocusGraphic();
app.loader.onProgress.add(showLoading);
app.loader.onError.add(showError);
app.loader.onComplete.add(loadDone);
bd.loadAllTextures(app);

window.addEventListener('resize', resize);


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
    
}

function showLoading(e) {
    let elem = document.getElementById("myBar");
    elem.style.width = e.progress + "%";
}

function showError(e){
    console.log(e);
}


