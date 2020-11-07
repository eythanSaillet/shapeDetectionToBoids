import org.openkinect.processing.*;
import gab.opencv.*;

// System var
Kinect kinect;
PImage depthMask = createImage(640, 480, RGB);
OpenCV opencv;
ArrayList<Contour> contours;

// System parameters
int depthDetectionValue = 150;

void setup() {
  size(640, 480);

  // Kinect init
  kinect = new Kinect(this);
  kinect.initDepth();
  kinect.initVideo();

  // OpenCV init
  opencv = new OpenCV(this, depthMask);
  //dataUpdateInterval();
}

int frameIndex = 0;
void draw() {
  //background(0);

  // Get depth image from kinect
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
}

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
