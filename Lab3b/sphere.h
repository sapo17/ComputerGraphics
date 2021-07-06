class sphere : public surface { // extends the abstract surface class

public:

    vec3 center;
    float radius;

    // Constructors
    sphere () {}
    sphere ( const vec3 &center, const float &radius ) : center ( center ), radius ( radius ) {
        setMaterials(
            vec3( 0.5f, 0.5f, 0.5f ),
            vec3( 1, 1, 1 ),
            vec3( 1, 1, 1 )
        );
        setColor( vec3( 0.1f, 0.1f, 0.4f ) );
    }

    // method declarations
    virtual bool intersection ( const ray &r, float tMin, float tMax, record &rec ) const override;
    virtual void print() override;

};

// Source: Ray Tracing in One Weekend - Peter Shirley, Fundamentals of Comp. Graphics
// Implementation for ray-sphere intersection, uses a classic quadratic equation: at^2 + bt + c = 0
// overrides the abstract intersection method, returns true if given ray intersects with a sphere
bool sphere::intersection ( const ray &r, float tMin, float tMax, record &rec ) const {

    vec3 ec = r.getOrigin() - center;                       // ray direction
    float a = r.getDirection().squaredLength();             // quadratic eq: part a
    float b = dot( ec, r.getDirection() );                  // quadratic eq: part half b
    float c = ec.squaredLength() - radius * radius;         // quadratic eq: part c
    float discriminant = b * b - a * c;                     // quadratic eq: discriminant
    
    if ( discriminant > 0 ) {                               // if discriminant positive, we have 2 solutions

        float sol = ( - b - sqrt( discriminant ) ) / a;    // quadratic eq sol: neg

        if ( sol < tMax && sol > tMin ) {                   // if solution in the range tMin < sol < tMax
            rec.t = sol;                                    // record t
            rec.p = r.pointAtRay( rec.t );                  // record point p at ray
            vec3 outwardNormal = ( rec.p - center ) / radius;   // calculates the normal
            rec.setFaceNormal( r, outwardNormal );              // sets the normal outwards when necessary 
            return true;                
        }

        sol = ( -b + sqrt( discriminant ) ) / a;           // quadratic eq sol: neg

        if ( sol < tMax && sol > tMin ) {                   // if solution in the range tMin < sol < tMax
            rec.t = sol;                                    // record t
            rec.p = r.pointAtRay( rec.t );                  // record point p at ray
            vec3 outwardNormal = ( rec.p - center ) / radius;   // calculates the normal
            rec.setFaceNormal( r, outwardNormal );              // sets the normal outwards when necessary
            return true;
        }

    } 

    return false;                                           // no intersection

}

void sphere::print() {
    std::cout << "Center: " << center << " Radius: " << radius << std::endl; 
}