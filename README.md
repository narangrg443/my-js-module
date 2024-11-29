sample code to utilize the controller module
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <canvas id="canvas"></canvas>
    <script type="module" >
        
        
        import controller from './modules/touchController.js'

        console.log(controller)
       const canvas=document.getElementById('canvas');
       const context=canvas.getContext('2d');
       canvas.width=500;
       canvas.height=500;
       
       const leftAnalog=controller.add(100,100,30,"analog")
       controller.init(canvas)


        function animate(){
            context.context.clearRect(0, 0, canvas.width, canvas.height);
            leftAnalog.draw()

            requestAnimationFrame(animate)
        }
    </script>
</body>
</html>
