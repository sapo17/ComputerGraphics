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

var modelViewLoc, projectionLoc, normalMatrixLoc;
var modelViewMatrix = mat4.create() , projectionMatrix = mat4.create(), normalMatrix = mat3.create();

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

    // retrieves modelViewMatrix's, projectionMatrix's, normalMatrix's Location
    modelViewLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    // init render
    render = new Render( gl, program, objects );

    // Default Lightning, Vertex Shading
    var defaultLight = new Lightning( gl, program );
    var currentLight = defaultLight;
    letThereBeLight( currentLight );
    
    var globalView = true;          // Default is global view
    var chosenObject = 0;           // 0 corresponds to global view
    var cameraMovements = false;    // Default: Camera isn't active
    var lightDefaultFlag = true;
    var lightningMovements = false;
    
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
                if ( lightningMovements ) { 
                    currentLight.rotation( 90.0, "X", true );
                    break;
                }
                rotationActivated = true;
                clockWise = true;
                rotationAxis = "X";
                break;
            case 's':
                if ( lightningMovements ) { 
                    currentLight.rotation( 90.0, "X", false );
                    break;
                }
                rotationActivated = true;
                clockWise = false;
                rotationAxis = "X";
                break;
            case 'e':
                if ( lightningMovements ) { 
                    currentLight.rotation( 90.0, "Y", true );
                    break;
                }
                rotationActivated = true;
                clockWise = true;
                rotationAxis = "Y";
                break;
            case 'q':
                if ( lightningMovements ) { 
                    currentLight.rotation( 90.0, "Y", false );
                    break;
                }
                rotationActivated = true;
                clockWise = false;
                rotationAxis = "Y";
                break;
            case 'd':
                if ( lightningMovements ) { 
                    currentLight.rotation( 90.0, "Z", true );
                    break;
                }
                rotationActivated = true;
                clockWise = true;
                rotationAxis = "Z";
                break;
            case 'a':
                if ( lightningMovements ) { 
                    currentLight.rotation( 90.0, "Z", false );
                    break;
                }
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
            // ligtning movement
            case 'l':
                lightningMovements ? lightningMovements = false : lightningMovements = true;
                break;
            // lightning options
            case 'n':                                                   // vertex shading - default lightning
                lightDefaultFlag = true;
                letThereBeLight( defaultLight );
                break;
            case 'u':                                                   // vertex shading - diffuse illumunation
                lightDefaultFlag = false;
                currentLight = new Lightning( gl, program );
                currentLight.setShading( true );
                currentLight.setDiffuseOnly();
                letThereBeLight( currentLight );
                break;
            case 'i':                                                   // vertex shading - specular highlight
                lightDefaultFlag = false;
                currentLight = new Lightning( gl, program );
                currentLight.setShading( true );
                currentLight.setSpecularOnly();
                letThereBeLight( currentLight );
                break;
            case 'o':                                                   // fragment shading - diffuse              
                lightDefaultFlag = false;
                currentLight = new Lightning( gl, program );
                currentLight.setShading( false );
                currentLight.setDiffuseOnly();
                letThereBeLight( currentLight );
                break;
            case 'p':                                                   // fragment shading - specular
                lightDefaultFlag = false;
                currentLight = new Lightning( gl, program );
                currentLight.setShading( false );
                currentLight.setSpecularOnly();
                letThereBeLight( currentLight );
                break;
            default:
                if ( key === '.' || key === ',' ) break; // '.' and ',' implemented with onkeydown
                console.log( " Key " + key + " isn't implemented yet." );
                break;
        }
    
    }
    
    // RightArrow moves the camera/object/light rightwards
    // LeftArrow moves the camera/object/light leftwards
    // UpArrow moves the camera/object/light upwards
    // DownArrow moves the camera/object/light downwards
    // '.' moves the camera/object/light backwards
    // ',' moves the camera/object/light forwards
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

        } else if ( lightningMovements ) {                              // lightningMovements: active

            switch (key) {
                case "ArrowRight":
                    currentLight.translation( vec4.fromValues( 1, 0, 0, 0 ) );
                    break;
                case "ArrowLeft":
                    currentLight.translation( vec4.fromValues( -1, 0, 0, 0 ) );
                    break;
                case "ArrowUp":
                    currentLight.translation( vec4.fromValues( 0, 1, 0, 0 ) );
                    break;
                case "ArrowDown":
                    currentLight.translation( vec4.fromValues( 0, -1, 0, 0 ) );
                    break;
                case ".":
                    currentLight.translation( vec4.fromValues( 0, 0, -1, 0 ) );
                    break;
                case ",":
                    currentLight.translation( vec4.fromValues( 0, 0, 1, 0 ) );
                    break;
                default:
                    break;
            }

            letThereBeLight( currentLight );

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

    // initialise and send the projection matrix
    mat4.perspective( projectionMatrix,  45 * Math.PI / 180, canvas.width/canvas.height, 1, 30  );
    gl.uniformMatrix4fv( projectionLoc, false, projectionMatrix );

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

    function letThereBeLight( light ) {
        objects.forEach( object  => {
            light.calcProducts( object.getAmbient(), object.getDiffuse(), object.getSpecular() );
            light.sendLightInfo( object.getShininess() );
        });
    }
    
}
