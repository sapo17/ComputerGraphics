function Cone ( gl ) {

    var gl = gl;
    var coneBase, coneSides;
    var basePoints = [], baseColors = [];

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

    // creates a base circle
    for ( var i = 0; i <= 360; i += 15 ) {
        var j = i * Math.PI / 180;
        basePoints.push( vec3.fromValues( Math.cos( j ), Math.sin( j ), 0 ) );
        baseColors.push( vertexColors[ i % 8 ] );
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

}