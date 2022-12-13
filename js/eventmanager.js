import * as vp from "./viewport.js"
import * as cb from "./celestialbodies.js"
import * as md from "./modal.js"

let focusCooldown = false;
export function bodyClicked(body){
    if(!focusCooldown){
        if(body != vp.focused){
            vp.setFocus(body);
            md.importPage(body);
            bottombarFocused(body);
            modalLocked = false;
            focusCooldown = true;
            setTimeout(()=>{
                focusCooldown = false;
            }, 1000);
        }else{
            md.resetPage();
            bottombarUnfocused(body);
            if(modalEnabled){
                modaldown();
                vp.modaldown();
                focusCooldown = true;
                setTimeout(()=>{
                    focusCooldown = false;
                }, 600);
            }
            vp.releaseFocus();
            modalLocked = true;
        }
    }
    
}



export function modalup(){
    document.getElementById('modal').classList.add('modal-open');
    document.getElementById('bottom_bar').classList.add('up');
    modalEnabled = true;
}

export function modaldown(){
    document.getElementById('modal').classList.remove('modal-open');
    document.getElementById('bottom_bar').classList.remove('up');
    modalEnabled = false;
}

let modalCooldown = false;
let modalLocked = true;
let modalEnabled = false;
let modalHeader = document.getElementById('modal_header');
modalHeader.addEventListener('click', () => {
    if(!modalCooldown){
        if(!modalEnabled && !modalLocked){
            modalup();
            vp.modalup();    
            window.navigator.vibrate(1);
        }else if(!modalLocked){
            modaldown();
            vp.modaldown();
            window.navigator.vibrate(1);
        }
        modalCooldown = true;
        setTimeout(()=>{
            modalCooldown = false;
        }, 600);
    }
});

//설정 버튼 이벤트

let options_button = document.getElementById('options_button');
let options = document.getElementById('options');
options_button.addEventListener('click', () => {
    options.classList.add('show');
    
    window.navigator.vibrate(1);
});

let options_close_button = document.getElementById('options_close');
options_close_button.addEventListener('click', () => {
    options.classList.remove('show');
    
    window.navigator.vibrate(1);
});


// 설정 값이 바뀌었을 때 처리하는 이벤트 핸들러

let options_simulate_speed = document.getElementById('options_simulate_speed');

options_simulate_speed.addEventListener('input', () => {
    let currSpeed = options_simulate_speed.value;
    
    window.navigator.vibrate(1);
    switch(currSpeed){
        case '0':
            document.getElementById('options_simulate_speed_indicator').innerText = '일시정지';
            cb.adjustSimulateSpeed(0);
            break;
        case '1':
            document.getElementById('options_simulate_speed_indicator').innerText = '실시간';
            cb.adjustSimulateSpeed(1/24/60/60);
            break;
        case '2':
            document.getElementById('options_simulate_speed_indicator').innerText = '1초 = 1분';
            cb.adjustSimulateSpeed(1/24/60);
            break;
        case '3':
            document.getElementById('options_simulate_speed_indicator').innerText = '1초 = 1시간';
            cb.adjustSimulateSpeed(1/24);
            break;
        case '4':
            document.getElementById('options_simulate_speed_indicator').innerText = '1초 = 1일';
            cb.adjustSimulateSpeed(1);
            break;
    }
});

let initialDate = new Date('2022-11-25');
let options_date = document.getElementById('options_date');
let options_date_set_button = document.getElementById('options_date_set_button');
options_date_set_button.addEventListener('click', () => {
    let input_date = options_date.valueAsDate;
    if(input_date){
        pauseSimulation();
        cb.setPos((input_date - initialDate) / 1000 / 60 / 60 / 24);
        options_date_set_button.innerText = '설정완료';
        setTimeout(()=>{
            options_date_set_button.innerText = '설정';
        }, 1000);
    }else{
        alert('날짜가 설정되지 않았습니다.');
    }
});


function pauseSimulation(){
    document.getElementById('options_simulate_speed').value = 0;
    document.getElementById('options_simulate_speed_indicator').innerText = '일시정지';
    cb.adjustSimulateSpeed(0);
}

let FPS_enabled = false;
let FPS_indicator = document.getElementById('fps_counter');
let FPS_enabled_box = document.getElementById('options_FPS_enable');
FPS_enabled_box.addEventListener('click', () => {
    if(!FPS_enabled){
        FPS_indicator.classList.add('visible');
        FPS_enabled = true;
    }else{
        FPS_indicator.classList.remove('visible');
        FPS_enabled = false;
    }
});

let fullscreen_enabled = false;

if (window.matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('fullscreen_option').remove();
}else{
    let fullscreen_enabled_box = document.getElementById('options_fullscreen_enable');
    fullscreen_enabled_box.addEventListener('click', () => {
        if(!document.fullscreenElement){
            openFullScreenMode();
            fullscreen_enabled = true;
        }else{
            closeFullScreenMode();
            fullscreen_enabled = false;
        }
    
        console.log(0);
    });
    window.onresize = function () {
        if (!document.fullscreenElement) {
            fullscreen_enabled_box.checked = false;
        }else{
            fullscreen_enabled_box.checked = true;
        }
    }    
}



let doc = document.body;
function openFullScreenMode() {
    if (doc.requestFullscreen)
        doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) // Chrome, Safari (webkit)
        doc.webkitRequestFullscreen();
    else if (doc.mozRequestFullScreen) // Firefox
        doc.mozRequestFullScreen();
    else if (doc.msRequestFullscreen) // IE or Edge
        doc.msRequestFullscreen();
}


function closeFullScreenMode() {
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.webkitExitFullscreen) // Chrome, Safari (webkit)
        document.webkitExitFullscreen();
    else if (document.mozCancelFullScreen) // Firefox
        document.mozCancelFullScreen();
    else if (document.msExitFullscreen) // IE or Edge
        document.msExitFullscreen();
    window.scrollTo(0, 0);
    window.scrollTo(0, 1000);
}



// 바텀바 이벤트 핸들러

let prev_body_button = document.getElementById('prev_body_button');
let next_body_button = document.getElementById('next_body_button');
prev_body_button.classList.add('invisible');

prev_body_button.addEventListener('click', () => {
    if(!focusCooldown){
        cb.focusPrevBody();
    }
});


next_body_button.addEventListener('click', () => {
    if(!focusCooldown){
        if(!vp.focused){
            cb.focusSun();
        }else{
            cb.focusNextBody();
        }
    }
});

function bottombarFocused(body){
    if(!cb.getNextBody(body)){
        next_body_button.classList.add('invisible');
        document.getElementById('bottom_bar_right_msg').innerText = "";
    }else{
        next_body_button.classList.remove('invisible');
        document.getElementById('bottom_bar_right_msg').innerText = cb.getNextBody(body).nameKor;
    }

    if(!cb.getPrevBody(body)){
        prev_body_button.classList.add('invisible');
        document.getElementById('bottom_bar_left_msg').innerText = "";
    }else{
        prev_body_button.classList.remove('invisible');
        document.getElementById('bottom_bar_left_msg').innerText = cb.getPrevBody(body).nameKor;
    }
}
function bottombarUnfocused(body){
    prev_body_button.classList.add('invisible');
    next_body_button.classList.remove('invisible');
    document.getElementById('bottom_bar_right_msg').innerText = "태양";
    document.getElementById('bottom_bar_left_msg').innerText = "";
}