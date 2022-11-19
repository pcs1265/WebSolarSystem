import * as util from "./util.js"
import * as vp from "./viewport.js"

let bodies = [];
let stage;
let container;

const referenceFPS = 75;
const referenceFrametime = 1000 / referenceFPS;



//orbitalPeriod는 일 단위
class CelestialBody {
    constructor(options){
        
        this.parent = options.parent;
        this.name = options.name;

        this.a = options.majorAxis;                    //장반경
        this.c = options.majorAxis * options.eccentricity;    //초점과 중심 사이의 거리
        this.b = Math.sqrt(Math.pow(this.a, 2) - Math.pow(this.c, 2));    //단반경

        this.x;
        this.y;
        this.centerX;
        this.centerY;
        this.focusScale = options.focusScale;

        this.orbitRot = options.orbitRot;
        this.orbitalPeriod = options.orbitalPeriod;

        if(!this.parent){
            this.centerX = util.centerW;
            this.centerY = util.centerH;
        }else{
            this.centerX = this.parent.x;
            this.centerY = this.parent.y;
        }
        
        this.angle = options.initialAngle;
        this.incAngle = 0;
        this.majorAxis = options.majorAxis; 
        this.scale = options.scale;
        
        let p = this.orbitRot * Math.PI / 180;

        this.focusX = Math.sqrt(this.a*this.a - this.b*this.b) * Math.cos(p) * util.screenMag;
        this.focusY = Math.sqrt(this.a*this.a - this.b*this.b) * Math.sin(p) * util.screenMag;

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
            this.incAngle =  (360 / this.orbitalPeriod)  * (referenceFPS / Math.pow(util.currentFPS, 2));
        }

        this.x = (this.a * Math.cos(t) * Math.cos(p) - this.b * Math.sin(t) * Math.sin(p) + this.focusX) * util.screenMag + this.centerX;
        this.y = (this.a * Math.cos(t) * Math.sin(p) + this.b * Math.sin(t) * Math.cos(p) + this.focusY) * util.screenMag + this.centerY;

        if(this.incAngle == Infinity){
        }else{
            this.angle += this.incAngle;
        }
        

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
                incAngle =  (360 / this.orbitalPeriod)  * (referenceFPS / Math.pow(util.currentFPS, 2));
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

export function setup(iStage){
    stage = iStage;
    container = new PIXI.Container({autoResize : true});
    stage.addChild(container);
}

export function addBody(options){
    
    
    let newBody = new CelestialBody(options);

    bodies.push(newBody);
    
    container.removeChildren();
    setOrbitGraphics();
    setBodiesSprite();

    return newBody;
}

function setOrbitGraphics(){
    for(let i = 0; i < bodies.length; i++){
        container.addChild(bodies[i].orbitGraphic);
    }
}
function setBodiesSprite(){
    for(let i = 0; i < bodies.length; i++){
        container.addChild(bodies[i].sprite);
    }
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