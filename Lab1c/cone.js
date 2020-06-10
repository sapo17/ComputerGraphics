class Cone {

    constructor( gl ) {
        this.gl = gl;
        this.coneBase;
        this.coneSides;
        this.basePoints = []
        this.baseColors = [];
        this.materialAmbient = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
        this.materialDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialSpecular = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
        this.materialShininess = 100.0;
        
        // creates a base circle
        for ( var i = 0; i <= 360; i += 1 ) {
            var j = i * Math.PI / 180;
            this.basePoints.push( vec3.fromValues( Math.cos( j ), Math.sin( j ), 0 ) );
            this.baseColors.push( [ 0.0, 0.7, 0.0, 0.0 ] );
        }

    }

    // creates a cone that consists of its base circle and sides
    create () {

        this.coneBase = new ConeBase( this.gl );
        this.coneBase.create( this.basePoints, this.baseColors );

        this.coneSides = new ConeSides( this.gl );
        this.coneSides.create( this.basePoints, this.baseColors );

    }

    // loads and transforms cone's base circle and sides
    loadTransformDraw ( program, translationVector, theta, axis, scalingVector ) {

        this.coneBase.load( program );
        this.coneBase.transform( translationVector, theta, axis, scalingVector );
        this.coneBase.draw();

        this.coneSides.load( program );
        this.coneSides.transform( translationVector, theta, axis, scalingVector );
        this.coneSides.draw();
        
    }

    // transforms the object according to the user input ( translation, rotation, scale )
    transform ( translationVector, theta, axis, scalingVector ) {
        
        this.coneBase.transform( translationVector, theta, axis, scalingVector );
        this.coneSides.transform( translationVector, theta, axis, scalingVector );

    }

    getAmbient () { return this.materialAmbient; }
    getDiffuse () { return this.materialDiffuse; }
    getSpecular () { return this.materialSpecular; }
    getShininess () { return this.materialShininess; }

}