<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Optimized Controller Canvas</title>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script type="module">
    import controller from './controller.js';

    // Initialize canvas and context
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Adjust canvas to fit the viewport
     canvas.width=500;
     canvas.height=500;
    // Initialize controller and components
    console.log(controller);
    controller.init(canvas);
    //if joystick is moved use analogLeft.direction.dx and analogLeft.direction.dy for unit vector 
    const analogLeft = controller.add(200, 200, 30, 'analog');

    //if(buttonA.pressed) returns true if the button is touched 
    const buttonA = controller.add(300, 200, 30, 'button', 'A');

    // Animation loop
    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Display controller state
      context.font = '16px sans-serif';
      context.fillStyle = 'black'; // Set text color
      context.fillText(
        `AnalogLeft dx: ${analogLeft.direction.dx} dy: ${analogLeft.direction.dy} analogpressed:${analogLeft.pressed}`,
        10,
        20
      );
      context.fillText(`ButtonA pressed: ${buttonA.pressed}`, 10, 40);

      // Draw controller UI
      controller.draw();

      requestAnimationFrame(animate);
    }

    // Start animation
    animate();
  </script>
</body>
</html>
