class camera {

public:

    vec3 eye, u, v, n;
    int width, height, maxBounces;
    float fov;

    // Constructor
    camera ( vec3 eye, vec3 at, vec3 up, float fov, int width, int height, int maxBounces = 1 ) {

        // sets the camera variables
        this->eye = eye;
        this->width = width;
        this->height = height;
        this->maxBounces = maxBounces;

        float theta = fov * M_PI / 180;         // degrees to radians
        this->fov = tan( theta );               // calculates the fov

        this->n = unitVector( at - this->eye ); // view point normal
        this->u = unitVector( cross( up, n ) ); // right
        this->v = unitVector( cross( n, u ) );  // up

    }

    // get methods
    ray getRay ( float u, float v );
    int getWidth() { return width; }
    int getHeight() { return height; }
    int getMaxBounces() { return maxBounces; }

};

// returns a new ray with the given pixel's position
ray camera::getRay( float u, float v ) {
    return ray( eye, n + this->u * fov * u + this->v * fov * v );
}