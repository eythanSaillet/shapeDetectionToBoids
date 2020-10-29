from cv2 import cv2
from p5 import *
import numpy as np
import time, json
import pandas as pd

# Trackbar

cam = cv2.VideoCapture(0)

def nothing(x):
	pass

cv2.namedWindow('Trackbars')
cv2.createTrackbar('L-H', 'Trackbars', 0, 180, nothing)
cv2.createTrackbar('L-S', 'Trackbars', 147, 255, nothing)
cv2.createTrackbar('L-V', 'Trackbars', 133, 255, nothing)
cv2.createTrackbar('U-H', 'Trackbars', 180, 180, nothing)
cv2.createTrackbar('U-S', 'Trackbars', 255, 255, nothing)
cv2.createTrackbar('U-V', 'Trackbars', 255, 255, nothing)

frameCounter = 0

while True:
	ret, frame = cam.read()

	# Get trackbars values
	LH = cv2.getTrackbarPos('L-H', 'Trackbars')
	LS = cv2.getTrackbarPos('L-S', 'Trackbars')
	LV = cv2.getTrackbarPos('L-V', 'Trackbars')
	UH = cv2.getTrackbarPos('U-H', 'Trackbars')
	US = cv2.getTrackbarPos('U-S', 'Trackbars')
	UV = cv2.getTrackbarPos('U-V', 'Trackbars')

	# Black detection try 1
	# rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
	# lower = np.array([150, 150, 150])
	# upper = np.array([255, 255, 255])
	# mask = cv2.inRange(rgb, lower, upper)

	# Red detection
	hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
	lower = np.array([LH, LS, LV])
	upper = np.array([UH, US, UV])
	mask = cv2.inRange(hsv, lower, upper)
	kernel = np.ones((10, 10), np.uint8)
	mask = cv2.erode(mask, kernel)

	# Contours detection
	contours, _ = cv2.findContours(
		mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

	for cnt in contours:
		area = cv2.contourArea(cnt)
		approx = cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)

		if area > 500:
			cv2.drawContours(frame, [approx], 0, (0, 255, 0), 5)

	cv2.imshow('Mask', mask)
	cv2.imshow('Frame', frame)

	k = cv2.waitKey(1)

	if k == 27:
		print('Escape hit, closing the app')
		break

	print(contours)

	# JSON Writer loop
	if frameCounter % 10 == 0:
		data = pd.Series(contours).to_json(orient='values')
		data = json.loads(data)
		with open('data.json', 'w', encoding='utf8') as outfile:
			json.dump(data, outfile, ensure_ascii=False)
	frameCounter += 1

	# Get video dimension
	# width = cam.get(3)
	# height = cam.get(4)
	# print(width, height)



cam.release()

cam.destroyAllWindows()
