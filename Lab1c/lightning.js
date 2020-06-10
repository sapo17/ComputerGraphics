class Lightning {

    constructor( gl, program ) {
        
        this.gl = gl;
        this.program = program;
        this.lightPosition = vec4.fromValues( 0.0, 10.0, 0.0, 0.0 );
        this.ambientLight = vec4.fromValues( 0.2, 0.2, 0.2, 1.0 );
        this.diffuseLight = vec4.fromValues( 0.7, 0.7, 0.7, 1.0 );
        this.specularLight = vec4.fromValues( 0.7, 0.7, 0.7, 1.0 );
        this.vertexShading = 0.0;
        this.ambientProduct, this.diffuseProduct, this.specularProduct;

    }

    // calculates the ambient, diffuse and specular parts
    calcProducts ( ambientReflection, diffuseReflection, specularReflection ) {
        this.calcAmbient( ambientReflection );
        this.calcDiffuse( diffuseReflection );
        this.calcSpecular( specularReflection );
    }

    // calculates and saves the ambient product
    calcAmbient ( ambientReflection ) {
        if ( this.ambientProduct === undefined ) {
            this.ambientProduct = vec4.create();
            vec4.mul( this.ambientProduct, this.ambientLight, ambientReflection );
        }
        return this.ambientProduct;
    }

    // calculates and saves the diffuse product
    calcDiffuse ( diffuseReflection ) {
        if ( this.diffuseProduct === undefined ) {
            this.diffuseProduct = vec4.create();
            vec4.mul( this.diffuseProduct, this.diffuseLight, diffuseReflection );
        }
        return this.diffuseProduct;
    }

    // calculates and saves the specular product
    calcSpecular ( specularReflection ) {
        if ( this.specularProduct === undefined ) {
            this.specularProduct = vec4.create();
            vec4.mul( this.specularProduct, this.specularLight, specularReflection );
        }
        return this.specularProduct;
    }

    // sends lightning information to the shaders
    sendLightInfo ( materialShininess ) {
        this.gl.uniform4fv( this.gl.getUniformLocation( this.program, "lightPosition" ), this.lightPosition );
        this.gl.uniform4fv( this.gl.getUniformLocation( this.program, "ambientProduct" ),  this.ambientProduct );
        this.gl.uniform4fv( this.gl.getUniformLocation( this.program, "diffuseProduct" ),  this.diffuseProduct );
        this.gl.uniform4fv( this.gl.getUniformLocation( this.program, "specularProduct" ),  this.specularProduct );
        this.gl.uniform1f( this.gl.getUniformLocation( this.program, "shininess"), materialShininess );
        this.gl.uniform1f( this.gl.getUniformLocation( this.program, "vertexShading" ), this.vertexShading );
    }

    // set methods

    // sets the lightning
    setLightning ( ambientLight, diffuseLight, specularLight ) {
        this.setAmbient( ambientLight );
        this.setDiffuse( diffuseLight );
        this.setSpecular( specularLight );
    }

    setAmbient ( a ) {
        this.ambientLight = a;
    }

    setDiffuse ( d ) {
        this.diffuseLight = d;
    }

    setSpecular ( s ) {
        this.specularLight = s;
    }

    setDiffuseOnly () {
        this.setLightning( vec4.fromValues( 0, 0, 0, 1.0 ), vec4.fromValues( 1.0, 1.0, 1.0, 1.0 ), vec4.fromValues( 0, 0, 0, 1.0 ) );
    }

    setSpecularOnly () {
        this.setLightning( vec4.fromValues( 0.0, 0.0, 0, 1.0 ), vec4.fromValues( 0.0, 0.0, 0.0, 1.0 ), vec4.fromValues( 1.0, 1.0, 1.0, 1.0 ) );
    }

    setShading ( vertexShadingBool ) {
        this.vertexShading = vertexShadingBool ? 1.0 : 0.0;
    }

    // translates the light position
    translation ( translationVector ) {
        vec4.add( this.lightPosition, this.lightPosition, translationVector );
    }

    // rotates the light position
    rotation ( angle, axis, clockWise ) {

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

        vec4.transformMat4( this.lightPosition, this.lightPosition, ctm );

    }

    // retrieves lightning products from the objects and send them to the shaders
    letThereBeLight( objects ) {

        objects.forEach( object => {
            
            if ( object instanceof CanadArm ) {
                object.consistsOf().forEach( symbol => {
                    this.calcProducts( symbol.getAmbient(), symbol.getDiffuse(), symbol.getSpecular() );
                    this.sendLightInfo( symbol.getShininess() );
                } );
            }

        });

    }
    

}