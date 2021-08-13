import * as GlobalVariables from './GlobalVariables.js';
import * as GlobalFunctions from './GlobalFunctions.js';
import Shape from './shape/Shape.js';
import Triangle from './shape/Triangle.js';
import Render from './Render.js';
import Square from './shape/Square.js';
import Cube from './shape/Cube.js';

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
    GlobalVariables.default.aspect = canvas.width / canvas.height;
    gl.uniform3fv( GlobalVariables.default.eyeLoc, GlobalVariables.default.eye );
    gl.uniform3fv( GlobalVariables.default.atLoc, GlobalVariables.default.at );
    gl.uniform3fv( GlobalVariables.default.upLoc, GlobalVariables.default.up );
    gl.uniform1f( GlobalVariables.default.fovLoc, GlobalVariables.default.fov );
    gl.uniform1f( GlobalVariables.default.aspectLoc, GlobalVariables.default.aspect );
    gl.uniform1f( GlobalVariables.default.nearLoc, GlobalVariables.default.near );
    gl.uniform1f( GlobalVariables.default.farLoc, GlobalVariables.default.far );
    // test end

    // create shapes
    const squareOne = new Shape();
    const triangleOne = new Shape();
    const cubeOne = new Shape();

    triangleOne.setMyScale( vec3.fromValues(0.2, 0.2, 0.2) );
    triangleOne.setMyRotation( vec3.fromValues(0, 0, 180) );
    triangleOne.setMyTranslation( vec3.fromValues(0, 0.5, 0) );
    triangleOne.create( Triangle.init().vertices, Triangle.init().colors );

    squareOne.setMyScale( vec3.fromValues( 0.2, 0.2, 0.2 ) );
    squareOne.setMyTranslation( vec3.fromValues(0, -0.5, 0) );
    squareOne.create( Square.init().vertices, Square.init().colors );

    cubeOne.setMyScale( vec3.fromValues( 0.2, 0.2, 0.2 ) );
    cubeOne.setMyRotation( vec3.fromValues( 45, 0, 0 ) );
    cubeOne.create( Cube.init().vertices, Cube.init().colors );
    // create shapes ends
    
    // init render
    const render = new Render( gl, program );
    render.addShape( triangleOne );
    render.addShape( squareOne );
    render.addShape( cubeOne );
    render.renderShapes( gl.TRIANGLES );
    // init render ends
    
}