const reader = new FileReader();
var globalIndex = 0;
var previewMedia = 0;
var card = document.getElementById("tempCard");
var cardButton = document.getElementById("tempButton");
const myAtem = new Atem({
    externalLog: console.log
})
myAtem.connect('192.168.1.28')

myAtem.on('connected', () => {
    console.log("Connected")
})

function previewFiles() {

    var preview = document.querySelector('#preview');
    var files = document.querySelector('input[type=file]').files;

    function readAndPreview(file) {

        var reader = new FileReader();

        reader.addEventListener("load", function () {

            newCard(globalIndex);

            var image = new Image();
            image.height = 100;
            image.width = 500;
            image.title = file.name;
            image.src = this.result;
            document.getElementById(globalIndex + "-image").src = this.result;
            var title = image.title.substring(0, image.title.indexOf("."))
            document.getElementById(globalIndex + "-title").innerHTML = title;
            globalIndex++;
        }, false);

        reader.readAsDataURL(file);


    }

    if (files) {
        [].forEach.call(files, readAndPreview);
    }
    for (i = 0; i <= 20; i++) {
        myAtem.clearMediaPoolStill(i);
    }
    var previewInput = document.getElementById("preview");
    document.getElementById("tempCard").parentNode.removeChild(card);
    document.getElementById("tempbutton").parentNode.removeChild(cardButton);
    document.getElementById("preview").removeChild(previewInput)
    console.log("DONE");
}



function newCard(index) {
    var newCard = card.cloneNode(true);
    //Title Handling
    var newTitle = document.createElement("div")
    newTitle.classList.add("card-header");
    newTitle.innerHTML = "TEMP";
    newTitle.id = index + "-title";
    //Button Handling
    var newButton = cardButton.cloneNode(true);
    newButton.id = "preview-" + index;
    //ID Setting
    newCard.id = index;
    newCard.firstElementChild.id = index + "-image";
    //Appended everything to newCard then to List
    newCard.appendChild(newTitle);
    newCard.appendChild(newButton);
    document.getElementById("list").appendChild(newCard);
}


function preview(id) {
    console.log("Preview:" + id);
    var index = id.substring(8, id.length);
    var img = document.getElementById(index + "-image")
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 1920;
    canvas.height = 1080;
    context.drawImage(img, 0, 0, 1920, 1080);
    var imgData = context.getImageData(10, 10, 1920, 1080).data;
    // console.log(imgData);
    //document.getElementById("list").appendChild(canvas);
    myAtem.uploadStill(previewMedia, imgData, "MEDIA" + id, "MEDIA" + id);
    if (previewMedia == 0) {
        previewMedia++;
        //document.getElementById("indicator").innerHTML = "Current Preview:" + previewMedia--;
    } else {
        previewMedia--;
        //document.getElementById("indicator").innerHTML = "Current Preview:" + previewMedia++;
    }
}