
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
// function lerp(a1, a2, t) {
//     return a1 * (1 - t) + a2 * t;
// }
function lerp(a, b, alpha) {
    return a + alpha * (a - b);
}

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

        console.log(reel.isSpinning);

        if (reel.isSpinning) return;
        startBtn.interactive = false;
        reel.isSpinning = true;
        reel.spinnerFinished = false;

        let tl = gsap.timeline();

        tl.to(reel.reelContainersArray[0], { y: 615, duration: .45, ease: "expoScale(0.5,7,none)" }, .1)
            .to(reel.reelContainersArray[1], { y: 615, duration: .35, ease: "expoScale(0.5,7,none)" }, .1)
            .to(reel.reelContainersArray[2], { y: 615, duration: 0.25, ease: "expoScale(0.5,7,none)" }, .1)
            .to(reel.reelContainersArray[3], { y: 615, duration: 0.15, ease: "expoScale(0.5,7,none)" }, .1);

        reel.app.ticker.add((delta) => {

            for (let i = 0; i < reel.reelContainersArray.length; i++) {
                if (reel.reelContainersArray[i].position.y >= 610) {
                    //     reel.reelContainersArray.unshift(reel.reelContainersArray.pop());

                    reel.reelContainersArray[i].position.y = reelPosArray[1][0];

                    reel.startSpinning(i);


                }
                //  reel.reelContainersArray[i].filters = [blurFilter1];
            }


        })
    }

    startSpinning(i) {

        if (reel.spinnerFinished) return;

        let spinner = gsap.fromTo(reel.reelContainersArray[i], { y: reelPosArray[1][0] }, { y: 615, duration: .35, ease: "expoScale(0.5,7,none)", });

        setTimeout(reel.finishSpin, 2000, spinner);
    }

    finishSpin(spinner) {

        if (reel.spinnerFinished) return;
        reel.spinnerFinished = true;

        reel.reelContainersArray.forEach((icon, index) => {
            console.log(index);
            for (let i = 3; i < 0; i--) {
                let ranNum = Math.floor(Math.random() * reel.iconsTexArray.length); // randomize last reel images

                icon.children[i].children[1].texture = (reel.iconsTexArray[ranNum]); // set index of icon to reelarray to hanbdle win conditions 
                reelArray[index][i] = ranNum;

            }
            // if (icon.children[0].children[1].texture === icon.children[1].children[1].texture) {
            console.log(reelArray);
            // }
        });

        console.log(reel.reelContainersArray[0].children[0].children[1]._texture.textureCacheIds);

        gsap.fromTo(reel.reelContainersArray[0], { y: -130 }, { y: reelPosArray[1][3], duration: .5, ease: 'back.out(1.2)', repeat: 0 });
        gsap.fromTo(reel.reelContainersArray[1], { y: -130 }, { y: reelPosArray[1][2], duration: .7, ease: 'back.out(1.2)', repeat: 0 });
        gsap.fromTo(reel.reelContainersArray[2], { y: -130 }, { y: reelPosArray[1][1], duration: .9, ease: 'back.out(1.2)', repeat: 0 });


        setTimeout(() => {

            reel.isSpinning = false;
            console.log(reel.spinnerFinished);
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
startBtn.on('pointerdown', reel.startRolling);

app.stage.addChild(topBoarder);
app.stage.addChild(bottomBoarder);
app.stage.addChild(startBtn);
app.stage.addChild(startBtnTxt);