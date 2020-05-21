const electron = require('electron')
const editJsonFile = require("edit-json-file");
const ipcRenderer = electron.ipcRenderer;
const { desktopCapturer } = electron;
let preset = editJsonFile(`${__dirname}/assets/data/broadcastPreset.json`);
var curLive = 0;
var curPreview = 0;

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
    var factor = 0;
    for (i = 0; i < lis.length; i++) {
        if (lis[i].value) {
            newCard(lis[i].value, i - factor, sel[i].value);
        } else {
          factor += 1;
        }
    }
    document.getElementById("tempListItm").parentNode.removeChild(tempListItm);
    document.getElementById("optionList").removeChild(tempLiveShotText);
    document.getElementById("optionList").removeChild(tempGraphicText);
    document.getElementById("optionList").removeChild(tempVideoText);
    $('#mainModal').modal('hide')
}

//New Cards
function newCard(name, index, type) {
  var itemList = document.getElementById("timeline");
  var optionsList = document.getElementById("optionList");
  var tempListItm = document.getElementById("tempListItm");
  var tempLiveShotText = document.getElementById("tempLiveShotText");
  var tempGraphicText = document.getElementById("tempGraphicText");
  var tempVideoText = document.getElementById("tempVideoText");
  switch (type) {
    case "Live Shot":
      var newItemListItm = tempListItm.cloneNode(true);
      var newLiveShotText = tempLiveShotText.cloneNode(true);
      //Make New Item in Rundown
      newItemListItm.innerHTML = name;
      newItemListItm.id = index;
      newItemListItm.href = "#" + "list-" + index;
      var typ = document.createElement("small");
            typ.innerHTML = " " + type;
            newItemListItm.appendChild(typ);

      itemList.appendChild(newItemListItm);
      //Make New Item for Options
      newLiveShotText.id = "list-" + index;
      //newLiveShotText.innerHTML = index + " TEXT " + type;

      optionsList.appendChild(newLiveShotText);
      break;
      case "Video":
        var newItemListItm = tempListItm.cloneNode(true);
        var newVideoText = tempVideoText.cloneNode(true);
        //Make New Item in Rundown
        newItemListItm.innerHTML = name;
        newItemListItm.id = index;
        newItemListItm.href = "#" + "list-" + index;
        var typ = document.createElement("small");
              typ.innerHTML = " " + type;
              newItemListItm.appendChild(typ);

        itemList.appendChild(newItemListItm);
        //Make New Item for Options
        newVideoText.id = "list-" + index;
        newVideoText.innerHTML = index + " TEXT " + type;
        optionsList.appendChild(newVideoText);
        break;

        case "Graphic":
          var newItemListItm = tempListItm.cloneNode(true);
          var newGraphicText = tempGraphicText.cloneNode(true);
          //Make New Item in Rundown
          newItemListItm.innerHTML = name;
          newItemListItm.id = index;
          newItemListItm.href = "#" + "list-" + index;
          var typ = document.createElement("small");
                typ.innerHTML = " " + type;
                newItemListItm.appendChild(typ);

          itemList.appendChild(newItemListItm);
          //Make New Item for Options
          newGraphicText.id = "list-" + index;
          newGraphicText.innerHTML = index + " TEXT " + type;
          optionsList.appendChild(newGraphicText);
          break;

  }

}

const { Atem } = require('atem-connection')
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

function next(){
if(document.getElementById(curPreview + "-preview")){
var currPre = document.getElementById(curPreview + "-preview");
var currLive = document.getElementById(curLive + "-live");
var newPre = document.getElementById(curPreview + 1);
currLive.classList.remove("list-group-item-danger");
//Trigger Graphic Here
currPre.classList.remove("list-group-item-success");
currPre.classList.add("list-group-item-danger");
currPre.id = curLive+1 + "-live";
currLive.id = curLive + "-old";
if(newPre){
newPre.id = curPreview + 1 + "-preview";
newPre.classList.add("list-group-item-success");
curPreview++;
} else {
document.getElementById("nextBtn").setAttribute('disabled','true');
}
curLive++;

} else {
var live = document.getElementById("0");
live.id = "0-live";
live.classList.add("list-group-item-danger");
var preview = document.getElementById("1");
preview.classList.add("list-group-item-success");
preview.id = "1-preview";
curPreview++;
}
}
