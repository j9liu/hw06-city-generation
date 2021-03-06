#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions; // We use this to refer to the scale of the plane

uniform vec3 u_LightDirections[3];
uniform vec3 u_LightColors[3];

uniform float u_WaterLevel;

in vec3 fs_Pos;
in vec4 fs_Nor;
out vec4 out_Col;

/* NOISE FUNCTIONS */

float random(vec2 p, vec2 seed) {
  return fract(sin(dot(p + seed, vec2(127.1f, 311.7f))) * 43758.5453f);
}

float interpNoise2D(float x, float y) {
	int intX = int(floor(x));
	float fractX = fract(x);
	int intY = int(floor(y));
	float fractY = fract(y);

	float v1 = random(vec2(intX, intY), vec2(0.));
	float v2 = random(vec2(intX + 1, intY), vec2(0.));
	float v3 = random(vec2(intX, intY + 1), vec2(0.));
	float v4 = random(vec2(intX + 1, intY + 1), vec2(0.));

	/*float i1 = smoothstep(v1, v2, v1 + (v2 - v1) * fractX);
	if(v1 > v2) {
		i1 = smoothstep(v2, v1, v2 + (v1 - v2) * fractX);
	}*/
	float i1 = mix(v1, v2, fractX);
	float i2 = mix(v3, v4, fractX);
	return mix(i1, i2, fractY);
}

float fbm2(vec2 p) {
	float total = 0.0f;
	float persistence = 0.5f;
	int octaves = 8;

	float freq = .5;
	float amp = 1. / persistence;

	for(int i = 0; i < octaves; i++) {
		freq *= 2.0;
		amp *= persistence;
		total += interpNoise2D(p.x * freq, p.y * freq) * amp;
	}

	return total;
}

float perturbedFbm(vec2 p)
  {
      vec2 q = vec2( fbm2( p + vec2(0.0,0.0) ),
                     fbm2( p + vec2(5.2,1.3) ) );

      vec2 r = vec2( fbm2( p + 4.0*q + vec2(9.7,9.2) ),
                     fbm2( p + 4.0*q + vec2(8.3,2.8) ) );

      return fbm2( p + 4.0*r );
  }

#define cell_size 2.f

vec2 generate_point(vec2 cell) {
    vec2 p = vec2(cell.x, cell.y);
    p += fract(sin(vec2(dot(p, vec2(127.1f, 311.7f)), dot(p, vec2(269.5f, 183.3f)) * 43758.5453f)));
    return p * cell_size;
}

float worleyNoise(vec2 pixel) {
    vec2 cell = floor(pixel / cell_size);

    vec2 point = generate_point(cell);

    float shortest_distance = length(pixel - point);

   // compute shortest distance from cell + neighboring cell points

    for(float i = -1.0f; i <= 1.0f; i += 1.0f) {
        float ncell_x = cell.x + i;
        for(float j = -1.0f; j <= 1.0f; j += 1.0f) {
            float ncell_y = cell.y + j;

            // get the point for that cell
            vec2 npoint = generate_point(vec2(ncell_x, ncell_y));

            // compare to previous distances
            float distance = length(pixel - npoint);
            if(distance < shortest_distance) {
                shortest_distance = distance;
            }
        }
    }

    return shortest_distance / cell_size;
}

void main() {
	vec2 coordinates = vec2(-fs_Pos.x, fs_Pos.z) / u_Dimensions;
	coordinates *= 2.;

	
	// Land vs. Water Graph
	float height = pow(fbm2(2.f * coordinates + vec2(1., -0.4)), 5.);
	if(height < u_WaterLevel) {
 		out_Col = vec4(mix(vec3(66., 134., 244.) / 255., vec3(34., 184., 201.) / 255.,
	 					   height + worleyNoise(coordinates)), 1.);
  	} else if(height < u_WaterLevel + 0.05) {
  		out_Col = vec4(0.1, 0.1, 0.1, 1.0);
  	} else {
  		float heightRange = 4.7 - u_WaterLevel;
  		vec3 dullGreen = vec3(44., 112., 71.) / 255.;
  		vec3 lowCol = vec3(191., 235., 122.) / 255.;
  		vec3 greyPurple = vec3(97., 91., 107.) / 255.;
  		vec3 darkPurple = vec3(44., 24., 54.) / 255.;
  		vec3 purple = vec3(89., 63., 102.) / 255.;
  		vec3 almostBlack = vec3(0.1);

  		float noise = pow(perturbedFbm(coordinates * 10.0), 3.0);
  		if(noise < 3.0) {
  			noise = smoothstep(0.0, 3.0, noise);
  		}
  		vec3 noiseCol = mix(almostBlack, greyPurple, noise);
  		noiseCol = mix(purple, noiseCol, fbm2(noiseCol.xz));
  		vec3 finalCol = darkPurple * 0.4 + dullGreen * 0.2 + 0.4 * noiseCol;
  		out_Col = vec4(finalCol, 1.);
  	}
	
}