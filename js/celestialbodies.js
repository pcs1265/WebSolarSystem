import * as util from "./util.js"
import * as vp from "./viewport.js"

let bodies = [];
let stage;
let container;

class CelestialBody {
    constructor(parent, texture, scale, orbitRadius, focusScale, incAngle, initialAngle){
        this.x;
        this.y;
        this.centerX;
        this.centerY;
        this.focusScale = focusScale;
        this.parent = parent;

        if(!this.parent){
            this.centerX = util.centerW;
            this.centerY = util.centerH;
        }else{
            this.centerX = this.parent.x;
            this.centerY = this.parent.y;
        }
        
        this.angle = initialAngle;
        this.incAngle = incAngle;
        this.orbitRadius = orbitRadius; 
        this.scale = scale;

        this.orbitGraphic = new PIXI.Graphics();
        this.orbitGraphic.lineStyle({
            color: 0xFFFFFF,
            alpha: 0.5,
            width: 0.5,
        });
        this.orbitGraphic.drawCircle(0, 0, orbitRadius);
        this.orbitGraphic.scale.set(util.screenMag);

        this.animate();


        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(this.scale * util.screenMag);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        
        console.log(texture.resolution);
        this.sprite.interactive = true;
        this.sprite.on('click', (event) => { vp.setFocus(this);});
        this.sprite.on('tap', (event) => { vp.setFocus(this);});
    }

    animate(){
        let rad = this.angle * Math.PI / 180;
        if(!this.parent){
            this.centerX = util.centerW;
            this.centerY = util.centerH;
        }else{
            this.centerX = this.parent.x;
            this.centerY = this.parent.y;
        }
        this.x = Math.cos(rad) * this.orbitRadius * util.screenMag + this.centerX;
        this.y = Math.sin(rad) * this.orbitRadius * util.screenMag + this.centerY;
        this.angle += this.incAngle;
        if(this.angle > 360){
            this.angle -= 360;
        }
        this.orbitGraphic.position.x = this.centerX;
        this.orbitGraphic.position.y = this.centerY;
    }

    nextPos(ms){
        let frames = ms / util.avgFrametime;
        let centerX;
        let centerY;
        if(!this.parent){
            centerX = util.centerW;
            centerY = util.centerH;
        }else{
            let parentCenter = this.parent.nextPos(ms);
            centerX = parentCenter.x;
            centerY = parentCenter.y;
        }
        
        let rad = (this.angle + (this.incAngle * frames)) * Math.PI / 180;
        let x = Math.cos(rad) * this.orbitRadius * util.screenMag + centerX;
        let y = Math.sin(rad) * this.orbitRadius * util.screenMag + centerY;
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
    
    let newBody = new CelestialBody(options.parent, options.texture, options.scale, options.orbitRadius, options.focusScale, options.incAngle, options.initialAngle);

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