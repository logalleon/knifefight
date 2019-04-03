import { Router } from "express";
import Knifefight from "./Controllers/Knifefight";

const init = (): Router => {

  const router: Router = Router();
  router.get('/status', (req, res) => res.sendStatus(200));
  const knifefight = new Knifefight();
  router.post('/knifefight', knifefight.handle.bind(knifefight));
  return router;

}

export default init;