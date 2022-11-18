
const MAX_PARTICLES = 10000;


class Background {
    constructor(){
        this.texture = PIXI.Texture.from('./img/particle.png');
        this.particles = [];
    }
    
    setup(stageWidth, stageHeight, stage){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.stage = stage;

        let particlePos = this.dotPos();


        for(let i = 0; i < particlePos.length; i++){
            const item = new Particle(particlePos[i], this.texture);
            this.particles.push(item);
        }

        this.container = new PIXI.ParticleContainer({autoResize : true});
        this.stage.addChild(this.container);

        for(let i = 0; i < this.particles.length; i++){
            const item = this.particles[i];
            this.container.addChild(item.sprite);
        }
    }
    
    dotPos(){
        const particles = [];
        
        const targetParticles = this.stageWidth * this.stageHeight / 3000;
        
        let totalParticles = 0;
        for(let i = 0; i < targetParticles; ++i){
            let width = Math.random() * this.stageWidth;
            let height = Math.random() * this.stageHeight;
            
            particles.push({
                x : width,
                y : height,
            });
            totalParticles++;
        }

        document.getElementById('particle_indicator').innerHTML = totalParticles;

        return particles;
    }

    resize(stageWidth, stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        for(let i = 0; i< this.particles.length; i++){
            const item = this.particles[i];
            item.x = Math.random() * stageWidth;
            item.y = Math.random() * stageHeight;
        }
    }

    reset(){
        this.container.removeChildren();
        for(let i = 0; i < this.particles.length; i++){
            const item = this.particles[i];
            this.container.addChild(item.sprite);
        } 
    }

    draw(){
        for(let i = 0; i< this.particles.length; i++){
            const item = this.particles[i];
            item.draw();
        }
    }
}