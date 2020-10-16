cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.init({
    showSVGCursors: true
});

let loaded = false;
let series = [];

const realFileButton = document.getElementById('real-file');
const fileButton = document.getElementById('file-button');
const fileText = document.getElementById('file-text');
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
    
    if (e.target.files.length === 1) {
        const file = e.target.files[0];

        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
        loadAndViewImage(imageId);

    } else {

        const files = e.target.files;

        Array.from(files).forEach(file => {
            let imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);

            series.push(imageId);
            loadAndViewImage(imageId);
        });
    }
});

function loadAndViewImage(imageId) {

    const element = document.getElementById('dicomImage');
    
    // limpar canvas e adicionar novos elementos
    cornerstone.disable(element);
    cornerstone.enable(element);

    cornerstone.loadImage(imageId).then(function(image) {

        const viewport = cornerstone.getDefaultViewportForImage(element, image);

        cornerstone.displayImage(element, image, viewport);
        loaded = true;

    }).catch(function(err) {
        alert(err);
    });
}

function handleFreehandRoi(element) {

    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;

    addActiveClass(element);

    if (loaded) {

        cornerstoneTools.addTool(FreehandRoiTool)
        cornerstoneTools.setToolActive('FreehandRoi', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('FreehandRoi');
    }
}

function handleAngle(element) {

    const AngleTool = cornerstoneTools.AngleTool;

    addActiveClass(element);

    if (loaded) {

        cornerstoneTools.addTool(AngleTool)
        cornerstoneTools.setToolActive('Angle', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('Angle');
    }
}

function handleEraser(element) {
    const EraserTool = cornerstoneTools.EraserTool;

    addActiveClass(element);

    if (loaded) {

        cornerstoneTools.addTool(EraserTool)
        cornerstoneTools.setToolActive('Eraser', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('Eraser');
    }
}

function handleProbe(element) {
    const ProbeTool = cornerstoneTools.ProbeTool;

    addActiveClass(element);

    if (loaded) {

        cornerstoneTools.addTool(ProbeTool)
        cornerstoneTools.setToolActive('Probe', {
            mouseButtonMask: 1
        });

    } else {
        cornerstoneTools.removeTool('Probe');
    }
}

function handleStackScrollMouseWheel(htmlElement) {
    const element = document.getElementById('dicomImage');
    const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;

    if (series.length < 1) {
        alert('É necessário fazer upload de vários DICOM');
        return false;
    }

    addActiveClass(htmlElement);

    const imageIds = series.map(seriesImage => seriesImage);
    const stack = {
        currentImageIdIndex: 0,
        imageIds
    };
        
    cornerstoneTools.addStackStateManager(element, ['stack']);
    cornerstoneTools.addToolState(element, 'stack', stack);
    
    cornerstoneTools.addTool(StackScrollMouseWheelTool);
    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
}

function addActiveClass(element) {
    let elements = document.querySelectorAll('.button');

    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');   
    }

    element.classList.add('active');
}