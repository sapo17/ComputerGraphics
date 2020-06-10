class ConeBase {

    constructor ( gl ) {

        this.gl = gl;
        this.points = [];
        this.colors = [];
        this.normals = [];

    }

    create ( basePoints, baseColors ) {

        var initialPoint = vec3.create();     // initial point for gl.TRIANGLE_FAN
        this.points.push( initialPoint );          
        this.colors.push( [ 0.0, 0.8, 0.0, 1.0 ] );
        
        this.points = points.concat( basePoints ); // concats created basePoints with the initial point
        this.colors = colors.concat( baseColors ); // concats created baseColors with the initial color

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

            this.normals.push( normal, normal, normal );
        }


    }

    // loads object into the GPU
    load ( program ) {

        // Load normals into GPU
        var nBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, nBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flat( this.normals ), this.gl.STATIC_DRAW );

        // Associate normals buffer with the shaders
        var vNormal = this.gl.getAttribLocation( this.program, "vNormal" );
        this.gl.vertexAttribPointer( vNormal, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vNormal );

        // Load colors into GPU
        var cBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, cBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flat( this.colors ), this.gl.STATIC_DRAW );

        // Associate color buffer with the shaders
        var vColor = this.gl.getAttribLocation( this.program, "vColor" );
        this.gl.vertexAttribPointer( vColor, 4, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vColor );

        // Load cube points into the gpu
        var vBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, vBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flat( this.points ), this.gl.STATIC_DRAW );

        // Associate vertex buffer with the shaders
        var vPosition = this.gl.getAttribLocation( this.program, "vPosition" );
        this.gl.vertexAttribPointer( vPosition, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vPosition );
        
    }

    // draws loaded object
    draw () {
        this.gl.drawArrays( this.gl.TRIANGLE_FAN, 0, this.points.length );
    }

    // transforms the object according to the user input ( translation, rotation, scale )
    transform ( translationVector, theta, axis, scalingVector ) {
        
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
        this.gl.uniformMatrix4fv( modelViewLoc, false, modelViewMatrix );

        // calculates and sends the normalMatrix using modelViewMatrix
        normalMatrix = mat3.create();
        mat3.normalFromMat4( normalMatrix, modelViewMatrix );
        this.gl.uniformMatrix3fv( normalMatrixLoc, false, normalMatrix );

    }

}