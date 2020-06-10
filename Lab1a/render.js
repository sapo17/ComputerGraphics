function Render( gl, program, objects ) {

    var gl = gl;
    var program = program;
    var objects = objects;
    var specificObject;     // used for local viewing

    this.setObjectToRender = function ( o ) {
        specificObject = o;
    }

    // render all 9 shapes
    this.globalRender= function () {
       
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        if ( rotationActivated ) {                      // increments theta if rotation activated
            clockWise ? theta += 0.01 : theta -= 0.01;
        } else {                                        // otherwise theta stays the same - 0
            theta = 0;
        }

        var objectPositions = [
            vec3.fromValues( 0.5, 0.5, 0 ),     // Cube 1's position
            vec3.fromValues( 0.5, 0.0, 0 ),     // Cube 2's position
            vec3.fromValues( 0.5, -0.5, 0 ),    // Cube 3's position
            vec3.fromValues( 0, 0.5, 0 ),       // Pyramid 1's position
            vec3.fromValues( 0, 0, 0 ),         // Pyramid 2's position
            vec3.fromValues( 0, -0.5, 0 ),      // Pyramid 3's position
            vec3.fromValues( -0.5, 0.5, 0 ),    // Cone 1's position
            vec3.fromValues( -0.5, 0.0, 0 ),    // Cone 2's position
            vec3.fromValues( -0.5,-0.5, 0 )     // Cone 3's position
        ];

        var cubeLoaded = false, pyramidLoaded = false;

        // loads and transforms each object contained in objects array
        // tranforms each object according to globalTranslationVector, theta, rotationAxis and globalScalingVector
        for ( let i = 0; i < objects.length; ++i ) {
            if ( objects[i] instanceof Cube ) {
                var cube = objects[i];
                if ( !cubeLoaded ) { 
                    cube.load( program );
                    cubeLoaded = true;
                }
                cube.transform( vec3.add( objectPositions[i], objectPositions[i], globalTranslationVector ), theta, rotationAxis, globalScalingVector );
                cube.draw();
            } else if ( objects[i] instanceof Pyramid ) {
                var pyramid = objects[i];
                if ( !pyramidLoaded ) {
                    pyramid.load( program );
                    pyramidLoaded = true;
                }
                pyramid.transform( vec3.add( objectPositions[i], objectPositions[i], globalTranslationVector ), theta, rotationAxis, globalScalingVector );
                pyramid.draw();
            } else if ( objects[i] instanceof Cone ) {
                var cone = objects[i];
                cone.loadTransformDraw( program, vec3.add( objectPositions[i], objectPositions[i], globalTranslationVector ), theta, rotationAxis, globalScalingVector );
            } else {
                alert( "Something went wrong!" );
                return -1;
            }
        }

        // initialises modelView & projection Matrix
        mat4.lookAt( modelViewMatrix, eye, at, up );
        mat4.perspective( projectionMatrix, 45 * Math.PI / 180, canvas.width/canvas.height, 1, 30  );

        gl.uniformMatrix4fv( modelViewLoc, false, modelViewMatrix );
        gl.uniformMatrix4fv( projectionLoc, false, projectionMatrix );

    } 
    
    // renders one specific object
    this.renderObject = function () {
    
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clears the shaders
        
        if ( rotationActivated ) {                      // increments theta if rotation activated
            clockWise ? theta += 0.01 : theta -= 0.01;
        } else {                                        // otherwise theta stays the same - 0
            theta = 0;
        }
        
        // initialisez modelView & projectionMatrix
        mat4.lookAt( modelViewMatrix, eye, at, up );
        mat4.perspective( projectionMatrix,  45 * Math.PI / 180, canvas.width/canvas.height, 1, 30  );

        gl.uniformMatrix4fv( modelViewLoc, false, modelViewMatrix );
        gl.uniformMatrix4fv( projectionLoc, false, projectionMatrix );
        
        // cone implemented differently
        // loads, transforms and draws cone
        if ( specificObject instanceof Cone ) {
            specificObject.loadTransformDraw( program, localTranslationVector, theta, rotationAxis, localScalingVector );
            return;
        }

        // loads, transforms and draws specified object
        specificObject.load( program );
        specificObject.transform( localTranslationVector, theta, rotationAxis, localScalingVector ); 
        specificObject.draw();

    }

}