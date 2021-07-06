To run the Lab3a assignment simply compile and run with the given instructions:

Compile  : 

- g++ main.cpp

Execution:

- Windows: a.exe filename.xml ( for Lab3a filename = example1.xml or example2.xml, for Lab3b: filename = example3.xml or example4.xml* )
- Linux  : ./a.out filename.xml ( for Lab3a filename = example1.xml or example2.xml, for Lab3b: filename = example3.xml or example4.xml* )

*example4.xml doesn't work as expected

The reason why I am not using CMake is that I am on Windows and cannot run Cmake on almighty server as posted on the Userforum Lab 3a Upload.
Since I don't know any of the other project software tool for managing build processes( including CMake ), and not learned any of them at the University, adding to that having
only minimal time at this point of the semester where I unfortunately don't have enought time to learn new use of software for managing build processes, I decided to keep compilation
and running of files very simple. As stated above, if you follow the instructions, you should be able to get the correct images as a out.ppm file.

After spending so much of my time to accomplish this assignment, if you encounter any issues at compilation or running the files pretty please contact me either at my u:account
a01428723@unet.univie.ac.at or my personal saipcanhasbay@gmail.com email adress.

Overall having no prior experience to raytracing, I used some of the books mentioned below as a resource. You can find small similarities as the material I read influenced me, but the
overall implementation is mine. As on the earlier assignments you will find the necessary citations.

File summaries:
- vec3.h      : Basic three dimensional float vector class for vector calculations.
- mat3.h      : Basic three dimensional float matrix class for matrix calculations. Not used in Lab3a.
- main.cpp    : Starting point, you can find commented out objects for default implementation.
- camera.h    : Basic camera class, contains methods for camera placement .
- light.h     : Basic light class, contains methods for lightning calculations.
- materials.h : Basic material class, encapsulates given xml materials.
- pugiconfig.h: Required for reading given xml files.
- pugixml.cpp : Required for reading given xml files.
- pugixml.hpp : Required for reading given xml files.
- ray.h       : Basic ray class, contains methods for creating a ray.
- readXml.h   : Contains methods for reading given xml files with the help of pugixml files.
- renderer.h  : Basic render class, contains methods for rendering the image.
- sphere.h    : Basic sphere class, extends abstract surface.h.
- surface.h   : Abstract surface class, declares an abstract intersection method for further use.
- triangle.h  : Basic triangle class, extends abstract surface.h.

Summary: Having an interest in raytracing but struggling to obtain the correct image( it still may be incorrect ) for quite amount of time and presuming that the next assignemnts diffulty
is gonna increase, I would appreciate a well thought feedback about my implementation. What can I do better ? What changes should I do for the last assignment ? After completing almost all assignments positively, it would be definitely be a shame to fail this course because of the last assignment Lab3b.

Thank you,
Saip-Can Hasbay ( 01428723 )

Literature:

- Interactive Computer Graphics
A Top-Down Approach with WebGL
Edward Angel and Dave Shreiner
Seventh Edition, Addison-Wesley 2015

- Fundamentals Of Computer Graphics - Peter Shirley, Steve Marschner

- Raytracing in One Weekend - Peter Shirley

