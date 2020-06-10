class ray {

public:

    vec3 origin, direction;

    ray ( const vec3& origin, const vec3& direction ) : origin ( origin ), direction ( direction )  {} // Constructor

    // Method declarations
    vec3 pointAtRay ( float t ) const;
    vec3 getOrigin() const;
    vec3 getDirection() const;
    void print() const { std::cout << "origin: " << origin << " direction: " << direction << std::endl;  }

};

vec3 ray::pointAtRay ( float t ) const { return origin + t * direction; } // returns a point with a given t
vec3 ray::getOrigin () const { return origin; }
vec3 ray::getDirection () const { return direction; }