# Snippets

## Actions

#### `action` (on selected text)

For selected text `createFoo`:

```js
// create foo

export const CREATE_FOO : 'CREATE_FOO' = 'CREATE_FOO';

type CreateFooPayload = {|

|};

export type CreateFooAction = {|
    type: typeof CREATE_FOO,
    payload: CreateFooPayload,
|};

export const createFoo = (payload: CreateFooPayload): CreateFooAction => ({
    type: CREATE_FOO,
    payload,
});
```

#### `action-no-payload` (on selected text)

```js
// create foo

export const CREATE_FOO : 'CREATE_FOO' = 'CREATE_FOO';

export type CreateFooAction = {|
    type: typeof CREATE_FOO,
|};

export const createFoo = (): CreateFooAction => ({
    type: CREATE_FOO,
});
```

## Imports

### AtlasKit

#### `import-ak-button`

```js
import Button from '@atlaskit/button';
```

#### `import-ak-button-group`

```js
import { ButtonGroup } from '@atlaskit/button';
```

#### `import-ak-flag-group`

```js
import { FlagGroup } from '@atlaskit/flag';
```

#### `import-ak-icon`

```js
import Icon from '@atlaskit/icon';
```

#### `import-ak-icon-glyph`

```
import ${1}Icon from '@atlaskit/icon/glyph/${2:icon-id}
```

#### `import-ak-inline-message`

```js
import InlineMessage from '@atlaskit/inline-message';
```

#### `import-ak-lozenge`

```js
import Lozenge from '@atlaskit/lozenge';
```

#### `import-ak-spinner`

```js
import Spinner from '@atlaskit/spinner';
```

#### `import-ak-tooltip`

```js
import Tooltip from '@atlaskit/tooltip';
```

#### `import-ak-grid-unit`

```js
import { gridUnit } from 'common/styles';
```

#### `import-ak-colors`

```js
import { colors } from '@atlaskit/theme';
```

### Misc

#### `import-lo`

```
import ${1:func} from 'lodash/${1:func}';
```

#### `import-lorem-ipsum`

```js
import loremIpsum from 'common/test/lorem-ipsum';
```

#### `import-story-action`

```js
import { action } from '@storybook/addon-actions';
```

#### `import-messages`

```js
import messages from './messages';
```