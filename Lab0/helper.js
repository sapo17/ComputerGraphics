// returns a new flattened Float32Array if given argument is an Array, otherwise throws an Error
function flat( vertices ) {
    
    if ( !( vertices instanceof Array ) ) throw new Error( "Argument must be type of an array." );

    var n = 0;
    vertices.forEach( array => {
        n += array.length;
    } );

    var points = new Float32Array( n );
    var idx = 0;
    for ( let i = 0; i < vertices.length; ++i ) {
        for ( let j = 0; j < vertices[i].length; ++j ) {
            points[ idx++ ] = vertices[i][j]; 
        }
    }

    return points;

}