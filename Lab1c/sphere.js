// Source ( Interactive Computer Graphics, Angel-Shreiner, Page 327 )
// Influenced by the chapter 6 section 6
// Lines similar 7-63
// Modified such that it works with my implementation
class Sphere {

    constructor ( gl ) {
        this.gl = gl;
        this.points = [];
        this.colors = [];
        this.normals = [];
        this.materialAmbient = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
        this.materialDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialSpecular = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialShininess = 100.0;
        this.subdivide = 5;
        this.index = 0;
        this.va = vec3.fromValues( 0.0, 0.0, -1.0 );
        this.vb = vec3.fromValues( 0.0, 0.942809, 0.333333 );
        this.vc = vec3.fromValues( -0.816497, -0.471405, 0.333333 );
        this.vd = vec3.fromValues( 0.816497, -0.471405, 0.333333 );
    }
    
    // creates the sphere
    create () {
        this.tetrahedron( this.va, this.vb, this.vc, this.vd, this.subdivide );
    }
    
    // constructs a tetrahedron
    tetrahedron( a, b, c, d, n ) {
        this.divideTriangle( a, b, c, n );
        this.divideTriangle( d, c, b, n );
        this.divideTriangle( a, d, b, n );
        this.divideTriangle( a, c, d, n );
    }
    
    // divides triangles recursivly according to given amount
    divideTriangle( a, b, c, count ) {
        
        if ( count > 0 ) {

            var ab = vec3.create();
            var ac = vec3.create();
            var bc = vec3.create();

            ab = vec3.scaleAndAdd( ab, a, b, 0.5 );
            ac = vec3.scaleAndAdd( ac, a, c, 0.5 );
            bc = vec3.scaleAndAdd( bc, b, c, 0.5 );

            ab = vec3.normalize( ab, ab );
            ac = vec3.normalize( ac, ac );
            bc = vec3.normalize( bc, bc );
            
            this.divideTriangle( a, ab, ac, count - 1 );
            this.divideTriangle( ab, b, bc, count - 1 );
            this.divideTriangle( bc, c, ac, count - 1 );
            this.divideTriangle( ab, bc, ac, count - 1 );
        }
        else { 
            this.triangle( a, b, c );
        }

    }

    // creates a triangle with given vertices
    triangle( a, b, c ) {

        this.normals.push(a);
        this.normals.push(b);
        this.normals.push(c);
        
        this.points.push(a);
        this.points.push(b);      
        this.points.push(c);

        var color = [ 0.4, 0.4, 0.4, 1.0 ];
        this.colors.push( color, color, color );

        this.index += 3;
    }

    // loads the sphere into the GPU
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

    // draws triangles
    draw () {
        this.gl.drawArrays( this.gl.TRIANGLES, 0, this.points.length );
    }

    // rotate around given axis with given amount of theta
    rotate( theta, axis ) {

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

    // translates the object given amount vector
    translate ( translationVector ) {

        var ctm = mat4.create();

        mat4.fromTranslation( ctm, translationVector );

        return ctm;

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

    // scales the object given amount vector
    scale ( scalingVector ) {

        var ctm = mat4.create();
        mat4.fromScaling( ctm, scalingVector );

        return ctm;

    }

    // get methods
    getAmbient() { return this.materialAmbient; }
    getDiffuse () { return this.materialDiffuse; }
    getSpecular () { return this.materialSpecular; }
    getShininess () { return this.materialShininess; }

}

