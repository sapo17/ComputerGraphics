#include <iostream>
#include <vector>
#include <fstream>
#include <cmath>
#include <algorithm>

#include "vec3.h"
#include "mat3.h"
#include "float.h"
#include "ray.h"
#include "camera.h"
#include "materials.h"
#include "surface.h"
#include "sphere.h"
#include "light.h"
#include "renderer.h"
#include "pugixml.hpp"
#include "readXml.h"

using namespace std;

int main () {

    // reads given xml information
    readXml xml( "example2.xml" );
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
    
    // int width = 500;
    // int height = 500;
    // float fov = 30;
    // float aspect = float( width ) / float ( height );

    // camera cam( vec3(0,0,1), vec3( 0, 0, -1), vec3(0,1,0), fov, width, height );
    // light lig;
    // vector<light> lights = {lig};
    // for( auto l : lights ) {
    //     l.setEye( cam.eye );
    // }

    // sphere sphere0( vec3( 0, 0, -1 ), 0.25 );
    // sphere sphere1( vec3( 0.5, 0, -1 ), 0.25 );

    // vector<surface*> surfaces;
    // surfaces.push_back( &sphere0 );
    // surfaces.push_back( &sphere1 );
    // renderer rend( cam, lights );
    // rend.render( surfaces );


}