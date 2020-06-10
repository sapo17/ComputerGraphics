function Pyramid ( gl ) {

    var gl = gl;
    var points = [];
    var colors = [];
    var normals = [];

    var materialAmbient = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
    var materialDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
    var materialSpecular = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
    var materialShininess = 100.0;

    // creates a pyramid that consists of one square and four triangles
    this.create = function () {
        this.square( 0, 3, 2, 1 );
        this.triangle( 0, 4, 1 );
        this.triangle( 1, 4, 2 );
        this.triangle( 2, 4, 3 );
        this.triangle( 3, 4, 0 );
    }

    this.square = function ( a, b, c, d ) {

        var vertices = [
            vec3.fromValues(-0.5, 0.0, 0.0 ), // A
            vec3.fromValues( 0.0,-0.5, 0.0 ), // B
            vec3.fromValues( 0.5, 0.0, 0.0 ), // C
            vec3.fromValues( 0.0, 0.5, 0.0 ), // D
        ];
    
        var indices = [ a, b, c, a, c, d ]; // each squre constructed by two triangles, thus 6 idx values
        
        // calculate the normal for each triangle
        // by ( p2-p0 ) x ( p1 - p0 )
        var left = vec3.create();
        var right = vec3.create();
        vec3.subtract( left, vertices[b], vertices[a] );
        vec3.subtract( right, vertices[c], vertices[a] );
        var cross = vec3.create();
        vec3.cross( cross, left, right );
        var normal = cross;
        vec3.normalize( normal, normal );

        for ( var i = 0; i < indices.length; ++i ) {
            
            points.push( vertices[indices[i]] );
            normals.push( normal );
            colors.push( [ 0.0, 0.5, 0.7, 1.0 ] );
        
        }
        
    }

    this.triangle = function( a, b, e ) {

        var vertices = [
            vec3.fromValues(-0.5, 0.0, 0.0 ), // A
            vec3.fromValues( 0.0,-0.5, 0.0 ), // B
            vec3.fromValues( 0.5, 0.0, 0.0 ), // C
            vec3.fromValues( 0.0, 0.5, 0.0 ), // D
            vec3.fromValues( 0.0, 0.0, 0.5 ), // E
        ];

        var indices = [ a, b, e ];

        // calculate the normal for each triangle
        // by ( p2-p0 ) x ( p1 - p0 )
        var left = vec3.create();
        var right = vec3.create();
        vec3.subtract( left, vertices[e], vertices[a] );
        vec3.subtract( right, vertices[b], vertices[a] );
        var cross = vec3.create();
        vec3.cross( cross, left, right );
        var normal = cross;
        vec3.normalize( normal, normal );

        for ( var i = 0; i < indices.length; ++i ) {
            
            points.push( vertices[indices[i]] );
            normals.push( normal );
            colors.push( [ 0.0, 0.5, 0.7, 1.0 ] );
        
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

        // Load pyramid points into the gpu
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
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
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

    this.getAmbient = function () { return materialAmbient; }
    this.getDiffuse = function () { return materialDiffuse; }
    this.getSpecular = function () { return materialSpecular; }
    this.getShininess = function () { return materialShininess; }

}