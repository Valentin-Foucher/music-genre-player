export const createRandomColor = () => {
    let hexCode = '';
    var hexValues = '0123456789abcdef';
    
    for ( var i = 0; i < 6; i++ ) {
      hexCode += hexValues.charAt(Math.floor(Math.random() * hexValues.length));
    }
    return hexCode;
}