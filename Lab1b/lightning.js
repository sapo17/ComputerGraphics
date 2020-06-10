function Lightning( gl, program ) {

    var gl = gl;
    var program = program;

    var lightPosition = vec4.fromValues( 0.0, 10.0, 0.0, 0.0 );
    
    var ambientLight = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
    var diffuseLight = vec4.fromValues( 0.7, 0.7, 0.7, 1.0 );
    var specularLight = vec4.fromValues( 0.7, 0.7, 0.7, 1.0 );

    var vertexShading = 1;

    var ambientProduct, diffuseProduct, specularProduct;

    this.calcProducts = function ( ambientReflection, diffuseReflection, specularReflection ) {
        this.calcAmbient( ambientReflection );
        this.calcDiffuse( diffuseReflection );
        this.calcSpecular( specularReflection );
    }

    this.calcAmbient = function ( ambientReflection ) {
        if ( ambientProduct === undefined ) {
            ambientProduct = vec4.create();
            vec4.mul( ambientProduct, ambientLight, ambientReflection );
        }
        return ambientProduct;
    }

    this.calcDiffuse = function ( diffuseReflection ) {
        if ( diffuseProduct === undefined ) {
            diffuseProduct = vec4.create();
            vec4.mul( diffuseProduct, diffuseLight, diffuseReflection );
        }
        return diffuseProduct;
    }

    this.calcSpecular = function ( specularReflection ) {
        if ( specularProduct === undefined ) {
            specularProduct = vec4.create();
            vec4.mul( specularProduct, specularLight, specularReflection );
        }
        return specularProduct;
    }

    this.sendLightInfo = function ( materialShininess ) {
        gl.uniform4fv( gl.getUniformLocation( program, "lightPosition" ), lightPosition );
        gl.uniform4fv( gl.getUniformLocation( program, "ambientProduct" ),  ambientProduct );
        gl.uniform4fv( gl.getUniformLocation( program, "diffuseProduct" ),  diffuseProduct );
        gl.uniform4fv( gl.getUniformLocation( program, "specularProduct" ),  specularProduct );
        gl.uniform1f( gl.getUniformLocation( program, "shininess"), materialShininess );
        gl.uniform1f( gl.getUniformLocation( program, "vertexShading" ),  vertexShading );
    }

    this.setLightning = function ( ambientLight, diffuseLight, specularLight ) {
        this.setAmbient( ambientLight );
        this.setDiffuse( diffuseLight );
        this.setSpecular( specularLight );
    }

    this.setAmbient = function ( a ) {
        ambientLight = a;
    }

    this.setDiffuse = function ( d ) {
        diffuseLight = d;
    }

    this.setSpecular = function ( s ) {
        specularLight = s;
    }

    this.setDiffuseOnly = function () {
        this.setLightning( vec4.fromValues( 0, 0, 0, 1.0 ), vec4.fromValues( 1.0, 1.0, 1.0, 1.0 ), vec4.fromValues( 0, 0, 0, 1.0 ) );
    }

    this.setSpecularOnly = function () {
        this.setLightning( vec4.fromValues( 0.0, 0.0, 0, 1.0 ), vec4.fromValues( 0.0, 0.0, 0.0, 1.0 ), vec4.fromValues( 1.0, 1.0, 1.0, 1.0 ) );
    }

    this.setShading = function ( vertexShadingBool ) {
        vertexShading = vertexShadingBool ? 1 : 0;
    }

    this.translation = function ( translationVector ) {
        vec4.add( lightPosition, lightPosition, translationVector );
    }

    this.rotation = function( angle, axis, clockWise ) {

        var ctm = mat4.create();
        if ( !clockWise ) angle = -angle;

        if ( axis === "X" ) {
            mat4.fromRotation( ctm, angle, vec3.fromValues( 1, 0, 0 ) );
        } else if ( axis === "Y" ) {
            mat4.fromRotation( ctm, angle, vec3.fromValues( 0, 1, 0 ) );
        } else if ( axis === "Z" ) {
            mat4.fromRotation( ctm, angle, vec3.fromValues( 0, 0, 1 ) );
        } else {
            throw Error( "Axis isn't specified correctly." );
        }

        vec4.transformMat4( lightPosition, lightPosition, ctm );

    }

}