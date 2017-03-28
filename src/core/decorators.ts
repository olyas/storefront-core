import StoreFront from '../storefront';
import { ATTRS, CSS, DEFAULTS, NAME, VIEW } from '../tag';

export function view(name: string, template: string, defaults?: any, css?: string, attrs?: string) {
  return function (target: any) {
    target[NAME] = name;
    target[VIEW] = template;
    if (defaults) {
      target[DEFAULTS] = defaults;
    }
    if (css) {
      target[CSS] = css;
    }
    if (attrs) {
      target[ATTRS] = attrs;
    }

    StoreFront.register((register) => register(target, name));
  };
}

export function attr(name: string, expression: string) {
  return function (target: any) {
    target[ATTRS] = `${(target[ATTRS] || '')} ${name}="${expression}"`;
  };
}

export function css(style: string) {
  return function (target: any) {
    target[CSS] = style;
  };
}

export function defaults(config: any) {
  return function (target: any) {
    target[DEFAULTS] = config;
  };
}
