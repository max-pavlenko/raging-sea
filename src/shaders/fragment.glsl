varying float vElevation;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
varying vec3 vPosition;

void main() {
    vec3 color = mix(uDepthColor, uSurfaceColor, (vPosition.y +.65) + vElevation * 1.5);
    gl_FragColor = vec4(color, 1.0);
}
