import * as util from "./util.js"


//배경 생성을 위해 사용할 파티클 텍스처
let texture = PIXI.Texture.from("./img/particle.png");

//생성한 파티클을 저장할 배열
let particles = [];
//파티클 컨테이너
let container;

//뷰포트 줌에 따른 파티클 크기를 저장
let particleScale = 1;

//파티클당 할당된 픽셀 수 - 작을수록 더 많이 생성됨
const pixelPerParticle = 500;
//총 파티클 수
let totalParticles = 0;

class Particle {
    constructor(pos){
        this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.sprite.scale.set(this.scale *  particleScale);
        this.sprite.anchor.set(0.5);
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
        this.scale = (Math.random() * 0.4 + 0.4) * util.screenMag;
    }

    draw(){
        //뷰포트 확대 수준에 맞는 스프라이트 크기 지정
        this.sprite.scale.set(this.scale * particleScale);
    }       
}

export function setup(stage){

    container = new PIXI.ParticleContainer(10000, {
        autoResize : true,
        vertices : true,
        position : true,
    });
    stage.addChild(container);

    
    placeParticles();

    for(let i = 0; i < particles.length; i++){
        const item = particles[i];
        container.addChild(item.sprite);
    }
}
    
function placeParticles(){
    
    const targetParticles = Math.floor(util.width * util.height / pixelPerParticle);
    
    totalParticles = targetParticles;
    for(let i = 0; i < targetParticles; ++i){
        let width = Math.random() * util.width;
        let height = Math.random() * util.height;
        const item = new Particle({x : width, y : height}, texture);
        particles.push(item);
    }
}


export function resize(){
    const targetParticles = Math.floor(util.width * util.height / pixelPerParticle);

    for(let i = 0; i < particles.length; i++){
        particles[i].sprite.x *= util.changeRatioW;
        particles[i].sprite.y *= util.changeRatioH;
    }

    if(particles.length > targetParticles){
        for(let i = particles.length; i >= targetParticles; i--){
            container.removeChild(particles.pop().sprite);
            totalParticles--;
        }
    }else{
        for(let i = particles.length; i <= targetParticles; i++){
            let width = Math.random() * util.width;
            let height = Math.random() * util.height;
            const item = new Particle({x : width, y : height}, texture);
            particles.push(item);
            container.addChild(item.sprite);
            totalParticles++;
        }
    }
}

//화면의 줌에 따라 배경 파티클 크기 조절
export function zoom(scale){    
    particleScale = 1 / (scale);
}

export function draw(){
    for(let i = 0; i< particles.length; i++){
        const item = particles[i];
        item.draw();
    }
}

