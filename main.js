fetch('./temp.json')
    .then(response => response.json())
    .then(data => createBodiesFromJson(data))
    .catch(error => console.error('Error loading JSON file:', error));


const xOff = 120;
const yOff = 50;

let stack;
let compStack;
let finalBody;

// tracker for which obj clicked
let currId = 0;

// start engine
let engine = Matter.Engine.create();

// no downwards gravity
engine.gravity.y = 0;

// need this for allowing click selection
const runner = Matter.Runner.create();

Matter.Events.on(runner, "tick", event => {
    if (mouseConstraint.body) { // the current body being moved by user
        console.log(mouseConstraint.body); // debugging
        mouseConstraint.body.frictionAir = 0.1; // set frictionAir higher
        currId = mouseConstraint.body;
    }
});

// create render
let render = Matter.Render.create({
    element: document.body, // unsure
    engine: engine, // unsure
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// create walls 
let ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 50, { isStatic: true });
let ground2 = Matter.Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, { isStatic: true });
let ground3 = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true });
let ground4 = Matter.Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true });

// referencing render from line 10
let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    element: document.body, // unsure
    mouse: mouse, // unsure
    constraint: {
        render: { visible: false }
    }
});

render.mouse = mouse; // unsure


// test
// let square = Matter.Bodies.fromVertices(window.innerWidth/2,window.innerHeight/2,[{ x:108, y:194 }, { x:18, y:18 }, { x:18, y:194 }]);


// load json to make Vertices
function createBodiesFromJson(data) {
    const fixtures = data['tangram'].fixtures;
    const posArrX = [551 + xOff,630 + xOff,735 + xOff,605 + xOff,697 + xOff,653 + xOff];
    const posArrY = [300 + yOff,277 + yOff,300 + yOff,412 + yOff,455 + yOff,344 + yOff];

    compStack = Matter.Composite.create();
    for (i = 0; i < 6; i++) {
        console.log(fixtures[i].vertices[0]);

        stack = Matter.Bodies.fromVertices(posArrX[i], posArrY[i], fixtures[i].vertices[0], {
            isStatic: data['tangram'].isStatic,
            density: data['tangram'].density,
            restitution: data['tangram'].restitution,
            friction: data['tangram'].friction,
            frictionAir: data['tangram'].frictionAir,
            frictionStatic: data['tangram'].frictionStatic,
            collisionFilter: data['tangram'].collisionFilter
        });

        // now add body ('stack') onto composite ('compStack')
        Matter.Composite.add(compStack, stack);
        Matter.World.add(engine.world, stack);
    };
    
    // archived forEach method below
    // fixtures.forEach(fixture => {
    //     const vertices = fixture.vertices[0].map(vertex => {
    //         return { x: vertex.x, y: vertex.y };
    //     });

    //     const xCoord = fixture.vertices[0][0].x;
    //     const yCoord = fixture.vertices[0][0].y;
    //     console.log(vertices);
    //     console.log(vertices[0].x + 'this is small');
    //     console.log(vertices[0].y + 'this is big');

    //     const stack = Matter.Bodies.fromVertices(vertices[0].x, vertices[0].y, vertices, {
    //         isStatic: data['tangram'].isStatic,
    //         density: data['tangram'].density,
    //         restitution: data['tangram'].restitution,
    //         friction: data['tangram'].friction,
    //         frictionAir: data['tangram'].frictionAir,
    //         frictionStatic: data['tangram'].frictionStatic,
    //         collisionFilter: data['tangram'].collisionFilter
    //     });

    //     Matter.World.add(engine.world, stack);
    // });
};

window.addEventListener('keydown', function(event) {
    if(event.key === 't'){
        // console.log(currId);
        console.log(compStack);
    }

    else if(event.key === 'q'){
        currId.angle = currId.angle - 0.03;
    }

    else if(event.key === 'w'){
        currId.angle = currId.angle + 0.03;
    }

    else if(event.key === 'e'){
        for( i = 0; i<compStack.bodies.length; i++){
            compStack.bodies[i].sleepThreshold = 1;
            Matter.Sleeping.set(compStack.bodies[i], true);
        };
    }

    else if(event.key === 'r'){
        for( i = 0; i<compStack.bodies.length; i++){
            Matter.Sleeping.set(compStack.bodies[i], false);
        };
    }

    else if(event.key === 's'){
        finalBody = Matter.Body.create({
            inertia: Infinity,
            friction: 10,
            restitution: 0,
            sleepThreshold: 1
        });
        for (i = 0; i < 5; i++){
            Matter.Body.setParts(finalBody, compStack.bodies[i])
        };
        Matter.Composite.add(finalBody);
    }


})

// load objs into world 
Matter.World.add(engine.world, [ground, ground2, ground3, ground4, mouseConstraint]);

// run engine
Matter.Runner.start(runner, engine);
Matter.Runner.run(engine);
Matter.Render.run(render);




