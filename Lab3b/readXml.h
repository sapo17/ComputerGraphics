enum stringCode { // enum for the use of switch statement
    position, lookat, up, horizontal_fov, resolution, max_bounces,
    ambient_light, diffuse_light, specular_light, parallel_light, point_light,
    spheroid, mesh,
    material_solid, material_textured
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
    if ( str == "point_light" ) return point_light;
    if ( str == "mesh" ) return mesh;
    if ( str == "material_solid" ) return material_solid;
    if ( str == "material_textured" ) return material_textured;
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
    std::string textureName = child.child("texture").attribute("name").value();
    return materials( col, kA, kD, kS, shininess, reflectance, transmittance, refraction, textureName );
}

// reads and returns surfaces
std::vector<surface*> readXml::readSurfaces () {

    pugi::xml_node surfacesNode = doc.child("scene").child("surfaces");

    std::vector<surface*> objects;

    for ( pugi::xml_node child: surfacesNode.children() ) {

        std::string name = child.name();

        if ( spheroid == hashIt(name) ) {       // reads spheres from the given xml file
            sphere* s = new sphere( readVec3( child.child("position") ), readFloat( child.attribute("radius") ) );
            s->setGivenMaterials( readMaterials( child.child("material_solid") ) );
            objects.push_back( s );
        } else if ( mesh == hashIt(name) ) {    // reads meshes from the given obj file

            objl::Loader loader;
            loader.LoadFile( child.attribute( "name" ).value() );

            std::vector< vec3 > vs; // vertices
            std::vector< vec3 > ns; // normals
            
            for ( const auto& m: loader.LoadedMeshes ) {    // read vertices and normals
                for ( const auto& v: m.Vertices ) {
                    vs.push_back( positionToVec3( v ) );
                    ns.push_back( normalToVec3( v ) );
                }
            }

            for ( unsigned int i = 0; i < vs.size(); i += 3 ) {      // creates given amount of triangles
                triangle* t = new triangle( vs.at( i ), vs.at( i+1 ), vs.at( i+2 ), ns.at( i ) );
                for ( pugi::xml_node sub: child.children() ) { // either material_solid or material_textured
                    std::string subName = sub.name();
                    if ( material_solid == hashIt(subName) ) t->setGivenMaterials( readMaterials( sub ) );
                    else if ( material_textured == hashIt(subName) ) t->setGivenMaterials( readMaterials( sub ) );
                    if ( t->getColor() == vec3() ) t->setColor( vec3( 0.5, 0.5, 0.5 ) );    // example4 w/o texture mapping
                }
                objects.push_back( t );                
            }

        }

    }

    return objects;

}

// reads and returns light information
std::vector<light> readXml::readLightInfo () {

    pugi::xml_node lightsNode = doc.child("scene").child("lights");

    vec3 ambient, parallelLight, parallelLightPos, pointLight, pointLightPos;
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
            case point_light:
                pointLight = readColor( child.child("color") );
                pointLightPos = readVec3( child.child("position") );
                lights.push_back( light( pointLight, pointLightPos ) );
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
        float fov = 0, width = 0, height = 0, bounces = 0;              // initializing to 0 just for getting rid of almighty warnings

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


