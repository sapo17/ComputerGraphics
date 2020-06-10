var gl, points;

window.onload = function init() {
    
    // initialize the system
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL( canvas );
    
    if ( !gl ) {
        alert( "WebGL isn't available." );
    }

    // initialize vertices of the box
    vertices = [ 
        glMatrix.vec2.fromValues( -0.75, -0.75 ),
        glMatrix.vec2.fromValues( -0.75,  0.75 ),
        glMatrix.vec2.fromValues(  0.75, -0.75 ),
        glMatrix.vec2.fromValues(  0.75,  0.75 ),
    ];

    try {
        points = flat( vertices ); // fllatten glMatrix vector
    } catch ( error ) {
        alert( "Vertices couldn't flattened." );
    }

    // Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    // Load Shader
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Initialize buffer
    var buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW );

    // Associating shader variables with the data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
    
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, points.length );
}