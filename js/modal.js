
let docs = [];
export async function loadDoc(body){
    docs[body.nameEn] = await fetchHtmlAsText('./bodyDocs/detail/' + body.nameEn + '.html');

    //docs[body.nameEn] = "";     //상세정보 비활성화
}

async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

export function importPage(target) {
    document.getElementById('modal_header').innerHTML = "<p id = 'bodyNameKor'>" + target.nameKor +"</p><p id = 'bodyNameEn'>" + target.nameEn + "</p><div id = 'show_details'> 상세정보 </div>";
    document.getElementById('body_details').innerHTML = docs[target.nameEn];      //상세정보 비활성화
}

export function resetPage(){
    document.getElementById('modal_header').innerHTML = "<p class='init_message'> 정보를 보려면 천체를 선택하세요. </p>";
    document.getElementById('body_details').innerHTML = "";      //상세정보 비활성화
}
