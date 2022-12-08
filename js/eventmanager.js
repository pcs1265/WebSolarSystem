import * as vp from "./viewport.js"
import * as cb from "./celestialbodies.js"

let focusCooldown = false;

export function bodyClicked(body){
    if(!focusCooldown){
        if(body != vp.focused){
            vp.setFocus(body);
            importPage(body);
            modalLocked = false;
            focusCooldown = true;
            setTimeout(()=>{
                focusCooldown = false;
            }, 1000);
        }else{
            resetPage();
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
    document.getElementById('modal_header').innerHTML = "<p id = 'bodyNameKor'></p><p id = 'bodyNameEn'></p><div id = 'show_details'> 상세정보 </div>";
    document.getElementById('bodyNameKor').innerHTML = target.nameKor;
    document.getElementById('bodyNameEn').innerHTML = target.nameEn;
    document.getElementById('body_details').innerHTML = await fetchHtmlAsText('./bodyDocs/detail/' + target.nameEn + '.html');
}

function resetPage(){
    document.getElementById('modal_header').innerHTML = "<p class='init_message'> 정보를 보려면 천체를 선택하세요. </p>";
    document.getElementById('body_details').innerHTML = "";
}



export function modalup(){
    document.getElementById('modal').classList.add('modal-open');
    modalEnabled = true;
}

export function modaldown(){
    document.getElementById('modal').classList.remove('modal-open');
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
    let currSpeed = Math.pow(options_simulate_speed.value, 2).toFixed(2);
    if(currSpeed == 0){
        document.getElementById('options_simulate_speed_indicator').innerText = '일시정지';
    }else{
        document.getElementById('options_simulate_speed_indicator').innerText = '1초 = ' + currSpeed + '일';
    }
    cb.adjustSimulateSpeed(currSpeed);
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