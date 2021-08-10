export default class Cube {


    static vertices = [
        vec4.fromValues( -0.5, -0.5,  0.5, 1.0 ),
        vec4.fromValues( -0.5,  0.5,  0.5, 1.0 ),
        vec4.fromValues(  0.5,  0.5,  0.5, 1.0 ),
        vec4.fromValues(  0.5, -0.5,  0.5, 1.0 ),
        vec4.fromValues( -0.5, -0.5, -0.5, 1.0 ),
        vec4.fromValues( -0.5,  0.5, -0.5, 1.0 ),
        vec4.fromValues(  0.5,  0.5, -0.5, 1.0 ),
        vec4.fromValues(  0.5, -0.5, -0.5, 1.0 )
    ];
    static vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 1.0, 1.0, 1.0, 1.0 ],  // white
        [ 0.0, 1.0, 1.0, 1.0 ]   // cyan
    ];


    static init() {

        function vertexCreator() {
            let result = [
                ...Cube.quad( 1, 0, 3, 2 ), ...Cube.quad( 2, 3, 7, 6 ), 
                ...Cube.quad( 3, 0, 4, 7 ), ...Cube.quad( 6, 5, 1, 2 ),
                ...Cube.quad( 4, 5, 6, 7 ), ...Cube.quad( 5, 4, 0, 1 )
            ];
            return result;
        }

        function vertexColorCreator() {
            let result = [
                ...Cube.quadColors( 1, 0, 3, 2 ), ...Cube.quadColors( 2, 3, 7, 6 ), 
                ...Cube.quadColors( 3, 0, 4, 7 ), ...Cube.quadColors( 6, 5, 1, 2 ),
                ...Cube.quadColors( 4, 5, 6, 7 ), ...Cube.quadColors( 5, 4, 0, 1 )
            ];
            return result;
        }

        return {
            vertices: vertexCreator,
            colors: vertexColorCreator
        };
    }


    static quad( a, b, c, d ) {
        const indices = [ a, b, c, a, c, d ];
        let result = [];

        for ( let i = 0; i < indices.length; ++i ) {
            result.push( Cube.vertices[indices[i]] );
        }

        return result;
    }


    static quadColors( a, b, c, d ) {
        const indices = [ a, b, c, a, c, d ];
        let result = [];

        for ( let i = 0; i < indices.length; ++i ) {
            result.push( Cube.vertexColors[indices[i]] );
        }

        return result;
    }


}