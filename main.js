// start engine
let engine = Matter.Engine.create();

let render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options : {
        width: 1600,
        height: 800,
        wireframes: false
    }
});

// create ground obj
let ground = Matter.Bodies.rectangle(400, 600, 2500, 60, { isStatic : true });



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create box obj
// let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
// let boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
// can also make them into constraints
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// mouse constraint
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: {visible: false}
    }
});
render.mouse = mouse;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create stacks
// let stack = Matter.Composites.stack(300,300,8,8,0,0, function (x,y) {
//     return Matter.Bodies.rectangle(x,y,20,20);
// })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let stack = Matter.Composites.stack(700,200,3,3,0,0, function(x,y){
    let sides = Math.round(Matter.Common.random(3, 5));
    return Matter.Bodies.polygon(x,y,sides,30);
})


console.log(stack.bodies[0])
console.log(stack.bodies[0].position.x);
console.log(stack.bodies[0].position.y);

// load objs into world + mouseConstraint
Matter.World.add(engine.world,[stack, ground, mouseConstraint]);

// run engine
Matter.Runner.run(engine);
Matter.Render.run(render);