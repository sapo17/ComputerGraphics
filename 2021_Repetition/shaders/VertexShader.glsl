attribute vec4 vPosition;
attribute vec4 vColor;

varying vec4 fColor;

uniform vec3 translationVector;
uniform vec3 rotationVector;
uniform vec3 scalingVector;

mat4 getRotationMatrix( vec3 rotationVector ) {

    // compute the sines and cosines of thetat for each of
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


mat4 getScalingMatrix( vec3 scalingVector ) {
    return mat4(
        scalingVector.x,             0.0,             0.0, 0.0,
                    0.0, scalingVector.y,             0.0, 0.0,
                    0.0,             0.0, scalingVector.z, 0.0,
                    0.0,             0.0,             0.0, 1.0
    );
}


mat4 getTranslationMatrix( vec3 translationVector ) {
    return mat4(
                        1.0,                 0.0,                 0.0, 0.0,
                        0.0,                 1.0,                 0.0, 0.0,
                        0.0,                 0.0,                 1.0, 0.0,
        translationVector.x, translationVector.y, translationVector.z, 1.0
    );
}


void main() {
    mat4 T = getTranslationMatrix( translationVector );
    mat4 R = getRotationMatrix( rotationVector );
    mat4 S = getScalingMatrix( scalingVector );
    mat4 temp = T * R * S;
    gl_Position = temp * vPosition;
    fColor = vec4( vColor.x, vColor.y, vColor.z, 1.0 );
}