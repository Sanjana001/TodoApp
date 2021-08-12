var object = null;
localStorage.clear();

/* Create the body part */
function createBody(){
    let div = document.createElement("div");
    div.classList.add("container");
    div.appendChild( createInput() );
    div.appendChild( createButton() );
    div.appendChild( createSelect() );
    div.appendChild( createList() );
    document.body.appendChild(div);
}

/* create input box for todos */
function createInput(){
    let input = document.createElement("input");
    input.id = "input";
    input.setAttribute("type","text");
    input.setAttribute("placeholder","Type something...");
    // take input value on pressing enter
    input.addEventListener('keyup', (event) => {
        if( event.keyCode === 13 ){
            trigger( event.target.value );
        }
    });
    return input;
}

/* create button */
function createButton(){
    let button = document.createElement("button");
    button.innerText = "Add";
    // set the click event on button
    button.addEventListener('click',(event)=>{
        target( event.target.previousSibling.value );
    });
    // set the window event listener for resizing the window
    window.addEventListener("resize", () => {
		if( window.innerWidth <= 700 ){
            button.innerText = "+";
        }else{
            button.innerText = "Add";
        }
     });
    return button;
}

function createSelectBody(string){
    let option = document.createElement("option");
    option.setAttribute("value",string);
    option.innerText = string;
    return option;
}

/* create the select body */
function createSelect(){
    let select = document.createElement("select");
    select.id = "select";
    select.appendChild( createSelectBody("All") );
    select.appendChild( createSelectBody("Completed") );
    select.appendChild( createSelectBody("Uncompleted") );
    // set the change event on select tag
    select.addEventListener('change',()=>{
        passTheValues();
    });
    return select;
}

function passTheValues(){
    let select = document.getElementById("select");
    let index = select.selectedIndex;
    let selected_value = select.options[index].text;
    let ol = document.getElementById("list");
    while( ol.childElementCount != 0 ){
        ol.removeChild( ol.childNodes[0] );
    }
    list_items = selected_value==="All" ? appendAllElements() : selected_value==="Completed" ? appendCompletedTasks() : appendUncompletedTasks();
    list_items.forEach( (value) => {
        ol.appendChild( value );
    });
}

/* create list for todos */
function createList() {
    let div = document.createElement("div");
    div.classList.add("list");
    let ol = document.createElement("ol");
    ol.id = "list";
    localStorage.setItem("Wake Up at 6:00 A.M",false);
    localStorage.setItem("Excercise",false);
    ol.appendChild( addListItems("Wake Up at 6:00 A.M") );
    ol.appendChild( addListItems("Excercise") );
    div.appendChild(ol);
    return div;
}

function createSubListItems(str,cls){
    let span = document.createElement("span");
    span.classList.add(cls);
    if(cls==="node") span.appendChild(str);
    else span.innerHTML = str;
    return span;
}

function removeTheParentNode(object){
    object.addEventListener('click',()=>{
        object = object.parentNode;
        localStorage.removeItem( object.textContent );
        object.remove();
    });
}

function appendAllTheLiChild(group_of_list_items,li){
    group_of_list_items.forEach( (value) => {
        li.appendChild(value);
    });
    return li;
}

function editTheText(object){
    object.addEventListener('click',()=>{
        this.object = object;
        document.getElementById("input").value = object.previousSibling.textContent;
    });
}

function addListItems(str){
    let arr = [];
    let li = document.createElement("li");
    let node = document.createTextNode(str);

    arr.push( createSubListItems("<i class='fa fa-check'></i>","check") );
    arr[0].style.visibility = "hidden";
    
    arr.push( createSubListItems(node,"node") );
    arr.push( createSubListItems("<i class='fa fa-edit'></i>","icon") );
    arr.push( createSubListItems("<i class='fa fa-trash'></i>","icon") );
    editTheText( arr[2] );
    removeTheParentNode( arr[3] );
    li = appendAllTheLiChild(arr,li);
    arr[1].addEventListener('click',()=>{
        arr[0].style.visibility = "visible";
        localStorage.setItem( arr[1].textContent, true );
        li.style.backgroundColor = "blueviolet";
        arr[2].style.display = "none";
    });
    return li;
}

function appendAllElements(){
    let list_items = [];
    console.log("all");
    Object.keys(localStorage).forEach( (key) => {
        if( localStorage.getItem(key) === "true" ) list_items.push( makeListOfCompletedTasks(key) );
        else list_items.push( addListItems(key) );
    });
    return list_items;
}

function appendCompletedTasks(){
    let list_items = [];
    Object.keys(localStorage).forEach( (key) => {
        if( localStorage.getItem(key) === "true" ){
            list_items.push( makeListOfCompletedTasks(key) );
        }
    });
    return list_items;
}

function makeListOfCompletedTasks(str){
    let arr = [];
    let li = document.createElement("li");
    let node = document.createTextNode(str);

    arr.push( createSubListItems("<i class='fa fa-check'></i>","check") );
    arr.push( createSubListItems(node,"node") );
    arr.push( createSubListItems("<i class='fa fa-trash'></i>","icon") );
    removeTheParentNode( arr[2] );
    li.style.backgroundColor = "blueviolet";
    li = appendAllTheLiChild(arr,li);
    return li;
}

function appendUncompletedTasks(){
    let list_items = [];
    console.log("Uncompleted Tasks");
    Object.keys(localStorage).forEach( (key,value) => {
        if( localStorage.getItem(key) == "false" ) list_items.push( makeListOfUncompletedTasks(key) );
    });
    return list_items;
}

function makeListOfUncompletedTasks(str){
    let arr = [];
    let li = document.createElement("li");
    let node = document.createTextNode(str);

    arr.push( createSubListItems("<i class='fa fa-check'></i>","check") );
    arr[0].style.visibility = "hidden";
    
    arr.push( createSubListItems(node,"node") );
    arr.push( createSubListItems("<i class='fa fa-edit'></i>","icon") );
    arr.push( createSubListItems("<i class='fa fa-trash'></i>","icon") );
    editTheText( arr[2] );
    removeTheParentNode( arr[3] );
    li = appendAllTheLiChild(arr,li);
    arr[1].addEventListener('click',()=>{
        arr[0].style.visibility = "visible";
        localStorage.setItem( arr[1].textContent, true );
        li.style.display = "none";
    });
    return li;
}

/* get the input value from user */
function trigger(value){
    switch(this.object){
        case null:{
            if( localStorage.getItem(value) == null ){
                localStorage.setItem(value,false);
                let list_item = addListItems(value);
                document.getElementById("list").appendChild(list_item);
            }
            else alert("Warning: The task has already assigned");
            break;
        }
        default:{
            localStorage.removeItem( this.object.previousSibling.textContent );
            this.object.previousSibling.textContent = value;
            localStorage.setItem( value, false );
            this.object = null;
        }
    }
    console.log( localStorage );
    document.getElementById("input").value = "";
}
