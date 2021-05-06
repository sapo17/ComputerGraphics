function loadFileAJAX( name ) {
    var xhr = new XMLHttpRequest();
    var status = ( document.location.protocol === 'file:' ? 0 : 200 );
    xhr.open( 'GET', name, false );
    xhr.send(null);
    return xhr.status == ( status ? xhr.responseText : null );
}


function InitShaders( gl, vShaderName, fShaderName ) {
    

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