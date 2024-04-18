/* eslint-disable no-param-reassign */
"use strict";

const DefaultSettings = {
	enabled: true,
	delay: 50
};

// Settings Migrator Extended v2.1
module.exports = function MigrateSettings(from_ver, to_ver, settings) {
	if (from_ver === undefined) return { ...DefaultSettings, ...settings };
	else if (from_ver === null) return DefaultSettings;
	else {
		from_ver = Number(from_ver);
		to_ver = Number(to_ver);

		if (from_ver + 1 < to_ver) {
			settings = MigrateSettings(from_ver, from_ver + 1, settings);
			return MigrateSettings(from_ver + 1, to_ver, settings);
		}

		const oldsettings = settings;
		settings = Object.assign(DefaultSettings, {});

		for (const option in oldsettings) {
			if (settings[option] !== undefined) {
				settings[option] = MigrateOption(settings[option], oldsettings[option], ["value", "gameId"]);
			}
		}

		return settings;
	}
};

function MigrateOption(option, oldoption, excludes = []) {
	if (oldoption === undefined) {
		oldoption = option;
	}

	if (Array.isArray(option)) {
		for (const key of Object.keys(option)) {
			option[key] = MigrateOption(option[key], oldoption[key], excludes);
		}
	} else if (option !== null && Object.getPrototypeOf(option) === Object.prototype) {
		for (const key of Object.keys(option)) {
			if (excludes.includes(key)) {
				option[key] = oldoption[key] || null;
			} else {
				option[key] = MigrateOption(option[key], oldoption[key], excludes);
			}
		}
	} else {
		option = oldoption;
	}

	return option;
}