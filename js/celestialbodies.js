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
    
    console.log(options.incAngle);
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

function reset(){
    this.container.removeChildren();
    for(let i = 0; i < this.particles.length; i++){
        const item = this.particles[i];
        this.container.addChild(item.sprite);
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


export function simulate(){


    for(let i = 0; i < particlesLength; i++){
        const item = this.particles[i];
        
        for(let j = i+1; j < particlesLength; j++){
            const item2 = this.particles[j];
            const dx_between_dots = item.x - item2.x;
            const dy_between_dots = item.y - item2.y;
            const dist_between_dots = Math.sqrt(dx_between_dots * dx_between_dots + dy_between_dots * dy_between_dots);
            
            if(item.type != item2.type){
                if(dist_between_dots < minDist_strong){
                    const angle = Math.atan2(dy_between_dots, dx_between_dots);
                    const tx = item2.x + Math.cos(angle) * minDist_strong;
                    const ty = item2.y + Math.sin(angle) * minDist_strong;
                    const ax = (tx - item.x) / 5;
                    const ay = (ty - item.y) / 5;
                    item.vx += ax;
                    item.vy += ay;
                    item2.vx -= ax;
                    item2.vy -= ay;
                }
            }else{
                if(dist_between_dots < minDist_normal){
                    const angle = Math.atan2(dy_between_dots, dx_between_dots);
                    const tx = item2.x + Math.cos(angle) * minDist_normal;
                    const ty = item2.y + Math.sin(angle) * minDist_normal;
                    const ax = (tx - item.x) / 5;
                    const ay = (ty - item.y) / 5;
                    item.vx += ax;
                    item.vy += ay;
                    item2.vx -= ax;
                    item2.vy -= ay;
                }
            }
            
        }
    }
}
