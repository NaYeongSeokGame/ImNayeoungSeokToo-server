const generatePin = () => {
    const charList = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let generatedPin = '';

    for (let index = 0; index < 6; index++) {
        const randomIndex = Math.floor(Math.random() * charList.length);
        generatedPin += charList[randomIndex];
    }

    return generatedPin;
}

export default generatePin;