class UserInput {

    constructor( gl, program ) {
        this.gl = gl;
        this.program = program;
        this.thetaOne = 0;                                                   // corresponds to base rotation
        this.thetaTwo = 0;                                                   // corresponds to lower arm rotation
        this.thetaThree = 0;                                                 // corresponds to upper arm rotation
        this.thetaFour = 0;                                                  // corresponds to finger rotation
        this.ballX = 0;                                                      // corresponds to X-axis pos. of bottom sphere
        this.axis = "Y";                                                     // default rotation axis
        this.cameraMovement = false;                                         // default: camera movement inactive
        this.picker = null;                                                  // picker model, default: null
        this.fingerPos = null;                                               // finger position of the picker, default: null
        this.dropRate = 0;                                                   // drop rate for falling animation
        this.light = null;                                                   // light reference
        this.objects = null;                                                 // rendered objects reference
    }

    input( event ) {
        
        var key = event.key;

        // camera movement
        if ( this.cameraMovement ) {

            switch ( key ) {
                case "ArrowRight":                                                                          // moves camera to right
                    vec3.add( eye, eye, vec3.fromValues( 1, 0, 0 ) );                                       
                    break;
                case "ArrowLeft":                                                                           // moves camera to left
                    vec3.sub( eye, eye, vec3.fromValues( 1, 0, 0 ) );
                    break;
                case "ArrowUp":                                                                             // moves camera to up
                    vec3.add( eye, eye, vec3.fromValues( 0, 1, 0 ) );
                    break;
                case "ArrowDown":                                                                           // moves camera to down
                    vec3.sub( eye, eye, vec3.fromValues( 0, 1, 0 ) );
                    break;
                case ".":                                                                                   // moves camera away
                    vec3.add( eye, eye, vec3.fromValues( 0, 0, 1 ) );
                    break;
                case "-":                                                                                   // moves camera closer
                    vec3.sub( eye, eye, vec3.fromValues( 0, 0, 1 ) );                               
                    break;
                case "c":                                                                                   // deactivates camera movement
                    this.cameraMovement = !this.cameraMovement;
                    break;
                default:
                    break;
            }

        } 
        else { // general user interaction

            switch ( key ) {
                // base rotation on Y axis
                case "ArrowRight":
                    this.thetaOne += 2 * Math.PI / 180;                                                                   
                    this.axis = "Y";
                    break;
                case "ArrowLeft":
                    this.thetaOne -= 2 * Math.PI / 180;
                    this.axis = "Y";
                    break;
                // lower arm rotation on Z axis
                case "ArrowUp":
                    this.thetaTwo += 2 * Math.PI / 180;
                    if ( this.thetaTwo > Math.PI/2 ) this.thetaTwo = Math.PI/2;                             // rotation limited to 90 deg
                    this.axis = "Z";
                    break;
                case "ArrowDown":
                    this.thetaTwo -= 2 * Math.PI / 180;
                    if ( this.thetaTwo < -Math.PI/2 ) this.thetaTwo = -Math.PI/2;                           // rotation limited to -90 deg
                    this.axis = "Z";
                    break;
                // upper arm rotation on Z axis
                case ".":
                    this.thetaThree += 2 * Math.PI / 180;
                    if ( this.thetaThree > 170 * Math.PI / 180 ) this.thetaThree = 170 * Math.PI / 180;     // rotation limited to 170 deg
                    this.axis = "Z";
                    break;
                case "-":
                    this.thetaThree -= 2 * Math.PI / 180;
                    if ( this.thetaThree < 170 * -Math.PI / 180 ) this.thetaThree = 170 * -Math.PI / 180;   // rotation limited to -170 deg
                    this.axis = "Z";
                    break;
                // ground sphere translation on X axis
                case "k":
                    this.ballX += 0.01;
                    if ( this.ballX > 0.25 ) this.ballX = 0.25;                                             // translation limited to 0.25
                    break;
                case "j":
                    this.ballX -= 0.01;
                    if ( this.ballX < -0.25 ) this.ballX = -0.25;                                           // translation limited to -0.25
                    break;
                // finger rotation on Z axis
                case "n":
                    this.thetaFour += 2 * Math.PI / 180;
                    if ( this.thetaFour > Math.PI/2 ) this.thetaFour = Math.PI/2;                           // rotation limited to 90 deg
                    this.axis = "Z";
                    break;
                case "m":
                    this.thetaFour -= 2 * Math.PI / 180;
                    if ( this.thetaFour < -Math.PI/2 ) this.thetaFour = -Math.PI/2;                         // translation limited to -90
                    this.axis = "Z";
                    break;
                // activate camera movement
                case "c":   
                    this.cameraMovement = !this.cameraMovement;
                    break;        
                // picking
                case "p":
                    if ( !objectPicked ) {
                        console.log( objectPicked );
                        this.setDropRate( 0 );
                        this.picker.pick();
                    }
                    break;  
                // dropping
                case "d":
                    if ( objectPicked ) {
                        this.picker.drop();
                        this.fingerPos = vec3.clone( this.picker.getFingerPos() );
                    }
                    break;
                // vertex shading, only set to only specular to see the difference
                case "v":
                    this.light = new Lightning( this.gl, this.program );
                    this.light.setShading( true );
                    this.light.setSpecularOnly();
                    this.light.letThereBeLight( this.objects );
                    break;
                // fragment shading
                case "f":
                    this.light = new Lightning( this.gl, this.program );
                    this.light.setShading( false );
                    this.light.letThereBeLight( this.objects );
                    break;
                default:
                    console.log( "Not implemented yet." );
                    break;
            }

        }
        
    }

    // set and get methods

    setDropRate ( dropRate ) {
        this.dropRate = dropRate;
    }

    setPicker ( picker ) {
        this.picker = picker;
    }

    setLight ( light ) {
        this.light = light;
    }

    setObjects( objects ) {
        this.objects = objects;
    }

    getThetaOne() { return this.thetaOne; }
    getThetaTwo() { return this.thetaTwo; }
    getThetaThree() { return this.thetaThree; }
    getThetaFour() { return this.thetaFour; }
    getBallX() { return this.ballX; }
    getAxis() { return this.axis; }

    // returns the rotation degree, uses dropRate for simplicity
    getFallingRot () {
        if ( this.fingerPos[1] - this.dropRate < -0.5 ) {
            return 0;
        }
        return this.dropRate * 5;
    }
    
    // returns the drop vector, uses -0.5 as stopping point
    getDropVector() {

        var t = vec3.create();
        if ( this.fingerPos[1] - this.dropRate < -0.5 ) {                                                             // stops at -0.5 since its the ground plane
            t = vec3.fromValues( this.fingerPos[0] , -0.5, this.fingerPos[2] + eye[2] );                              // + eye[2] required since it effects modelViewMatrix
            onGround = true;
            return t;
        }
        this.dropRate += 0.005;
        t = vec3.fromValues( this.fingerPos[0] , this.fingerPos[1] - this.dropRate, this.fingerPos[2] + eye[2] );    // + eye[2] required since it effects modelViewMatrix
        return t;

    }

}
