import { Request, Response } from "express";
import { SlackRequest, SlackResponse, Combatant, Orientation } from '../interfaces';
import { pluck, weightedPluck, randomInt } from "ossuary/dist/lib/Random";
import Parser from "ossuary/dist/lib/Parser";
import config from '../config';
import _ from 'lodash';

const CLEAR = 'clear';
// Spacing has to be odd for things to fight over to work
const SPACING = [3, 5, 7];
const REG_QUOTES = /".*?"/;

class Knifefight {

  private parser: Parser;

  constructor () {
    this.parser = new Parser({});
  }

  /**
   * This does all the route handling and magic stuff happens
   * @param req 
   * @param res 
   */
  async handle (req: Request, res: Response): Promise<void> { // < This has to resolve a promise according to some dumb stuff
    const body: SlackRequest = req.body;
    const options = body.text.split(' ');
    let response: SlackResponse;
    response = {
      text: this.getCombatants(options),
      response_type: "in_channel"
    };
    res.json(response);
  }

  getCombatants (options: string[]): string {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    const row1Spacing = pluck(SPACING);
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
    let hasThingFightingOver = false;
    if (options[2]) {
      hasThingFightingOver = true;
    }
    const midpoint = Math.floor(row2Spacing / 2);
    for (let i = 0; i < row2Spacing; i++) {
      if (hasThingFightingOver && i === midpoint) {
        row2.push(options[2]);
      } else {
        row2.push(CLEAR);
      }
    }
    row2.push(leftFacing.weapon);
    row2.push(leftFacing.legs);

    // Row 3
    if (options[0] || options[1]) {
      let name1 = pluck(config.DEFAULT_NAMES);
      let name2 = pluck(config.DEFAULT_NAMES);
      if (options[0]) {
        if (options[0].match(REG_QUOTES)) {
          name1 = name1.replace(/\"/g, '');
        } else {
          name1 = _.startCase(options[0].trim().toLowerCase());
        }
      }
      if (options[1]) {
        if (options[1].match(REG_QUOTES)) {
          name2 = name2.replace(/\"/g, '');
        } else {
          name2 = _.startCase(options[0].trim().toLowerCase());
        }
      }
      row3.push(name1);
      for (let i = 0; i < row2Spacing; i++) {
        row3.push(`:${CLEAR}:`);
      }
      row3.push(name2);
    }

    row1 = row1.map((str) => `:${str}:`)
    row2 = row2.map((str) => `:${str}:`);
    if (row3.length) {
      row3 = row3.map((str) => `${str}`);
      return `${row1.join('')}\n${row2.join('')}\n${row3.join('')}`;
    } else {
      return `${row1.join('')}\n${row2.join('')}`;
    }
    
  }

  getCombatant (orientation: Orientation): Combatant {
    let head;
    let legs;
    let weapon;
    let parseable;
    switch (orientation) {
      case Orientation.Left:
        head = pluck(config.HEADS.concat(config.HEADS_LEFT));
        legs = pluck(config.LEGS_FACING_LEFT);
        weapon = weightedPluck(config.WEAPONS_FACING_LEFT);
        break;
      case Orientation.Right:
        head = pluck(config.HEADS.concat(config.HEADS_RIGHT));
        legs = pluck(config.LEGS_FACING_RIGHT);
        weapon = weightedPluck(config.WEAPONS_FACING_RIGHT);
        break;
    }
    if (!weapon) {
      weapon = '';
    }
    return { head, legs, weapon };
  }

}

export default Knifefight;
