import { GameObject } from "../objects/GameObject.ts";
import { OffsetContainer } from "../objects/OffsetContainer.ts";
import { TextPopup } from "../objects/TextPopup.ts";

export class ScoreManager{
    constructor(rootObject: GameObject){
        new TextPopup(rootObject, "+100", "#FFD700");
    }
}