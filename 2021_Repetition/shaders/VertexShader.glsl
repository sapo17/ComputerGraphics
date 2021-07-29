attribute vec4 vPosition;
attribute vec4 vColor;

varying vec4 fColor;

uniform vec3 translationVector;
uniform vec3 rotationVector;
uniform vec3 scalingVector;
uniform vec3 eye;
uniform vec3 at;
uniform vec3 up;

/** returns the rotation matrix from the given rotation vector */
mat4 getRotationMatrix( vec3 rotationVector ) {

    // compute the sines and cosines of theta for each of
    // the three axes in one computation
    vec3 angles = radians( rotationVector );
    vec3 c = cos( angles );
    vec3 s = sin( angles );
    
    // Remember: Column major order!
    mat4 rx = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, c.x, s.x, 0.0,
        0.0,-s.x, c.x, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 ry = mat4(
        c.y, 0.0,-s.y, 0.0,
        0.0, 1.0, 0.0, 0.0,
        s.y, 0.0, c.y, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    mat4 rz = mat4(
        c.z,-s.z, 0.0, 0.0,
        s.z, c.z, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    return rz * ry * rx;
}


/** returns the scaling matrix given from the given scaling vector */
mat4 getScalingMatrix( vec3 scalingVector ) {
    return mat4(
        scalingVector.x,             0.0,             0.0, 0.0,
                    0.0, scalingVector.y,             0.0, 0.0,
                    0.0,             0.0, scalingVector.z, 0.0,
                    0.0,             0.0,             0.0, 1.0
    );
}


/** returns the translation matrix from the given tranbslation vector */
mat4 getTranslationMatrix( vec3 translationVector ) {
    return mat4(
                        1.0,                 0.0,                 0.0, 0.0,
                        0.0,                 1.0,                 0.0, 0.0,
                        0.0,                 0.0,                 1.0, 0.0,
        translationVector.x, translationVector.y, translationVector.z, 1.0
    );
}


/** returns the model-view matrix from the given transformation vectors */
mat4 getTransformationMatrix( vec3 translationVector, vec3 rotationVector, 
        vec3 scalingVector ) {
    mat4 T = getTranslationMatrix( translationVector );
    mat4 R = getRotationMatrix( rotationVector );
    mat4 S = getScalingMatrix( scalingVector );
    mat4 result = T * R * S;
    return result;
}


/** returns the model-view matrix from given vectors */
mat4 lookAt( vec3 eye, vec3 at, vec3 up ) {

    mat4 result = mat4( 1.0 );
    
    if ( any(notEqual(eye, at)) ) {
        vec3 n = normalize( at - eye );     // view-plane normal
        vec3 u = normalize( cross(up, n) ); // perpendicular vector
        vec3 v = normalize( cross(n, u) );  // new up vector
        n = -n;
        result = mat4(
                       u.x,           v.x,            n.x, 0.0,
                       u.y,           v.y,            n.y, 0.0,
                       u.z,           v.z,            n.z, 0.0,
            -dot( u, eye ), -dot( v, eye), -dot( n, eye ), 1.0
        );
    } 

    return result;
}


/** starting point of the vertex shader */
void main() {
    mat4 modelViewMatrix = lookAt( eye, at, up ) * getTransformationMatrix(
        translationVector, rotationVector, scalingVector );
    gl_Position = modelViewMatrix * vPosition;
    fColor = vColor;
}