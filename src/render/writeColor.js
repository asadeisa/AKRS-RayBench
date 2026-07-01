// Linear Vector3 -> clamp[0,1] -> gamma encode -> x255 -> RGBA8 write at `data[index..index+3]`.
// Single write-out step for the whole pipeline (memory/rendering.md) — no double gamma.
export function writeColor(data, index, color, gamma) {
  const encode = (c) => {
    const clamped = c < 0 ? 0 : c > 1 ? 1 : c;
    return Math.round(Math.pow(clamped, 1 / gamma) * 255);
  };
  data[index] = encode(color.x);
  data[index + 1] = encode(color.y);
  data[index + 2] = encode(color.z);
  data[index + 3] = 255;
}
