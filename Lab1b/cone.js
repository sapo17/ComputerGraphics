function Cone ( gl ) {

    var gl = gl;
    var coneBase, coneSides;
    var basePoints = [], baseColors = [];

    var materialAmbient = vec4.fromValues( 0.3, 0.3, 0.3, 1.0 );
    var materialDiffuse = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
    var materialSpecular = vec4.fromValues( 1.0, 1.0, 1.0, 1.0 );
    var materialShininess = 100.0;

    // creates a base circle
    for ( var i = 0; i <= 360; i += 1 ) {
        var j = i * Math.PI / 180;
        basePoints.push( vec3.fromValues( Math.cos( j ), Math.sin( j ), 0 ) );
        baseColors.push( [ 0.0, 0.7, 0.0, 0.0 ] );
    }

    // creates a cone that consists of its base circle and sides
    this.create = function () {

        coneBase = new ConeBase( gl );
        coneBase.create( basePoints, baseColors );

        coneSides = new ConeSides( gl );
        coneSides.create( basePoints, baseColors );

    }

    // loads and transforms cone's base circle and sides
    this.loadTransformDraw = function ( program, translationVector, theta, axis, scalingVector ) {

        coneBase.load( program );
        coneBase.transform( translationVector, theta, axis, scalingVector );
        coneBase.draw();

        coneSides.load( program );
        coneSides.transform( translationVector, theta, axis, scalingVector );
        coneSides.draw();
        
    }

    // transforms the object according to the user input ( translation, rotation, scale )
    this.transform = function( translationVector, theta, axis, scalingVector ) {
        
        coneBase.transform( translationVector, theta, axis, scalingVector );
        coneSides.transform( translationVector, theta, axis, scalingVector );

    }

    this.getAmbient = function () { return materialAmbient; }
    this.getDiffuse = function () { return materialDiffuse; }
    this.getSpecular = function () { return materialSpecular; }
    this.getShininess = function () { return materialShininess; }

}