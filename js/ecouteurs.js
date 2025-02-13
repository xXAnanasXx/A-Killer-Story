function initListeners(inputStates, canvas) {
    window.onkeydown = (event) => {
        //console.log("Touche pressée : " + event.key);
        if(event.key === "ArrowRight" || event.key === "d") {
            inputStates.ArrowRight = true;
        }
        if(event.key === "ArrowLeft" || event.key === "q") {
            inputStates.ArrowLeft = true;
        }
        if(event.key === "ArrowUp" || event.key === "z") {
            inputStates.ArrowUp = true;
        }
        if(event.key === "ArrowDown" || event.key === "s") {
            inputStates.ArrowDown = true;
        }
    }

    window.onkeyup = (event) => {
        //console.log("Touche relachée : " + event.key);
        if(event.key === "ArrowRight" || event.key === "d") {
            inputStates.ArrowRight = false;
        }
        if(event.key === "ArrowLeft" || event.key === "q") {
            inputStates.ArrowLeft = false;
        }
        if(event.key === "ArrowUp" || event.key === "z") {
            inputStates.ArrowUp = false;
        }
        if(event.key === "ArrowDown" || event.key === "s") {
            inputStates.ArrowDown = false;
        }
    }

    window.onmousemove = (event) => {
        // get proper x and y for the mouse in the canvas
        inputStates.mouseX = event.clientX - canvas.getBoundingClientRect().left;
        inputStates.mouseY = event.clientY - canvas.getBoundingClientRect().top;
    }
}

export { initListeners };