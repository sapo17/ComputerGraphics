class CanadArm {

    constructor( program, gl, ui ) {
        
        this.program = program;
        this.gl = gl;
        this.ui = ui;
        this.symbols = new Map();
        this.fingerPos = vec3.create();
        this.BASE_HEIGHT      = .1;
        this.BASE_WIDTH       = .5;
        this.SPHERE_HEIGHT    = .09;
        this.SPHERE_WIDTH     = .09;
        this.ARM_HEIGHT       = .5;
        this.ARM_WIDTH        = .1;
        this.FINGER_HEIGHT    = .25;
        this.FINGER_WIDTH     = .03;
        this.cubeObject = new Cube( this.gl );
        this.cubeObject.create();
        this.sphereObject = new Sphere( this.gl );
        this.sphereObject.create();

    }

    // Source: Interactive Computer Graphics - Angel,Shreiner, Chapter 9
    // Lines similar: 28-37
    // influenced by constructing a node for the three structure
    // returns the current node that contains a child and a sibling
    node () {

        var node = {
            child: null,
            sibling: null,
        }

        return node;

    }

    // creates the tree data structure with default symbols
    create () {

        var baseNode = this.node();
        baseNode.child = "BottomSphere";
        this.symbols.set( "Base", baseNode );

        var botSphereNode = this.node();
        botSphereNode.child = "LowerArm";
        this.symbols.set( "BottomSphere", botSphereNode );

        var lowArmNode = this.node();
        lowArmNode.child = "MidSphere";
        this.symbols.set( "LowerArm", lowArmNode );
        
        var midSphereNode = this.node();
        midSphereNode.child = "UpperArm";
        this.symbols.set( "MidSphere", midSphereNode );

        var upArmNode = this.node();
        upArmNode.child = "EndSphere";
        this.symbols.set( "UpperArm", upArmNode );

        var endSphereNode = this.node();
        endSphereNode.child = "FingerLeft";
        this.symbols.set( "EndSphere", endSphereNode );

        var leftFinNode = this.node();
        leftFinNode.sibling = "FingerRight";
        this.symbols.set( "FingerLeft", leftFinNode );

        var rightFinNode = this.node();
        this.symbols.set( "FingerRight", rightFinNode );

    }
    
    // traverses and draws the elements of the tree structure
    traverse ( symbolName ) {

        switch ( symbolName ) {
            case "Base":
                this.base();
                var baseNode = this.symbols.get( symbolName );
                if ( baseNode.child != null ) this.traverse( baseNode.child );
                if ( baseNode.sibling != null ) this.traverse( baseNode.sibling );
                break;
            case "BottomSphere":
                this.bottomSphere();
                var botSphereNode = this.symbols.get( symbolName );
                if ( botSphereNode.child != null ) this.traverse( botSphereNode.child );
                if ( botSphereNode.sibling != null ) this.traverse( botSphereNode.sibling );
                break;
            case "LowerArm":
                this.lowerArm();
                var lowArmNode = this.symbols.get( symbolName );
                if ( lowArmNode.child != null ) this.traverse( lowArmNode.child );
                if ( lowArmNode.sibling != null ) this.traverse( lowArmNode.sibling );
                break;
            case "MidSphere":
                this.midSphere();
                var midSphereNode = this.symbols.get( symbolName );
                if ( midSphereNode.child != null ) this.traverse( midSphereNode.child );
                if ( midSphereNode.sibling != null ) this.traverse( midSphereNode.sibling );
                break;
            case "UpperArm":
                this.upperArm();
                var upArmNode = this.symbols.get( symbolName );
                if ( upArmNode.child != null ) this.traverse( upArmNode.child );
                if ( upArmNode.sibling != null ) this.traverse( upArmNode.sibling );
                break;
            case "EndSphere":
                this.endSphere();
                var endSphereNode = this.symbols.get( symbolName );
                if ( endSphereNode.child != null ) this.traverse( endSphereNode.child );
                if ( endSphereNode.sibling != null ) this.traverse( endSphereNode.sibling );
                break;
            case "FingerLeft":
                this.finger( -1 );
                var leftFinNode = this.symbols.get( symbolName );
                if ( leftFinNode.child != null ) this.traverse( leftFinNode.child );
                if ( leftFinNode.sibling != null ) this.traverse( leftFinNode.sibling );
                break;
            case "FingerRight":
                this.finger();
                var rightFinNode = this.symbols.get( symbolName );
                if ( rightFinNode.child != null ) this.traverse( rightFinNode.child );
                if ( rightFinNode.sibling != null ) this.traverse( rightFinNode.sibling );
                break;
            case "PickedCube":
                this.pickedCube();
                var pickedCubeNode = this.symbols.get( symbolName );
                if ( pickedCubeNode.child != null ) this.traverse( pickedCubeNode.child );
                if ( pickedCubeNode.sibling != null ) this.traverse( pickedCubeNode.sibling );
                break;
            default:
                break;
        }
        
        
    }

    // picks up the object if the distance is smaller than 0.35
    pick () {

        // getting cube's position
        var cubePos = vec3.create();
        mat4.getTranslation( cubePos, modelViewMatrix );
        
        var figPos = this.fingerPos;
        
        // point-point subtraction
        var d = vec3.create();
        vec3.sub( d, figPos, cubePos );
        
        // finding vector d's length
        var len = vec3.len( d );

        // if the distance between endSphere and colaredCube
        // lower than 0.35 than canadArm can pick up the colaredCube
        if ( len < 0.35 ) {
            var rightFinNode = this.symbols.get( "FingerRight" );
            rightFinNode.child = "PickedCube";
            objectPicked = true;
            objectAtDefault = false;
            onGround = false;
            var pickedCubeNode = this.node();
            this.symbols.set( "PickedCube", pickedCubeNode );
        }

    }

    // calculates the matrices and draws the object
    pickedCube () {

        var temp = mat4.clone( modelViewMatrix );

        var t = mat4.create();
        var cubeScaling = .15;

        // rotate base
        mat4.fromTranslation( t, vec3.fromValues( -this.FINGER_WIDTH, this.FINGER_HEIGHT/2, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );

        var cube = new Cube( this.gl, true );
        cube.create();

        cube.load( this.program );
        cube.transform( vec3.fromValues( 0, 0.5 * cubeScaling, 0 ), 0, "X", vec3.fromValues( cubeScaling, cubeScaling, cubeScaling ) );
        cube.draw();

        modelViewMatrix = mat4.clone( temp );

    }

    // removes the object from the three structure
    drop () {
        objectPicked = false;
        this.symbols.delete( "PickedCube" );
        var rightFinNode = this.symbols.get( "FingerRight" );
        rightFinNode.child = null;
    }

    // calculates the matrices and draws the object
    base () {

        var t = mat4.create();
        var r = mat4.create();

        // rotate base
        mat4.fromTranslation( t, vec3.fromValues( 0, -.5, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );
        mat4.fromRotation( r, this.ui.getThetaOne(), vec3.fromValues( 0, 1, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, r );

        this.cubeObject.load( this.program );
        this.cubeObject.transform( vec3.fromValues( 0, 0.5 * this.BASE_HEIGHT, 0 ), 0, "X", vec3.fromValues( this.BASE_WIDTH, this.BASE_HEIGHT, this.BASE_WIDTH ) );
        this.cubeObject.draw();

    }

    // calculates the required matrices for drawing the symbol
    bottomSphere () {

        var t = mat4.create();
        
        mat4.fromTranslation( t, vec3.fromValues( ui.getBallX(), this.BASE_HEIGHT, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );

        this.drawSphere();

    }

    // calculates the required matrices for drawing the symbol
    midSphere () {

        var t = mat4.create();
        var r = mat4.create();
        
        mat4.fromTranslation( t, vec3.fromValues( 0, this.ARM_HEIGHT, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );

        this.drawSphere();

    }

    // calculates the required matrices for drawing the symbol
    endSphere () {

        var t = mat4.create();
        
        mat4.fromTranslation( t, vec3.fromValues( 0, this.ARM_HEIGHT, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );

        this.drawSphere();

    }

    // calculates the required matrices for drawing the symbol
    lowerArm () {

        var t = mat4.create();
        var r = mat4.create();

        // rotate base
        mat4.fromTranslation( t, vec3.fromValues( 0, this.SPHERE_HEIGHT, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );
        mat4.fromRotation( r, this.ui.getThetaTwo(), vec3.fromValues( 0, 0, 1 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, r );

        this.drawArm();

    }

    // calculates the required matrices for drawing the symbol
    upperArm () {

        var t = mat4.create();
        var r = mat4.create();

        // rotate base
        mat4.fromTranslation( t, vec3.fromValues( 0, this.SPHERE_HEIGHT, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );
        mat4.fromRotation( r, this.ui.getThetaThree(), vec3.fromValues( 0, 0, 1 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, r );

        this.drawArm();

    }


    // calculates the required matrices for drawing the symbol
    finger ( sign = 1 ) {

        // saving modelViewMatrix for the right finger
        var temp = mat4.clone( modelViewMatrix );

        var t = mat4.create();
        var r = mat4.create();

        // rotate base
        mat4.fromTranslation( t, vec3.fromValues( sign * this.SPHERE_WIDTH / 2, this.SPHERE_HEIGHT, 0 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, t );
        mat4.fromRotation( r, this.ui.getThetaFour(), vec3.fromValues( 0, 0, 1 ) );
        mat4.mul( modelViewMatrix, modelViewMatrix, r );

        // saving finger position
        mat4.getTranslation( this.fingerPos, modelViewMatrix );

        this.drawFinger();

        // if its the left finger, we retrieve the old mV for the right finger
        if ( sign == -1 ) { modelViewMatrix = mat4.clone( temp ); }

    }

    // draws the objects with specified scaling and translation
    drawSphere () {

        this.sphereObject.load( this.program );
        this.sphereObject.transform( vec3.fromValues( 0, this.SPHERE_HEIGHT, 0 ), 0, "X", vec3.fromValues( this.SPHERE_WIDTH, this.SPHERE_HEIGHT, this.SPHERE_WIDTH ) );
        this.sphereObject.draw();

    }

    // draws the objects with specified scaling and translation
    drawArm () {

        this.cubeObject.load( this.program );
        this.cubeObject.transform( vec3.fromValues( 0, 0.5 * this.ARM_HEIGHT, 0 ), 0, "X", vec3.fromValues( this.ARM_WIDTH, this.ARM_HEIGHT, this.ARM_WIDTH ) );
        this.cubeObject.draw();

    }

    // draws the objects with specified scaling and translation
    drawFinger () {

        this.cubeObject.load( this.program );
        this.cubeObject.transform( vec3.fromValues( 0, 0.5 * this.FINGER_HEIGHT, 0 ), 0, "X", vec3.fromValues( this.FINGER_WIDTH, this.FINGER_HEIGHT, this.FINGER_WIDTH ) );
        this.cubeObject.draw();

    }

    // returns the primitives for lightning
    consistsOf () {
        return [ this.cubeObject, this.sphereObject ];
    }

    // returns the endSphere / finger position
    getFingerPos () {
        return this.fingerPos;
    }

}