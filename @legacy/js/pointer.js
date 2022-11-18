class Pointer{
    constructor(){
        this.x = 0;
        this.y = 0;
        this.radius = 25;
        this.active = false;

        document.addEventListener('pointermove', this.onPointerMove.bind(this), false);
        document.addEventListener('pointerdown', this.onPointerDown.bind(this) , false);
        document.addEventListener('pointerup', this.onPointerUp.bind(this) , false);
    }

    reset(){
        this.radius = 25;
    }

    onPointerMove(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }

    onPointerDown(e){
    }

    onPointerUp(e){
    }
}