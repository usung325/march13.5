fetch('./temp.json')
    .then(response => response.json())
    .then(data => createBodiesFromJson(data))
    .catch(error => console.error('Error loading JSON file:', error));


const xOff = window.innerWidth/2.2;
const yOff = window.innerHeight/2.2;

const xCounter = 551;
const yCounter = 256;

let stack;
let compStack;
let finalBody;
let arrParts = [];
let fillCol = [];
let firstUpdate = true;
let currSleeping = false;

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
    const posArrX = [551 + xOff - xCounter, 607 + xOff - xCounter, 734 + xOff - xCounter, 605 + xOff -xCounter, 697 + xOff -xCounter, 653 + xOff-xCounter, 652 + xOff-xCounter];
    const posArrY = [300 + yOff - yCounter, 300 + yOff - yCounter, 300 + yOff - yCounter, 411 + yOff - yCounter, 453 + yOff - yCounter, 344 + yOff - yCounter, 256 + yOff - yCounter];

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

    fillCol = ['#fae150', '#ee7d30', '#4899d3', '#273981', '#273981', '#ee7d30', '#fae150'];

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
            if (fillCol.length != 1) {
                let tempColor = fillCol[randNum]; // store repeated color in a temp var
                fillCol.splice(randNum, 1); // remove the repeated color
                let secondRandNum = Math.floor((Math.random() * (fillCol.length)));
                assigncol = fillCol[secondRandNum]; //find another color

                compStack.bodies[i].render.fillStyle = assigncol;
                fillCol.push(tempColor); // push repeated color back into the array

                currCols.push(assigncol);
            }
            else {
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

window.addEventListener('mousedown', () => {
    if (currSleeping) {
        for (i = 0; i < compStack.bodies.length; i++) {
            compStack.bodies[i].sleepThreshold = 1;
            Matter.Sleeping.set(compStack.bodies[i], true);
        }
    }
})
window.addEventListener('mouseup', () => {
    if (currSleeping) {
        for (i = 0; i < compStack.bodies.length; i++) {
            compStack.bodies[i].sleepThreshold = 1;
            Matter.Sleeping.set(compStack.bodies[i], true);
        }
    }
})


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
        currSleeping = true;

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
            sleepThreshold: 1
        });

        arrParts = [];

        // add all bodies onto ('arrParts')
        for (i = 0; i < compStack.bodies.length; i++) {
            arrParts.push(compStack.bodies[i])
        };

        // ('arrParts') made up on ('compStack.bodies[i]') added to parent body aka ('finalBody')
        Matter.Body.setParts(finalBody, arrParts);


        // for (i = 0; i < compStack.bodies.length; i++){
        //     console.log(compStack.bodies[i].render.fillStyle);
        //     compStack.bodies[i].render.fillStyle = '#ffffff'  //changes color of all once pressed 's'
        // }


        // remove rest of compStack objects
        compStack.bodies.splice(0, compStack.bodies.length);

        Matter.Composite.add(compStack, finalBody);

        // compStack.bodies[0].render.fillStyle = '#ffffff'; // this only changes the color of bodies for id:14

        Matter.World.add(engine.world, compStack);
        // console.log(compStack);
        // console.log('below is compStack.bodies');
        // console.log(compStack.bodies);



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
                    // fillStyle: currCols[0]
                    fillStyle: currCols[arrParts.indexOf(part)]
                }
            });
            Matter.Composite.add(compStack, part1);
        });





        // compStack.bodies = arrParts;
        // Matter.World.add(engine.world, compStack);
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

    else if (event.key === 'v') {
        // need to import ressurect-js
        // https://github.com/skeeto/resurrect-js

        // Assuming `bodies` is an array of Matter.js bodies
        const bodiesData = compStack.map(body => ({
            position: body.position,
            vertices: body.vertices,
            density: body.density,
            restitution: body.restitution,
            // Add other properties as needed
        }));

        const jsonString = JSON.stringify(bodiesData);

        // Save `jsonString` to a file
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






