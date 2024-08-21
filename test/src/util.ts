export function createGeoJSONCircle(
  longitude: number,
  latitude: number,
  radius: number,
  points: number
): [number, number][] {
  const ret: [number, number][] = []
  const distanceX = radius / (111.32 * Math.cos((latitude * Math.PI) / 180))
  const distanceY = radius / 110.574

  let theta, x, y

  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI)
    x = distanceX * Math.cos(theta)
    y = distanceY * Math.sin(theta)
    ret.push([longitude + x, latitude + y])
  }

  ret.push(ret[0])
  return ret
}
