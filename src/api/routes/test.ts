import { Router } from "express";
import { check } from "../LambertRequest";
const router = Router();

router.get(
	"/",
	check({
		guild: true,
		body: {
			test: String,
		},
	}),
	(req, res) => {
		res.send(req.client.user.username);
	}
);

export default router;
