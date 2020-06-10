var gl, points;

window.onload = function init() {
    
    // Setup WebGL
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert( "Your browser doesn't support WebGL." );
    }

    // Initialiize vertices of a triangle
    var vertices = [
        glMatrix.vec2.fromValues( -0.75, -0.75 ),
        glMatrix.vec2.fromValues(   0.0,  0.75 ),
        glMatrix.vec2.fromValues(  0.75, -0.75 )
    ];

    try {
        points = flat( vertices ); // flatten glMatrix vec2 elements of vertices
    } catch ( error ) {
        alert( "Vertices couldn't flattened." );
    }

    // Setup window screen
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Initialise and load shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create a buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    // Associate shader variables with the buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();

}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}