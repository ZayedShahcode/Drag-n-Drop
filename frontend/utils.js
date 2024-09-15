export const setNewOffset = (card,mouseMoveDir = {x:0,y:0})=>{
    const offsetLeft = card.offsetLeft - mouseMoveDir.x;
    const offsetTop = card.offsetTop - mouseMoveDir.y;

    return {
        x: offsetLeft < 0 ? 0 : offsetLeft,
        y:offsetTop < 0 ? 0: offsetTop
    }
}

export function autoGrow(textAreaRef) {
    const { current } = textAreaRef;
    current.style.height = "auto"; // Reset the height
    current.style.height = current.scrollHeight + "px"; // Set the new height
}

export const setZIndex = (selectedCard) => {
    selectedCard.style.zIndex = 999;
 
    Array.from(document.getElementsByClassName("card")).forEach((card) => {
        if (card !== selectedCard) {
            card.style.zIndex = selectedCard.style.zIndex - 1;
        }
    });
};

export const bodyParser=(value)=>{
    try{
        return JSON.parse(value)
    }catch(err){
        return value;
    }
}

export const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days*24*60*60*1000);
   
    document.cookie = `${name}=${value};expires=${expirationDate.toUTCString()}; path=/`;
   };

export const getCookie = (name) => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));
   
    return cookies ? cookies.split("=")[1] : null;
   };