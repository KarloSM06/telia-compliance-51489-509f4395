import React, { useEffect, useRef } from 'react';

const ShaderBackgroundMountains = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    float noise(vec2 p) {
      return sin(p.x)*sin(p.y);
    }

    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000*noise(p); p *= 2.02;
      f += 0.2500*noise(p); p *= 2.03;
      f += 0.1250*noise(p); p *= 2.01;
      f += 0.0625*noise(p);
      return f;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      vec2 p = (uv - 0.5) * 3.0;
      p.y -= 0.3;

      float y = fbm(vec2(p.x * 1.5, iTime * 0.1)) * 0.5;
      float lines = 0.0;

      for (float i = 0.0; i < 1.0; i += 0.02) {
        float h = fbm(vec2(p.x * 1.2, i * 5.0 + iTime * 0.1)) * 0.4;
        float line = smoothstep(h + 0.005, h, p.y);
        lines += line * (1.0 - i);
      }

      vec3 lineColor = vec3(0.2, 0.6, 1.0); // ljusblå linjer
      float alpha = lines * 0.3; // Lägg till alpha för transparens
      
      gl_FragColor = vec4(lineColor, alpha);
    }
  `;

  const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShaderProgram = (gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return null;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Shader link error:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported.');
      return;
    }

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    if (!shaderProgram) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
        time: gl.getUniformLocation(shaderProgram, 'iTime'),
      },
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const start = Date.now();
    let animationFrameId: number;

    const render = () => {
      const t = (Date.now() - start) / 1000;
      gl.clearColor(0.0, 0.0, 0.0, 0.0); // Transparent bakgrund
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      // Aktivera alpha blending
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(programInfo.program);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(programInfo.uniformLocations.time, t);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-screen pointer-events-none" style={{ zIndex: -20 }} />;
};

export default ShaderBackgroundMountains;
