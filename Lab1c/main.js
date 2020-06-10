// flags for picking an object
var objectAtDefault = true;
var objectPicked = false;
var onGround = true;

var at = vec3.fromValues( 0, 0, 0 );    // camera's looking at
var up = vec3.fromValues( 0, 1, 0 );    // orthogonal up vector
var eye = vec3.fromValues( 0, 0, 3 );   // VRP position

var render; // reference for rendering

var modelViewLoc, projectionLoc, normalMatrixLoc;
var modelViewMatrix = mat4.create(), projectionMatrix = mat4.create(), normalMatrix = mat3.create();

function main() {
   
    // setting up WebGL
    canvas = document.getElementById( "gl-canvas" );
    var gl = WebGLUtils.setupWebGL( canvas );
   
    if ( !gl ) {
        alert( "WebGL isn't available." );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.05, 0.10, 0.20, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    // settiing up WebGl ends

    // initialise and load Shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // retrieves projectionMatrix's, normalMatrix's Location
    modelViewLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
    
    // init UserInput
    ui = new UserInput( gl, program );
    
    // handles keyboard input
    window.onkeydown = function ( event ) {
        ui.input( event );
    }
    
    // create CanadArm
    var canadArm = new CanadArm( program, gl, ui );
    canadArm.create();

    // ui: sets canadArm as the picker
    ui.setPicker( canadArm );
    
    // creates a cube to pick
    var cube = new Cube( gl, true );
    cube.create(); 

    // objects to render
    var objects = [ canadArm, cube ];
    ui.setObjects( objects );
    
    // init render
    render = new Render( gl, program, ui );
    render.setObjectsToRender( objects );

    // Default Lightning, Fragment Shading
    var light = new Lightning( gl, program );
    light.letThereBeLight( objects );
    ui.setLight( light );
    
    // initialise and send the projection matrix
    mat4.perspective( projectionMatrix,  45 * Math.PI / 180, canvas.width/canvas.height, 1, 30  );
    gl.uniformMatrix4fv( projectionLoc, false, projectionMatrix );

    startRender();
    
    function startRender() {

        render.renderObjects();
        requestAnimationFrame( startRender );

    }
    
}
