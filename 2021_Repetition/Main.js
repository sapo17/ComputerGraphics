import * as GlobalVariables from './GlobalVariables.js';
import * as GlobalFunctions from './GlobalFunctions.js';
import Shape from './shape/Shape.js';
import Triangle from './shape/Triangle.js';
import Render from './Render.js';

window.onload = main();

/** Starting Point of WebGL */
function main() {
    
    // setting up WebGL Begins
    const canvas = document.getElementById( 'gl-canvas' );
    const gl = WebGLUtils.setupWebGL( canvas );

    if ( !gl ) {
        alert( 'WebGL is not available' );
    }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    // setting up WebGL Ends

    // initialise and load shaders begins
    const program = GlobalFunctions.InitShaders( gl, 
        GlobalVariables.default.vShaderName, GlobalVariables.default.fShaderName );
    gl.useProgram( program );
    GlobalFunctions.setUniformLocations( gl, program );
    // initialise and load shaders ends

    // Test start
    gl.uniform3fv( GlobalVariables.default.eyeLoc, GlobalVariables.default.eye );
    gl.uniform3fv( GlobalVariables.default.atLoc, GlobalVariables.default.at );
    gl.uniform3fv( GlobalVariables.default.upLoc, GlobalVariables.default.up );
    // test end

    // create shapes
    const shape = new Shape();
    shape.setMyScale( vec3.fromValues(0.2, 0.2, 0.2) );
    shape.setMyRotation( vec3.fromValues(0, 0, 180) );
    shape.create( Triangle.init().vertices, Triangle.init().colors )
    // create shapes ends
    
    // init render
    const render = new Render( gl, program );
    render.addShape( shape );
    render.renderShapes( gl.TRIANGLES );
    // init render ends
    
}