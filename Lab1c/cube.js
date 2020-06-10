class Cube {

    constructor( gl, colorCube = false ) {
        this.gl = gl;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.materialAmbient = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
        this.materialDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialSpecular = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialShininess = 100.0;
        this.colorCube = colorCube;
    }
    

    // Interactive Computer Graphics, Angel, Chapter 4, Section 4.6.4, page 198
    // Lines cited: 11 - 18
    // Creates a cube efficiently 
    // based on the separation of the geometry and topology
    create () {
        this.square( 1, 0, 3, 2 );      // each cube has 6 faces
        this.square( 2, 3, 7, 6 );      // we assign each vertex an idx number
        this.square( 3, 0, 4, 7 );
        this.square( 6, 5, 1, 2 );
        this.square( 4, 5, 6, 7 );
        this.square( 5, 4, 0, 1 );
    }

    square ( a, b, c, d ) {

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
            this.colorCube ? this.colors.push( vertexColors[ indices[i] ] ) : this.colors.push( [ 0.6, 0.6, 0.6, 1.0 ] );
        
        }

    }

    // loads object into the GPU
    load ( program ) {

        // Load normals into GPU
        var nBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, nBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flat( this.normals ), this.gl.STATIC_DRAW );

        // Associate normals buffer with the shaders
        var vNormal = this.gl.getAttribLocation( program, "vNormal" );
        this.gl.vertexAttribPointer( vNormal, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vNormal );

        // Load colors into GPU
        var cBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, cBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flat( this.colors ), this.gl.STATIC_DRAW );

        // Associate color buffer with the shaders
        var vColor = this.gl.getAttribLocation( program, "vColor" );
        this.gl.vertexAttribPointer( vColor, 4, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vColor );

        // Load cube points into the gpu
        var vBuffer = this.gl.createBuffer();
        this.gl.bindBuffer( this.gl.ARRAY_BUFFER, vBuffer );
        this.gl.bufferData( this.gl.ARRAY_BUFFER, flat( this.points ), this.gl.STATIC_DRAW );

        // Associate vertex buffer with the shaders
        var vPosition = this.gl.getAttribLocation( program, "vPosition" );
        this.gl.vertexAttribPointer( vPosition, 3, this.gl.FLOAT, false, 0, 0 );
        this.gl.enableVertexAttribArray( vPosition );
        
    }

    // draws loaded object
    draw () {
        this.gl.drawArrays( this.gl.TRIANGLES, 0, this.points.length );
    }

    // transforms the object according to the user input ( translation, rotation, scale )
    transform ( translationVector, theta, axis, scalingVector ) {

        var ctm = mat4.create();

        mat4.mul( ctm, ctm, this.rotate( theta, axis ) );
        mat4.mul( ctm, ctm, this.translate( translationVector ) );
        mat4.mul( ctm, ctm, this.scale( scalingVector ) );

        // concatanates the modelViewMatrix with ctm
        mat4.mul( ctm, modelViewMatrix, ctm );
        this.gl.uniformMatrix4fv( modelViewLoc, false, ctm );

        // calculates and sends the normalMatrix using modelViewMatrix
        normalMatrix = mat3.create();
        mat3.normalFromMat4( normalMatrix, ctm );
        this.gl.uniformMatrix3fv( normalMatrixLoc, false, normalMatrix );

    }

    // rotate
    rotate ( theta, axis ) {

        var ctm = mat4.create();

        if ( axis === "X" ) {
            mat4.fromRotation( ctm, theta, vec3.fromValues( 1, 0, 0 ) );
        } else if ( axis === "Y" ) {
            mat4.fromRotation( ctm, theta, vec3.fromValues( 0, 1, 0 ) );
        } else if ( axis === "Z" ) {
            mat4.fromRotation( ctm, theta, vec3.fromValues( 0, 0, 1 ) );
        } else {
            throw Error( "Axis isn't specified correctly." );
        }

        return ctm;


    }

    translate ( translationVector ) {

        var ctm = mat4.create();

        mat4.fromTranslation( ctm, translationVector );

        return ctm;

    }


    scale ( scalingVector ) {

        var ctm = mat4.create();
        mat4.fromScaling( ctm, scalingVector );

        return ctm;

    }

    getAmbient() { return this.materialAmbient; }
    getDiffuse () { return this.materialDiffuse; }
    getSpecular () { return this.materialSpecular; }
    getShininess () { return this.materialShininess; }

}