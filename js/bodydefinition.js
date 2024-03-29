import * as cb from "./celestialbodies.js"

//행성 추가 - 항상 모천체부터 추가해야함.
//모천체가 없는 천체는 화면의 가운데에 위치함.
export function loadAllTextures(app){
    app.loader.baseUrl = "./img/bodies";
    app.loader
        .add("sun", "sun.png")
        .add("mercury", "mercury.png")
        .add("venus", "venus.png")
        .add("earth", "earth.png")
        .add("moon", "moon.png")
        .add("mars", "mars.png")
        .add("deimos", "deimos.png")
        .add("phobos", "phobos.png")
        .add("jupiter", "jupiter.png")
        .add("io", "io.png")
        .add("europa", "europa.png")
        .add("ganymede", "ganymede.png")
        .add("callisto", "callisto.png")
        .add("saturn", "saturn.png")
        .add("titan", "titan.png")
        .add("uranus", "uranus.png")
        .add("titania", "titania.png")
        .add("neptune", "neptune.png")
        .add("triton", "triton.png")
        .add("pluto", "pluto.png");
        app.loader.load();
}

export function addAllBodies(app){
    let sun = cb.addBody({
        nameKor: '태양',
        nameEn: 'Sun',
        parent: null,
        texture: app.loader.resources.sun.texture,
        scale: 0.04,
        focusScale: 2,
        initialAngle: 0,
    
        majorAxis: 0,
        orbitRot: 0,
        eccentricity : 0,
        orbitalPeriod : 0,
    });
    
    let mercury = cb.addBody({
        nameKor: '수성',
        nameEn: 'Mercury',
        parent: sun,
        texture: app.loader.resources.mercury.texture,
        scale: 0.01,
        focusScale: 10,
        initialAngle: 75,
    
        majorAxis: 77,
        orbitRot: 100,
        eccentricity : 0.20563,
        orbitalPeriod : 87.9691,
    });
    
    let venus = cb.addBody({
        nameKor: '금성',
        nameEn: 'Venus',
        parent: sun,
        texture: app.loader.resources.venus.texture,
        scale: 0.01,
        focusScale: 10,
        initialAngle: 105,
    
        majorAxis: 144,
        orbitRot: 0,
        eccentricity : 0.00677323,
        orbitalPeriod :	224.70069,
    });
    
    let earth = cb.addBody({
        nameKor: '지구',
        nameEn: 'Earth',
        parent: sun,
        texture: app.loader.resources.earth.texture,
        scale: 0.01,
        focusScale: 10,
        initialAngle: 292,
    
        majorAxis: 200,
        orbitRot: 0,
        eccentricity : 0.0167086,
        orbitalPeriod : 365.25641,
    });
    let moon = cb.addBody({
        nameKor: '달',
        nameEn: 'Moon',
        parent: earth,
        texture: app.loader.resources.moon.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 110,
    
        majorAxis: 20,
        orbitRot: 100,
        eccentricity : 0.0549006,
        orbitalPeriod : 27.32166155,
    });
    
    let mars = cb.addBody({
        nameKor: '화성',
        nameEn: 'Mars',
        parent: sun,
        texture: app.loader.resources.mars.texture,
        scale: 0.01,
        focusScale: 10,
        initialAngle: 295,
    
        majorAxis: 304,
        orbitRot: 210,
        eccentricity : 0.094,
        orbitalPeriod : 686.971,
    });
    
    let phobos = cb.addBody({
        nameKor: '포보스',
        nameEn: 'Phobos',
        parent: mars,
        texture: app.loader.resources.phobos.texture,
        scale: 0.003,
        focusScale: 25,
        initialAngle: 0,
    
        majorAxis: 17,
        orbitRot: 0,
        eccentricity : 0.0,
        orbitalPeriod : 0.3188888,
    });
    
    let deimos = cb.addBody({
        nameKor: '데이모스',
        nameEn: 'Deimos',
        parent: mars,
        texture: app.loader.resources.deimos.texture,
        scale: 0.003,
        focusScale: 25,
        initialAngle: 285,
    
        majorAxis: 25,
        orbitRot: 0,
        eccentricity : 0.0,
        orbitalPeriod : 1.2624,
    });
    
    let jupiter = cb.addBody({
        nameKor: '목성',
        nameEn: 'Jupiter',
        parent: sun,
        texture: app.loader.resources.jupiter.texture,
        scale: 0.04,
        focusScale: 3,
        initialAngle: 350,
    
        majorAxis: 520,
        orbitRot: 180,
        eccentricity : 0.048775,
        orbitalPeriod : 4332.59,
    });
    
    let io = cb.addBody({
        nameKor: '이오',
        nameEn: 'Io',
        parent: jupiter,
        texture: app.loader.resources.io.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 30,
    
        majorAxis: 55,
        orbitRot: 0,
        eccentricity : 0.0,
        orbitalPeriod : 1.769137786,
    });
    
    let europa = cb.addBody({
        nameKor: '유로파',
        nameEn: 'Europa',
        parent: jupiter,
        texture: app.loader.resources.europa.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 200,
    
        majorAxis: 65,
        orbitRot: 0,
        eccentricity : 0.0,
        orbitalPeriod : 3.55118,
    });
    
    let ganymede = cb.addBody({
        nameKor: '가니메데',
        nameEn: 'Ganymede',
        parent: jupiter,
        texture: app.loader.resources.ganymede.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 110,
    
        majorAxis: 75,
        orbitRot: 0,
        eccentricity : 0.0,
        orbitalPeriod : 7.15455296,
    });
    
    let callisto = cb.addBody({
        nameKor: '칼리스토',
        nameEn: 'Callisto',
        parent: jupiter,
        texture: app.loader.resources.callisto.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 250,
    
        majorAxis: 85,
        orbitRot: 0,
        eccentricity : 0.0,
        orbitalPeriod : 16.6890184,
    });
    
    let saturn = cb.addBody({
        nameKor: '토성',
        nameEn: 'Saturn',
        parent: sun,
        texture: app.loader.resources.saturn.texture,
        scale: 0.04,
        focusScale: 3,
        initialAngle: 40,
    
        majorAxis: 955,
        orbitRot: 0,
        eccentricity : 0.05415060,
        orbitalPeriod : 10756.1995,
    });

    let titan = cb.addBody({
        nameKor: '타이탄',
        nameEn: 'Titan',
        parent: saturn,
        texture: app.loader.resources.titan.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 30,
    
        majorAxis: 70,
        orbitRot: 0,
        eccentricity : 0.0288,
        orbitalPeriod : 15.945,
    });
    
    let uranus = cb.addBody({
        nameKor: '천왕성',
        nameEn: 'Uranus',
        parent: sun,
        texture: app.loader.resources.uranus.texture,
        scale: 0.025,
        focusScale: 4,
        initialAngle: 320,
    
        majorAxis: 1921.5,
        orbitRot: 0,
        eccentricity : 0.046381,
        orbitalPeriod : 30707.4896,
    });

    let titania = cb.addBody({
        nameKor: '티타니아',
        nameEn: 'Titania',
        parent: uranus,
        texture: app.loader.resources.titania.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 30,
    
        majorAxis: 50,
        orbitRot: 0,
        eccentricity : 0.00011,
        orbitalPeriod : 8.706234,
    });
    
    let neptune = cb.addBody({
        nameKor: '해왕성',
        nameEn: 'Neptune',
        parent: sun,
        texture: app.loader.resources.neptune.texture,
        scale: 0.025,
        focusScale: 4,
        initialAngle: 5,
    
        majorAxis: 3006.5,
        orbitRot: 0,
        eccentricity : 0.009456,
        orbitalPeriod : 60223.3528,
    });

    let triton = cb.addBody({
        nameKor: '트리톤',
        nameEn: 'Triton',
        parent: neptune,
        texture: app.loader.resources.triton.texture,
        scale: 0.004,
        focusScale: 25,
        initialAngle: 30,
    
        majorAxis: 50,
        orbitRot: 0,
        eccentricity : 0.000016,
        orbitalPeriod : -5.876854,
    });
    
    let pluto = cb.addBody({
        nameKor: '명왕성',
        nameEn: 'Pluto',
        parent: sun,
        texture: app.loader.resources.pluto.texture,
        scale: 0.025,
        focusScale: 4,
        initialAngle: 60,
    
        majorAxis: 3800.5,
        orbitRot: 315,
        eccentricity : 0.24880766,
        orbitalPeriod : 90560,
    });
}