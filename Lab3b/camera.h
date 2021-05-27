class camera {

public:

    vec3 eye, vpn, u, v;
    int width, height, maxBounces;
    float fov;

    // Constructor
    camera ( vec3 eye, vec3 at, vec3 up, float fov, int width, int height, int maxBounces = 1 ) {

        // sets the camera variables
        this->eye = eye;
        this->width = width;
        this->height = height;
        this->maxBounces = maxBounces;

        float theta = fov * M_PI / 180;              // degrees to radians
        this->fov = tan( theta  );                   // calculates the fov

        vpn = unitVector( eye - at );                // view point normal
        u = unitVector( cross( up, vpn ) );          // right
        v = cross( vpn, u );                         // up

        std::cout << "vpn: " << vpn << " u: " << u << " v: " << v << std::endl;

    }

    // get methods
    ray getRay ( float u, float v );
    int getWidth() { return width; }
    int getHeight() { return height; }
    int getMaxBounces() { return maxBounces; }

};

// returns a new ray with the given pixel's position
ray camera::getRay( float u, float v ) {
    return ray( eye, -1 * vpn + this->u * fov * u + this->v * fov * v ); // ray( origin, direction )
}