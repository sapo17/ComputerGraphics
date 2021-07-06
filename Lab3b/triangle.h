class triangle : public surface {

public:

    vec3 v0, v1, v2, normal;

    // Constructors
    triangle () {}
    triangle ( const vec3 &v0, const vec3 &v1, const vec3 &v2 ) : v0( v0 ), v1( v1 ), v2( v2 ) {
        setMaterials(
            vec3( 0.3f, 0.3f, 0.3f ),
            vec3( 1, 1, 1 ),
            vec3( 1, 1, 1 )
        );
        setColor( vec3( 0.4f, 0.1f, 0.1f ) );
        normal = unitVector(cross( v1 - v0, v2 - v0 ));
    }
    triangle ( const vec3 &v0, const vec3 &v1, const vec3 &v2, const vec3& normal ) :
        v0( v0 ), v1 ( v1 ), v2 ( v2 ), normal ( normal ) {
            setMaterials(
                vec3( 0.3f, 0.3f, 0.3f ),
                vec3( 1, 1, 1 ),
                vec3( 1, 1, 1 )
            );
            setColor( vec3( 0.5f, 0.5f, 0.5f ) );
        }

    // method declarations
    virtual bool intersection ( const ray &r, float tMin, float tMax, record &rec ) const override;
    virtual void print() override;

};

// Source: Scratch A Pixel
// Implementation for ray-sphere intersection, uses Moeller-Trumbore Algorithm
// overrides the abstract intersection method, returns true if given ray intersects with a triangle
bool triangle::intersection( const ray &r, float tMin, float tMax, record &rec ) const {

    // Moeller-Trumbore algorithm

    vec3 e1 = v1 - v0;
    vec3 e2 = v2 - v0;

    // P = direction x ( v2 - v0 )
    vec3 P = cross( r.getDirection(), e2 );

    // Culling: If determinant is negative, the triangle is backfacing ( not rendering )
    float determinant = dot( P, e1 );
    if ( determinant < FLT_EPSILON ) return false;

    // inverse determinant: 1 / P . e1
    float invDet = 1 / determinant;

    // Tranforming form original world space to the origin
    // t, u, v space

    // Calculate T: ( origin - v0 )
    vec3 T = r.getOrigin() - v0;

    // calculate u-axis: ( P . T ) * invDeterminant
    // no intersection if u < 0 or u > 1
    float u = dot( P, T ) * invDet;
    if ( u < 0 || u > 1 ) return false;

    // calculate Q: ( T x e1 )
    // calculate v-axis: ( Q . D ) * invDeterminant
    // no intersection if v < 0 or u+v > 1    
    vec3 Q = cross( T, e1 );
    float v = dot( Q, r.getDirection() ) * invDet;
    if ( v < 0 || u + v > 1 ) return false;

    // We know the ray intersects the triangle
    // compute t: ( Q . e2 ) * invDeterminant
    float t = dot( Q, e2 ) * invDet;

    if ( t < tMax && t > tMin ) {                       // if solution in the range tMin < sol < tMax
        rec.t = t;                                      // record t
        rec.p = r.pointAtRay( rec.t );                  // record point p at ray
        rec.setFaceNormal( r, normal );                 // sets the normal outwards when necessary
        return true;
    }

    return false;

}

void triangle::print() {
    std::cout <<  "v0: " << v0
              << " v1: " << v1
              << " v2: " << v2
              << " n: "  << normal << std::endl;
}