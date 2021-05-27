class materials {

public:

    vec3 color;
    float ka, kd, ks, shininess;
    float reflectance, transmittance, refraction;
    std::string textureName;

    // Constructors, sets given xml values
    materials () {}
    materials ( 
        const vec3& color, const float &ka, const float &kd, const float &ks, const float &shininess,
        const float &reflectance, const float &transmittance, const float &refraction, const std::string &textureName = std::string("")
        ) :
               color ( color ), ka( ka ), kd( kd ), ks( ks ), shininess( shininess ),
               reflectance ( reflectance ), transmittance( transmittance ), refraction( refraction ),
               textureName( textureName ) {}

    // declarations and get methods
    void setReflectance( const float &reflectance );
    void setTransmittance( const float &transmittance );
    void setRefraction( const float &refraction );
    void setColor( const vec3 &col );
    float getKa() { return ka; }
    float getKd() { return kd; }
    float getKs() { return ks; }
    std::string getTextureName() { return textureName; }
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