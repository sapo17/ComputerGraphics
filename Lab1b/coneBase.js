function ConeBase ( gl ) {

    var gl = gl;
    var points = [];
    var colors = [];
    var normals = [];

    this.create = function ( basePoints, baseColors ) {

        var initialPoint = vec3.create();     // initial point for gl.TRIANGLE_FAN
        points.push( initialPoint );          
        colors.push( [ 0.0, 0.8, 0.0, 1.0 ] );
        
        points = points.concat( basePoints ); // concats created basePoints with the initial point
        colors = colors.concat( baseColors ); // concats created baseColors with the initial color

        // calculate the normal for each triangle
        // by ( p2-p0 ) x ( p1 - p0 )
        for ( let i = 0; i < basePoints.length-1; i += 2 ) {
            var left = vec3.create();
            var right = vec3.create();
            vec3.sub( left, basePoints[ i + 1 ], initialPoint );
            vec3.sub( right, basePoints[ i ], initialPoint );
            var cross = vec3.create();
            vec3.cross( cross, left, right );
            var normal = cross;
            vec3.normalize( normal, normal );

            normals.push( normal, normal, normal );
        }


    }

    // loads object into the GPU
    this.load = function ( program ) {

        // Load normals into GPU
        var nBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flat( normals ), gl.STATIC_DRAW );

        // Associate normals buffer with the shaders
        var vNormal = gl.getAttribLocation( program, "vNormal" );
        gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vNormal );

        // Load colors into GPU
        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flat( colors ), gl.STATIC_DRAW );

        // Associate color buffer with the shaders
        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        // Load cube points into the gpu
        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flat( points ), gl.STATIC_DRAW );

        // Associate vertex buffer with the shaders
        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );
        
    }

    // draws loaded object
    this.draw = function () {
        gl.drawArrays( gl.TRIANGLE_FAN, 0, points.length );
    }

    // transforms the object according to the user input ( translation, rotation, scale )
    this.transform = function( translationVector, theta, axis, scalingVector ) {
        
        modelViewMatrix = mat4.create();
        mat4.lookAt( modelViewMatrix, eye, at, up );

        var ctm = mat4.create();
        var q = quat.create();
        
        if ( axis === "X" ) {
            mat4.fromRotationTranslationScale( ctm, quat.rotateX( q, q, theta ), translationVector, scalingVector );
        } else if ( axis === "Y" ) {
            mat4.fromRotationTranslationScale( ctm, quat.rotateY( q, q, theta ), translationVector, scalingVector );
        } else if ( axis === "Z" ) {
            mat4.fromRotationTranslationScale( ctm, quat.rotateZ( q, q, theta ), translationVector, scalingVector );
        } else {
            throw Error( "Axis isn't specified correctly." );
        }
        
        // calculates and sends the modelViewMatrix
        mat4.mul( modelViewMatrix, modelViewMatrix, ctm );
        gl.uniformMatrix4fv( modelViewLoc, false, modelViewMatrix );

        // calculates and sends the normalMatrix using modelViewMatrix
        normalMatrix = mat3.create();
        mat3.normalFromMat4( normalMatrix, modelViewMatrix );
        gl.uniformMatrix3fv( normalMatrixLoc, false, normalMatrix );

    }

}