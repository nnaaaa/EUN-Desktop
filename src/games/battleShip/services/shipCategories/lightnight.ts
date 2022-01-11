import { IShipCategories } from 'games/battleShip/modals/ship'
import { ShipCategories, ShipSize } from './ship'
import Constants from '../constants'

export class LightnightShip extends ShipCategories {
    build() {
        const name = 'Lightnight'
        const category: IShipCategories = {
            name,
            size: new ShipSize(2,1),
        }
        return category
    }
}
