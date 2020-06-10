class sphere : public surface { // extends the abstract surface class

public:

    vec3 center;
    float radius;

    // Constructors
    sphere () {}
    sphere ( const vec3 &center, const float &radius ) : center ( center ), radius ( radius ) {
        setMaterials(
            vec3( 0.3f, 0.3f, 0.3f ),
            vec3( 0.6f, 0.6f, 0.6f ),
            vec3( 0.6f, 0.6f, 0.6f )
        );
        setColor( vec3( 0.1f, 0.1f, 0.4f ) );
    }

    // method declarations
    virtual bool intersection ( const ray &r, float tMin, float tMax, record &rec ) const override;
    virtual void print() override;

};

// overrides the abstract intersection method, returns true if given ray intersects with a sphere
bool sphere::intersection ( const ray &r, float tMin, float tMax, record &rec ) const {

    vec3 ec = r.getOrigin() - center;                       // ray direction
    float a = dot( r.getDirection(), r.getDirection() );    // quadratic eq: part a
    float b = dot( ec, r.getDirection() );                  // quadratic eq: part b
    float c = dot( ec, ec ) - radius * radius;              // quadratic eq: part c
    float discriminant = b * b - a * c;                     // quadratic eq: discriminant
    
    if ( discriminant > 0 ) {                               // if discriminant positive, we have 2 solutions

        float sol = ( - b - sqrt( b * b - a * c ) ) / a;    // quadratic eq sol: neg

        if ( sol < tMax && sol > tMin ) {                   // if solution in the range tMin < sol < tMax
            rec.t = sol;                                    // record t
            rec.p = r.pointAtRay( rec.t );                  // record point p at ray
            rec.normal = ( rec.p - center ) / radius;       // calculate surface normal
            return true;                
        }

        sol = ( -b + sqrt( b * b - a * c ) ) / a;           // quadratic eq sol: neg

        if ( sol < tMax && sol > tMin ) {                   // if solution in the range tMin < sol < tMax
            rec.t = sol;                                    // record t
            rec.p = r.pointAtRay( rec.t );                  // record point p at ray
            rec.normal = ( rec.p - center ) / radius;       // calculate surface normal
            return true;
        }

    } 

    return false;                                           // no intersection

}

void sphere::print() {
    std::cout << "Center: " << center << " Radius: " << radius << std::endl; 
}