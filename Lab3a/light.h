class light {

public:

    vec3 lightPosition, ambientLight, diffuseLight, specularLight;
    vec3 eye;

    // Constructors
    light () {
        lightPosition = vec3( 0, 10, 0 );
        ambientLight = vec3( 0.3, 0.3, 0.3 );
        diffuseLight = vec3( 0.7, 0.7, 0.7 );
        specularLight = vec3( 0.7, 0.7, 0.7 );
    }

    light ( const light &l ) {
        lightPosition = l.lightPosition;
        ambientLight = l.ambientLight;
        diffuseLight = l.diffuseLight;
        specularLight = l.specularLight;
    }

    light ( const vec3 &ambient ) : ambientLight ( ambient ), lightPosition( vec3( 0, 1, 0 ) ) {}

    light ( const vec3 &parallelLight, const vec3 &parallelLightPos ) : ambientLight( parallelLight ),
        diffuseLight( parallelLight ), specularLight( parallelLight ), lightPosition( parallelLightPos ) {}
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
    l = vec3( l.x(), -1*l.y(), l.z() );                                                                             // used for the xml file

    vec3 n = unitVector( rec.normal );                                                                              // surface normal
    vec3 v = unitVector( eye - rec.p );                                                                             // view direction
    vec3 h = unitVector( l + v );                                                                                   // halfway vector for the specular term

    vec3 r = -1*reflect( l, n );                                                                                    // perfect reflection direction

    // if matGiven is true, xml data is used

    vec3 ambient = matGiven ? s->getGivenMaterials().getKa() * ambientLight : ambientProduct( s->getAmbient() );    // ambient term

    float diffuseAngle = std::max( dot( n, l ), 0.0f );                                                             // diffuse term
    vec3 diffuse = matGiven ? s->getGivenMaterials().getKd() * diffuseLight * diffuseAngle                             
                            : diffuseAngle * diffuseProduct( s->getDiffuse() );

    float shininess = matGiven ? s->getGivenMaterials().getShininess() : 100.0f;
    float specularAngle = std::pow( std::max( dot( r, v ), 0.0f ), shininess*0.1 );

    vec3 specular = matGiven ? s->getGivenMaterials().getKs() * specularLight * specularAngle                       // specular term
                             : specularAngle * specularProduct( s->getSpecular() );

    return ambient * 0.6f + diffuse + specular;                                                                     // modified ambient term for a better look

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