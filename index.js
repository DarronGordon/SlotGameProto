
//#region -- IMPORTS ---

import * as PIXI from "pixi.js";
//import Victor from "victor";
//import Matter from "matter-js";
import gsap from "gsap";

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


            };
            //  this.reelContainer.addChild(iconContainer);
            reelRowContainer.y = reelPosArray[1][i];
            this.reelContainersArray.push(reelRowContainer);
        }
        console.log(this.reelContainersArray);
    };

    startRolling() {

        if (this.isSpinning) return;
        this.isSpinning = true;

        let tl = gsap.timeline();

        tl.to(reel.reelContainersArray[0], { y: 615, duration: 2.8, ease: "none" }, .1)
            .to(reel.reelContainersArray[1], { y: 615, duration: 2.2, ease: "none" }, .1)
            .to(reel.reelContainersArray[2], { y: 615, duration: 1.6, ease: "none" }, .1)
            .to(reel.reelContainersArray[3], { y: 615, duration: 0.8, ease: "none" }, .1);


        reel.app.ticker.add((delta) => {

            for (let i = 0; i < reel.reelContainersArray.length; i++) {
                if (reel.reelContainersArray[i].position.y >= 610) {
                    //     reel.reelContainersArray.unshift(reel.reelContainersArray.pop());

                    reel.reelContainersArray[i].position.y = reelPosArray[1][0];
                    console.log(reel.reelContainersArray[reel.reelContainersArray.length - 1].position.y);
                }

            }

        })
    }

    // SetUpReelIconBlocks() { // 560 is the height of the reel 
    //     const topReel = this.SetUpReelIcons();
    //     const middleReel = this.SetUpReelIcons();
    //     const bottomReel = this.SetUpReelIcons();

    //     topReel.y = -560;
    //     middleReel.y = 0
    //     bottomReel.y = 560;

    // }

};

const reel = new Reel(app, reelArray, iconTexArray);

reel.SetUpReelContainer();
reel.SetUpReelIcons();

document.addEventListener('click', reel.startRolling);