export default class Render {

    constructor(gl, program) {
        this.gl = gl;
        this.program = program;
        this.shapes = [];
    }


    /**
     * @param {*} shape Shape object that will be added to the list of shapes
     */
    addShape( shape ) {
        this.shapes.push( shape );
    }


    /**
     * Renders list of shapes with given glType
     * @param {*} glType drawing type ( e.g. gl.TRIANGLES )
     */
    renderShapes( glType ) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.shapes.forEach(shape => {
            shape.load(this.gl, this.program);
            shape.transformThis(this.gl);
            shape.draw(this.gl, glType)
        });
    }


    /**
     * Renders given shape object with the given glType
     * @param {*} shape Shape object to render
     * @param {*} glType drawing type ( e.g. gl.TRIANGLES )
     */
    renderShape( shape, glType ) {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        shape.load(this.gl, this.program);
        shape.transformThis(this.gl);
        shape.draw(this.gl, glType)
    }


}