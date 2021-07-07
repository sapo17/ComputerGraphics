import * as GlobalVariables from "./GlobalVariables.js";


/**
 * prepares separated shader files for further use  ( e.g. compilation )
 * @param {*} name shader file name to load
 * @returns status whether shader file prepared successfully or not
 */
function loadFileAJAX( name ) {
    var xhr = new XMLHttpRequest();
    var status = ( document.location.protocol === 'file:' ? 0 : 200 );
    xhr.open( 'GET', name, false );
    xhr.send(null);
    return xhr.status == status ? xhr.responseText : null;
}


/**
 * 
 * @param {*} gl WebGL instance
 * @param {*} vShaderName vertex shader file name
 * @param {*} fShaderName fragment shader file name
 * @returns a WebGL program that is initialized with given WebGL instance and
 *  shaders
 */
export function InitShaders( gl, vShaderName, fShaderName ) {
    

    function getShader(gl, shaderName, type) {
        var shader = gl.createShader( type );
        var shaderScript = loadFileAJAX( shaderName );

        if ( !shaderScript ) {
            alert( 'Could not find shader source: ' + shaderName );
        }

        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);

        if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
            alert( gl.getShaderInfoLog(shader) );
            return -1;
        }

        return shader;
    }


    var vertexShader = getShader( gl, vShaderName, gl.VERTEX_SHADER );
    var fragmentShader = getShader( gl, fShaderName, gl.FRAGMENT_SHADER );
    var program = gl.createProgram();

    if ( vertexShader < 0 || fragmentShader < 0 ) {
        alert( 'Could not initialize shaders' );
        return -1;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        alert( 'Could not initialize shaders' );
        return -1;
    }

    return program;
}


/**
 * @param {*} array array content to flatten
 * @returns a new flattened Float32Array
 */
export function array_flatter( array ) {

    if ( !(array instanceof Array) ) {
        throw new Error( 'Given argument must be an array to be flattened');
    }

    let n = 0;
    array.forEach( array => {
        n += array.length;
    });

    let points = new Float32Array( n );
    let idx = 0;
    for ( let i = 0; i < array.length; ++i ) {
        for ( let j = 0; j < array[i].length; ++j ) {
            points[ idx++ ] = array[i][j];
        }
    }
    
    return points;
}


/**
 * @param {*} msg message to throw
 */
export function throw_error( msg ) {
    throw new Error( msg );
}


/**
 * @param {*} condition condition that leads to error
 * @param {*} msg shown error message, if condition is true
 */
export function precondition( condition, msg ) {
    if ( condition ) {
        throw_error( msg );
    }
}


/**
 * throws an error indicating subclass responsibilty
 */
export function throw_subclass_error() {
    throw_error( 'Subclass must implement this method' );
}


/**
 * set uniform variable locations
 * @param {*} gl WebGL instance
 * @param {*} program WebGL program instance
 */
export function setUniformLocations( gl, program ) {
    GlobalVariables.translationVectorLoc = gl.getUniformLocation( program,
        'translationVector');
    GlobalVariables.rotationVectorLoc = gl.getUniformLocation( program,
        'rotationVector');
    GlobalVariables.scalingVectorLoc = gl.getUniformLocation( program,
        'scalingVector');
}
