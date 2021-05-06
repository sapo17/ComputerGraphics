attribute vec4 vPosition;
attribute vec4 vColor;

varying vec4 fColor;

void main() {
    gl_Position = vPosition;
    fColor = vec4( vColor.x, vColor.y, vColor.z, 1.0 );
}