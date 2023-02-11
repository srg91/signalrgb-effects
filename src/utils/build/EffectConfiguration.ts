export class EffectConfiguration {
  readonly title: string;
  readonly filename: string;
  readonly properties: Meta[];

  constructor({
    title,
    filename,
    properties,
  }: {
    title: string;
    filename?: string;
    properties: Meta[];
  }) {
    this.title = title;
    this.filename =
      filename || title.toLocaleLowerCase().replace(" ", "-") + ".html";
    this.properties = properties.slice();
  }
}

export type EffectProperty = {
  property: string;
  label: string;
  type: string;
  default: string;
  values?: string;
  min?: string;
  max?: string;
};

export type EffectDescription = {
  description: string;
};

export type EffectPublisher = {
  publisher: string;
};

type Meta = EffectProperty | EffectDescription | EffectPublisher;
