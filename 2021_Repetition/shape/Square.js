export default class Square {

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
            const a = 1, b = 0, c = 3, d = 2;
            const indices = [ a, b, c, a, c, d ];
            let result = [];

            for ( let i = 0; i < indices.length; ++i ) {
                result.push( Square.vertices[indices[i]] );
            }

            return result;
        }

        function vertexColorCreator() {
            const a = 1, b = 0, c = 3, d = 2;
            const indices = [ a, b, c, a, c, d ];
            let result = [];

            for ( let i = 0; i < indices.length; ++i ) {
                result.push( Square.vertexColors[indices[i]] );
            }

            return result;
        }

        return {
            vertices: vertexCreator,
            colors: vertexColorCreator
        };
    }


}