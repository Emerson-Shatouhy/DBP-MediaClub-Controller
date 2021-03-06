const {
  ProgramInputCommand
} = require("atem-connection/dist/commands");

var curLive = 0;
var curPreview = 0;
var previewMedia = 0;
var first = true;

var previewCanvas = document.getElementById('previewCanvas');
var previewCtx = previewCanvas.getContext('2d');
var liveCanvas = document.getElementById('liveCanvas');
var liveCtx = liveCanvas.getContext('2d');

$('#previewCanvas').css('width', '100%');
$('#liveCanvas').css('width', '100%');
$(window).resize(function () {
  $('#previewCanvas').height($('#previewCanvas').width() / 1.78);
  $('#liveCanvas').height($('#liveCanvas').width() / 1.78);
});
//ATEM Setup
const myAtem = new Atem({
  externalLog: console.log
})

myAtem.connect('192.168.1.20')

myAtem.on('connected', () => {
  document.getElementById("statusText").innerHTML = myAtem.state.info.productIdentifier + " has been connected!"
  $('#status').show();
})


//Create the Modal List
var sortable = Sortable.create(rundownList, {
  animation: 150,
});

//Key Bindings
Mousetrap.bind('1', function () {
  $('#0').tab('show')
});
Mousetrap.bind('2', function () {
  $('#1').tab('show')
});
Mousetrap.bind('3', function () {
  $('#2').tab('show')
});
Mousetrap.bind('4', function () {
  $('#3').tab('show')
});
Mousetrap.bind('5', function () {
  $('#4').tab('show')
});
Mousetrap.bind('6', function () {
  $('#5').tab('show')
});
Mousetrap.bind('7', function () {
  $('#6').tab('show')
});
Mousetrap.bind('8', function () {
  $('#7').tab('show')
});
Mousetrap.bind('enter', function () {
  next();
});


//New Item in list
function newSegment() {
  var temp = document.getElementById("item0");
  var item = temp.cloneNode(true);
  var div1 = item.firstElementChild;
  var input = div1.firstElementChild;
  input.value = "";
  document.getElementById("rundownList").appendChild(item);

  $('.delete').on('click', function () {
    $(this).parent().parent().remove();
    document.getElementById("newSegment").removeAttribute('disabled');
  });
  var list = document.getElementById("rundownList").getElementsByTagName("input");
  if (list.length > 20) {
    document.getElementById("newSegment").setAttribute('disabled', 'true');
  } else {
    document.getElementById("newSegment").removeAttribute('disabled');
  }
}

//Show Modal and Add the List
$(document).ready(function () {

  $('#status').hide();
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
  $('.delete').on('click', function () {
    $(this).parent().parent().remove();
    document.getElementById("newSegment").removeAttribute('disabled');
  });
  var img1 = new Image();
  img1.addEventListener('load', function () {
    liveCtx.drawImage(img1, 0, 0, liveCanvas.width, liveCanvas.height);
    previewCtx.drawImage(img1, 0, 0, previewCanvas.width, previewCanvas.height);
  }, false);
  img1.src = "./assets/images/colorbars.png";

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
  //Clear ATEM Media Pool
  for (i = 0; i <= 20; i++) {
    myAtem.clearMediaPoolStill(i);
  }
  myAtem.changePreviewInput(1000);
  myAtem.changeProgramInput(1000);
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
      newItemListItm.href = "#" + "option-" + index + "-liveShot";
      var typ = document.createElement("small");
      typ.innerHTML = " " + type;
      newItemListItm.appendChild(typ);

      itemList.appendChild(newItemListItm);
      //Make New Item for Options
      newLiveShotText.id = "option-" + index + "-liveShot";
      optionsList.appendChild(newLiveShotText);

      document.getElementById("option-" + index + "-liveShot").querySelector("#cameraSelect").id = "cameraSelect-" + index;

      break;
    case "Video":
      var newItemListItm = tempListItm.cloneNode(true);
      var newVideoText = tempVideoText.cloneNode(true);
      //Make New Item in Rundown
      newItemListItm.innerHTML = name;
      newItemListItm.id = index;
      newItemListItm.href = "#" + "option-" + index + "-video";
      var typ = document.createElement("small");
      typ.innerHTML = " " + type;
      newItemListItm.appendChild(typ);

      itemList.appendChild(newItemListItm);
      //Make New Item for Options
      newVideoText.id = "option-" + index + "-video";
      newVideoText.innerHTML = index + " TEXT " + type;
      optionsList.appendChild(newVideoText);
      break;

    case "Graphic":
      var newItemListItm = tempListItm.cloneNode(true);
      var newGraphicText = tempGraphicText.cloneNode(true);
      //Make New Item in Rundown
      newItemListItm.innerHTML = name;
      newItemListItm.id = index;
      newItemListItm.href = "#" + "option-" + index + "-graphic";
      var typ = document.createElement("small");
      typ.innerHTML = " " + type;
      newItemListItm.appendChild(typ);

      itemList.appendChild(newItemListItm);
      //Make New Item for Options
      newGraphicText.id = "option-" + index + "-graphic";

      optionsList.appendChild(newGraphicText);

      document.getElementById("option-" + index + "-graphic").querySelector("#uploadPreview-temp").id = "uploadPreview-" + index;
      document.getElementById("option-" + index + "-graphic").querySelector("#uploadImage-temp").setAttribute("onChange", `PreviewImage(${index});`);
      document.getElementById("option-" + index + "-graphic").querySelector("#uploadImage-temp").id = "uploadImage-" + index;
      break;

  }

}

//Handles Setting Next Live and Next Preview
function next() {
  if (document.getElementById(curPreview + "-preview")) {
    var currPre = document.getElementById(curPreview + "-preview");
    var currLive = document.getElementById(curLive + "-live");
    var newPre = document.getElementById(curPreview + 1);
    currLive.classList.remove("list-group-item-danger");
    //Trigger Graphic Here
    currPre.classList.remove("list-group-item-success");
    currPre.classList.add("list-group-item-danger");
    currPre.id = curLive + 1 + "-live";
    currLive.id = curLive + "-old";
    if (newPre) {
      newPre.id = curPreview + 1 + "-preview";
      newPre.classList.add("list-group-item-success");
      curPreview++;
    } else {
      document.getElementById("nextBtn").setAttribute('disabled', 'true');
    }
    curLive++;

  } else {
    var newLive = document.getElementById("0");
    newLive.id = "0-live";
    newLive.classList.add("list-group-item-danger");
    var newPreview = document.getElementById("1");
    newPreview.classList.add("list-group-item-success");
    newPreview.id = "1-preview";
    curPreview++;
  }
  live(curLive);
  preview(curPreview);

}

//Handles image preview for all Graphics
function PreviewImage(index) {
  var oFReader = new FileReader();
  oFReader.readAsDataURL(document.getElementById("uploadImage-" + index).files[0]);

  oFReader.onload = function (oFREvent) {
    document.getElementById("uploadPreview-" + index).src = oFREvent.target.result;
  };
}

//Sets Live
function live(index) {
  if (!first) {
    myAtem.cut();
  } else {
    if (document.getElementById("option-" + index + "-liveShot")) {
      var cam = document.getElementById("cameraSelect-" + index).value;
      myAtem.changePreviewInput(cam);
      myAtem.cut();
      updateLive("liveShot");
    } else if (document.getElementById("option-" + index + "-graphic") && first) {
      var graphic = document.getElementById("uploadPreview-" + index).src;
      updateLive("graphic", graphic);
      myAtem.changePreviewInput(3010);
      myAtem.cut();

    } else {
      myAtem.cut();
    }
    first = false;
  }
  updateLive("graphic", graphic);
}

//Sets Preview
function preview(index) {
  if (document.getElementById("option-" + index + "-liveShot")) {
    var cam = document.getElementById("cameraSelect-" + index).value;
    updatePreview("liveshot");
    myAtem.changePreviewInput(cam);
  } else if (document.getElementById("option-" + index + "-graphic")) {
    var graphic = document.getElementById("uploadPreview-" + index).src;
    updatePreview("graphic", graphic);
    switch (previewMedia) {
      case 0:
        myAtem.changePreviewInput(3020);
        break

      case 1:
        myAtem.changePreviewInput(3010);
    }
  }
}

function updatePreview(option, src) {
  if (document.getElementById(curPreview + "-preview")) {
    switch (option) {
      case "liveshot":

        break
      case "graphic":
        var img = new Image(previewCanvas.width, previewCanvas.height);
        img.src = src;
        previewCtx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
        var canvas = document.getElementById("temp")
        canvas.height = 1080;
        canvas.width = 1920;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1920, 1080);
        var imgData = ctx.getImageData(10, 10, 1920, 1080).data;
        myAtem.uploadStill(previewMedia, imgData, "MEDIA", "MEDIA");
        updateMediaPool();
        break
    }
  } else {
    var img1 = new Image();
    img1.addEventListener('load', function () {
      previewCtx.drawImage(img1, 0, 0, previewCanvas.width, previewCanvas.height);
    }, false);
    img1.src = "./assets/images/colorbars.png";
  }
}


function updateLive(option, src) {
  if (!first) {
    liveCtx.drawImage(previewCanvas, 0, 0)
  } else {
    switch (option) {
      case "liveshot":

        break
      case "graphic":
        var img = new Image(liveCanvas.width, liveCanvas.height);
        img.src = src;
        img.addEventListener('load', function () {
          liveCtx.drawImage(img, 0, 0, liveCanvas.width, liveCanvas.height)
        }, false);

        var canvas = document.getElementById("temp")
        canvas.height = 1080;
        canvas.width = 1920;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1920, 1080);
        var imgData = ctx.getImageData(10, 10, 1920, 1080).data;
        myAtem.uploadStill(previewMedia, imgData, "MEDIA", "MEDIA");

        updateMediaPool();
        break
    }
  }

}

function updateMediaPool() {
  if (previewMedia == 1) {
    previewMedia--;
  } else {
    previewMedia++;
  }
}

//Sleep Function
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}