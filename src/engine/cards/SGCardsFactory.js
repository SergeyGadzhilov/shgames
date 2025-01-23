import { assets } from "../assets";
import { SGResizableImage } from "../images/SGResizableImage";
import { SGRectangle } from "../sgrectangle";
import { Card, CARDS_VALUES } from "./card";
import { SGCardImage } from "./SGCardImage";

const directories = [
    "hearts",
    "clubs",
    "diamonds",
    "spades"
];

export class SGCardsFactory {
    getSmallImage(options) {
        const dir = directories[options.suit];
        return new SGResizableImage({
            image: assets.getImage(`assets/cards/${dir}/${dir}.png`),
            borders: {x: 0, y: 0, width: 20, height: 20}
        });
    }

    getBigImage(options) {
        if (options.value < CARDS_VALUES.JECK) {
            const img = this.getSmallImage(options);
            img.width = 75;
            img.height = 75;
            return img;
        }

        const dir = directories[options.suit];
        return new SGResizableImage({
            image: assets.getImage(`assets/cards/${dir}/${options.value}.png`),
            borders: {x: 0, y: 0, width: 85, height: 80}
        });
    }

    create(options) {
        return new Card({
            suit: options.suit,
            value: options.value == 1 ? CARDS_VALUES.ACE : options.value,
            frontImage: new SGCardImage({
                suit: options.suit,
                value: options.value == 1 ? CARDS_VALUES.ACE : options.value,
                smallImage: this.getSmallImage(options),
                bigImage: this.getBigImage(options),
                borders: new SGRectangle({x: 0, y: 0, width: 100, height: 130})
            }),
            backImage: assets.getImage("assets/cards/cardback.png"),
        });
    }
}