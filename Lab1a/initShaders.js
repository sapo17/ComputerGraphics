function initShaders( gl, vertexShaderId, fragmentShaderId ) {
    
    var vertexShader, fragmentShader;

    var vertexElement = document.getElementById( vertexShaderId );
    if ( !vertexElement ) {
        alert( "Unable to load vertex shader: " + vertexShaderId );
        return -1;
    } else {

        // Creation & compilation of shader
        vertexShader = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertexShader, vertexElement.text );
        gl.compileShader( vertexShader );

        // Incase of compiling error:
        if ( !gl.getShaderParameter( vertexShader, gl.COMPILE_STATUS ) ) {
            var error = "Vertex shader failed to compile. Error log: " 
            + "<pre>" + gl.getShaderInfoLog( vertexShader ) + "</pre>";
            alert( error );
            return -1;
        }

    }

    var fragmentElement = document.getElementById( fragmentShaderId );
    if ( !fragmentElement ) {
        alert( "Unable to load fragment shader: " + fragmentShaderId );
        return -1;
    } else {

        // Creation & compilation of shader
        fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragmentShader, fragmentElement.text );
        gl.compileShader( fragmentShader );

        // Incase of compiling error:
        if ( !gl.getShaderParameter( fragmentShader, gl.COMPILE_STATUS ) ) {
            var error = "Fragment shader failed to compile. Error log: " 
            + "<pre>" + gl.getShaderInfoLog( fragmentShader ) + "</pre>";
            alert( error );
            return -1;
        }

    }
    

    // Create a program and attach compiled shaders
    var program = gl.createProgram();
    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );

    // Incase of linking error:
    if ( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
        var error = "Shader program failed to link. Error code: " 
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
            alert( error );
            return -1;
    }

    return program;

}