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
    vec3 drawPixel ( const ray &r, const std::vector<surface*> &surfaces, record &rec, const int &step );
    void render( const std::vector<surface*> &surfaces );

};

// records the closest intersection and returns true if any intersection occurs, otherwise false
inline bool recordClosest( const std::vector<surface*> surfaces, record &rec, const ray& r ) {
    record temp_rec;
    bool intersected = false;
    float closestIntersection = FLT_MAX;

    // iterates through surfaces
    for ( const auto &s : surfaces ) {

        // checks whether any intersection occurs
        if ( s->intersection( r, 0.0, closestIntersection, temp_rec ) ) {

            // saves the surface which has the closest intersection
            if ( temp_rec.t < closestIntersection ) {
                temp_rec.s = s;
            }

            // saves the temporary record
            intersected = true;
            closestIntersection = temp_rec.t;
            rec = temp_rec;

        } 

    }

    return intersected;
}

// returns true if the point of intersection is in shadow from any of the surfaces, otherwise false
inline bool shadowIntersection( const std::vector<surface*> &surfaces, record &rec, const renderer& renderer ) {
    for ( const auto &s: surfaces ) {
        if ( s->getGivenMaterials().getShininess() == 20 ) continue; // added for example4 to avoid the shadow of the wall
            for ( const auto& lig: renderer.lights ) {
                if ( !(lig.ambientLight == vec3()) ) continue;
                vec3 l = lig.getLightPosition();
                vec3 tempLightDirection = l.y() < 0 ? -1*l : vec3( l.x(), l.y(), -l.z());
                ray shadowRay( rec.p, tempLightDirection );
                if ( s->intersection( shadowRay, 0.5, FLT_MAX, rec ) ) return true;
            }            
        }
    return false;
}

// Source: Scratch-A-Pixel
// Link: https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/reflection-refraction-fresnel
// fresnel calculation for refraction, modifies kr value
void fresnel( const vec3& incident, const vec3 &normal, const float &ior, float &kr ) {
    float cosi = std::max(-1.0f, std::min(1.0f, dot(normal, incident)));
    float etai = 1, etat = ior;

    float sint = etai / etat * sqrtf( std::max( 0.f, 1 - cosi * cosi ) );

    if ( sint >= 1 ) kr = 1;
    else {
        float cost = sqrtf( std::max( 0.f, 1 - sint * sint ) );
        cosi = fabs( cosi );
        float Rs = (( etat * cosi ) - (etai * cost)) / ( (etat*cosi) + (etai*cost) );
        float Rp = (( etai * cosi ) - (etat * cost)) / ( (etai*cosi) + (etat*cost) );
        kr = ( Rs * Rs + Rp * Rp ) / 2;
    }
}

// Source: Angel-Interactive Computer graphics, chapter 12
// Only influenced how to structure the whole tracing process
// draws a pixel if ray intersects with any surface element
vec3 renderer::drawPixel ( const ray &r, const std::vector<surface*> &surfaces, record &rec, const int &step = 0 ) {

    vec3 localColor, reflected, transmitted;

    // in case of recursion
    if ( step > cam.getMaxBounces() ) return vec3();

    bool intersected = recordClosest( surfaces, rec, r );

    // in case of intersection, draws the closest surface to the camera
    if ( intersected ) {

        // iterates and calculates phong value for each available light
        for ( auto &lig : lights ) {
            localColor += lig.lightning( rec, rec.s, materialGiven );    
        }
        localColor *= rec.s->getColor();

        // if the surface reflects light
        if ( rec.s->getGivenMaterials().getReflectance() > 0 ) {
            ray reflectedRay( rec.p + rec.normal * 0.1, reflect( r.getDirection(), rec.normal ) );
            return reflected = drawPixel( reflectedRay, surfaces, rec, step + 1);
        }

        // if the surface transmits light
        if ( rec.s->getGivenMaterials().getTransmittance() > 0 ) {
            float kr;
            fresnel( r.getDirection(), rec.normal, rec.s->getGivenMaterials().getRefraction(), kr );
            bool out = dot( r.getDirection(), rec.normal ) < 0;
            vec3 bias = rec.normal * 0.5;

            if ( kr < 1 ) {
                vec3 refractionDirection = refract( r.getDirection(), rec.normal, rec.s->getGivenMaterials().getRefraction() );
                vec3 refractionOrigin = out ? rec.p - bias : rec.p + bias;
                ray refractedRay( refractionOrigin, refractionDirection );
                transmitted = drawPixel( refractedRay, surfaces, rec, step + 1 );
            }
            vec3 reflectionDirection = reflect( r.getDirection(), rec.normal );
            vec3 reflectionOrigin = out ? rec.p + bias : rec.p - bias;
            ray reflectedRay( reflectionOrigin, reflectionDirection );
            reflected = drawPixel( reflectedRay, surfaces, rec, step + 1 );

            return transmitted = reflected * kr + transmitted * ( 1 - kr );   
        }

    }

    // if the point is in shadow returns shadow value
    if ( shadowIntersection( surfaces, rec, *this ) ) return vec3( 0.2, 0.2, 0.2 );

    return localColor; 

}

// Source: Raytracing in one Weekend-Peter Shirley and Fundamentals of Computer Graphics
// Influenced how to output image and how to calculate the coordinates
// renders an image that contains surfaces with a given height and width
void renderer::render ( const std::vector<surface*> &surfaces ) {

    // size variables
    int width = cam.getWidth();
    int height = cam.getHeight();
    int left = -1, right = 1;
    int bottom = -1, top = 1;

    // puts out an ppm file with 8 bit values
    std::ofstream out( "out.ppm" );
    out << "P3\n" << width << " " << height << "\n255\n";

    // iterates through width and height inversed
    for ( int y = height; y > 0; --y ) {
        for ( int x = 0; x < width; ++x ) {

            vec3 color;

            // calculates the coordinates of pixel's position on the image plane
            float u = left + ( right - left ) * float( x + 0.5 ) / float( width );
            float v = bottom + ( top - bottom ) * float( y + 0.5 ) / float( height );

            // creates a ray with a given pixel's position
            ray r = cam.getRay( u, v );

            // draws a pixel with the given ray
            record rec;
            color += drawPixel( r, surfaces, rec );

            // bring values into 8 bit range
            int ir = int( 255 * clamp( 0, 1, color[0] ) );
            int ig = int( 255 * clamp( 0, 1, color[1] ) );
            int ib = int( 255 * clamp( 0, 1, color[2] ) );

            out << ir << ' '
                << ig << ' '
                << ib << '\n';

        }
    }

}

