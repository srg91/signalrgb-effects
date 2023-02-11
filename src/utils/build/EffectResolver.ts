import path from "path";
import { glob } from "glob";
import {
  EffectConfiguration,
  EffectDescription,
  EffectProperty,
  EffectPublisher,
} from "./EffectConfiguration";

export default new (class EffectResolver {
  protected static indexFileName = "index.ts";
  protected static effectFileName = "effect.ts";
  protected static templateFilePath = "src/template.html";
  protected static effectsDirectory = "src/effects";

  protected _effects?: { [name: string]: { entrie?: string; options?: any } };

  entries() {
    if (this._shouldResolve) this._resolve();
    return Object.fromEntries(
      Object.entries(this._effects || {}).map(([name, value]) => [
        name,
        value.entrie || "",
      ])
    );
  }

  protected get _shouldResolve() {
    return this._effects === undefined;
  }

  options() {
    if (this._shouldResolve) this._resolve();
    return Object.fromEntries(
      Object.entries(this._effects || {}).map(([name, value]) => [
        name,
        value.options || {},
      ])
    );
  }

  protected _resolve() {
    this._effects = {};

    glob
      .sync(`${EffectResolver.effectsDirectory}/*`)
      .map((effectSourceDirectory) => {
        const effect: { entrie?: string; options?: any } = {};

        const indexPath = path.resolve(
          effectSourceDirectory,
          EffectResolver.indexFileName
        );

        const module = require(indexPath);
        const configuration = module.default as EffectConfiguration;

        const effectName = path.basename(effectSourceDirectory);
        effect.entrie = path.resolve(
          effectSourceDirectory,
          EffectResolver.effectFileName
        );

        effect.options = {
          template: EffectResolver.templateFilePath,
          inject: "body" as "body",
          minify: true,

          chunks: [effectName],
          filename: configuration.filename,
          title: configuration.title,
          meta: Object.fromEntries(
            configuration.properties.map((value) => {
              return [
                ((value as EffectDescription).description && "description") ||
                  ((value as EffectPublisher).publisher && "publisher") ||
                  (value as EffectProperty).property,
                value,
              ];
            })
          ),
        };

        this._effects && (this._effects[effectName] = effect);
      });
  }
})();
