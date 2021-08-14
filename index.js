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
        if( event.keyCode === 13 && event.target.value ){
            trigger( event.target.value );
            event.target.value = "";
        }
    });
    return input;
}

/* create button */
function createButton(){
    let button = document.createElement("button");
    button.innerText = window.innerWidth <= 700 ? "+" : "Add";
    // set the click event on button
    button.addEventListener('click',(event)=>{
        if( event.target.previousSibling.value ){
            trigger( event.target.previousSibling.value );
            event.target.previousSibling.value = "";
        }
    });
    // set the window event listener for resizing the window
    window.addEventListener("resize", () => {
        button.innerText = window.innerWidth <= 700 ? "+" : "Add";
     });
    return button;
}

/* create the option tags */
function createSelectBody(string){
    let option = document.createElement("option");
    option.setAttribute("value",string);
    option.innerText = string;
    return option;
}

/* create the select box */
function createSelect(){
    let select = document.createElement("select");
    select.id = "select";
    select.appendChild( createSelectBody("All") );
    select.appendChild( createSelectBody("Completed") );
    select.appendChild( createSelectBody("Uncompleted") );
    // set the change event on select tag
    select.addEventListener('change',(event)=>{
        passTheValues( event.target.options[ event.target.options.selectedIndex ].value );
    });
    return select;
}

/* make the lists according to the selected option */
function passTheValues(selected_value){
    let ol = document.getElementById("list");
    while( ol.childElementCount != 0 ){
        ol.removeChild( ol.childNodes[0] );
    }
    list_items = selected_value==="All" ? appendAllElements() : selected_value==="Completed" ? appendCompletedTasks() : appendUncompletedTasks();
    list_items.forEach( (value) => {
        ol.appendChild( value );
    });
}

/* create list tag for todos */
function createList() {
    let ol = document.createElement("ol");
    ol.id = "list";
    // set the items in localstorage
    localStorage.setItem("Wake Up at 6:00 A.M",false);
    localStorage.setItem("Excercise",false);
    ol.appendChild( addListItems("Wake Up at 6:00 A.M") );
    ol.appendChild( addListItems("Excercise") );
    return ol;
}

function addListItems(str){
    let arr = [];
    let li = document.createElement("li");
    let node = document.createTextNode(str);

    arr.push( createSubListItems("<i class='fa fa-check'></i>","check") );
    arr[0].style.visibility = "hidden";
    arr.push( createSubListItems(node,"node") );
    arr.push( createSubListItems("<i class='fa fa-edit'></i>","edit") );
    arr.push( createSubListItems("<i class='fa fa-trash'></i>","icon") );
    
    //editTheText( arr[2] );
    removeTheParentNode( arr[3] );
    li = appendAllTheLiChild(arr,li);
    arr[1].addEventListener('click',()=>{
        arr[0].style.visibility = "visible";
        localStorage.setItem( arr[1].textContent, true );
        arr[1].style.textDecoration = "line-through";
        li.style.backgroundColor = "blueviolet";
        arr[2].style.display = "none";
    });
    return li;
}

function createSubListItems(str,cls){
    let span = document.createElement("span");
    span.classList.add(cls);
    if(cls==="node") span.appendChild(str);
    else span.innerHTML = str;
    if( cls === "edit"){
        span.addEventListener('click', (event) => { editTheText(event); });
    }
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

function editTheText(event){
    let input =  event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0];
    input.value = event.target.parentNode.previousSibling.textContent;
    object = event.target.parentNode.previousSibling;
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
    arr[1].style.textDecoration = "line-through";
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
    switch(object){
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
            localStorage.removeItem( object.textContent );
            object.textContent = value;
            localStorage.setItem( value, false );
            object = null;
        }
    }
    console.log( localStorage );
}
