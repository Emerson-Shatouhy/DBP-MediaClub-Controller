const electron = require('electron')
const editJsonFile = require("edit-json-file");
const ipcRenderer = electron.ipcRenderer;
const { desktopCapturer } = electron;
let preset = editJsonFile(`${__dirname}/assets/data/broadcastPreset.json`);


//Create the Modal List
var sortable = Sortable.create(rundownList, {
    animation: 150,
});




//New Item in list
function newSegment() {
    var temp = document.getElementById("item0");
    var item = temp.cloneNode(true);
    var div1 = item.firstElementChild;
    var input = div1.firstElementChild;
    input.value = "";
    document.getElementById("rundownList").appendChild(item);

    $('.delete').on('click', function() {
        $(this).parent().parent().remove();
        document.getElementById("newSegment").removeAttribute('disabled');
    });
    var list = document.getElementById("rundownList").getElementsByTagName("input");
    if (list.length > 8) {
        document.getElementById("newSegment").setAttribute('disabled', 'true');
    } else {
        document.getElementById("newSegment").removeAttribute('disabled');
    }
}

//Show Modal and Add the List
$(document).ready(function() {
    var i = 0;
    while (i < 4) {
        var temp = document.getElementById("item0");
        var item = temp.cloneNode(true);
        var div1 = item.firstElementChild;
        var input = div1.firstElementChild;
        var div2 = div1.getElementsByClassName("form-control")[1].value;
        switch (i) {
            case 0:
                input.value = "Opening";
                break;
            case 1:
                input.value = "Prayer";
                break;
            case 2:
                input.value = "Pledge";
                break;
            case 3:
                input.value = "";
                break;
        }
        document.getElementById("rundownList").appendChild(item);
        i++;
        item.id = "item" + i;
    }
    $('.delete').on('click', function() {
        $(this).parent().parent().remove();
        document.getElementById("newSegment").removeAttribute('disabled');
    });


    $('#mainModal').modal('show');
});

//Creates Time line
function newRunDown() {
    var sel = document.getElementById("rundownList").getElementsByTagName("select");
    var lis = document.getElementById("rundownList").getElementsByTagName("input");
    for (i = 0; i < lis.length; i++) {
        if (lis[i].value) {
            newCard(lis[i].value, i, sel[i].value);
        }
    }
    var liveShotTemp = document.getElementById("liveShotTemp");
    liveShotTemp.parentNode.removeChild(liveShotTemp);
    var graphicTemp = document.getElementById("graphicTemp");
    graphicTemp.parentNode.removeChild(graphicTemp);
    var videoTemp = document.getElementById("videoTemp");
    videoTemp.parentNode.removeChild(videoTemp);
    $('#mainModal').modal('hide')
}

//Handles the creation of New Cards
function newCard(name, index, type) {
    switch (type) {
        case "Live Shot":
            var itm = document.getElementById("liveShotTemp");
            var cln = itm.cloneNode(true);
            cln.id = index;
            var body = cln.firstElementChild.firstElementChild;
            var header = body.firstElementChild;
            header.innerHTML = name;
            header.id = "cardTitle" + index;
            var button = body.lastElementChild.firstElementChild;
            button.id = "btn" + index;
            button.setAttribute("onClick", `send('liveShot', ${index})`);
            var select = body.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild;
            select.id = "sel" + index;
            var typ = document.createElement("small");
            typ.classList.add("text-muted");
            typ.innerHTML = " " + type;
            header.appendChild(typ);
            document.getElementById("timeline").appendChild(cln);
            break;

        case "Graphic":
            var itm = document.getElementById("graphicTemp");
            var cln = itm.cloneNode(true);
            cln.id = index;
            var body = cln.firstElementChild.firstElementChild;
            var header = body.firstElementChild;
            header.innerHTML = name;
            header.id = "cardTitle" + index;
            var button = body.lastElementChild.lastElementChild;
            button.setAttribute("onClick", `send('graphic', ${index})`);
            button.id = "btn" + index;
            var typ = document.createElement("small");
            typ.classList.add("text-muted");
            typ.innerHTML = " " + type;
            header.appendChild(typ);
            document.getElementById("timeline").appendChild(cln);
            break;


        case "Video":
            var itm = document.getElementById("videoTemp");
            var cln = itm.cloneNode(true);
            cln.id = index;
            var body = cln.firstElementChild.firstElementChild;
            var header = body.firstElementChild;
            header.innerHTML = name;
            header.id = "cardTitle" + index;
            var button = body.lastElementChild.lastElementChild;
            button.setAttribute("onClick", `send('video', ${index})`);
            button.id = "btn" + index;
            var typ = document.createElement("small");
            typ.classList.add("text-muted");
            typ.innerHTML = " " + type;
            header.appendChild(typ);
            document.getElementById("timeline").appendChild(cln);
            break;
    }

}

const {
    Atem
} = require('atem-connection')
const myAtem = new Atem({
    externalLog: console.log
})

myAtem.connect('169.254.220.239')

myAtem.on('connected', () => {
    myAtem.changeProgramInput(1).then((res) => {
        // ProgramInputCommand {
        // 	flag: 0,
        // 	rawName: 'PrgI',
        // 	mixEffect: 0,
        // 	properties: { source: 3 },
        // 	resolve: [Function],
        // 	reject: [Function] }
    })
})



//Handles Send Function
function send(type, index) {
    if (document.getElementById(index - 1 + "-live")) {
        var old = document.getElementById(index - 1 + "-live");
        var oldB = document.getElementById(index - 1 + "-live").firstElementChild;
        old.id = index - 1 + "-old";
        oldB.classList.remove("border-danger");
        oldB.classList.add("border-light");
        var button = document.getElementById("btn" + index);
        button.setAttribute('disabled', 'true');
    }

    switch (type) {
        case "liveShot":
            if (document.getElementById(index + "-preview")) {
                var border = document.getElementById(index + "-preview").firstElementChild;
                document.getElementById(index + "-preview").id = index + "-live";
                border.classList.remove("border-light");
                border.classList.add("border-danger");
                myAtem.autoTransition();
                break;
            } else if (document.getElementById(index)) {
                var border = document.getElementById(index).firstElementChild;
                document.getElementById(index).id = index + "-live";
                border.classList.remove("border-light");
                border.classList.add("border-danger");
                myAtem.autoTransition();
            }
            break;
        case "graphic":
            if (document.getElementById(index + "-preview")) {
                var border = document.getElementById(index + "-preview").firstElementChild;
                document.getElementById(index + "-preview").id = index + "-live";
                border.classList.remove("border-light");
                border.classList.add("border-danger");
                myAtem.autoTransition();
                break;
            } else if (document.getElementById(index)) {
                var border = document.getElementById(index).firstElementChild;
                document.getElementById(index).id = index + "-live";
                border.classList.remove("border-light");
                border.classList.add("border-danger");
                myAtem.autoTransition();
            } else
                break;
        case "video":
            if (document.getElementById(index + "-preview")) {
                var border = document.getElementById(index + "-preview").firstElementChild;
                document.getElementById(index + "-preview").id = index + "-live";
                border.classList.remove("border-light");
                border.classList.add("border-danger");
                myAtem.autoTransition();
                break;
            } else if (document.getElementById(index)) {
                var border = document.getElementById(index).firstElementChild;
                document.getElementById(index).id = index + "-live";
                border.classList.remove("border-light");
                border.classList.add("border-danger");
                myAtem.autoTransition();
            }
            break;

    }
    var button = document.getElementById("btn" + index);
    button.setAttribute('disabled', 'true');
    preview(index + 1);
}


//Handles all Preview Control
function preview(index) {
    var next = document.getElementById(index);
    if (document.getElementById(index)) {
        var border = document.getElementById(index).firstElementChild;
        next.id = index + "-preview";

        border.classList.remove("border-light");
        border.classList.add("border-success");
    }
}
