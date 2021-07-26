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

    // create shapes
    const shape = new Shape();
    shape.create( Triangle.init().vertices, Triangle.init().colors )
    // create shapes ends
    
    // init render
    const render = new Render( gl, program );
    render.addShape( shape );
    render.renderShapes( gl.TRIANGLES );
    // init render ends
    
}