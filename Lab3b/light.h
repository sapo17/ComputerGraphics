class light {

public:

    vec3 lightPosition, ambientLight, diffuseLight, specularLight;
    vec3 eye;

    // Constructors
    light () {
        lightPosition = vec3( 0, -3.0, -1.0 );
        ambientLight = vec3( 0.3, 0.3, 0.3 );
        diffuseLight = vec3( 1, 1, 1 );
        specularLight = vec3( 1, 1, 1 );
    }

    light ( const light &l ) {
        lightPosition = l.lightPosition;
        ambientLight = l.ambientLight;
        diffuseLight = l.diffuseLight;
        specularLight = l.specularLight;
    }

    light ( const vec3 &ambient ) : lightPosition( vec3( 0, 1, 0 ) ), ambientLight ( ambient ) {}

    light ( const vec3 &light, const vec3 &lightPosition ) : lightPosition( lightPosition ),
        ambientLight( vec3() ), diffuseLight( light ), specularLight( light ) {}
    // Constructors end

    // Method Declarations
    vec3 lightning( record& rec, surface *s, const bool &matGiven );
    vec3 ambientProduct( const vec3 &materialAmbient );
    vec3 diffuseProduct( const vec3 &materialDiffuse );
    vec3 specularProduct( const vec3 &materialSpecular );
    vec3 getLightPosition() const;
    void setEye( const vec3 &eye );

};

// calculates and returns phong shading vector either from given xml or with default values
vec3 light::lightning( record& rec, surface *s, const bool &matGiven = false ) {
    vec3 l = unitVector( getLightPosition() - rec.p );                                                              // view direction
    vec3 n = unitVector( rec.normal );                                                                              // surface normal
    vec3 v = unitVector( eye - rec.p );                                                                             // view direction
    // vec3 h = unitVector( l + v );                                                                                // halfway vector for the specular term
    vec3 r = reflect( l, n );                                                                                       // perfect reflection direction

    // if matGiven is true, xml data is used

    vec3 ambient = matGiven ? s->getGivenMaterials().getKa() * ambientLight : ambientProduct( s->getAmbient() );    // ambient term

    vec3 tempL = l.y() < 0 ? vec3( l.x(), -l.y(), l.z() ) : l;                                                      // diffuse term, had to negate y-axis ( example3.xml )
    float diffuseAngle = std::max( dot( n, tempL ), 0.0f );                                  
    vec3 diffuse = matGiven ? s->getGivenMaterials().getKd() * diffuseLight * diffuseAngle                             
                            : diffuseAngle * diffuseProduct( s->getDiffuse() );

    vec3 tempR = l.y() < 0 ? r : -1* r;                                                                             // had to negate r ( example4.xml )
    float shininess = matGiven ? s->getGivenMaterials().getShininess() : 100.0f;
    float specularAngle = std::pow( std::max( dot( tempR, v ), 0.0f ), shininess );

    vec3 specular = matGiven ? s->getGivenMaterials().getKs() * specularLight * specularAngle                       // specular term
                             : specularAngle * specularProduct( s->getSpecular() );


    return ambient + diffuse + specular;    
}

// returns ambient product with a given material vector
vec3 light::ambientProduct ( const vec3 &materialAmbient ) {
    return ambientLight * materialAmbient;
}

// returns diffuse product with a given material vector
vec3 light::diffuseProduct( const vec3 &materialDiffuse ) {
    return diffuseLight * materialDiffuse;
}

// returns specular product with a given material vector
vec3 light::specularProduct( const vec3 &materialSpecular ) {
    return specularLight * materialSpecular;
}

// returns light position
vec3 light::getLightPosition() const {
    return lightPosition;
}

// sets the camera eye position, required for view direction
void light::setEye ( const vec3 &eye ) { this->eye = eye; }