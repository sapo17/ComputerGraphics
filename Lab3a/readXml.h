enum stringCode { // enum for the use of switch statement
    position, lookat, up, horizontal_fov, resolution, max_bounces,
    ambient_light, diffuse_light, specular_light, parallel_light,
    spheroid
};

stringCode hashIt ( const std::string &str ) { // hashes a string into a enum type
    if ( str == "position" ) return position;
    if ( str == "lookat" ) return lookat;
    if ( str == "up" ) return up;
    if ( str == "horizontal_fov" ) return horizontal_fov;
    if ( str == "resolution" ) return resolution;
    if ( str == "max_bounces" ) return max_bounces;
    if ( str == "ambient_light" ) return ambient_light;
    if ( str == "sphere" ) return spheroid;
    if ( str == "parallel_light" ) return parallel_light;
    throw std::invalid_argument( "Child does not exist." );
}

// class for reading given xml values
class readXml {

public:

    pugi::xml_document doc;
    pugi::xml_parse_result result;

    // Constructor, loads the given file
    readXml ( const char* fileName ) {
        result = doc.load_file( fileName );
        std::cout << result.description() << " reading XML file." << std::endl;
    }

    // method declarations
    camera readCameraInfo ();
    std::vector<light> readLightInfo();
    std::vector<surface*> readSurfaces();
    vec3 readVec3 ( const pugi::xml_node &child );
    vec3 readColor ( const pugi::xml_node &child );
    float readFloat ( const pugi::xml_attribute &attr );
    materials readMaterials ( const pugi::xml_node &child );

};

// reads and returns a vec3 type of value
vec3 readXml::readVec3 ( const pugi::xml_node &child ) { 
    return vec3( child.attribute("x").as_float(), child.attribute("y").as_float(), child.attribute("z").as_float() );
}

// reads and returns a vec3 type of value, specifically a color
vec3 readXml::readColor ( const pugi::xml_node &child ) {
    return vec3( child.attribute("r").as_float(), child.attribute("g").as_float(), child.attribute("b").as_float() );
}

// reads and returns a float value
float readXml::readFloat ( const pugi::xml_attribute &attr ) {
    return attr.as_float(); 
}

// reads and returns materials
materials readXml::readMaterials ( const pugi::xml_node &child ) {
    vec3 col = readColor( child.child("color") );
    float kA = readFloat( child.child("phong").attribute("ka") );
    float kD = readFloat( child.child("phong").attribute("kd") );
    float kS = readFloat( child.child("phong").attribute("ks") );
    float shininess = readFloat( child.child("phong").attribute("exponent") );
    float reflectance = readFloat( child.child("reflectance").attribute("r") );
    float transmittance = readFloat( child.child("transmittance").attribute("t") );
    float refraction = readFloat( child.child("refraction").attribute("iof") );
    return materials( col, kA, kD, kS, shininess, reflectance, transmittance, refraction );
}

// reads and returns surfaces
std::vector<surface*> readXml::readSurfaces () {

    pugi::xml_node surfacesNode = doc.child("scene").child("surfaces");

    std::vector<surface*> objects;

    for ( pugi::xml_node child: surfacesNode.children() ) {

        std::string name = child.name();

        if ( spheroid == hashIt(name) ) {
            sphere* s = new sphere( readVec3( child.child("position") ), readFloat( child.attribute("radius") ) );
            s->setGivenMaterials( readMaterials( child.child("material_solid") ) );
            objects.push_back( s );
        }

    }

    return objects;

}

// reads and returns light information
std::vector<light> readXml::readLightInfo () {

    pugi::xml_node lightsNode = doc.child("scene").child("lights");

    vec3 ambient, parallelLight, parallelLightPos;
    std::vector<light> lights;

    for ( pugi::xml_node child: lightsNode.children() ) {

        std::string name = child.name();

        switch ( hashIt(name) ) {
            case ambient_light:
                ambient = readColor( child.child("color") );
                lights.push_back( light( ambient ) );
                break;
            case parallel_light:
                parallelLight = readColor( child.child("color") );
                parallelLightPos = readVec3( child.child("direction") );
                lights.push_back( light( parallelLight, parallelLightPos ) );
                break;
            default:
                throw std::invalid_argument( "Child doesn't exist." );
        }
        
    }

    return lights;

}

// reads and returns camera information
camera readXml::readCameraInfo () {
        
        pugi::xml_node camNode = doc.child("scene").child("camera");
        vec3 eye, at, upVec; 
        float fov, width, height, bounces;

        for ( pugi::xml_node child: camNode.children() ) {
            
            std::string name = child.name();

            switch ( hashIt(name) ) {
            case position:
                eye = readVec3( child );
                break;
            case lookat:
                at = readVec3( child );
                break;
            case up:
                upVec = readVec3( child );
                break;
            case horizontal_fov:
                fov = readFloat( child.attribute("angle") );
                break;
            case resolution:
                width = readFloat( child.attribute("horizontal") );
                height = readFloat( child.attribute("vertical") );
                break;
            case max_bounces:
                bounces = readFloat( child.attribute("n") );
                break;
            default:
                throw std::invalid_argument( "Child doesn't exist." );
            }

        }

        return camera( eye, at, upVec, fov, width, height, bounces );
    }


