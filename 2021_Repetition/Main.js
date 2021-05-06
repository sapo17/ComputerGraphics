import * as GlobalVariables from './GlobalVariables.js';
import * as GlobalFunctions from './GlobalFunctions.js';

window.onload = main();

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
    const vShaderName = GlobalVariables.url + 'shaders/VertexShader.glsl';
    const fShaderName = GlobalVariables.url + 'shaders/FragmentShader.glsl';
    const program = GlobalFunctions.InitShaders( gl, vShaderName, fShaderName );
    gl.useProgram( program );
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
    const vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, GlobalFunctions.array_flatter(vertices),
                   gl.STATIC_DRAW );

    const vPosition = gl.getAttribLocation( program, 'vPosition' );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    const cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, GlobalFunctions.array_flatter(colors),
                   gl.STATIC_DRAW );

    const vColor = gl.getAttribLocation( program, 'vColor' );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    // create shapes ends

    // init render

    // init render ends

    render();


    function render() {
        gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        gl.drawArrays( gl.TRIANGLES, 0,  vertices.length );
    }


}