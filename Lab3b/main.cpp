#include <iostream>
#include <vector>
#include <fstream>
#include <cmath>
#include <algorithm>
#include <random>

#include "OBJ_Loader.h"
#include "pugixml.cpp"
#include "pugixml.hpp"
#include "vec3.h"
#include "mat3.h"
#include "float.h"
#include "ray.h"
#include "camera.h"
#include "materials.h"
#include "surface.h"
#include "sphere.h"
#include "triangle.h"
#include "light.h"
#include "renderer.h"
#include "readXml.h"

using namespace std;

int main ( int argc, char* argv[] ) {

    if ( argc < 2 ) {
        cerr << "Error, Usage: " << argv[0] << " Filename.xml" << endl;
        return 1;
    }

    char* fileName = argv[1];
    cout << "Reading xml file: " << fileName << endl;

    // reads given xml information
    readXml xml( fileName );
    camera cam = xml.readCameraInfo();
    vector<light> lights = xml.readLightInfo();
    vector<surface*> surfaces = xml.readSurfaces();

    // sets eye for the view direction
    for ( auto l : lights ) {
        l.setEye( cam.eye );
    }
    
    renderer rend( cam, lights, true );  // sets rendering
    rend.render( surfaces );             // starts rendering

    // default values
    
    // int width = 512;
    // int height = 512;
    // float fov = 45;

    // camera cam( vec3( 0, 0, 1 ), vec3( 0, 0, -1 ), vec3( 0, 1, 0 ), fov, width, height );
    // light lig;
    // light light2( vec3(1, 1, 1) ); // only ambient

    // vector<light> lights = {lig, light2};
    // for( auto l : lights ) {
    //     l.setEye( cam.eye );
    // }

    // sphere sphere0( vec3( 0, 0, -1 ), 0.5 );
    // sphere sphere1( vec3( 0, -100.5, -1 ), 100 );
    // vector<surface*> surfaces = { &sphere0, &sphere1 };

    // renderer rend( cam, lights );
    // rend.render( surfaces );

}