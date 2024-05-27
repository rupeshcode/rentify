// @ts-nocheck

const calcFp = () => {
  const {
    cookieEnabled,
    deviceMemory,
    doNotTrack,
    hardwareConcurrency,
    language,
    languages,
    maxTouchPoints,
    platform,
    userAgent,
    vendor,
  } = window.navigator;

  const { width, height, colorDepth, pixelDepth } = window.screen;
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const touchSupport = "ontouchstart" in window;
  const devicePixelRatio = window.devicePixelRatio;

  const canvas = calculateCanvasId();
  const webgl = getWebglId();
  const webglInfo = getWebglInfo();

  const data = JSON.stringify(
    {
      canvas,
      colorDepth,
      cookieEnabled,
      deviceMemory,
      devicePixelRatio,
      doNotTrack,
      hardwareConcurrency,
      height,
      language,
      languages,
      maxTouchPoints,
      pixelDepth,
      platform,
      timezone,
      timezoneOffset,
      touchSupport,
      userAgent,
      vendor,
      webgl,
      webglInfo,
      width,
    },
    null,
    8
  );
  return murmur3_32_gc(JSON.stringify(data, null, 4));
};

const calculateCanvasId = () => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const text =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?";
    ctx.textBaseline = "top";
    ctx.font = "14px 'serif'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(text, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(text, 4, 17);

    const result = canvas.toDataURL();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    return murmur3_32_gc(result);
  } catch {
    return null;
  }
};

const getWebglId = () => {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl");
    if (!ctx) return null;
    canvas.width = 256;
    canvas.height = 128;

    const f =
      "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
    const g =
      "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
    const h = ctx.createBuffer()!;

    ctx.bindBuffer(ctx.ARRAY_BUFFER, h);

    const i = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.7321, 0]);

    ctx.bufferData(ctx.ARRAY_BUFFER, i, ctx.STATIC_DRAW),
      (h.itemSize = 3),
      (h.numItems = 3);

    const j = ctx.createProgram()!;
    const k = ctx.createShader(ctx.VERTEX_SHADER)!;

    ctx.shaderSource(k, f);
    ctx.compileShader(k);

    const l = ctx.createShader(ctx.FRAGMENT_SHADER)!;

    ctx.shaderSource(l, g);
    ctx.compileShader(l);
    ctx.attachShader(j, k);
    ctx.attachShader(j, l);
    ctx.linkProgram(j);
    ctx.useProgram(j);

    j.vertexPosAttrib = ctx.getAttribLocation(j, "attrVertex");
    j.offsetUniform = ctx.getUniformLocation(j, "uniformOffset");

    ctx.enableVertexAttribArray(j.vertexPosArray);
    ctx.vertexAttribPointer(j.vertexPosAttrib, h.itemSize, ctx.FLOAT, !1, 0, 0);
    ctx.uniform2f(j.offsetUniform, 1, 1);
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, h.numItems);

    const n = new Uint8Array(canvas.width * canvas.height * 4);
    ctx.readPixels(0, 0, canvas.width, canvas.height, ctx.RGBA, ctx.UNSIGNED_BYTE, n);

    const result = JSON.stringify(n).replace(/,?"[0-9]+":/g, "");

    ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT | ctx.STENCIL_BUFFER_BIT);

    return murmur3_32_gc(result);
  } catch {
    return null;
  }
};

const getWebglInfo = () => {
  try {
    const ctx = document.createElement("canvas").getContext("webgl")!;
    const result = {
      VERSION: ctx.getParameter(ctx.VERSION),
      SHADING_LANGUAGE_VERSION: ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION),
      VENDOR: ctx.getParameter(ctx.VENDOR),
      SUPORTED_EXTENSIONS: ctx.getSupportedExtensions(),
    };
    return result;
  } catch {
    return null;
  }
};

const murmur3_32_gc = (key: string) => {
  const remainder = key.length & 3;
  const bytes = key.length - remainder;
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  let h1 = 0,
    h1b,
    k1;

  for (let i = 0; i < bytes; i++) {
    k1 =
      (key.charCodeAt(i) & 0xff) |
      ((key.charCodeAt(++i) & 0xff) << 8) |
      ((key.charCodeAt(++i) & 0xff) << 16) |
      ((key.charCodeAt(++i) & 0xff) << 24);
    ++i;

    k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1b = ((h1 & 0xffff) * 5 + ((((h1 >>> 16) * 5) & 0xffff) << 16)) & 0xffffffff;
    h1 = (h1b & 0xffff) + 0x6b64 + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16);
  }

  const i = bytes - 1;

  k1 = 0;

  switch (remainder) {
    case 3: {
      k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
      break;
    }
    case 2: {
      k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
      break;
    }
    case 1: {
      k1 ^= key.charCodeAt(i) & 0xff;
      break;
    }
  }

  k1 = ((k1 & 0xffff) * c1 + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
  k1 = (k1 << 15) | (k1 >>> 17);
  k1 = ((k1 & 0xffff) * c2 + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
  h1 ^= k1;

  h1 ^= key.length;

  h1 ^= h1 >>> 16;
  h1 =
    ((h1 & 0xffff) * 0x85ebca6b + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) &
    0xffffffff;
  h1 ^= h1 >>> 13;
  h1 =
    ((h1 & 0xffff) * 0xc2b2ae35 + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16)) &
    0xffffffff;
  h1 ^= h1 >>> 16;

  return h1 >>> 0;
};

let FP: string | undefined;

export const getFingerprint = () => {
  if (!FP) {
    FP = calcFp().toString();
  }
  return FP;
};
