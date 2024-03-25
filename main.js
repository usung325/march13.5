

// start engine
let engine = Matter.Engine.create();
engine.gravity.y = 0;
// engine.constraintIterations = 600;
// engine.positionIterations = 600;
// engine.velocityIterations = 600;


const runner = Matter.Runner.create();

let render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options : {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// create curr click tracker
let currId = 0;


// create ground obj
let ground = Matter.Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, 100, { isStatic : true });
let ground2 = Matter.Bodies.rectangle(window.innerWidth/2, 0, window.innerWidth, 100, { isStatic : true });
let ground3 = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight/2, 60, window.innerHeight, { isStatic : true });
let ground4 = Matter.Bodies.rectangle(0, window.innerHeight/2, 60, window.innerHeight, { isStatic : true });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create box obj
// let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
// let boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
// can also make them into constraints
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// mouse constraint
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    element: document.body,
    mouse: mouse,
    constraint: {
        render: {visible: false}
    }
});
render.mouse = mouse;


// to click and know which object its clicking
Matter.Events.on(runner, "tick", event => {
  if (mouseConstraint.body) {
    console.log('body found');
    console.log(mouseConstraint.body); 
    mouseConstraint.body.frictionAir = 0.1;
    currId = mouseConstraint.body
    // currId = mouseConstraint.body.id;
    // Matter.Composite.remove(stack, mouseConstraint.body);

  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//this is original code
// let stack = Matter.Composites.stack(700,200,3,3,0,0, function(x,y){
//     let sides = Math.round(Matter.Common.random(3, 5));
//     return Matter.Bodies.polygon(x,y,sides,30);
// });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    
let stack = Matter.Composites.stack(window.innerWidth/3, window.innerHeight/3, 8,2, 5, 50, function(x,y){
    // let sides = Math.floor((Math.random() * 5) + 3);
    // return Matter.Bodies.polygon(x, y, sides, 50, {
    //     render: {
    //         // fillStyle: arrColor[randIndex]
    //     }
    // });
    let listVerts = [[
        {x : 18 , y : 195},
        {x : 18 , y : 16},
        {x : 107 , y : 195}
    ],[
        {x : 261 , y : 154},
        {x : 292 , y : 186},
        {x : 229 , y : 249},
        {x : 198 , y : 218},
        {x : 198 , y : 154}
    ],[
        {x : 198 , y : 195},
        {x : 153 , y : 151},
        {x : 197 , y : 105}
    ]]
    return Matter.Bodies.fromVertices(x, y, listVerts[Math.floor((Math.random() * 3))]);
});


// // create a string that attaches two objects together with a constraint
// let string = Matter.Constraint.create({
//     // pointA: {x: stack.bodies[0].position.x, y: stack.bodies[0].position.y },
//     bodyA: stack.bodies[1],
//     bodyB: stack.bodies[0],
//     stiffness: 0.9
// });

let attached = false;

// not needed
// Matter.Events.on(mouseConstraint, 'mousemove', function(e){
//     if(e.body === stack.bodies[0]) firing = true;
// });

let allTheBodies = Matter.Composite.allBodies(stack);


window.addEventListener('keydown', function(event) {
    if(event.key === 'w'){
        console.log('key logged');
        // Matter.Body.rotate(stack.bodies[0], Math.PI / 12);
        currId.angle = currId.angle + 0.03;
    }
    else if(event.key === 'q'){
        console.log('key logged');
        // Matter.Body.rotate(currId, -(Math.PI / 12));
        currId.angle = currId.angle - 0.03;
    }
    else if(event.key == 't'){
        console.log(allTheBodies);
    }
    else if(event.key === 'l'){
        console.log('pressed l, everything is now frozen or released');
        for( i=0; i<stack.bodies.length; i++){
            // stack.bodies[i].isStatic = !stack.bodies[i].isStatic
            stack.bodies[i].frictionAir = 0.1;
            
            Matter.Body.setVelocity(stack.bodies[i], {x: 0, y:0});
            // Matter.Body.setPosition(stack.bodies[i], [updateVelocity=false]);
        };
        
    }
    else if(event.key === '0'){
        Matter.Sleeping.set(allTheBodies[1], true);
    }
    else if(event.key === 'e'){
        for( i = 0; i<stack.bodies.length; i++){
            // stack.bodies[i].force.x = 0;
            // stack.bodies[i].force.y = 0;
            // Matter.Body.setSpeed(stack.bodies[i], 0);
            // stack.bodies[i].isSleeping = true;
            stack.bodies[i].sleepThreshold = 1;
            Matter.Sleeping.set(stack.bodies[i], true);
        }
    }
    else if(event.key === 'r'){
        for( i = 0; i<stack.bodies.length; i++){
            Matter.Sleeping.set(stack.bodies[i], false);
        }
    }
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//enable this for click interaction
// let currKeyDown = false;
// let removeConst = false;
// window.addEventListener('keydown', function(event) {
//     console.log('Key pressed:', event.key);
//     if(event.key === 'e'){
//         currKeyDown = true;
//         console.log('this is distance', Math.abs(stack.bodies[0].position.x-stack.bodies[1].position.x));
//         console.log('this is distance', Math.abs(stack.bodies[0].position.y-stack.bodies[1].position.y));
//         console.log(stack.bodies[0].position.x);
//     }

//     if(event.key === 'x'){
//         removeConst = true;
//     }
//     // Here you can add logic to interact with Matter.js objects
// });

// window.addEventListener('keyup', function(event){
//     if(event.key === 'e'){
//         currKeyDown = false;
//     }
//     if(event.key === 'x'){
//         removeConst = false;
//     }
// });

// Matter.Events.on(engine, 'afterUpdate', function(){
//     if(!attached && (Math.abs(stack.bodies[0].position.x-stack.bodies[1].position.x) < 40 && Math.abs(stack.bodies[0].position.y-stack.bodies[1].position.y) < 40)&& currKeyDown){
//         let string2 = Matter.Constraint.create({
//             bodyA: stack.bodies[1],
//             bodyB: stack.bodies[0],
//             stiffness: 0.0001,
//             length: 27
//         });
//         Matter.World.add(engine.world, string2);
//     }
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



let listBodies = [stack, ground, ground2, ground3, ground4, mouseConstraint];


// load objs into world + mouseConstraint
Matter.World.add(engine.world,listBodies);


// run engine
Matter.Runner.start(runner, engine);
Matter.Runner.run(engine);
Matter.Render.run(render);



////////////////////////

