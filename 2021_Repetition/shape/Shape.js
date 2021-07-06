import * as GlobalFunctions from '../GlobalFunctions.js';
import * as GlobalVariables from '../GlobalVariables.js';

/**
 * Represents a Shape that can be rendered with WebGL
 */
export default class Shape {

    /** default constructor: contains an array of points and colors */
    constructor() {
        this.points = [];
        this.colors = [];
    }

    
    /**
     * initializes points and colors arrays with given functions
     * @param {*} vertexCreator a function that returns an array of vertex 
     *  points
     * @param {*} vertexColorCreator a function that returns an array of vertex
     *  colors
     */
    create( vertexCreator, vertexColorCreator ) {
        this.points = vertexCreator();
        this.colors = vertexColorCreator();
    }


    /**
     * loads and associates points and color arrays with the shaders
     * @param {*} gl WebGL instance
     * @param {*} program WebGL program instance
     */
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

        // associate points buffer with the shaders
        const vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

    }


    /**
     * draws the shape
     * @param {*} gl WebGL instance 
     * @param {*} glType drawing type ( e.g. TRIANGLES )
     */
    draw( gl, glType ) {
        GlobalFunctions.precondition( this.points.length === this.colors.length,
            'points.len != colors.len' );
        gl.drawArrays( gl.glType, 0, this.points.length );
    }


    /**
     * sends the transformation vectors into the GPU
     * @param {*} gl WebGL instance
     * @param {*} translationVector describes amount of translation
     * @param {*} rotationVector describes amount of rotation
     * @param {*} scalingVector describes amount of scaling
     */
    transform( gl, translationVector, rotationVector, scalingVector ) {
        GlobalFunctions.sendUniform3fv( gl, 
            GlobalVariables.translationVectorLoc, translationVector );
        GlobalFunctions.sendUniform3fv( gl,
            GlobalVariables.rotationVectorLoc, rotationVector );
        GlobalFunctions.sendUniform3fv( gl,
            GlobalVariables.scalingVectorLoc, scalingVector );
    }

}