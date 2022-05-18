<a name="sandboxTheme"></a>

## sandboxTheme : <code>object</code>
Sandbox Theme Frontend JS Revealing Module

Gives you all you need to deal with frontend/client/browser interactions
- feature methods API to easy develop fast forward features
- global API methods to access page data and information about the current page
- global namespace of the lib in the window object
- you can change the name with search/replace

Demo: https://www.dev-themes.com/

**Kind**: global namespace  

* [sandboxTheme](#sandboxTheme) : <code>object</code>
    * [.info](#sandboxTheme.info) : <code>object</code>
    * [.page](#sandboxTheme.page) : <code>object</code>
    * [.$body](#sandboxTheme.$body) : <code>jQuery\_DOMelement</code>
    * [.features](#sandboxTheme.features) : <code>namespace</code>
    * [.init(data)](#sandboxTheme.init)
    * [.is_page([ID])](#sandboxTheme.is_page)
    * [.get_page([property])](#sandboxTheme.get_page)
    * [.get_feature([feature_name])](#sandboxTheme.get_feature) ⇒ <code>namespace</code> \| <code>object</code>
    * [.trigger(eventName, [eventData])](#sandboxTheme.trigger)
    * [.sanitize_html_class(class_name)](#sandboxTheme.sanitize_html_class)

<a name="sandboxTheme.info"></a>

### sandboxTheme.info : <code>object</code>
gerneral purpose data storage, gets extracted from init data "info" key values and gets extended by features informations

can be also filled and extended like the page data

**Kind**: static property of [<code>sandboxTheme</code>](#sandboxTheme)  
<a name="sandboxTheme.page"></a>

### sandboxTheme.page : <code>object</code>
page data storage, gets extracted from init data with every key/value pairs except for the "info" key

  WordPress usual contents with the sandboxTheme_data:
  - ID:   number
  - name: string  the slug/permalink name of that page/post/content
  - meta: object  other field contents, in WordPress filled with "get_post_custom()"
  - verify:       nonce value used for admin-ajax requests filled with "wp_create_nonce('sandbox_ajax_call')"
  - urls: object  contains addresses where your script can communicate with
  -- admin-ajax:    address to access ajax responder functions
  -- rest:          rest endpoint for that page
  -- template:      Template root folder URL
                       
  Drupal usual contents of window.drupalsettings:
  - ajaxTrustedUrl:   object
  - data:   object  contains informations about external links and other stuff
  - path:   object  contains relevant data
  -- baseUrl:             string   root of the website
  -- currentLanguage:     string   2 letter ISO language code
  -- currentPath:         string   the node path, example "node/1" also useable as ID
  -- currentPathIsAdmin:  Boolean
  -- isFront:             Boolean
  -- pathPrefix:          string   ""
  -- scriptPath:          string/null
  - there are even more keys there, to see all look at
  UNFORTUNATLY there is no documentation for Drupal what default values are inside of "drupalssettings"
  also it may be subject to change
                       
  Shopify usual contents of window.sandboxTheme_data
  - handle:        string  the slug/permalink name of that page/post/content
  - template:      string  the used template root file name
  - shopCurrency:  string  ISO currency name
  - moneyFormat:   string  template to display an ammount, example: "&euro;{{amount}}"
                       
  you can add more values in a similar way as WordPress or you can also use the global
  window.Shopify object as data source, but thats then not extendable.
  UNFORTUNATLY there is no documentation for Shopify what default values are inside of "window.Shopify"
  also it may be subject to change

**Kind**: static property of [<code>sandboxTheme</code>](#sandboxTheme)  
<a name="sandboxTheme.$body"></a>

### sandboxTheme.$body : <code>jQuery\_DOMelement</code>
never again select $('body') just use sandboxTheme.$body or document.body

**Kind**: static property of [<code>sandboxTheme</code>](#sandboxTheme)  
**Example**  
```js
sandboxTheme.$body.addClass('myClass');
```
<a name="sandboxTheme.features"></a>

### sandboxTheme.features : <code>namespace</code>
place to add your features.

**Kind**: static property of [<code>sandboxTheme</code>](#sandboxTheme)  
<a name="sandboxTheme.init"></a>

### sandboxTheme.init(data)
init method

use to initiate the lib. 
you can fill the first param "data" it with a handed over localization script in JSON format

**Kind**: static method of [<code>sandboxTheme</code>](#sandboxTheme)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | named usually "sandboxTheme_data"                         WordPress: use wp_localize_script to add data.    See /theme/wordpress/functions.php for detailed possibilities                         Drupal: use the global "window.drupalsettings" data stack   See https://www.codimth.com/blog/web/drupal/passing-data-php-javascript-drupal-8 for implementations   Shopify: use "window.theme" |

**Example**  
```js
// only prepared data
sandboxTheme.init(sandboxTheme_data);

// get more data from the WordPress REST API
// Don't forget to add "'show_in_rest' => true," when registering a custom post type
var siteData = $.getJSON(sandboxTheme_data.urls.rest);

siteData.done(function(pageData){
  if ( $.isPlainObject(pageData) ) {
    sandboxTheme.init($.extend(sandboxTheme_data, pageData));
  } else {
    sandboxTheme.init(sandboxTheme_data);
  }
});
```
<a name="sandboxTheme.is_page"></a>

### sandboxTheme.is\_page([ID])
is_page method

use to determine if this is a "page", in WordPress this means if it has the post_type "page"

**Kind**: static method of [<code>sandboxTheme</code>](#sandboxTheme)  

| Param | Type | Description |
| --- | --- | --- |
| [ID] | <code>number</code> | when an ID gets provided is_page() checks if you are on a post/page/content with that ID |

**Example**  
```js
if ( sandboxTheme.is_page(8) { 
  // on page with the ID 8
};
```
<a name="sandboxTheme.get_page"></a>

### sandboxTheme.get\_page([property])
get_page  method

returns you all page properties in sandboxTheme.page or single properties if a propertyname is provided

**Kind**: static method of [<code>sandboxTheme</code>](#sandboxTheme)  

| Param | Type | Description |
| --- | --- | --- |
| [property] | <code>string</code> | inspect sandboxTheme.page for possible values.  Throws an error if the property does not exist. |

**Example**  
```js
var ajax_url = sandboxTheme.get_page('urls').ajax;

if ( sandboxTheme.get_page('url_params').get('view') === 'student' ) { 
  // URL has "?view=student"
};
```
<a name="sandboxTheme.get_feature"></a>

### sandboxTheme.get\_feature([feature_name]) ⇒ <code>namespace</code> \| <code>object</code>
get_feature

returns you all registered features or a single feature if a featurename is provided

**Kind**: static method of [<code>sandboxTheme</code>](#sandboxTheme)  
**Returns**: <code>namespace</code> \| <code>object</code> - all registered features or a single feature if a featurename is provided  

| Param | Type | Description |
| --- | --- | --- |
| [feature_name] | <code>string</code> | inspect sandboxTheme.featrues for possible values.                                  throws an error if the feature does not exist. |

**Example**  
```js
var scrolled_feature = sandboxTheme.get_feature('scrolled');

// sandboxTheme.info['feature-scrolled'] true when setup() of that feature returned true
// typeof scrolled_feature.ready === 'function' check if that optional method exists
if ( sandboxTheme.info['feature-scrolled'] && typeof scrolled_feature.ready === 'function' ) {
  scrolled_feature.ready();
}
```
<a name="sandboxTheme.trigger"></a>

### sandboxTheme.trigger(eventName, [eventData])
trigger method

use to trigger an internal event. 
all features methods with the same name as the event name will be executed.

only event names in the list of the internal "eventNames" array are allowed.

Default event names:
- 'resize'
- 'scroll'
- 'ready'
- 'load'
- 'sticky'

you can easily extend that list to allow more event names.

**Kind**: static method of [<code>sandboxTheme</code>](#sandboxTheme)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of the event to trigger |
| [eventData] | <code>object</code> | pass additional data to the event handlers |

**Example**  
```js
element.addEventlistener('click', function(event){
  if ( document.body.classList.contains('active') ) {
    // all present "disable_element()" methods of all features get executed
    sandboxTheme.trigger('disable_element', element);
  } else {
    // all present "enable_element()" methods of all features get executed
    sandboxTheme.trigger('enable_element', element);
  }
});
```
<a name="sandboxTheme.sanitize_html_class"></a>

### sandboxTheme.sanitize\_html\_class(class_name)
Sanitize HTML class

Clone of WordPress PHP API method sanitize_html_class for best compatibility.

Use it to get save sanitized html classNames

**Kind**: static method of [<code>sandboxTheme</code>](#sandboxTheme)  

| Param | Type | Description |
| --- | --- | --- |
| class_name | <code>string</code> | required  string you want to be a class name |

**Example**  
```js
var text = element.textContent, // hello world
    class_name = sandboxTheme.sanitize_html_class(text); // hello-world
```

