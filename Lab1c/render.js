class Render {

    constructor( gl, program, ui ) {
        this.gl = gl;
        this.program = program;
        this.objects;
        this.ui = ui;
    }

    setObjectsToRender ( o ) {
        this.objects = o;
    }
    
    // renders given objects
    renderObjects () {
    
        this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clears the shaders
        
        // creates the model-view matrix
        modelViewMatrix = mat4.create();
        mat4.lookAt( modelViewMatrix, eye, at, up );
 
        var temp = mat4.clone( modelViewMatrix );                             // saves modelViewMatrix for different objects

        this.objects.forEach( object => {
            
            // renders canadArm
            if ( object instanceof CanadArm ) {
                
                object.traverse( "Base" );

                modelViewMatrix = mat4.clone( temp );

            }
            
            // object at his default position
            if ( object instanceof Cube && objectAtDefault ) {

                var cubeScaling = .15;
                var cubeXPos    = .8;
                var ground      = -.5;

                var t = mat4.create();
                mat4.fromTranslation( t, vec3.fromValues( cubeXPos, ground, 0 ) );
                mat4.mul( modelViewMatrix, modelViewMatrix, t );

                object.load( this.program );
                object.transform( vec3.fromValues( 0, 0.5 * cubeScaling, 0 ), 0, "X", vec3.fromValues( cubeScaling, cubeScaling, cubeScaling ) );
                object.draw();

            }

            // object when dropped by the canadArm
            if ( object instanceof Cube && !objectAtDefault && !objectPicked ) {
    
                modelViewMatrix = mat4.clone( temp );
    
                // retrieving dropVector and amount of rotation
                var fallingRot = ui.getFallingRot();
                var dropVector = ui.getDropVector();
       
               
                if ( onGround ) {  // object stays on the ground
                    var t = mat4.create();
                    mat4.fromTranslation( t, vec3.fromValues( dropVector[0], -0.5, dropVector[2] ) );
                    mat4.mul( modelViewMatrix, modelViewMatrix, t ); 
                    fallingRot = 0;
                } else {          // object falls down
                    var t = mat4.create();
                    mat4.fromTranslation( t, dropVector );
                    mat4.mul( modelViewMatrix, modelViewMatrix, t );
                }
    
                var cubeScaling = .15;
    
                object.load( this.program );
                object.transform( vec3.fromValues( 0, 0.5 * cubeScaling, 0 ), fallingRot, "X", vec3.fromValues( cubeScaling, cubeScaling, cubeScaling ) );
                object.draw();
    
            }
            
        });
        

    }

}