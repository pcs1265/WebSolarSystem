import * as vp from "./viewport.js"

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

