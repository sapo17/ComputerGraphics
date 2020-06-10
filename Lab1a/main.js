var theta = 0;                      // default amount of rotation
var rotationAxis = "X";             // default rotation axis
var clockWise = true;               // default rotation is clock wise                        
var rotationActivated = true;      // default rotation status

var globalScalingVector = vec3.fromValues( 0.2, 0.2, 0.2 );    
var localScalingVector = vec3.fromValues( 0.75, 0.75, 0.75 );
var globalTranslationVector = vec3.create();
var localTranslationVector = vec3.create(); 

var at = vec3.fromValues( 0, 0, 0 );    // camera's looking at
var up = vec3.fromValues( 0, 1, 0 );    // orthogonal up vector
var eye = vec3.fromValues( 0, 0, 2 );   // VRP position

var render; // reference for rendering

var modelViewLoc, projectionLoc, transformLoc;
var modelViewMatrix = mat4.create() , projectionMatrix = mat4.create();

function main() {
   
    // setting up WebGL
    canvas = document.getElementById( "gl-canvas" );
    var gl = WebGLUtils.setupWebGL( canvas );
   
    if ( !gl ) {
        alert( "WebGL isn't available." );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    // settiing up WebGl ends

    // initialise and load Shaders
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Shape creation
    var objects = [];
    for ( let i = 0; i < 9; ++i ) {
        if ( i < 3 ) {                  // creates 3 cubes
            var cube = new Cube( gl );
            cube.create();
            objects.push( cube );
        } else if ( i >= 3 && i < 6 ) { // creates 3 pyramids
            var pyramid = new Pyramid( gl );
            pyramid.create();
            objects.push( pyramid );
        } else if ( i >= 6 ) {          // creates 3 cones
            var cone = new Cone( gl );
            cone.create();
            objects.push( cone );
        } else {
            alert( "Object creation problem." );
            return -1;
        }
    }
    // Shape creation ends

    // gets modelViewMatrix's, projectionMatrix's and transform matrix's location
    modelViewLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionLoc = gl.getUniformLocation( program, "projectionMatrix" );
    transformLoc = gl.getUniformLocation( program, "transform" );

    // init render
    render = new Render( gl, program, objects );

    var globalView = true;          // Default is global view
    var chosenObject = 0;           // 0 corresponds to global view
    var cameraMovements = false;    // Default: Camera isn't active
    
    // chooses specific object 1-9 to render
    // x,X, y,Y, z,Z to scale object/s
    // w, s, e, q, d, a to change rotation
    // c to activate camera/deactivate camera movements
    // r to activate/deactivate rotation
    window.onkeypress = function ( event ) {
        var key = String.fromCharCode( event.keyCode );
        
        switch ( key ) {
            case '0': // Global View
                globalView = true;
                break;
            case '1': // Shape 1
                globalView = false;
                chosenObject = 1;
                break;
            case '2': // Shape 2
                globalView = false;
                chosenObject = 2;
                break;
            case '3': // Shape 3
                globalView = false;
                chosenObject = 3;
                break;
            case '4': // Shape 4
                globalView = false;
                chosenObject = 4;
                break;
            case '5': // Shape 5
                globalView = false;
                chosenObject = 5;
                break;
            case '6': // Shape 6
                globalView = false;
                chosenObject = 6;
                break;
            case '7': // Shape 7
                globalView = false;
                chosenObject = 7;
                break;
            case '8': // Shape 8
                globalView = false;
                chosenObject = 8;
                break;
            case '9': // Shape 9
                globalView = false;
                chosenObject = 9;
                break;
            // Scaling
            case 'x':
                globalView ? vec3.multiply( globalScalingVector, globalScalingVector, vec3.fromValues( 0.9, 1, 1) ) :   // global scaling
                             vec3.multiply( localScalingVector, localScalingVector, vec3.fromValues( 0.9, 1, 1 ) );     // local scaling
                break;
            case 'X':
                globalView ? vec3.multiply( globalScalingVector, globalScalingVector, vec3.fromValues( 1.1, 1, 1) ) :   // global scaling
                             vec3.multiply( localScalingVector, localScalingVector, vec3.fromValues( 1.1, 1, 1 ) );     // local scaling
                break;
            case 'y':
                globalView ? vec3.multiply( globalScalingVector, globalScalingVector, vec3.fromValues( 1, 0.9, 1) ) :   // global scaling
                             vec3.multiply( localScalingVector, localScalingVector, vec3.fromValues( 1, 0.9, 1 ) );     // local scaling
                break;
            case 'Y':
                globalView ? vec3.multiply( globalScalingVector, globalScalingVector, vec3.fromValues( 1, 1.1, 1) ) :   // global scaling
                             vec3.multiply( localScalingVector, localScalingVector, vec3.fromValues( 1, 1.1, 1 ) );     // local scaling
                break;
            case 'z':
                globalView ? vec3.multiply( globalScalingVector, globalScalingVector, vec3.fromValues( 1, 1, 0.9) ) :   // global scaling
                             vec3.multiply( localScalingVector, localScalingVector, vec3.fromValues( 1, 1, 0.9 ) );     // local scaling
                break;
            case 'Z':
                globalView ? vec3.multiply( globalScalingVector, globalScalingVector, vec3.fromValues( 1, 1, 1.1) ) :   // global scaling
                             vec3.multiply( localScalingVector, localScalingVector, vec3.fromValues( 1, 1, 1.1 ) );     // local scaling
                break;
            // Rotations
            case 'w':
                rotationActivated = true;
                clockWise = true;
                rotationAxis = "X";
                break;
            case 's':
                rotationActivated = true;
                clockWise = false;
                rotationAxis = "X";
                break;
            case 'e':
                rotationActivated = true;
                clockWise = true;
                rotationAxis = "Y";
                break;
            case 'q':
                rotationActivated = true;
                clockWise = false;
                rotationAxis = "Y";
                break;
            case 'd':
                rotationActivated = true;
                clockWise = true;
                rotationAxis = "Z";
                break;
            case 'a':
                rotationActivated = true;
                clockWise = false;
                rotationAxis = "Z";
                break;
            // activate camera movement
            case 'c':
                cameraMovements ? cameraMovements = false : cameraMovements = true;
                break;
            // activate rotation
            case 'r':
                rotationActivated ? rotationActivated = false : rotationActivated = true;
                break;
            default:
                if ( key === '.' || key === ',' ) break; // '.' and ',' implemented with onkeydown
                console.log( " Key " + key + " isn't implemented yet." );
                break;
        }
    
    }
    
    // RightArrow moves the camera/object rightwards
    // LeftArrow moves the camera/object leftwards
    // UpArrow moves the camera/object upwards
    // DownArrow moves the camera/object downwards
    // '.' moves the camera/object backwards
    // ',' moves the camera/object forwards
    window.onkeydown = function ( event ) {
        
        var key = event.key;
        if ( cameraMovements ) {                                        // cameraMovements: active
            
            switch ( key ) {
                case "ArrowRight":
                    vec3.add( eye, eye, vec3.fromValues( 1, 0, 0 ) );
                    break;
                case "ArrowLeft":
                    vec3.add( eye, eye, vec3.fromValues( -1, 0, 0 ) );
                    break;
                case "ArrowUp":
                    vec3.add( eye, eye, vec3.fromValues( 0, 1, 0 ) );
                    break;
                case "ArrowDown":
                    vec3.add( eye, eye, vec3.fromValues( 0, -1, 0 ) );
                    break;
                case ".":
                    vec3.add( eye, eye, vec3.fromValues( 0, 0, -1 ) );
                    break;
                case ",":
                    vec3.add( eye, eye, vec3.fromValues( 0, 0, 1 ) );
                    break;
                default:
                    break;
            }

        } else {                                                        // cameraMovements: deactive
                                                                        //  moves the objects according to the global or local view
            switch ( key ) {
                case "ArrowRight":
                    globalView ? vec3.add( globalTranslationVector, globalTranslationVector, vec3.fromValues( 0.5, 0, 0 ) ) :
                                 vec3.add( localTranslationVector, localTranslationVector, vec3.fromValues( 1, 0, 0 ) );
                    break;
                case "ArrowLeft":
                    globalView ? vec3.add( globalTranslationVector, globalTranslationVector, vec3.fromValues( -0.5, 0, 0 ) ) :
                                 vec3.add( localTranslationVector, localTranslationVector, vec3.fromValues( -1, 0, 0 ) );
                    break;
                case "ArrowUp":
                    globalView ? vec3.add( globalTranslationVector, globalTranslationVector, vec3.fromValues( 0, 0.5, 0 ) ) :
                                 vec3.add( localTranslationVector, localTranslationVector, vec3.fromValues( 0, 1, 0 ) );
                    break;
                case "ArrowDown":
                    globalView ? vec3.add( globalTranslationVector, globalTranslationVector, vec3.fromValues( 0, -0.5, 0 ) ) :
                                 vec3.add( localTranslationVector, localTranslationVector, vec3.fromValues( 0, -1, 0 ) );
                    break;
                case ".":
                    globalView ? vec3.add( globalTranslationVector, globalTranslationVector, vec3.fromValues( 0, 0, -0.5 ) ) :
                                 vec3.add( localTranslationVector, localTranslationVector, vec3.fromValues( 0, 0, -1 ) );
                    break;
                case ",":
                    globalView ? vec3.add( globalTranslationVector, globalTranslationVector, vec3.fromValues( 0, 0, 0.5 ) ) :
                                 vec3.add( localTranslationVector, localTranslationVector, vec3.fromValues( 0, 0, 1 ) );
                    break;
                default:
                    break;
            }
    
        }
    
    }
    
    startRender();
    
    function startRender() {
        
        if ( globalView ) {                                             // renders all 9 objects
            render.globalRender();
        } else {                                                        // renders one specific object
            render.setObjectToRender( objects[ chosenObject - 1 ] );    // 1-9 corresponds 0-8 on objects, e.g. objects[ 0 ] = cube1 
            render.renderObject();    
        }
        
        requestAnimationFrame( startRender );

    }
    
}
