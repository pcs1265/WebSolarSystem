import * as util from "./util.js"
import * as em from "./eventmanager.js"
import * as md from "./modal.js"

let bodies = [];
let bodyContainer;
let orbitContainer;

let orbitLineWidthRatio = 1;

let simulate_speed = 1/86400;

let focusedIndex = 0;

//orbitalPeriod는 일 단위
class CelestialBody {
    constructor(options){
        this.parent = options.parent;
        this.nameKor = options.nameKor;
        this.nameEn = options.nameEn;

        this.x;
        this.y;
        this.centerX;
        this.centerY;
        this.originalFocusScale = options.focusScale;
        this.focusScale = this.originalFocusScale * util.screenMagH;       //포커스 되었을 때 뷰포트 줌 크기

        this.orbitRot = options.orbitRot;
        this.orbitalPeriod = options.orbitalPeriod;

        this.incAngle = 0;
        this.angle = options.initialAngle - this.orbitRot;      //궤도 상 시작 위치 원일점이 0도.
        
        this.initialAngle = this.angle;

        this.scale = options.scale;         //실제 눈에 보일 크기
        
        let p = this.orbitRot * Math.PI / 180;      //궤도 회전각의 라디안
        this.a = options.majorAxis;                    //장반경
        this.c = this.a * options.eccentricity;    //초점과 중심 사이의 거리
        this.b = Math.sqrt(Math.pow(this.a, 2) - Math.pow(this.c, 2));    //단반경

        this.focusX = this.c * Math.cos(p);
        this.focusY = this.c * Math.sin(p);
        

        this.orbitGraphic = new PIXI.Graphics();
        this.drawOrbit();


        this.avgDist = (this.a + Math.sqrt(Math.pow(this.b, 2) + Math.pow(this.c * util.screenMag, 2))) / 2;
        this.animate();

        this.sprite = new PIXI.Sprite.from(options.texture);
        this.sprite.scale.set(this.scale * util.screenMag);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.interactive = true;
        this.sprite.on('click', (event) => {
            em.bodyClicked(this);
            focusedIndex = bodies.indexOf(this);
        });
        this.sprite.on('tap', (event) => {
            em.bodyClicked(this);
            focusedIndex = bodies.indexOf(this);
        });

        this.avgDist = this.calcAvgDist();
    }

    animate(){
        let t = this.angle * Math.PI / 180;
        let p = this.orbitRot * Math.PI / 180;
        
        if(!this.parent){
            this.centerX = util.centerW;
            this.centerY = util.centerH;
        }else{
            this.centerX = this.parent.x;
            this.centerY = this.parent.y; 
        }

        this.x = (this.a * Math.cos(t) * Math.cos(p) - this.b * Math.sin(t) * Math.sin(p) + this.focusX ) * util.screenMag + this.centerX;
        this.y = (this.a * Math.cos(t) * Math.sin(p) + this.b * Math.sin(t) * Math.cos(p) + this.focusY ) * util.screenMag  + this.centerY;
        

        let dist = Math.sqrt(Math.pow(this.x - this.centerX, 2) + Math.pow(this.y - this.centerY, 2));
        this.incAngle =  (360 / this.orbitalPeriod) / util.referenceFPS  * util.animateSpeed * (this.avgDist / dist) * simulate_speed;
        if(this.parent)
            this.angle -= this.incAngle;
        if(this.angle < -360){
            this.angle += 360;
        }
    }

    nextPos(ms){
        let frames = ms / util.avgFrametime;
        let x;
        let y;
        let angle = this.angle;
        let incAngle = this.incAngle;
        for(let i = 0; i <= frames + 1; i++){
            let centerX;
            let centerY;
            let p = this.orbitRot * Math.PI / 180;

            if(!this.parent){
                centerX = util.centerW;
                centerY = util.centerH;
            }else{
                let parentCenter = this.parent.nextPos(util.avgFrametime * i);
                centerX = parentCenter.x;
                centerY = parentCenter.y;
            }
    
            

            let rad = (angle) * Math.PI / 180;
            x = (this.a * Math.cos(rad) * Math.cos(p) - this.b * Math.sin(rad) * Math.sin(p) + this.focusX) * util.screenMag + centerX;
            y = (this.a * Math.cos(rad) * Math.sin(p) + this.b * Math.sin(rad) * Math.cos(p) + this.focusY) * util.screenMag + centerY;

            let dist = Math.sqrt(Math.pow(this.x - this.centerX, 2) + Math.pow(this.y - this.centerY, 2));
            incAngle =  (360 / this.orbitalPeriod) / util.referenceFPS  * util.animateSpeed * (this.avgDist / dist) * simulate_speed;

            if(this.parent)
                angle -= incAngle;
            if(angle < -360){
                angle += 360;
            }
        }
        return new PIXI.Point(x, y);
    }

    resize(){
        this.sprite.scale.set(this.scale * util.screenMag);
        this.focusScale = this.originalFocusScale * util.screenMagH; 
        this.orbitGraphic.scale.set(util.screenMag);
    }

    draw(){
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        
        this.orbitGraphic.position.x = this.centerX;
        this.orbitGraphic.position.y = this.centerY;
    }

    setSpriteSize(size){
        this.sprite.scale.set(size);
    }

    calcAvgDist(){
        let p = this.orbitRot * Math.PI / 180;

        let distSum = 0;
        for(let i = 0; i < 360; ++i){
            let t = i * Math.PI / 180;
            this.x = (this.a * Math.cos(t) * Math.cos(p) - this.b * Math.sin(t) * Math.sin(p) + this.focusX) *util.screenMag + this.centerX;
            this.y = (this.a * Math.cos(t) * Math.sin(p) + this.b * Math.sin(t) * Math.cos(p) + this.focusY) *util.screenMag + this.centerY;
            distSum += Math.sqrt(Math.pow(this.x - this.centerX, 2) + Math.pow(this.y - this.centerY, 2));
        }
        
        return distSum / 360;
    }

    drawOrbit(){
        this.orbitGraphic.clear();

        this.graphicX = this.c;
        this.graphicY = 0;
        this.orbitGraphic.lineStyle({
            color: 0xFFFFFF,
            alpha: 0.5,
            width: 10 * orbitLineWidthRatio,
        });
        this.orbitGraphic.drawEllipse(this.graphicX, this.graphicY, this.a, this.b);
        this.orbitGraphic.scale.set(util.screenMag);
        this.orbitGraphic.angle = this.orbitRot;
    }

    setPos(dateDiff){       //초기 위치로부터 주어진 날짜차이만큼의 위치 지정
        if(this.orbitalPeriod != 0)
            this.angle = this.initialAngle - (360 / this.orbitalPeriod) * dateDiff;
    }
}

export function setup(stage){

    //다른 천체와 궤도가 겹치더라도 항상 천체는 궤적보다 앞에 있어야함.
    //따라서 다른 컨테이너로 관리하여 항상 궤적을 먼저 그리도록 함.
    orbitContainer = new PIXI.Container(1500, {autoResize : true});
    stage.addChild(orbitContainer);
    orbitContainer.interactiveChildren = false;

    bodyContainer = new PIXI.Container(1500, {autoResize : true});
    stage.addChild(bodyContainer);
}

//천체를 추가하는 함수
export function addBody(options){
    let newBody = new CelestialBody(options);

    bodies.push(newBody);
    md.loadDoc(newBody);
    orbitContainer.addChild(newBody.orbitGraphic);
    bodyContainer.addChild(newBody.sprite);

    return newBody;
}

export function resize(){
    for(let i = 0; i< bodies.length; i++){
        const item = bodies[i];
        item.resize();
    }
}

export function animate(){
    for(let i = 0; i< bodies.length; i++){
        const item = bodies[i];
        item.animate();
    }
}

export function draw(){
    for(let i = 0; i< bodies.length; i++){
        const item = bodies[i];
        item.draw();
    }
}

let intervalCounter = 0;
export function zoom(scale){
    orbitLineWidthRatio = 1 / scale;
    if(intervalCounter == 0){
        for(let i = 0; i< bodies.length; i++){
            const item = bodies[i];
            item.drawOrbit();
        }
    }
    intervalCounter = (intervalCounter + 1) % 2;
}

export function adjustSimulateSpeed(speed){
    simulate_speed = speed;
}

export function setPos(dateDiff){
    for(let i = 0; i< bodies.length; i++){
        const item = bodies[i];
        item.setPos(dateDiff);
    }
}


export function focusPrevBody(){
    focusedIndex--;
    em.bodyClicked(bodies[focusedIndex]);
    if(focusedIndex <= 0){
        return false;
    }else{
        return true;
    }
}

export function focusNextBody(){
    focusedIndex++;
    em.bodyClicked(bodies[focusedIndex]);
    if(focusedIndex >= bodies.length - 1){
        return false;
    }else{
        return true;
    }
}

export function getPrevBody(body){
    return bodies[bodies.indexOf(body) - 1];
}
export function getNextBody(body){
    return bodies[bodies.indexOf(body) + 1];
}

export function focusSun(){
    focusedIndex = 0;
    em.bodyClicked(bodies[0]);
}