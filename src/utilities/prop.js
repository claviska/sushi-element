export class Prop {
  constructor(options) {
    this.value = options.value;
    this.reflect = options.reflect;
    this.watch = options.watch;
  }
}

export function prop(options) {
  return new Prop(options);
}
