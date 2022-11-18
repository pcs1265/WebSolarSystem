class CelestialBodies {
    constructor(){
        this.particles = [];
    }
    
    setup(stageWidth, stageHeight, stage){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.stage = stage;
        this.texture = PIXI.Texture.from('./img/body.png');

        this.container = new PIXI.Container({autoResize : true});
        this.stage.addChild(this.container);
    }
    
    addBody(x, y, radius){
        let body = new Body({x, y}, this.texture, radius);

        this.container.addChild(body.sprite);
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