class renderer {

public:

    int width, height;
    camera cam;
    std::vector<light> lights;
    bool materialGiven = false;

    // Constructor
    renderer ( const camera &cam, const std::vector<light> &lights, const bool& b = false ) 
        : cam( cam ), lights( lights ), materialGiven( b ) {}

    // Method declarations
    vec3 drawPixel ( const ray &r, const std::vector<surface*> &surfaces, const int &step );
    void render( const std::vector<surface*> &surfaces );

};

// draws a pixel if ray intersects with any surface element
vec3 renderer::drawPixel ( const ray &r, const std::vector<surface*> &surfaces, const int &step = 0 ) {
        
    record rec;
    vec3 localColor, reflected, transmitted;

    // in case of recursion
    if ( step > cam.getMaxBounces() ) return vec3( 0, 0, 0 );

    // iterates through surfaces
    for ( const auto &s : surfaces ) {
        
        // checks whether any intersection occurs
        if ( s->intersection( r, 0.0, FLT_MAX, rec ) ) {

            // iterates and calculates phong value for each available light
            for ( auto &lig : lights ) {
                localColor += lig.lightning( rec, s, materialGiven );                 
            }

            // ray reflectedRay( rec.p, reflect( unitVector(r.getOrigin()), unitVector(rec.normal) ) );
            // reflected = drawPixel( reflectedRay, surfaces, step + 1 );

            // if ( reflected.length() > 0 ) reflected = unitVector(vec3( sqrt(reflected.x()), sqrt(reflected.y()), sqrt(reflected.z()) ));

            localColor *=  s->getColor(); // adds the surface color

        } 

    }

    return localColor; 

}

// renders an image that contains surfaces with a given height and width
void renderer::render ( const std::vector<surface*> &surfaces ) {

    // size variables
    int width = cam.getWidth();
    int height = cam.getHeight();
    int left = 1, right = -1; // flipped left and right for getting a correct image
    int bottom = -1, top = 1;

    // puts out an ppm file with 8 bit values
    std::ofstream out( "out.ppm" );
    out << "P3\n" << width << " " << height << "\n255\n";

    // iterates through width and height
    for ( int y = 0; y < height; ++y ) {
        for ( int x = 0; x < width; ++x ) {

            vec3 color;

            // calculates the coordinates of pixel's position on the image plane
            float u = float( left ) + float( right - left ) * float( x + 0.5 ) / float( width ) ;
            float v = float( bottom ) + float( top - bottom ) * float( y + 0.5 ) / float( height );

            // creates a ray with a given pixel's position
            ray r = cam.getRay( u, v );

            // draws a pixel with the given ray
            color += drawPixel( r, surfaces );

            // brings values into 8 bit range
            int ir = int( 255 * color[0] );
            int ig = int( 255 * color[1] );
            int ib = int( 255 * color[2] );

            if ( ir > 255 ) ir = 255;
            if ( ig > 255 ) ig = 255;
            if ( ib > 255 ) ib = 255;

            out << ir << ' '
                << ig << ' '
                << ib << '\n';

        }
    }

}
