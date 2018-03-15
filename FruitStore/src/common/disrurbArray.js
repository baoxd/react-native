export default (array) => {
    const len = array.length;
    array.forEach((v, i) => {
        const random = Math.floor( Math.random() * len );
        [array[i], array[random]] = [array[random], array[i]];
    });
    return array;
}