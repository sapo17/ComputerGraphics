// basic vec3<float> class for all three dimensional vector calculations
class vec3 { 

public:
    float v[3];

    // Constructors
    vec3 ()                              { v[0] = 0; v[1] = 0; v[2] = 0; }
    vec3 ( float x, float y, float z )   { v[0] = x; v[1] = y; v[2] = z; };

    // Methods
    inline float x() const;
    inline float y() const;
    inline float z() const;
    inline float length() const;
    inline float squaredLength() const;
    inline void makeUnitVector();
    inline float operator [] ( int i ) const;
    inline float& operator [] ( int i );
    inline vec3& operator += ( const vec3 &v2 );
    inline vec3& operator -= ( const vec3 &v2 );
    inline vec3& operator *= ( const vec3 &v2 );
    inline vec3& operator /= ( const vec3 &v2 );
    inline vec3& operator *= ( const float f );
    inline vec3& operator /= ( const float f );

};

// Methods

// returns x,y,z values of the vector
inline float vec3::x() const { return v[0]; }
inline float vec3::y() const { return v[1]; }
inline float vec3::z() const { return v[2]; }

// returns length of the vector
inline float vec3::length() const {
    return sqrt( v[0]*v[0] + v[1]*v[1] + v[2]*v[2] );
}

// returns squared length of the vector
inline float vec3::squaredLength() const {
    return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
}

// makes the a unit vector / normalization
inline void vec3::makeUnitVector() {
    if ( this->length() > 1 ) {
        float k = 1.0 / length();
        v[0] *= k; v[1] *= k; v[2] *= k;
    }
}

// returns the ith value
inline float vec3::operator [] ( int i ) const { return v[i]; }
inline float& vec3::operator [] ( int i ) { return v[i]; }

// Overloading operators for arithmetic calculations

inline vec3& vec3::operator += ( const vec3 &v2 ) {
    v[0] += v2.x();
    v[1] += v2.y();
    v[2] += v2.z();
    return *this;
}

inline vec3& vec3::operator -= ( const vec3 &v2 ) {
    v[0] -= v2.x();
    v[1] -= v2.y();
    v[2] -= v2.z();
    return *this;
}

inline vec3& vec3::operator *= ( const vec3 &v2 ) {
    v[0] *= v2.x();
    v[1] *= v2.y();
    v[2] *= v2.z();
    return *this;
}

inline vec3& vec3::operator /= ( const vec3 &v2 ) {
    v[0] /= v2.x();
    v[1] /= v2.y();
    v[2] /= v2.z();
    return *this;
}

inline vec3& vec3::operator *= ( const float f ) {
    v[0] *= f;
    v[1] *= f;
    v[2] *= f;
    return *this;
}

inline vec3& vec3::operator /= ( const float f ) {
    float k = 1.0 / f;
    v[0] *= k;
    v[1] *= k;
    v[2] *= k;
    return *this;
}

// Global functions

// prints out the vector elements
inline std::ostream& operator << ( std::ostream &os, const vec3 &v ) {
    os << v.x() << " " << v.y() << " " << v.z();
    return os;
}

// Overloading operators for arithmetic calculations

inline vec3 operator + ( const vec3 &v1, const vec3 &v2 ) {
    return vec3( v1.x() + v2.x(), v1.y() + v2.y(), v1.z() + v2.z() );
}

inline vec3 operator - ( const vec3 &v1, const vec3 &v2 ) {
    return vec3( v1.x() - v2.x(), v1.y() - v2.y(), v1.z() - v2.z() );
}

inline vec3 operator * ( const vec3 &v1, const vec3 &v2 ) {
    return vec3( v1.x() * v2.x(), v1.y() * v2.y(), v1.z() * v2.z() );
}

inline vec3 operator * ( const vec3 &v, float f ) {
    return vec3( f * v.x(), f *v.y(), f *v.z() );
}

inline vec3 operator * ( float f, const vec3 &v ) {
    return vec3( f * v.x(), f *v.y(), f *v.z() );
}

inline vec3 operator / ( const vec3 &v, const float f ) {
    if ( f == 0.0 ) throw std::invalid_argument( "Division by 0." );
    return vec3( v.x() / f, v.y() / f, v.z() / f );
}

inline bool operator == ( const vec3 &v1, const vec3 &v2 ) {
    return (
        v1.x() == v2.x() &&
        v1.y() == v2.y() &&
        v1.z() == v2.z()
    );
}

// dot product of given two vectors
inline float dot ( const vec3 &v1, const vec3& v2 ) {
    return v1.x() * v2.x() + v1.y() * v2.y() + v1.z() * v2.z();
}

// cross product of two vectors
inline vec3 cross ( const vec3 &v1, const vec3& v2 ) {
    return vec3(
        v1.y() * v2.z() - v1.z() * v2.y(),
        v1.z() * v2.x() - v1.x() * v2.z(),
        v1.x() * v2.y() - v1.y() * v2.x()
    );
}

// returns a unit vector / normalize
inline vec3 unitVector ( vec3 v ) {
    return v.length() > 1 ? v / v.length() : v;
}

// taken from scratch a pixel, maps to range between lo & hi
inline float clamp(const float &lo, const float &hi, const float &v) { 
    return std::max(lo, std::min(hi, v)); 
} 

// returns the perfect reflection with a given incident( mostly light position ) and surface normal
inline vec3 reflect ( const vec3 &incident, const vec3 &normal ) {
    return incident - 2.0f * dot( normal, incident ) * normal;
}

// returns the refract vector with a given incident and surface normal vector
inline vec3 refract ( const vec3& incident, const vec3 &normal, const float &ior ) {
    float etai = 1; // assuming refraction index of vacuum
    float etat = ior;
    vec3 normalRefraction = normal;
    float cosi = clamp( -1.0f, 1.0f, dot( incident, normal ) );

    // normal . incident < 0: hitpoint outside the surface
    if ( cosi < 0 ) cosi = -cosi;   // negate dot product if the ray is outside the surface
    // normal . incident > 0: hitpoint inside the surface
    else {
        normalRefraction = -1 * normal; // negate normal if the ray is inside the surface
        std::swap( etai, etat );
    }

    // etai / etat = eta -> snell's law
    float eta = etai / etat;
    // critical value
    float k = 1 - eta * eta * ( 1 - cosi * cosi );
    // returns 0 if critical angle is lower than 0, meaning total internal reflection
    return k < 0 ? vec3() : eta * incident + ( eta * cosi - sqrtf(k) ) * normalRefraction;
}

// returns max element of the vec3
inline std::vector<float>::iterator max( const vec3& v ) {
    std::vector<float> vals = { v.x(), v.y(), v.z() };
    return std::max_element( vals.begin(), vals.end() );
}

// converts objl::Position to vec3
inline vec3 positionToVec3( const objl::Vertex &v ) {
    return vec3( v.Position.X, v.Position.Y, v.Position.Z );
}

// converts objl::Normal to vec3
inline vec3 normalToVec3( const objl::Vertex &v ) {
    return vec3( v.Normal.X, v.Normal.Y, v.Normal.Z );
}