int wallRepulsionRange = 60;
class Wall {
  PVector a;
  PVector b;

  Wall(int a1, int a2, int b1, int b2) {
    this.a = new PVector(a1, a2);
    this.b = new PVector(b1, b2);
  }

  void display() {
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}

// Using Line-line intersection algorythm
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
float intersectTest(Wall wall, PVector pos, PVector dir) {
  float den = (wall.a.x - wall.b.x) * (pos.y - pos.y + dir.y) - (wall.a.y - wall.b.y) * (pos.x - pos.x + dir.x);
  float t = ((wall.a.x - pos.x) * (pos.y - pos.y + dir.y) - (wall.a.y - pos.y) * (pos.x - pos.x + dir.x)) / den;
  float u = ((wall.a.x - wall.b.x) * (wall.a.y - pos.y) - (wall.a.y - wall.b.y) * (wall.a.x - pos.x)) / den;

  PVector crossPoint;
  float dist;
  if (t > 0 && t < 1 && u > 0) {
    crossPoint = new PVector(wall.a.x + t * (wall.b.x - wall.a.x), wall.a.y + t * (wall.b.y - wall.a.y));
    // stroke('red')
    // strokeWeight(10)
    // point(crossPoint.x, crossPoint.y)
    dist = pos.dist(crossPoint);
    if (dist < wallRepulsionRange) {
      // console.log({ state: true, dist: dist })
      return dist;
    }
  }
  return 0;
}
