import Tag, { ALIASES } from '.';

namespace Alias {
  export interface Definition {
    flags: string[];
    name?: string;
    child?: Definition;
    value?: any;
    opts?: any;
  }

  export function parse(aliasDefinition: string) {
    const [, alias, child]: any[] = aliasDefinition.match(/^([^\[]*)?(?:\[(.*)\])?/);
    const definition: Definition = Alias.tokenize(alias);
    if (child) {
      definition.child = parse(child);
    } else if (aliasDefinition.endsWith('[]')) {
      definition.child = { flags: [] };
    }

    return definition;
  }

  export function tokenize(alias: string) {
    const anonymous = !alias || alias.startsWith(':');
    const tokens = alias.split(':')
      .filter((token) => token && token.length);
    const flags = tokens.slice(anonymous ? 0 : 1);

    const definition: Definition = { flags };
    if (!anonymous) {
      definition.name = tokens[0];
    }

    return definition;
  }

  export function subscribe(tag: Tag.Instance) {
    tag['on']('before-mount', enrichState(tag.state, tag));
    tag['on']('update', enrichState(tag.state, tag));
  }

  export function enrichState(state: any, tag: Tag.Instance) {
    return () => {
      if (tag.parent) {
        Alias.enrichState(state, tag.parent);
      }
      Object.keys(tag[ALIASES])
        .forEach((key: string) => tag.state[`$${key}`] = tag[ALIASES][key].value);
    };
  }
}

export default Alias;
