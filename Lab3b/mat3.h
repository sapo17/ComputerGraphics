class mat3 {

public:

    vec3 r[3];

    // Constructor
    mat3 () {
        r[0] = vec3( 1, 0, 0 );
        r[1] = vec3( 0, 1, 0 );
        r[2] = vec3( 0, 0, 1 );
    }

    mat3 ( const vec3 &r1, const vec3 &r2, const vec3 &r3 ) {
        r[0] = r1;
        r[1] = r2;
        r[2] = r3;
    }

    inline vec3 r1() const;
    inline vec3 r2() const;
    inline vec3 r3() const;

};

// methods
inline vec3 mat3::r1() const { return r[0]; }
inline vec3 mat3::r2() const { return r[1]; }
inline vec3 mat3::r3() const { return r[2]; }


// global functions

inline std::ostream& operator << ( std::ostream &os, const mat3 &m ) {
    os << m.r1() << "\n"
       << m.r2() << "\n"
       << m.r3();
    return os;
}

inline mat3 transpose ( const mat3 &m ) {
    return mat3(
        vec3( m.r1().x(), m.r2().x(), m.r3().x() ),
        vec3( m.r1().y(), m.r2().y(), m.r3().y() ),
        vec3( m.r1().z(), m.r2().z(), m.r3().z() )
    );
}

inline mat3 operator + ( const mat3 &m1, const mat3 &m2 ) {
    return mat3(
        m1.r1() + m2.r1(),
        m1.r2() + m2.r2(),
        m1.r3() + m2.r3()
    );
}

inline mat3 operator - ( const mat3 &m1, const mat3 &m2 ) {
    return mat3(
        m1.r1() - m2.r1(),
        m1.r2() - m2.r2(),
        m1.r3() - m2.r3()
    );
}

inline mat3 mul ( const mat3 &m1, const mat3 &m2 ) {
    mat3 temp = transpose( m2 );
    return mat3(
        vec3( dot( m1.r1(), temp.r1() ), dot( m1.r1(), temp.r2() ), dot( m1.r1(), temp.r3() ) ),
        vec3( dot( m1.r2(), temp.r1() ), dot( m1.r2(), temp.r2() ), dot( m1.r2(), temp.r3() ) ),
        vec3( dot( m1.r3(), temp.r1() ), dot( m1.r3(), temp.r2() ), dot( m1.r3(), temp.r3() ) )
    );
}

inline mat3 operator * ( const mat3 &m1, const mat3 &m2 ) { return mul( m1, m2 ); }

inline vec3 operator * ( const mat3 &m, const vec3 &v ) {
    return vec3( 
        m.r1().x() * v.x() + m.r1().y() * v.y() + m.r1().z() * v.z(),
        m.r2().x() * v.x() + m.r2().y() * v.y() + m.r2().z() * v.z(),
        m.r3().x() * v.x() + m.r3().y() * v.y() + m.r3().z() * v.z()
    );
}

// inline mat3 translate ( const mat3 &m, const vec3 &v ) {
//     return mat3(
//         m.r1(),
//         m.r2(),
//         vec3( 
//             v.x() * m.r1().x() + v.y() * m.r2().x() + m.r3().x(),
//             v.x() * m.r1().y() + v.y() * m.r2().y() + m.r3().y(),
//             v.x() * m.r1().z() + v.y() * m.r2().z() + m.r3().z()
//         )
//     );
// }