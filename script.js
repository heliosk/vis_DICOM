cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.init({
    showSVGCursors: true
});

let loaded = false;
let freehandRoiEnabled = false;
let angleEnabled = false;
let eraserEnabled = false;

const realFileButton = document.getElementById('real-file');
const fileButton = document.getElementById('file-button');
const fileText = document.getElementById('file-text');

const dropZone = document.getElementById('dicomImage');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

const element = document.getElementById('dicomImage');
cornerstone.enable(element);

fileButton.addEventListener("click", function() {
    realFileButton.click();
});

realFileButton.addEventListener("change", function() {
    if (realFileButton.value) {
        fileText.innerHTML = realFileButton.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
    } else {
        fileText.innerHTML = "Selecione um arquivo ...";
    }
});

document.getElementById('real-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    loadAndViewImage(imageId);
});

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files;
    file = files[0];

    const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
    loadAndViewImage(imageId);
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function loadAndViewImage(imageId) {

    const element = document.getElementById('dicomImage');

    cornerstone.loadImage(imageId).then(function(image) {

        const viewport = cornerstone.getDefaultViewportForImage(element, image);

        cornerstone.displayImage(element, image, viewport);
        loaded = (!loaded) ? true : false;

    }).catch(function(err) {
        alert(err);
    });
}

function handleFreehandRoi(element) {

    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;

    addActiveClass(element);

    if ((loaded) && (!freehandRoiEnabled)) {

        freehandRoiEnabled = true;
        cornerstoneTools.addTool(FreehandRoiTool)
        cornerstoneTools.setToolActive('FreehandRoi', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('FreehandRoi');
        freehandRoiEnabled = false;
    }
}

function handleAngle(element) {

    const AngleTool = cornerstoneTools.AngleTool;

    addActiveClass(element);

    if ((loaded) && (!angleEnabled)) {

        angleEnabled = true;
        cornerstoneTools.addTool(AngleTool)
        cornerstoneTools.setToolActive('Angle', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('Angle');
        angleEnabled = false;
    }
}

function handleEraser(element) {
    const EraserTool = cornerstoneTools.EraserTool;

    addActiveClass(element);

    if ((loaded) && (!eraserEnabled)) {

        eraserEnabled = true;
        cornerstoneTools.addTool(EraserTool)
        cornerstoneTools.setToolActive('Eraser', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('Eraser');
        eraserEnabled = false;
    }
}

function addActiveClass(element) {
    let elements = document.querySelectorAll('.button');

    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');   
    }

    element.classList.add('active');
}