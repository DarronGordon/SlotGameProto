
//#region -- IMPORTS ---

import * as PIXI from "pixi.js";
//import Victor from "victor";
//import Matter from "matter-js";
import gsap, { Bounce } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";


gsap.registerPlugin(PixiPlugin);
//#endregion

import iconBG from './Fruits/Panel.png';
import icon1 from './Fruits/Apple.png';
import icon2 from './Fruits/Cherry.png';
import icon3 from './Fruits/Banana.png';
import icon4 from './Fruits/Walnut.png';
import icon5 from './Fruits/WaterMelon.png'

let slot1 = PIXI.Texture.from(icon1);
let slot2 = PIXI.Texture.from(icon2);
let slot3 = PIXI.Texture.from(icon3);
let slot4 = PIXI.Texture.from(icon4);
let slot5 = PIXI.Texture.from(icon5);
let slotBG = PIXI.Texture.from(iconBG);

let iconTexArray = [slot1, slot2, slot3, slot4, slot5];
//#region --- INNIT ---
let canvasSizeX = (720);
let canvasSizeY = (720);


//const canvas = document.getElementById("mycanvas");
const app = new PIXI.Application({
    //view: canvas,

    backgroundColor: 0x6f0000,
    transparent: .5,
    width: canvasSizeX,
    height: canvasSizeY
});
globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

//#endregion

const reelArray = [
    [0, 0, 0], //row1
    [0, 0, 0], //row2
    [0, 0, 0],//row3
    [0, 0, 0]//row 4
];
const reelPosArray = [
    [80, 300, 500],// X pos's
    [-130, 50, 230, 420]// Y pos's
];


export class Reel { // CREATE THE REEL THAT ROLLS AND HOLDS THE ICONS 

    constructor(app, reelArray, iconsTexArray) {
        this.app = app;

        this.reelContainer = new PIXI.Container({ width: 600, height: 600 });
        this.reelContainer.name = 'REEL BG CONTAINER';
        this.reelContainerBG = new PIXI.Graphics();
        this.iconsTexArray = iconsTexArray;
        this.reelArray = reelArray;
        this.iconsArray = [[], [], [], []];
        this.containersArray = [[], [], [], []];
        this.reelContainersArray = [];
        this.reelSpinSpeed = 0;
    }


    //SET UP PLAY AREA & BACKGROUND
    SetUpReelContainer() {
        this.app.stage.addChild(this.reelContainer);
        this.reelContainerBG.beginFill(0x000000);
        this.reelContainerBG.drawRect(0, 0, 600, 600);
        this.reelContainerBG.endFill();
        this.reelContainerBG.position.x = 60;   //Positioning the inner bg
        this.reelContainerBG.position.y = 10;  //
        this.reelContainer.addChild(this.reelContainerBG);
        this.app.stage.addChild(this.reelContainer);
        this.isSpinning = false;
        this.spinnerFinished = false;
    }

    //SET UP REEL ICONS
    SetUpReelIcons() {


        for (let i = 0; i < this.reelArray.length; i++) {
            const reelRowContainer = new PIXI.Container();
            reelRowContainer.name = `REEL CONTAINER ROW#${i}`;

            for (let x = 0; x < this.reelArray[0].length; x++) {

                const iconContainer = new PIXI.Container();
                iconContainer.name = 'ICON CONTAINER';
                iconContainer.width = 100;
                iconContainer.height = 100;

                const reelIconSprite = new PIXI.Sprite(this.iconsTexArray[Math.floor(Math.random() * this.iconsTexArray.length)]);

                const reelIconSpriteBG = new PIXI.Sprite(slotBG);

                reelIconSprite.x = 0;
                reelIconSprite.y = 0;
                reelIconSpriteBG.x = reelIconSprite.x;
                reelIconSpriteBG.y = reelIconSprite.y;

                iconContainer.addChild(reelIconSpriteBG);
                iconContainer.addChild(reelIconSprite);

                iconContainer.scale.set(1.5);
                iconContainer.position.x = 0;
                iconContainer.position.y = 0;

                iconContainer.position.x = reelPosArray[0][x];

                iconContainer.position.y = 0;


                reelRowContainer.addChild(iconContainer)
                this.app.stage.addChild(reelRowContainer);

                this.iconsArray[i].push(reelIconSprite);
                this.containersArray[i].push(iconContainer);

                this.spinnerFinished = false;
            };
            //  this.reelContainer.addChild(iconContainer);
            reelRowContainer.y = reelPosArray[1][i];

            this.reelContainersArray.push(reelRowContainer);


        }
    };

    startRolling() {
        if (reel.isSpinning) return;

        reel.reelSpinSpeed = 25;
        startBtn.interactive = false;
        reel.isSpinning = true;
        reel.spinnerFinished = false;


        reel.app.ticker.add((delta) => {

            for (let index = 0; index < reel.reelContainersArray.length; index++) {
                reel.reelContainersArray[index].y += reel.reelSpinSpeed * delta; //                    

            }
            for (let i = 0; i < reel.reelContainersArray.length; i++) {
                if (reel.reelContainersArray[i].position.y >= 600) {

                    reel.reelContainersArray[i].position.y = reelPosArray[1][0]; // if its at the bottom put it at the top

                }
            }

        });
        const t = setTimeout(() => {
            reel.finishSpin();
        },
            2000);
    }



    finishSpin() {

        if (reel.spinnerFinished) return;
        reel.spinnerFinished = true;
        reel.reelSpinSpeed = 0;

        reel.reelContainersArray.forEach((icon, index) => {

            for (let i = 0; i < 3; i++) {
                let ranNum = Math.floor(Math.random() * reel.iconsTexArray.length); // randomize last reel images

                icon.children[i].children[1].texture = (reel.iconsTexArray[ranNum]); // set index of icon to reelarray to hanbdle win conditions 
                reelArray[index][i] = ranNum;

            }
        });

        for (let index = 0; index < reel.reelContainersArray.length; index++) {
            gsap.fromTo(reel.reelContainersArray[index], { y: reel.reelContainersArray[index].y, y: reelPosArray[1][index] + 10 }, {
                duration: .8, ease: "elastic.out",
                y: reelPosArray[1][index] - 5
            });

        }

        const t = setTimeout(() => {
            reel.isSpinning = false;
            startBtn.interactive = true;

        }, 2000);
    }

}

const margin = 150
const bottomBoarder = new PIXI.Graphics();

bottomBoarder.beginFill(0x000000);

bottomBoarder.drawRect(0, app.screen.height - margin, app.screen.width, 150);

bottomBoarder.endFill();
bottomBoarder.zIndex = 2;
const topBoarder = new PIXI.Graphics();

topBoarder.beginFill(0x000000);

topBoarder.drawRect(0, 0 - margin / 1.3, app.screen.width, 150);

topBoarder.endFill();
topBoarder.zIndex = 2;

const startBtn = new PIXI.Graphics();
const startBtnTxt = new PIXI.Text('Start')


startBtn.beginFill(0x33F6FF);

startBtn.drawCircle(app.screen.width / 2, app.screen.height - margin / 1.7, 50);
startBtnTxt.x = app.screen.width / 2.15;
startBtnTxt.y = app.screen.height - margin / 1.5;
startBtn.endFill();
startBtn.zIndex = 2;
startBtn.interactive = true;
startBtn.cursor = 'pointer';


const reel = new Reel(app, reelArray, iconTexArray);

reel.SetUpReelContainer();
reel.SetUpReelIcons();

//document.addEventListener('click', reel.startRolling);
startBtn.on('pointerover', () => { if (startBtn.interactive === false) { return; } startBtn.tint = 0x605f5a; });
startBtn.on('pointerout', () => { if (startBtn.interactive === false) { return; } startBtn.tint = 0x33F6FF; });
startBtn.on('pointerdown', () => { ; reel.startRolling(); });

app.stage.addChild(topBoarder);
app.stage.addChild(bottomBoarder);
app.stage.addChild(startBtn);
app.stage.addChild(startBtnTxt);