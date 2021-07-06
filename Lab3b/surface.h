struct record;

// abstract surface class
class surface {

private:
    vec3 materialAmbient, materialDiffuse, materialSpecular, color;
    materials givenMaterials;

public:
    
    // abstract methods
    virtual bool intersection ( const ray& r, float tMin, float tMax, record &rec ) const = 0;
    virtual void print() = 0;

    // set and get methods
    void setMaterials( const vec3 &matAmbient, const vec3 &matDiff, const vec3 &matSpec );
    void setAmbient( const vec3 &ambient );
    void setDiffuse( const vec3 &diffuse );
    void setSpecular( const vec3 &specular );
    void setColor ( const vec3 &color );
    void setGivenMaterials( const materials &m );
    vec3 getAmbient() { return materialAmbient; }
    vec3 getDiffuse() { return materialDiffuse; }
    vec3 getSpecular() { return materialSpecular; }
    vec3 getColor() { return color; }
    materials getGivenMaterials() { return givenMaterials; }
    
};

// Sets appropriate field values

void surface::setMaterials( const vec3 &matAmbient, const vec3 &matDiff, const vec3 &matSpec ) {
    setAmbient( matAmbient );
    setDiffuse( matDiff );
    setSpecular( matSpec );
}

void surface::setAmbient( const vec3 &ambient ) { materialAmbient = ambient; }
void surface::setDiffuse( const vec3 &diffuse ) { materialDiffuse = diffuse; }
void surface::setSpecular( const vec3 &specular ) { materialSpecular = specular; }
void surface::setColor( const vec3 &color ) { this->color = color; }

void surface::setGivenMaterials( const materials &m ) {
    givenMaterials = m;
    color = m.color;
}

// Source: Ray Tracing in One Weekend, Peter Shirley
// Records latest t value, point, and surface normal, used mostly for intersection
// struct record, records latest t value, point p and surface normal
struct record {
    float t;
    vec3 p;
    vec3 normal;
    bool frontFace;
    surface *s;

    // changes the surface normal direction if the ray and normal face in the same direction
    // dot( normal, r.direction ) > 0 -> same direction, returns negated normal
    // otherwise returns given normal
    inline void setFaceNormal( const ray& r, const vec3& outwardNormal ) {
        frontFace = dot( r.getDirection(), outwardNormal ) < 0;
        normal = frontFace ? outwardNormal : -1 * outwardNormal;
    }
};