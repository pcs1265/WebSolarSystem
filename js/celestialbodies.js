import * as util from "./util.js"
import * as vp from "./viewport.js"

let bodies = [];
let bodyContainer;
let orbitContainer;

//orbitalPeriod는 일 단위
class CelestialBody {
    constructor(options){
        this.parent = options.parent;
        this.name = options.name;

        this.x;
        this.y;
        this.centerX;
        this.centerY;
        this.focusScale = options.focusScale;       //포커스 되었을 때 뷰포트 줌 크기

        this.orbitRot = options.orbitRot;
        this.orbitalPeriod = options.orbitalPeriod;

        this.incAngle = 0;
        this.angle = options.initialAngle;      //궤도 상 시작 위치 원일점이 0도.

        this.scale = options.scale;         //실제 눈에 보일 크기
        
        let p = this.orbitRot * Math.PI / 180;      //궤도 회전각의 라디안
        this.a = options.majorAxis;                    //장반경
        this.c = options.majorAxis * options.eccentricity;    //초점과 중심 사이의 거리
        this.b = Math.sqrt(Math.pow(this.a, 2) - Math.pow(this.c, 2));    //단반경

        this.focusX = this.c * Math.cos(p) * util.screenMag;
        this.focusY = this.c * Math.sin(p) * util.screenMag;

        this.graphicX = Math.sqrt(this.a*this.a - this.b*this.b) * util.screenMag;
        this.graphicY = 0;

        this.orbitGraphic = new PIXI.Graphics();
        this.orbitGraphic.lineStyle({
            color: 0xFFFFFF,
            alpha: 0.5,
            width: 0.5,
        });
        this.orbitGraphic.drawEllipse(this.graphicX, this.graphicY, this.a, this.b);
        this.orbitGraphic.scale.set(util.screenMag);
        this.orbitGraphic.angle = options.orbitRot;

        this.animate();

        this.sprite = new PIXI.Sprite(options.texture);
        this.sprite.scale.set(this.scale * util.screenMag);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.interactive = true;
        this.sprite.on('click', (event) => { vp.setFocus(this);});
        this.sprite.on('tap', (event) => { vp.setFocus(this);});
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
            this.incAngle =  (360 / this.orbitalPeriod) / util.referenceFPS  * util.animateSpeed;
        }

        this.x = (this.a * Math.cos(t) * Math.cos(p) - this.b * Math.sin(t) * Math.sin(p) + this.focusX) * util.screenMag + this.centerX;
        this.y = (this.a * Math.cos(t) * Math.sin(p) + this.b * Math.sin(t) * Math.cos(p) + this.focusY) * util.screenMag + this.centerY;
        
        this.angle += this.incAngle;

        if(this.angle > 360){
            this.angle -= 360;
        }
        this.orbitGraphic.position.x = this.centerX;
        this.orbitGraphic.position.y = this.centerY;
    }

    nextPos(ms){
        let frames = ms / util.avgFrametime;
        let x;
        let y;
        let angle = this.angle;
        let incAngle = this.incAngle;
        for(let i = 1; i <= frames; i++){
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
                incAngle =  (360 / this.orbitalPeriod)  / util.referenceFPS * util.animateSpeed;
            }

            let rad = (angle) * Math.PI / 180;
            x = (this.a * Math.cos(rad) * Math.cos(p) - this.b * Math.sin(rad) * Math.sin(p) + this.focusX) * util.screenMag + centerX;
            y = (this.a * Math.cos(rad) * Math.sin(p) + this.b * Math.sin(rad) * Math.cos(p) + this.focusY) * util.screenMag + centerY;

            angle += incAngle;
        }
        return new PIXI.Point(x, y);
    }

    resize(){
        this.sprite.scale.set(this.scale * util.screenMag);
        this.orbitGraphic.scale.set(util.screenMag);
    }

    draw(){
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    setSpriteSize(size){
        this.sprite.scale.set(size);
    }
        
}

export function setup(stage){

    //다른 천체와 궤도가 겹치더라도 항상 천체는 궤적보다 앞에 있어야함.
    //따라서 다른 컨테이너로 관리하여 항상 궤적을 먼저 그리도록 함.
    orbitContainer = new PIXI.Container(1500, {autoResize : true});
    stage.addChild(orbitContainer);
    bodyContainer = new PIXI.Container(1500, {autoResize : true});
    stage.addChild(bodyContainer);
}

export function addBody(options){
    let newBody = new CelestialBody(options);

    bodies.push(newBody);
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