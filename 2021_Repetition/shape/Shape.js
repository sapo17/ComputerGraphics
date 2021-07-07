import * as GlobalFunctions from '../GlobalFunctions.js';
import * as GlobalVariables from '../GlobalVariables.js';


export default class Shape {


    constructor() {
        this.points = [];
        this.colors = [];
    }

    
    create( vertexCreator, vertexColorCreator ) {
        this.points = vertexCreator();
        this.colors = vertexColorCreator();
    }


    load( gl, program ) {

        // load colors into the GPU
        const cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, 
            GlobalFunctions.array_flatter( this.colors ), gl.STATIC_DRAW );

        // associate color buffer with the shaders
        const vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        // load points into the GPU
        const vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, 
            GlobalFunctions.array_flatter( this.points ), gl.STATIC_DRAW );

    }


    draw( gl, glType ) {
        GlobalFunctions.precondition( this.points.length === this.colors.length,
            'points.len != colors.len' );
        gl.drawArrays( gl.glType, 0, this.points.length );
    }


    transform( gl, translationVector, rotationVector, scalingVector ) {
        gl.uniform3fv( GlobalVariables.translationVectorLoc, 
            translationVector );
        gl.uniform3fv( GlobalVariables.rotationVectorLoc, 
            rotationVector );
        gl.uniform3fv( GlobalVariables.scalingVectorLoc, 
            scalingVector );
    }

}