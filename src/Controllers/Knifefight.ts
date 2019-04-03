import { Request, Response } from "express";
import { SlackRequest, SlackResponse, Combatant, Orientation } from '../interfaces';
import { pluck, randomInt } from "ossuary/dist/lib/Random";
import config from '../config';

const CLEAR = 'clear';
const MIN_SPACING = 3;
const MAX_SPACING = 5;

class Knifefight {

  constructor () {
  }

  /**
   * This does all the route handling and magic stuff happens
   * @param req 
   * @param res 
   */
  async handle (req: Request, res: Response): Promise<void> { // < This has to resolve a promise according to some dumb stuff
    const body: SlackRequest = req.body;
    const { user_id } = body;
    let response: SlackResponse;
    response = {
      text: this.getCombatants(),
      response_type: "in_channel"
    };
    res.json(response);
  }

  getCombatants (): string {
    let row1 = [];
    let row2 = [];
    const row1Spacing = randomInt(MIN_SPACING, MAX_SPACING);
    const row2Spacing = row1Spacing - 2;
    const rightFacing = this.getCombatant(Orientation.Right);
    const leftFacing = this.getCombatant(Orientation.Left);

    // Row 1
    row1.push(rightFacing.head);
    for (let i = 0; i < row1Spacing; i++) {
      row1.push(CLEAR);
    }
    row1.push(leftFacing.head);

    // Row 2
    row2.push(rightFacing.legs);
    row2.push(rightFacing.weapon);
    for (let i = 0; i < row2Spacing; i++) {
      row2.push(CLEAR);
    }
    row2.push(leftFacing.weapon);
    row2.push(leftFacing.legs);

    row1 = row1.map((str) => `:${str}:`)
    row2 = row2.map((str) => `:${str}:`);
    return `${row1.join('')}\n${row2.join('')}`;
  }

  getCombatant (orientation: Orientation): Combatant {
    const head = pluck(config.HEADS);
    let legs;
    let weapon;
    switch (orientation) {
      case Orientation.Left:
        legs = pluck(config.LEGS_FACING_LEFT);
        weapon = pluck(config.WEAPONS_FACING_LEFT);
        break;
      case Orientation.Right:
        legs = pluck(config.LEGS_FACING_RIGHT);
        weapon = pluck(config.WEAPONS_FACING_RIGHT);
        break;
    }
    return { head, legs, weapon };
  }

}

export default Knifefight;