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

For selected text `createFoo`:

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

## View

#### `props-spread`

```
const { $1 } = this.props;
```

#### `props-spread-intl`

```js
const { intl: { formatMessage } } = this.props;
```

#### `props-default`

```
static defaultProps = {
    $1
};
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

#### `import-ak-modal`

```js
import ModalDialog from 'common/components/modal-dialog';
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

### View

#### `import-react`

```js
import React from 'react';
```

#### `import-react-component`

```js
import React, { Component } from 'react';
```

#### `import-react-component-type`

```js
import React, { type ComponentType } from 'react';
```

#### `import-react-fragment`

```js
import React, { Fragment } from 'react';
```

#### `import-intl-define`

```js
import { defineMessages } from 'react-intl';
```

#### `import-intl-inject`

```js
import { injectIntl, type IntlShape } from 'react-intl';
```

#### `import-styled`

```js
import styled from 'styled-components';
```

#### `import-story-storiesof`

```js
import { decoratedStoriesOf } from 'common/util/storybook';
```

#### `import-story-action`

```js
import { action } from '@storybook/addon-actions';
```

#### `import-redux-connect`

```js
import { connect } from 'react-redux';
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

#### `import-reselect`

```js
import { createSelector, type Selector } from 'reselect';
```

#### `import-messages`

```js
import messages from './messages';
```