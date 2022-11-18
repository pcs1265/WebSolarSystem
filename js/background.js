import * as util from "./util.js"
let particles = [];
let texture = PIXI.Texture.from("./img/particle.png");


let stage;
let container;

let stageWidth;
let stageHeight;
let totalParticles = 0;




class Particle {
    constructor(pos, texture){
        this.x = pos.x;
        this.y = pos.y;
        this.vx = 0;
        this.vy = 0;
        this.scale = Math.random() * 0.05 / util.DPR;

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(this.scale);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;

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

    stageWidth = util.width;
    stageHeight = util.height;

    placeParticles();

    container = new PIXI.ParticleContainer({autoResize : true});
    stage.addChild(container);

    for(let i = 0; i < particles.length; i++){
        const item = particles[i];
        container.addChild(item.sprite);
    }
}
    
function placeParticles(){
    
    const targetParticles = util.width * util.height / 1000;
    
    totalParticles = 0;
    for(let i = 0; i < targetParticles; ++i){
        let width = Math.random() * util.width;
        let height = Math.random() * util.height;

        const item = new Particle({x : width, y : height}, texture);
        particles.push(item);
        totalParticles++;
    }

    document.getElementById('particle_indicator').innerHTML = totalParticles;
}

export function resize(){
    const targetParticles = util.width * util.height / 1000;
    const diffX = util.width / stageWidth;
    const diffY = util.height / stageHeight;
    stageWidth = util.width;
    stageHeight = util.height;

    container.removeChildren();

    for(let i = 0; i < particles.length; i++){
        particles[i].x *= diffX;
        particles[i].y *= diffY;
    }

    if(particles.length > targetParticles){
        for(let i = particles.length; i >= targetParticles; i--){
            particles.pop();
            totalParticles--;
        }
    }else{
        for(let i = particles.length; i <= targetParticles; i++){
            let width = Math.random() * util.width;
            let height = Math.random() * util.height;
            const item = new Particle({x : width, y : height}, texture);
            particles.push(item);
            totalParticles++;
        }
    }

    for(let i = 0; i < particles.length; i++){
        container.addChild(particles[i].sprite);
    }

    document.getElementById('particle_indicator').innerHTML = totalParticles;

    
}

function reset(){
    this.container.removeChildren();
    for(let i = 0; i < this.particles.length; i++){
        const item = this.particles[i];
        this.container.addChild(item.sprite);
    } 
}

export function draw(){
    for(let i = 0; i< particles.length; i++){
        const item = particles[i];
        item.draw();
    }
}

