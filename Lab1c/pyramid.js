class Pyramid {

    constructor( gl ) {
        
        this.gl = gl;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.materialAmbient = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
        this.materialDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialSpecular = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialShininess = 100.0;
        
    }

    // creates a pyramid that consists of one square and four triangles
    create () {
        this.square( 0, 3, 2, 1 );
        this.triangle( 0, 4, 1 );
        this.triangle( 1, 4, 2 );
        this.triangle( 2, 4, 3 );
        this.triangle( 3, 4, 0 );
    }

    square ( a, b, c, d ) {

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
            
            this.points.push( vertices[indices[i]] );
            this.normals.push( normal );
            this.colors.push( [ 0.0, 0.5, 0.7, 1.0 ] );
        
        }
        
    }

    triangle ( a, b, e ) {

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
            
            this.points.push( vertices[indices[i]] );
            this.normals.push( normal );
            this.colors.push( [ 0.0, 0.5, 0.7, 1.0 ] );
        
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

        // Load pyramid points into the gpu
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
        this.gl.drawArrays( this.gl.TRIANGLES, 0, this.points.length );
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

    getAmbient () { return this.materialAmbient; }
    getDiffuse () { return this.materialDiffuse; }
    getSpecular () { return this.materialSpecular; }
    getShininess () { return this.materialShininess; }

}