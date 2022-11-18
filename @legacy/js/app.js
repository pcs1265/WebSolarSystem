
class App{
    constructor(){
        if (!window.localStorage.getItem('FILTERS_ENABLED')){
            window.localStorage.setItem('FILTERS_ENABLED', 'T');
        }
        if (!window.localStorage.getItem('VISCOSITY')){
            window.localStorage.setItem('VISCOSITY', 0.5);
        }
        if (!window.localStorage.getItem('BOWL_SIZE')){
            window.localStorage.setItem('BOWL_SIZE', 1);
        }
        if (!window.localStorage.getItem('OIL_RATIO')){
            window.localStorage.setItem('OIL_RATIO', 0.25);
        }
        if(window.localStorage.getItem('FILTERS_ENABLED') == 'T'){
            this.filtersEnabled = true;
        }else{
            this.filtersEnabled = false;    
        }

        this.bowlSize = parseFloat(window.localStorage.getItem('BOWL_SIZE'));
        this.oilRatio = parseFloat(window.localStorage.getItem('OIL_RATIO'));
        this.viscosity = parseFloat(window.localStorage.getItem('VISCOSITY'));
        this.friction = 0.8 - (0.2 * (this.viscosity - 0.5));



        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.radius = 1 / (Math.min(this.stageWidth, this.stageHeight) / 200);
        
        this.DPR = window.devicePixelRatio;

        this.background = new Background(this.texture);
        this.celestialBodies = new CelestialBodies(this.texture);
        this.visual = new Visual(this.stageWidth, this.stageHeight);
        this.background.setup(this.stageWidth, this.stageHeight, this.visual.stage);
        this.celestialBodies.setup(this.stageWidth, this.stageHeight, this.visual.stage);
        this.celestialBodies.addBody(this.stageWidth/ 2, this.stageHeight / 2, this.radius);
        this.pointer = new Pointer();

        this.nextAnimation = requestAnimationFrame(this.animate.bind(this));
        window.addEventListener('resize', this.resize.bind(this), false);
        
        this.frameCounter = 0;
        this.fpsIndicator = document.getElementById("fps_indicator");
        setInterval(this.showFPS.bind(this), 1000);

    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.visual.resize(this.stageWidth, this.stageHeight);
        this.background.resize(this.stageWidth, this.stageHeight);
    }

    animate(){
        this.background.draw();
        this.celestialBodies.draw();
        this.visual.draw();
        this.frameCounter++;
        this.nextAnimation = requestAnimationFrame(this.animate.bind(this));
    }

    showFPS(){
        this.fpsIndicator.innerHTML = this.frameCounter;
        this.frameCounter = 0;
    }

    applyChanges(){
        cancelAnimationFrame(this.nextAnimation);
        this.friction = 0.8 - (0.2 * (this.viscosity - 0.5));
        this.bowl = new Bowl(this.texture);
        this.particles = this.bowl.setup(this.stageWidth, this.stageHeight, this.visual.stage);
        this.pointer.reset();
        this.visual.reset();

        // this.bowl.setup(this.stageWidth, this.stageHeight, this.bowlSize, this.oilRatio);
        // this.density = this.bowl.density;
        // this.pointer.reset(this.density , this.particles);
        // this.visual.reset(this.density, this.particles);

        this.nextAnimation = requestAnimationFrame(this.animate.bind(this));

    }
}
