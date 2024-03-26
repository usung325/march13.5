fetch('./temp.json')
    .then(response => response.json())
    .then(data => createBodiesFromJson(data))
    .catch(error => console.error('Error loading JSON file:', error));


const xOff = 120;
const yOff = 50;

let stack;
let compStack;
let finalBody;
let arrParts = [];
let fillCol = [];
let firstUpdate = true;

let currCols = [];




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

        mouseConstraint.body.frictionAir = 0.1; // set frictionAir higher when clicked

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

// load json to make Vertices
function createBodiesFromJson(data) {
    const fixtures = data['tangram'].fixtures;
    const posArrX = [551 + xOff, 607 + xOff, 734 + xOff, 605 + xOff, 697 + xOff, 653 + xOff, 773];
    const posArrY = [300 + yOff, 300 + yOff, 300 + yOff, 411 + yOff, 453 + yOff, 344 + yOff, 306];

    compStack = Matter.Composite.create();
    for (i = 0; i < 7; i++) {
        console.log(fixtures[i].vertices[0]);

        stack = Matter.Bodies.fromVertices(posArrX[i], posArrY[i], fixtures[i].vertices[0], {
            isStatic: data['tangram'].isStatic,
            // density: data['tangram'].density,
            density: 0.001,
            restitution: data['tangram'].restitution,
            friction: data['tangram'].friction,
            frictionAir: data['tangram'].frictionAir,
            frictionStatic: data['tangram'].frictionStatic,
            collisionFilter: data['tangram'].collisionFilter,
            render: {
                // fillStyle: '#ffffff'
            }
        });

        // now add body ('stack') onto composite ('compStack')
        Matter.Composite.add(compStack, stack);
    };
    Matter.World.add(engine.world, compStack);

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

function randomColAssign() {

    fillCol = ['#fae150', '#ee7d30', '#4899d3', '#273981', '#273981', '#ee7d30', '#fae150' ];

    let colTemp = true;

    for (i = 0; i < compStack.bodies.length; i++) {

        // console.log(fillCol);

        // console.log( 'this is fillCol.length: ' + fillCol.length);

        let randNum = Math.floor((Math.random() * (fillCol.length)));

        // console.log('this is randNum: ' + randNum);

        let assigncol = fillCol[randNum];

        if (colTemp === true || colTemp != assigncol) {

            compStack.bodies[i].render.fillStyle = assigncol;
            colTemp = assigncol;

            // console.log('this is the new colTemp: '+ colTemp)
            currCols.push(assigncol);
        }
        else {
            if (fillCol.length != 1){
                let tempColor = fillCol[randNum]; // store repeated color in a temp var
                fillCol.splice(randNum, 1); // remove the repeated color
                let secondRandNum = Math.floor((Math.random() * (fillCol.length))); 
                assigncol = fillCol[secondRandNum]; //find another color
    
                compStack.bodies[i].render.fillStyle = assigncol;
                fillCol.push(tempColor); // push repeated color back into the array
    
                currCols.push(assigncol);
            }
            else{
                compStack.bodies[i].render.fillStyle = assigncol;
                colTemp = assigncol;

                // console.log('this is the new colTemp: '+ colTemp)
                currCols.push(assigncol);
            }
        }

        fillCol.splice(randNum, 1);
        console.log(currCols);
    };

    
};


window.addEventListener('keydown', function (event) {
    if (event.key === 't') {
        // debugging key

        // console.log(currId);
        // console.log(compStack);

        // console.log(finalBody);

        // this accesses color
        // console.log(compStack.bodies[0].render.fillStyle);



        ////////////////////////////////////////////////////////////////////////////////


        // console.log('this is arrParts: ');
        // console.log(arrParts);

        // console.log('this is compStack: ');
        // console.log(compStack);

        // console.log('this is finalBody: ');
        // console.log(finalBody);

        // console.log(finalBody.parts);

        console.log(Matter.Composite.allBodies(compStack));
    }

    else if (event.key === 'q') {
        currId.angle = currId.angle - 0.03;
    }

    else if (event.key === 'w') {
        currId.angle = currId.angle + 0.03;
    }

    else if (event.key === 'e') {
        // console.log(compStack.bodies);
        for (i = 0; i < compStack.bodies.length; i++) {
            compStack.bodies[i].sleepThreshold = 1;
            Matter.Sleeping.set(compStack.bodies[i], true);
        };
    }

    else if (event.key === 'r') {
        for (i = 0; i < compStack.bodies.length; i++) {
            Matter.Sleeping.set(compStack.bodies[i], false);
        };
    }

    else if (event.key === 's') {
        finalBody = Matter.Body.create({
            inertia: Infinity,
            friction: 10,
            restitution: 0,
            sleepThreshold: 1,
            
        });

        arrParts = [];

        // add all bodies onto ('arrParts')
        for (i = 0; i < compStack.bodies.length; i++) {
            arrParts.push(compStack.bodies[i])
        };

        // ('arrParts') made up on ('compStack.bodies[i]') added to parent body aka ('finalBody')
        Matter.Body.setParts(finalBody, arrParts);

        // remove rest of compStack objects
        compStack.bodies.splice(0, compStack.bodies.length);

        Matter.Composite.add(compStack, finalBody);
        Matter.World.add(engine.world, compStack);
        console.log(compStack);



    }

    else if (event.key === 'p') {
        //remove id 14 from finalBody

        // Matter.Composite.remove(compStack, finalBody);
        Matter.Composite.remove(engine.world, compStack); // this works

        Matter.Composite.clear(compStack); // Removes all bodies, constraints and composites from the given composite.

        finalBody.parts.splice(0, finalBody.parts.length);

        Matter.Body.setParts(finalBody, arrParts); // this works
        compStack.bodies = arrParts;

        Matter.World.add(engine.world, compStack);
    }

    else if (event.key === 'l') {
        //remove id 14 from finalBody

        compStack.bodies.splice(0, compStack.bodies.length);

        Matter.Composite.remove(compStack, compStack.bodies);
        Matter.Composite.remove(engine.world, compStack);
        Matter.Composite.clear(compStack);


        arrParts.forEach(part => {
            let part1 = Matter.Body.create({
                parts: [part],
                render: {
                    fillStyle: currCols[arrParts.indexOf(part)]
                }
            });
            Matter.Composite.add(compStack, part1);
        });



        // compStack.bodies = arrParts;
        // Matter.World.add(engine.world, compStack);
    }

    else if (event.key === 'd') {
        // Remove compStack from the world
        Matter.Composite.remove(engine.world, compStack);

        // Clear compStack
        Matter.Composite.clear(compStack);

        Matter.Body.setParts(finalBody, []);
        Matter.Body.setParts(finalBody, arrParts);

        compStack.bodies = finalBody.parts;
        // compStack.bodies.splice(0,1);

        // // Ensure finalBody is not already in compStack
        // if (!compStack.bodies.includes(finalBody)) {
        //     // Add finalBody back to compStack
        //     Matter.Composite.add(compStack, finalBody);
        // }

        // Add compStack back to the world
        Matter.World.add(engine.world, compStack);
    }

});

// Listen for the afterUpdate event
// Call random color function after initializing
Matter.Events.on(engine, 'afterUpdate', function () {
    if (firstUpdate) {
        randomColAssign();
        firstUpdate = false; // Prevent the function from being called again
    }
});

// Run the engine
Matter.Runner.run(engine);


// load objs into world 
Matter.World.add(engine.world, [ground, ground2, ground3, ground4, mouseConstraint]);

// run engine
Matter.Runner.start(runner, engine);
Matter.Runner.run(engine);
Matter.Render.run(render);






