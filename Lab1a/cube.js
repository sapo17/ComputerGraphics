function Cube ( gl ) {

    var gl = gl;
    var points = [];
    var colors = [];

    // Interactive Computer Graphics, Angel, Chapter 4, Section 4.6.4, page 198
    // Lines cited: 11 - 18
    // Creates a cube efficiently 
    // based on the separation of the geometry and topology
    this.create = function ( ) {
        this.square( 1, 0, 3, 2 );      // each cube has 6 faces
        this.square( 2, 3, 7, 6 );      // we assign each vertex an idx number
        this.square( 3, 0, 4, 7 );
        this.square( 6, 5, 1, 2 );
        this.square( 4, 5, 6, 7 );
        this.square( 5, 4, 0, 1 );
    }

    this.square = function ( a, b, c, d ) {

        var vertices = [
            vec3.fromValues( -0.5, -0.5,  0.5 ),
            vec3.fromValues( -0.5,  0.5,  0.5 ),
            vec3.fromValues(  0.5,  0.5,  0.5 ),
            vec3.fromValues(  0.5, -0.5,  0.5 ),
            vec3.fromValues( -0.5, -0.5, -0.5 ),
            vec3.fromValues( -0.5,  0.5, -0.5 ),
            vec3.fromValues(  0.5,  0.5, -0.5 ),
            vec3.fromValues(  0.5, -0.5, -0.5 )
        ];

        var vertexColors = [
            [ 0.0, 0.0, 0.0, 1.0 ],  // black
            [ 1.0, 0.0, 0.0, 1.0 ],  // red
            [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
            [ 0.0, 1.0, 0.0, 1.0 ],  // green
            [ 0.0, 0.0, 1.0, 1.0 ],  // blue
            [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
            [ 1.0, 1.0, 1.0, 1.0 ],  // white
            [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
        ];

    
        var indices = [ a, b, c, a, c, d ]; // each squre constructed by two triangles, thus 6 idx values

        for ( var i = 0; i < indices.length; ++i ) {
            
            points.push( vertices[indices[i]] );
            colors.push( vertexColors[indices[i]] );
        
        }
        
    }

    // loads object into the GPU
    this.load = function ( program ) {

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
        gl.drawArrays( gl.TRIANGLES, 0, points.length );
    }

    // transforms the object according to the user input ( translation, rotation, scale )
    this.transform = function( translationVector, theta, axis, scalingVector ) {
      
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
        
        gl.uniformMatrix4fv( transformLoc, false, ctm );

    }

}