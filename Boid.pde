class Boid {
  PVector pos = new PVector(random(30, width - 30), random(30, height - 30));
  PVector vel = PVector.random2D();
  PVector acc = PVector.random2D();
  float angle;
  float maxSpeed = 1.5;
  float maxForce = 0.15;
  int triangleRadius = 4;

  PVector align() {
    int radius = 30;
    PVector steering = new PVector();
    int influencer = 0;
    for (Boid _boid : boids) {
      if (pos.dist(_boid.pos) < radius) {
        steering.add(_boid.vel);
        influencer++;
      }
    }
    if (influencer > 0) {
      steering.div(influencer);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  PVector cohesion() {
    int radius = 40;
    PVector steering = new PVector();
    int influencer = 0;
    for (Boid _boid : boids) {
      if (this.pos.dist(_boid.pos) < radius) {
        steering.add(_boid.pos);
        influencer++;
      }
    }
    if (influencer > 0) {
      steering.div(influencer);
      steering.sub(this.pos);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  PVector separation() {
    int radius = 15;
    PVector steering = new PVector();
    int influencer = 0;
    for (Boid _boid : boids) {
      float d = this.pos.dist(_boid.pos);
      if (d < radius) {
        PVector diff = PVector.sub(this.pos, _boid.pos);
        if (d != 0) diff.div(d);
        steering.add(diff);
        influencer++;
      }
    }
    if (influencer > 0) {
      steering.div(influencer);
      steering.setMag(this.maxSpeed);
      // steering.sub(this.vel)
      steering.limit(this.maxForce + 0.2);
    }
    return steering;
  }

  void applyForces() {
    // 0.7
    //this.acc.add(this.align().mult(alignSlider.value()));
    this.acc.add(this.align().mult(0.5));
    // 0.3
    //this.acc.add(this.cohesion().mult(cohesionSlider.value()));
    this.acc.add(this.cohesion().mult(0.2));
    // 0.4
    //this.acc.add(this.separation().mult(separationSlider.value()));
    this.acc.add(this.separation().mult(0.35));

    PVector ray2 = new PVector(cos(this.angle - 80), sin(this.angle - 80));
    PVector ray1 = new PVector(cos(this.angle + 80), sin(this.angle + 80));
    // stroke('green');
    // strokeWeight(1);
    // line(this.pos.x, this.pos.y, ray1.x, ray1.y);
    // line(this.pos.x, this.pos.y, ray2.x, ray2.y);

    // Apply wall repulsion
    for (Wall _wall : walls) {
     this.wallRepulsion(_wall, this.vel);
     this.wallRepulsion(_wall, ray1);
     this.wallRepulsion(_wall, ray2);
     }

    // this.acc.setMag(0.07);
  }

  void wallRepulsion(Wall wall, PVector ray) {
    float intersectInfo = intersectTest(wall, this.pos, ray);
    if (intersectInfo != 0) {
      // strokeWeight(15)
      // stroke('blue')
      // point(wallCenter.x, wallCenter.y)
      PVector wallVector = new PVector(wall.b.x - wall.a.x, wall.b.y - wall.a.y);
      PVector wallCenter = new PVector(wall.a.x + wallVector.x / 2, wall.a.y + wallVector.y / 2);

      float wallVectorAngle = wallVector.heading();
      PVector normal1 = new PVector(cos(wallVectorAngle + 90), sin(wallVectorAngle + 90));
      PVector normal2 = new PVector(cos(wallVectorAngle - 90), sin(wallVectorAngle - 90));

      float distFactor = 1 - intersectInfo / wallRepulsionRange;
      // if (ray === this.vel) {
      //   distFactor *= 2;
      // }
      if (this.pos.dist(new PVector(wallCenter.x + normal1.x, wallCenter.y + normal1.y)) < this.pos.dist(new PVector(wallCenter.x + normal2.x, wallCenter.y + normal2.y))) {
        this.acc.add(normal1).setMag(exp(distFactor * 1.2) * 0.06);
      } else {
        this.acc.add(normal2).setMag(exp(distFactor * 1.2) * 0.06);
      }
      // console.log(distFactor, Math.exp(distFactor * 1.2) * 0.1);
    }
  }

  void move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    // this.vel.limit(5);
    this.acc.mult(0);

    // Wall teleport
    this.pos.x = (this.pos.x < 0) ? width : this.pos.x;
    this.pos.x = (this.pos.x > width) ? 0 : this.pos.x;
    this.pos.y = (this.pos.y < 0) ? height : this.pos.y;
    this.pos.y = (this.pos.y > height) ?  0 : this.pos.y;
  }

  void display() {
    this.angle = this.vel.heading();

    PVector[] triangle = {
      new PVector(this.pos.x + this.triangleRadius * cos(this.angle), this.pos.y + this.triangleRadius * sin(this.angle)), 
      new PVector(this.pos.x + this.triangleRadius * cos(this.angle + 2.6), this.pos.y + this.triangleRadius * sin(this.angle + 2.6)), 
      new PVector(this.pos.x + this.triangleRadius * cos(this.angle - 2.6), this.pos.y + this.triangleRadius * sin(this.angle - 2.6))
    };

    stroke(0);
    strokeWeight(1);
    line(triangle[0].x, triangle[0].y, triangle[1].x, triangle[1].y);
    line(triangle[1].x, triangle[1].y, triangle[2].x, triangle[2].y);
    line(triangle[2].x, triangle[2].y, triangle[0].x, triangle[0].y);
  }
}
