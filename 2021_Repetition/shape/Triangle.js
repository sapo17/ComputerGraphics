export default class Triangle {


  static init() {

    function vertexCreator() {
      const vertices = [
        vec4.fromValues( 1.0, 0.0, 0.0, 1.0 ),
        vec4.fromValues(-1.0, 0.0, 0.0, 1.0 ),
        vec4.fromValues( 0.0, 1.0, 0.0, 1.0 ),
      ];
      return vertices;
    }

    function vertexColorCreator() {
      const colors = [
        [ 1.0, 0.5, 1.0, 1.0 ],
        [ 1.0, 1.0, 0.0, 1.0 ],
        [ 1.0, 0.0, 1.0, 1.0 ],
      ];
      return colors;
    }

    return {
      vertices: vertexCreator,
      colors: vertexColorCreator
    };
  }

}