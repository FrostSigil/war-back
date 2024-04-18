module.exports = function warback(mod) {
	
	mod.game.initialize(["me"]);

	mod.command.add("backdelay", arg => {
		if (!arg) {
			mod.settings.enabled = !mod.settings.enabled;
			mod.command.message(`Module ${mod.settings.enabled ? "enabled" : "disabled"}`);
		} else if (!isNaN(arg)) {
			mod.settings.delay = arg;
			mod.command.message(`Set delay ${arg} ms`);
		} else if (arg.toLowerCase() === "reload") {
			mod.command.exec("proxy reload war-back");
		} else {
			mod.command.message(`Invalid argument: ${arg}`);
		}
	});

	mod.hook("S_ACTION_END", "*", { order: -Infinity, filter: { fake: null } }, event => {
		if (mod.game.me.class === "warrior" && mod.game.me.is(event.gameId) && event.skill.id === 220200) {
			backwar();
		}
	});

	function backwar() {
		mod.hookOnce("S_INSTANT_MOVE", "*", event => {
			if (mod.game.me.is(event.gameId) && mod.settings.enabled) {
				mod.setTimeout(() => mod.send("S_INSTANT_MOVE", "*", event), mod.settings.delay);
			}
		});
	};
};