import * as vp from "./viewport.js"
import * as cb from "./celestialbodies.js"

let focusCooldown = false;
let lastFocused = null;
export function bodyClicked(body){
    if(!focusCooldown){
        if(body != vp.focused){
            vp.setFocus(body);
            importPage(body);
            bottombarFocused(body);
            modalLocked = false;
            focusCooldown = true;
            setTimeout(()=>{
                focusCooldown = false;
            }, 1000);
            lastFocused = body;
        }else{
            resetPage();
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

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

async function importPage(target) {
    document.getElementById('modal_header').innerHTML = "<p id = 'bodyNameKor'>" + target.nameKor +"</p><p id = 'bodyNameEn'>" + target.nameEn + "</p><div id = 'show_details'> 상세정보 </div>";
    //document.getElementById('bodyNameKor').innerText = target.nameKor;
    //document.getElementById('bodyNameEn').innerText = target.nameEn;
    document.getElementById('body_details').innerHTML = await fetchHtmlAsText('./bodyDocs/detail/' + target.nameEn + '.html');
}

function resetPage(){
    document.getElementById('modal_header').innerHTML = "<p class='init_message'> 정보를 보려면 천체를 선택하세요. </p>";
    document.getElementById('body_details').innerHTML = "";
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
        }else if(!modalLocked){
            modaldown();
            vp.modaldown();
        }
        modalCooldown = true;
        setTimeout(()=>{
            modalCooldown = false;
        }, 600);
    }
});


let options_button = document.getElementById('options_button');
let options = document.getElementById('options');
options_button.addEventListener('click', () => {
    options.classList.add('show');
});

let options_close_button = document.getElementById('options_close');
options_close_button.addEventListener('click', () => {
    options.classList.remove('show');
});


// 설정 값이 바뀌었을 때 처리하는 이벤트 핸들러

let options_simulate_speed = document.getElementById('options_simulate_speed');

options_simulate_speed.addEventListener('input', () => {
    let currSpeed = options_simulate_speed.value;
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
        FPS_enabled = !FPS_enabled;
    }else{
        FPS_indicator.classList.remove('visible');
        FPS_enabled = !FPS_enabled;
    }
});

// 바텀바 이벤트 핸들러

let prev_body_button = document.getElementById('prev_body_button');
let next_body_button = document.getElementById('next_body_button');
prev_body_button.classList.add('invisible');

prev_body_button.addEventListener('click', () => {
    if(!focusCooldown){
        cb.focusPrevBody();
        focusCooldown = true;
        setTimeout(()=>{
            focusCooldown = false;
        }, 500);
    }
});


next_body_button.addEventListener('click', () => {
    if(!focusCooldown){
        if(!vp.focused && lastFocused){
            bodyClicked(lastFocused);
        }else{
            cb.focusNextBody();
        }
        focusCooldown = true;
        setTimeout(()=>{
            focusCooldown = false;
        }, 500);
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
    document.getElementById('bottom_bar_right_msg').innerText = body.nameKor + "(으)로 이동";
    document.getElementById('bottom_bar_left_msg').innerText = "";
}