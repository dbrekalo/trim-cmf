# List elements
When resource is browsed, filtered and sorted a subset of attributes and relation data is shown in table or list view.
We use list elements to define what goes into this list.
This usually includes a combination of textual and graphical data and some list item actions.

In most cases we add list element definitions via [resource list](core-concepts-and-api#resource-list) handler inside resource controller setupList method.

## Shared options
All list elements accept following set of options:

* **Caption**: All list elements accept a "caption" option used to define table heading caption.
* **MapTo**: Option "mapTo" is used for mapping list item value to resource model attribute or relation data. When mapTo is defined as regular string it will fetch model value under that key. When computed value is needed define mapTo as callback.
* **Attributes**: When attributes option is defined list element will render each key as DOM element attribute.

---

```js
var TextListItem = require('js/listElements/text');
...
listHandler.addItem(TextListItem, {
    caption: 'title',
    mapTo: 'title'
});

listHandler.addItem(TextListItem, {
    caption: 'Full name',
    attributes: {
        title: 'First and last name',
        style: 'letter-spacing: 0.3em;'
    },
    mapTo: function(model) {
        return model.get('firstName') + ' ' + model.get('lastName');
    }
});
```

## Text
Text list element is used for displaying textual data.

```js
var TextListItem = require('js/listElements/text');
...
listHandler.addItem(TextListItem, {
    caption: 'tags',
    mapTo: 'tags.title'
});
```

### Options:
* **escapeHtml**: escapes html entities (default true)
* **limitCharacters**: set number of characters to display before text is truncated (Integer or boolean, default false)
* **limitWords**: set number of words to display before text is truncated (Integer or boolean, default false)
* **stripTags**: remove html tags in string (boolean, default false),
* **collectionDelimiter**: set delimiter to be used when collection elements are joined (string, default ', ')
* **ifEmpty**: text to display when element value is empty (string, default '')

```js
listHandler.addItem(TextListItem, {
    caption: 'Full name',
    mapTo: function(model) {
        return model.get('firstName') + ' ' + model.get('lastName');
    },
    limitCharacters: 100,
    ifEmpty: 'N/A'
});

listHandler.addItem(TextListItem, {
    caption: 'Description',
    mapTo: 'article.html',
    stripTags: true,
    limitWords: 20
});
```

## Link
Link list element is used for rendering links pointing inside or outside CMS.

```js
var LinkListItem = require('js/listElements/link');
...
listHandler.addItem(LinkListItem, {
    caption: 'Title',
    mapTo: 'title',
    action: 'editItem'
});
```
### Options:
* **action**: callback to run when link is clicked, accepts string "editItem" which runs CMS editing route (function or string, default undefined)
* **isExternalLink**: set to true for links outside cms and application router domain (boolean, default false)
* **url**: where links points to (function or string, default string)
* **escapeHtml**: escapes html entities (default true)
* **limitCharacters**: set number of characters to display before text is truncated (Integer or boolean, default false)
* **limitWords**: set number of words to display before text is truncated (Integer or boolean, default false)
* **stripTags**: remove html tags in string (boolean, default false),
* **collectionDelimiter**: set delimiter to be used when collection elements are joined (string, default ', ')
* **ifEmpty**: text to display when element value is empty (string, default '')

```js
listHandler.addItem(LinkListItem, {
    caption: 'Title',
    mapTo: 'title',
    url: 'http://my-site.com',
    isExternalLink: true
});
```

## Date time
List element used for displaying date time data.
```js
var DateTimeListItem = require('js/listElements/dateTime');
...
listHandler.addItem(DateTimeListItem, {
    caption: 'Date and time',
    mapTo: 'publishDate'
});
```
### Options:
* **format**: used to define output format (string, default 'DD.MM.YYYY HH:mm')

```js
listHandler.addItem(DateTimeListItem, {
    caption: 'Date and time',
    mapTo: 'publishDate',
    format: 'DD.MM.YYYY HH:mm'
});
```

## Date
List element used for displaying date data.

```js
var DateListItem = require('js/listElements/date');
...
listHandler.addItem(DateListItem, {
    caption: 'Date and time',
    mapTo: 'publishDate'
});
```

### Options:
* **format**: used to define output format (string, default 'DD.MM.YYYY')

```js
listHandler.addItem(DateListItem, {
    caption: 'Date and time',
    mapTo: 'publishDate',
    format: 'DD.MM.YYYY'
});
```

## Blip
List element used for graphical rendering of Boolean or enumerated data.

```js
var BlipListItem = require('js/listElements/blip');
...
listHandler.addItem(BlipListItem, {
    caption: 'Published',
    mapTo: 'published'
});
```

### States option:
Array of object with following keys:

* **value**: value matching model value
* **caption**: string which sets title atttribute when state is active
* **color**: element background color when state is active

```js
listHandler.addItem(BlipListItem, {
    caption: 'Published',
    mapTo: 'publishedState',
    states: [
        {value: 0, caption: 'Unpublished', color: '#ededed'},
        {value: 1, caption: 'Published', color: 'green'},
        {value: 2, caption: 'Archived', color: 'red'}
    ]
});
```

## Button
List element used for adding button control with custom action.
```js
var ButtonListItem = require('js/listElements/button');
...
listHandler.addItem(ButtonListItem, {
    caption: 'Buttons',
    mapTo: function() {
        return 'Quick edit';
    },
    action: function(model) {
        console.log(model);
    }
});
```

## Context menu
List element used for adding dropdown control with list item actions.
```js
var ContextMenu = require('js/listElements/contextMenu');
...
listHandler.addItem(ContextMenu, {
    caption: 'Actions',
    items: [
        {caption: 'Edit', action: 'editItem'},
        {caption: 'Delete', action: 'deleteItem', confirm: true}
    ]
});
```
### Items option
Array of objects with following keys:
* **caption**: item action caption in context menu drop-down
* **action**: callback to run when action is clicked. Receives current item model as argument. Accepts 'editItem' and 'deleteItem' strings for predefined actions.
* **url**: string or function generating string for use cases when action has link.
* **confirm**: brings confirm dialog up for action if set to true. Accept string for with custom confirm question.
* **showIf**: optional callback to decide if action is to be shown for this list item. Receives current item model as argument.

```js
listHandler.addItem(ContextMenu, {
    caption: 'Actions',
    items: [
        {caption: 'Edit', action: 'editItem'},
        {caption: 'Delete', action: 'deleteItem', confirm: 'Are you sure you want to delete item?'},
        {
            caption: 'Publish',
            action: function(model) {
                model.saveOnly({attributes: {published: true}}).always(function() {
                    listHandler.refreshItems();
                });
            },
            showIf: function(model) {
                return model.get('published') === false;
            }
        },
    ]
});
```


## Media
List element used for presenting media items (image, video, audio, file).
Best used with "card" resource list template.

```js
var MediaListItem = require('js/listElements/media');
...
listHandler.addItem(MediaListItem, {
    caption: 'Main media'
});
```

### Options:
* **mapImageTo**: where to look for image thumbnail in model (default 'thumbnailUrl').
* **mapLargeImageTo**: where to look for large image in model when zooming image with lightbox.
* **mapMediaTypeTo**: what attribute should be used for resolving media type  (default 'mediaType')
* **backgroundImage**: used if media type is image, audio or video embbed. Can be path or function with entity model as argument that returns asset path
* **mediaRelation**:  if set, media model will be retrieved from  model relation

```js
listHandler.addItem(MediaListItem, {
    caption: 'Main media',
    mapImageTo: 'previewUrl',
    mapLargeImageTo: 'originalUrl',
    mediaTypeAttribute: 'type',
    mediaRelation: 'media'
});
```
