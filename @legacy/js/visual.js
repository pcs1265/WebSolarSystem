class Visual {
    constructor(stageWidth, stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.setWebgl();
    }

    setWebgl(){
        this.renderer = new PIXI.Renderer({
            width: document.body.clientWidth,
            height: document.body.clientHeight,
            antialias: true,
            transparent: false,
            resolution: window.devicePixelRatio,
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x000000,
        });

        this.renderer.view.id = 'stage';
        document.getElementById('container').appendChild(this.renderer.view);
        
        this.stage = new PIXI.Container();
    }

    resize(stageWidth, stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.renderer.resize(this.stageWidth, this.stageHeight);
    }

    draw(){
        this.renderer.render(this.stage);
    }
}