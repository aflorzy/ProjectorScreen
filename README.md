# ProjectorScreen

Simulation of the paneled projector screen at Prestonwood Baptist church.
*The Gift of Christmas* utilizes these screens to their fullest by executing complex sequences of movements.
The image projected on the screens never spills outside the screen areas, even when there are gaps between the screen panels.
This is because a real-time digital mask is applied to the video feed which essentially applies black pixels to every region except where the screens are.

There is an API that provides the location of all screen panels so the mask can track their locations and continuously update the video feed
