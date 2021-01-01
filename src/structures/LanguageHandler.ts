import i18next, { i18n, InitOptions } from "i18next";
import { Handler } from "./Handler";
import { LanguageModule } from "./Language";

export interface LanguageHandlerOptions extends InitOptions {}

export class LanguageHandler extends Handler<LanguageModule> {
	public localization: i18n;
	constructor(opts: LanguageHandlerOptions) {
		super({ id: "languages" });

		this.localization = i18next.createInstance(opts);
	}

	async init() {
		await this.localization.init();
	}

	reload;
}
