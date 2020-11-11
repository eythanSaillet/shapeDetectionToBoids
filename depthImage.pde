/*
import org.openkinect.processing.*;
 import gab.opencv.*;
 
 // System var
 Kinect kinect;
 PImage depthMask = createImage(640, 480, RGB);
 OpenCV opencv;
 ArrayList<Contour> contours;
 
 // System parameters
 int depthDetectionValue = 150;
 */
// Boids
//ArrayList<Boid> boids;
Boid[] boids = new Boid[150];
Wall[] walls = new Wall[5];

void setup() {
  size(640, 480);
  pixelDensity(2);

  /*
  // Kinect init
   kinect = new Kinect(this);
   kinect.initDepth();
   kinect.initVideo();
   
   // OpenCV init
   opencv = new OpenCV(this, depthMask);
   //dataUpdateInterval();
   */

  // Boids
  for (int i = 0; i < 150; i++) {
    boids[i] = new Boid();
  }
  walls[0] = new Wall(0, 0, width - 0, 0);
  walls[1] = new Wall(0, height - 0, width - 0, height - 0);
  walls[2] = new Wall(0, 0, 0, height - 0);
  walls[3] = new Wall(width - 0, 0, width - 0, height - 0);
  
  walls[4] = new Wall(width / 2, 100, width / 2, height - 100);
}

int frameIndex = 0;
void draw() {
  background(255);

  // Get depth image from kinect
  /*
  PImage depthImg = kinect.getDepthImage();
   
   // Create depth mask with a certain distance
   for (int i = 0; i < depthImg.pixels.length; i++) {
   float b = brightness(depthImg.pixels[i]);
   if (b > depthDetectionValue) {
   depthMask.pixels[i] = color(0, 255, 0);
   } else {
   depthMask.pixels[i] = color(0, 0, 0);
   }
   }
   depthMask.updatePixels();
   //image(depthMask, 0, 0);
   
   if (frameIndex % 15 == 0) {
   contourDetection();
   }
   frameIndex++;
   */

  // Boids
  for (Boid _boid : boids) {
    _boid.applyForces();
    _boid.move();
    _boid.display();
  }
  
  // Walls
  for (Wall _wall : walls) {
    _wall.display();
  }
}
/*
// Contour detection with OpenCV
 void contourDetection() {
 opencv.loadImage(depthMask);
 contours = opencv.findContours();
 
 background(0);
 strokeWeight(2);
 for (Contour contour : contours) {
 //stroke(0, 255, 0);
 //contour.draw();
 stroke(255, 0, 0);
 beginShape();
 for (PVector point : contour.getPolygonApproximation().getPoints()) {
 vertex(point.x, point.y);
 }
 endShape();
 }
 }
 */
