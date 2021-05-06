// returns a new flattened Float32Array
// if given argument is an Array,
// otherwise throws an Error
function array_flatter( array ) {

    if ( !(array instanceof Array) ) {
        throw new Error( 'Given argument must be an array to be flattened');
    }

    let n = 0;
    vertices.forEach( array => {
        n += array.length;
    });

    let points = new Float32Array( n );
    let idx = 0;
    for ( let i = 0; i < vertices.length; ++i ) {
        for ( let j = 0; j < vertices[i].length; ++j ) {
            points[ idx++ ] = vertices[i][j];
        }
    }
    
    return points;
}