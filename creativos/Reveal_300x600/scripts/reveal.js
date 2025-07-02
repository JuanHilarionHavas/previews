const slider = document.querySelector("#image-comparison-slider");
const sliderImgWrapper = document.querySelector("#image-comparison-slider .img-wrapper");
const sliderHandle = document.querySelector("#image-comparison-slider .handle");
let flag = true, 
contadorAfk = 0, 
initcounter,
animation = 0,
side,
timeout,
isSliderLocked = false;

const initInterval = () =>{
        //Cada segundo se lanza la función ctrlTiempo
      timeout = setTimeout(() => {
            initcounter = setInterval(ctrlTiempo, 1000); 
            sliderImgWrapper.classList.add("init_an");
            sliderHandle.classList.add("init_ani");
        }, 4000);      
}

function reset_animation() {
    /*
    var r= document.querySelector(':root');
    let position, handleposition

    sliderImgWrapper.style.width == "" ? position = "50%": position = sliderImgWrapper.style.width
    handleposition = 100 - parseFloat(position)
    handleposition = `calc(${handleposition}% - 25px)`;

    r.style.setProperty('--final-position_img', position);
    r.style.setProperty('--final-position_handle', handleposition);

    */

    sliderImgWrapper.style.animationDelay = "0.5s!important";
    sliderImgWrapper.style.animation = 'none';
    sliderImgWrapper.offsetHeight; /* trigger reflow */
    sliderImgWrapper.style.animation = null;

    sliderHandle.style.animationDelay = "0.5s!important";
    sliderHandle.style.animation = 'none';
    sliderHandle.offsetHeight; /* trigger reflow */
    sliderHandle.style.animation = null; 

    contadorAfk = 0;
  }

  function cancel_animation() {
    sliderImgWrapper.style.animation = 'none';
    sliderImgWrapper.style.animation = null;
    sliderImgWrapper.style.animationPlayState = "initial";

    sliderHandle.style.animation = 'none';
    sliderHandle.style.animation = null;
    sliderHandle.style.animationPlayState = "initial";
  }

function ctrlTiempo() {
    //Se aumenta en 1 la variable.
    contadorAfk = contadorAfk + 1;

    //Se comprueba si ha pasado del tiempo que designemos.
    if (contadorAfk >= 6) { 
        animation = animation + 1;
        if (animation > 2){
            clearInterval(initcounter)
        }else{
            reset_animation()
        }
    }
}


slider.addEventListener("mousemove", sliderMouseMove);
slider.addEventListener("touchmove", sliderMouseMove);

function sliderMouseMove(event) {

    clearInterval(initcounter);
    cancel_animation();
    clearTimeout(timeout);

    if(isSliderLocked) return;

    const sliderLeftX = slider.offsetLeft;
    const sliderWidth = slider.clientWidth;
    const sliderHandleWidth = sliderHandle.clientWidth;
    const sliderMidWitdh = sliderWidth/5

    let leftZone = sliderMidWitdh,
        rigthZone = sliderWidth - sliderMidWitdh

    let mouseX = (event.clientX || event.touches[0].clientX) - sliderLeftX;

        if (mouseX <= leftZone && flag){
            Enabler.counter('Left', true);
            side = "Left";
            flag = false
            Enabler.counter('Dragged', true);
        }else if(mouseX >= rigthZone && flag){
            Enabler.counter('Right', true);
            side = "Right";
            flag = false
            Enabler.counter('Dragged', true);
        }else if(mouseX < rigthZone && mouseX > leftZone && !flag){
            flag = true
        }

    if(mouseX < 0) mouseX = 0;
    else if(mouseX > sliderWidth) mouseX = sliderWidth;
    
    sliderImgWrapper.style.width = `${((1 - mouseX/sliderWidth) * 100).toFixed(4)}%`;
    sliderHandle.style.left = `calc(${((mouseX/sliderWidth) * 100).toFixed(4)}% - ${sliderHandleWidth/2}px)`;
    isSliderLocked = false;
}



slider.addEventListener("mousedown", sliderMouseDown);
slider.addEventListener("touchstart", sliderMouseDown);
slider.addEventListener("mouseup", sliderMouseUp);
slider.addEventListener("touchend", sliderMouseUp);
slider.addEventListener("mouseleave", sliderMouseLeave);

function sliderMouseDown(event) {
    if(isSliderLocked) isSliderLocked = false;
    sliderMouseMove(event);
}

function sliderMouseUp() {
    if(!isSliderLocked) isSliderLocked = true;
}

function sliderMouseLeave() {
    if(isSliderLocked) isSliderLocked = false;
}