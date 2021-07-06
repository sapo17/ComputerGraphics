import * as GlobalVariables from './GlobalVariables.js';
import * as GlobalFunctions from './GlobalFunctions.js';
import Shape from './shape/Shape.js';

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
    gl.clearColor( 0, 0, 0, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    // setting up WebGL Ends

    // initialise and load shaders begins
    const program = GlobalFunctions.InitShaders( gl, 
        GlobalVariables.vShaderName, GlobalVariables.fShaderName );
    gl.useProgram( program );
    GlobalFunctions.setUniformLocations( gl, program );
    // initialise and load shaders ends

    // create shapes
    const vertices = [
        vec3.fromValues( -1.0, -1.0, 0.0 ),
        vec3.fromValues(  1.0, -1.0, 0.0 ),
        vec3.fromValues(  0.0,  1.0, 0.0 ),
    ];
    const colors = [
        [ 1.0, 0.0, 0.0, 1.0 ],
        [ 1.0, 0.0, 0.0, 1.0 ],
        [ 1.0, 0.0, 0.0, 1.0 ],
    ];
    const triangleCreator = () => {return vertices}
    const triangleColorCreator = () => {return colors};
    const triangle = new Shape();
    triangle.create( triangleCreator, triangleColorCreator );
    // create shapes ends
    
    // init render
    
    // init render ends
    
    render();

    
    function render() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        triangle.load( gl, program );
        triangle.transform( gl, vec3.create(), vec3.create(), 
            vec3.fromValues(0.5, 0.5, 0.5) );
        triangle.draw( gl, TRIANGLES );
    }


}