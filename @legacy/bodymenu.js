
import * as em from "../js/eventmanager.js"

let modal = document.getElementById('body_details');
let menu = document.createElement('div');

export function addBodyToMenu(body){
    if(!body.parent){
        let newBody = document.createElement('li');
        newBody.id = body.nameEn;
        newBody.innerHTML = body.nameKor;
        newBody.onclick = ()=>{
            em.bodyClicked(body);
        };
        let newTree = document.createElement('ul');
        newTree.id = body.nameEn + "_tree";
        newTree.classList.add("body_tree");
        menu.appendChild(newBody);
        menu.appendChild(newTree);
    }else{
        let bodyTree = document.getElementById(body.parent.nameEn + '_tree');
        let newBody = document.createElement('li');
        newBody.id = body.nameEn;
        newBody.innerHTML = body.nameKor;
        newBody.onclick = ()=>{
            em.bodyClicked(body);
        };
        let newTree = document.createElement('ul');
        newTree.id = body.nameEn + "_tree";
        newTree.classList.add("body_tree");
        bodyTree.appendChild(newBody);
        bodyTree.appendChild(newTree);
    }
}

export function showMenu(){
    modal.appendChild(menu);
}