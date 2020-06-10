class materials {

public:

    vec3 color;
    float ka, kd, ks, shininess;
    float reflectance, transmittance, refraction;

    // Constructors, sets given xml values
    materials () {}
    materials ( const vec3& color, const float &kA, const float &kD, const float &kS, const float &s,
               const float &reflec, const float &transm, const float &refrac ) {
        this->color = color;
        ka = kA; kd = kD; ks = kS; shininess = s;
        reflectance = reflec; transmittance = transm; refraction = refrac;
    }

    // declarations and get methods
    void setReflectance( const float &reflectance );
    void setTransmittance( const float &transmittance );
    void setRefraction( const float &refraction );
    void setColor( const vec3 &col );
    float getKa() { return ka; }
    float getKd() { return kd; }
    float getKs() { return ks; }
    float getShininess() { return shininess; }
    float getReflectance() { return reflectance; }
    float getTransmittance() { return transmittance; }
    float getRefraction() { return refraction; }

};

// set methods
void materials::setColor( const vec3& col ) { color = col; }
void materials::setReflectance( const float &r ) { reflectance = r; }
void materials::setTransmittance( const float &t ) { transmittance = t; }
void materials::setRefraction( const float &r ) { refraction = r; }