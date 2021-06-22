Namespace: sandboxTheme
=======================

sandboxTheme
------------

Sandbox Theme Frontend JS Revealing Module

Gives you all you need to deal with frontend/client/browser interactions

-   feature methods API to easy develop fast forward features
-   global API methods to access page data and information about the current page
-   global namespace of the lib in the window object
-   you can change the name with search/replace

Source:  
-   [lib.js](lib.js.html), [line 4](lib.js.html#line4)

### Members

#### (static) \$body :jQuery\_DOMelement

never again select \$('body') just use sandboxTheme.\$body or document.body

##### Type:

-   jQuery\_DOMelement

Source:  
-   [lib.js](lib.js.html), [line 255](lib.js.html#line255)

#### (static) features :object

place to add your features.

##### Type:

-   object

Source:  
-   [lib.js](lib.js.html), [line 391](lib.js.html#line391)

#### (static) info :object

gerneral purpose data storage, gets extracted from init data "info" key values and gets extended by features informations

can be also filled and extended like the page data

##### Type:

-   object

Source:  
-   [lib.js](lib.js.html), [line 116](lib.js.html#line116)

#### (static) page :object

page data storage, gets extracted from init data with every key/value pairs except for the "info" key

WordPress usual contents with the sandboxTheme\_data:

-   ID: number
-   name: string the slug/permalink name of that page/post/content
-   meta: object other field contents, in WordPress filled with "get\_post\_custom()"
-   verify: nonce value used for admin-ajax requests filled with "wp\_create\_nonce('sandbox\_ajax\_call')"
-   urls: object contains addresses where your script can communicate with -- admin-ajax: address to access ajax responder functions -- rest: rest endpoint for that page -- template: Template root folder URL

Drupal usual contents of window.drupalsettings:

-   ajaxTrustedUrl: object
-   data: object contains informations about external links and other stuff
-   path: object contains relevant data -- baseUrl: string root of the website -- currentLanguage: string 2 letter ISO language code -- currentPath: string the node path, example "node/1" also useable as ID -- currentPathIsAdmin: Boolean -- isFront: Boolean -- pathPrefix: string "" -- scriptPath: string/null
-   there are even more keys there, to see all look at UNFORTUNATLY there is no documentation for Drupal what default values are inside of "drupalssettings" also it may be subject to change

Shopify usual contents of window.sandboxTheme\_data

-   handle: string the slug/permalink name of that page/post/content
-   template: string the used template root file name
-   shopCurrency: string ISO currency name
-   moneyFormat: string template to display an ammount, example: "€{{amount}}"

you can add more values in a similar way as WordPress or you can also use the global window.Shopify object as data source, but thats then not extendable. UNFORTUNATLY there is no documentation for Shopify what default values are inside of "window.Shopify" also it may be subject to change

##### Type:

-   object

Source:  
-   [lib.js](lib.js.html), [line 125](lib.js.html#line125)

### Methods

#### (static) get\_feature(feature\_nameopt)

get\_feature method

returns you all registered features or a single feature if a featurename is provided

##### Parameters:

<table>
<col width="25%" />
<col width="25%" />
<col width="25%" />
<col width="25%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Type</th>
<th align="left">Attributes</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>feature_name</code></td>
<td align="left">string</td>
<td align="left">&lt;optional&gt;<br /></td>
<td align="left"><p>optional inspect sandboxTheme.featrues for possible values.</p>
<p>throws an error if the feature does not exist.</p></td>
</tr>
</tbody>
</table>

Source:  
-   [lib.js](lib.js.html), [line 315](lib.js.html#line315)

#### (static) get\_page(propertyopt)

get\_page method

returns you all page properties in sandboxTheme.page or single properties if a propertyname is provided

##### Parameters:

<table>
<col width="25%" />
<col width="25%" />
<col width="25%" />
<col width="25%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Type</th>
<th align="left">Attributes</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>property</code></td>
<td align="left">string</td>
<td align="left">&lt;optional&gt;<br /></td>
<td align="left"><p>inspect sandboxTheme.page for possible values.</p>
<p>Throws an error if the property does not exist.</p></td>
</tr>
</tbody>
</table>

Source:  
-   [lib.js](lib.js.html), [line 290](lib.js.html#line290)

#### (static) init(data)

init method

use to initiate the lib. you can fill the first param "data" it with a handed over localization script in JSON format

##### Parameters:

<table>
<col width="33%" />
<col width="33%" />
<col width="33%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>data</code></td>
<td align="left">object</td>
<td align="left"><p>named usually &quot;sandboxTheme_data&quot;</p>
<p>WordPress: use wp_localize_script to add data. See /theme/wordpress/functions.php for detailed possibilities</p>
<p>Drupal: use the global &quot;window.drupalsettings&quot; data stack See https://www.codimth.com/blog/web/drupal/passing-data-php-javascript-drupal-8 for implementations</p>
<p>Shopify: use &quot;window.theme&quot;</p></td>
</tr>
</tbody>
</table>

Source:  
-   [lib.js](lib.js.html), [line 251](lib.js.html#line251)

#### (static) is\_page(IDopt)

is\_page method

use to determine if this is a "page", in WordPress this means if it has the post\_type "page"

##### Parameters:

<table>
<col width="25%" />
<col width="25%" />
<col width="25%" />
<col width="25%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Type</th>
<th align="left">Attributes</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>ID</code></td>
<td align="left">number</td>
<td align="left">&lt;optional&gt;<br /></td>
<td align="left"><p>when an ID gets provided is_page() checks if you are on a post/page/content with that ID</p></td>
</tr>
</tbody>
</table>

Source:  
-   [lib.js](lib.js.html), [line 269](lib.js.html#line269)

#### (static) sanitize\_html\_class(class\_name)

Sanitize HTML class

Clone of WordPress PHP API method sanitize\_html\_class for best compatibility.

Use it to get save sanitized html classNames

##### Parameters:

<table>
<col width="33%" />
<col width="33%" />
<col width="33%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>class_name</code></td>
<td align="left">string</td>
<td align="left"><p>required string you want to be a class name</p></td>
</tr>
</tbody>
</table>

Source:  
-   [lib.js](lib.js.html), [line 369](lib.js.html#line369)

#### (static) trigger(eventName, eventDataopt)

trigger method

use to trigger an internal event. all features methods with the same name as the event name will be executed.

only event names in the list of the internal "eventNames" array are allowed.

Default event names:

-   'resize'
-   'scroll'
-   'ready'
-   'load'
-   'sticky'

you can easily extend that list to allow more event names.

##### Parameters:

<table>
<col width="25%" />
<col width="25%" />
<col width="25%" />
<col width="25%" />
<thead>
<tr class="header">
<th align="left">Name</th>
<th align="left">Type</th>
<th align="left">Attributes</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td align="left"><code>eventName</code></td>
<td align="left">string</td>
<td align="left"></td>
<td align="left"><p>name of the event to trigger</p></td>
</tr>
<tr class="even">
<td align="left"><code>eventData</code></td>
<td align="left">object</td>
<td align="left">&lt;optional&gt;<br /></td>
<td align="left"><p>pass additional data to the event handlers</p></td>
</tr>
</tbody>
</table>

Source:  
-   [lib.js](lib.js.html), [line 350](lib.js.html#line350)

[Home](index.html)
------------------

### Namespaces

-   [sandboxTheme](sandboxTheme.html)

Documentation generated by [JSDoc 3.6.7](https://github.com/jsdoc/jsdoc) on Tue Jun 22 2021 16:52:16 GMT+0200 (Mitteleuropäische Sommerzeit)
