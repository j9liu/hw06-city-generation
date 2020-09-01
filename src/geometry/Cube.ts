import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class Cube extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  center: vec4;
  transcol1: Float32Array; // Data for bufTransform1
  transcol2: Float32Array; // Data for bufTransform2
  transcol3: Float32Array; // Data for bufTransform3
  transcol4: Float32Array; // Data for bufTransform4

  constructor(center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);
  }

  create() {

  this.indices = new Uint32Array([0, 1, 2,
                                  0, 2, 3,
                                  4, 5, 6,
                                  4, 6, 7,
                                  8, 9, 10,
                                  8, 10, 11,
                                  12, 13, 14,
                                  12, 14, 15,
                                  16, 17, 18,
                                  16, 18, 19,
                                  20, 21, 22,
                                  20, 22, 23]);
  this.normals = new Float32Array([0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, -1, 0,
                                   0, 0, 1, 0,
                                   0, 0, 1, 0,
                                   0, 0, 1, 0,
                                   0, 0, 1, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   -1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   1, 0, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, -1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0,
                                   0, 1, 0, 0]);
  this.positions = new Float32Array([-.5, -.5, -.5, 1, // back face
                                     .5, -.5, -.5, 1,
                                     .5, .5, -.5, 1,
                                     -.5, .5, -.5, 1,
                                     -.5, -.5, .5, 1, // front face
                                     .5, -.5, .5, 1,
                                     .5, .5, .5, 1,
                                     -.5, .5, .5, 1,
                                     -.5, -.5, -.5, 1, // left face
                                     -.5, -.5, .5, 1,
                                     -.5, .5, .5, 1,
                                     -.5, .5, -.5, 1,
                                     .5, -.5, -.5, 1, // right face
                                     .5, -.5, .5, 1,
                                     .5, .5, .5, 1, 
                                     .5, .5, -.5, 1,
                                     -.5, -.5, -.5, 1, // bottom face
                                     -.5, -.5, .5, 1,
                                     .5, -.5, .5, 1,
                                     .5, -.5, -.5, 1,
                                     -.5, .5, -.5, 1, // top face
                                     -.5, .5, .5, 1,
                                     .5, .5, .5, 1,
                                     .5, .5, -.5, 1
                                     ]);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateCol();
    this.generateTransform1();
    this.generateTransform2();
    this.generateTransform3();
    this.generateTransform4();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created cube`);
  }

  setInstanceVBOs(col1: Float32Array, col2: Float32Array, col3: Float32Array, col4: Float32Array,
                  colors: Float32Array) {
    this.colors = colors;
    this.transcol1 = col1;
    this.transcol2 = col2;
    this.transcol3 = col3;
    this.transcol4 = col4;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform1);
    gl.bufferData(gl.ARRAY_BUFFER, this.transcol1, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform2);
    gl.bufferData(gl.ARRAY_BUFFER, this.transcol2, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform3);
    gl.bufferData(gl.ARRAY_BUFFER, this.transcol3, gl.STATIC_DRAW);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform4);
    gl.bufferData(gl.ARRAY_BUFFER, this.transcol4, gl.STATIC_DRAW);
  }
};

export default Cube;
