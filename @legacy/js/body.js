//Particle type
//0 = OIL
//1 = WATER

class Body {
    constructor(pos, texture, radius){
        this.x = pos.x;
        this.y = pos.y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(this.radius);
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        
        this.sprite.tint = 0xFFFF00;
    }

    draw(){
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    setSpriteSize(size){
        this.sprite.scale.set(size);
    }
        
}