```js
/**
 * Sanbox Theme Frontend JS Library
 * 
 * Gives you all you need to deal with frontend/client/browser interactions
 *
 * API
 *
 * @name    sandboxTheme  global namespace of the lib in the window object 
 *                        you can change it with search/replace
 *
 * @method  init()        use to initiate the lib. you can fill the first param "data" it with a handed over localization script in JSON format
 * @param   data required i name that "sandboxTheme_data" usually
 *                      
 *                        WordPress: use wp_localize_script to add data. 
 *                        See /theme/wordpress/functions.php for detailed possibilities
 *                      
 *                        Drupal: use the global "window.drupalsettings" data stack
 *                        See https://www.codimth.com/blog/web/drupal/passing-data-php-javascript-drupal-8 for implementations
 *
 *                        Shopify: use "window.theme"
 *
 *
 * @jQuery  $body         DOMelement never again select $('body') just use this one or document.body
 *
 *
 * @data    page          page data storage, gets extracted from init data with every key/value pairs except for the "info" key
 *
 *                        WordPress usual contents with the sandboxTheme_data:
 *                        - ID:   number
 *                        - name: string  the slug/permalink name of that page/post/content
 *                        - meta: object  other field contents, in WordPress filled with "get_post_custom()"
 *                        - verify:       nonce value used for admin-ajax requests filled with "wp_create_nonce('sandbox_ajax_call')"
 *                        - urls: object  contains addresses where your script can communicate with
 *                        -- admin-ajax:    address to access ajax responder functions
 *                        -- rest:          rest endpoint for that page
 *                        -- template:      Template root folder URL
 *                      
 *                        Drupal usual contents of window.drupalsettings:
 *                        - ajaxTrustedUrl:   object
 *                        - data:   object  contains informations about external links and other stuff
 *                        - path:   object  contains relevant data
 *                        -- baseUrl:             string   root of the website
 *                        -- currentLanguage:     string   2 letter ISO language code
 *                        -- currentPath:         string   the node path, example "node/1" also useable as ID
 *                        -- currentPathIsAdmin:  Boolean
 *                        -- isFront:             Boolean
 *                        -- pathPrefix:          string   ""
 *                        -- scriptPath:          string/null
 *                        - there are even more keys there, to see all look at
 *                        UNFORTUNATLY there is no documentation for Drupal what default values are inside of "drupalssettings"
 *                        also it may be subject to change
 *                        
 *                        Shopify usual contents of window.sandboxTheme_data
 *                        - handle:        string  the slug/permalink name of that page/post/content
 *                        - template:      string  the used template root file name
 *                        - shopCurrency:  string  ISO currency name
 *                        - moneyFormat:   string  template to display an ammount, example: "&euro;{{amount}}"
 *                        
 *                        you can add more values in a similar way as WordPress or you can also use the global
 *                        window.Shopify object as data source, but thats then not extendable.
 *                        UNFORTUNATLY there is no documentation for Shopify what default values are inside of "window.Shopify"
 *                        also it may be subject to change
 *
 *
 * @data    info          info data storage, gets extracted from init data "info" key values and gets extended by features informations
 *                        can be also filled and extended like the page data
 *
 *
 * @method  trigger()     use to trigger an internal event. 
 *                        all features methods with the same name as the event name will be executed.
 *
 *                        only event names in the list of the internal "eventNames" array are allowed.
 *                        default events: 'resize', 'scroll', 'ready', 'load', 'sticky'
 *                        you can easily extend that list to allow more event names.
 *
 * @param   eventName string  required name of the event to trigger
 * @param   eventData object  optional pass additional data to the event handlers
 *
 *
 * @method  sanitize_html_class()  clone of WordPress PHP API method sanitize_html_class for best compatibility.
 *                                 use it to get save sanitized html classNames
 *                        
 * @param   class_name string  required  string you want to be a class name
 *
 *
 * @method  is_page()  use to determine if this is a "page", in WordPress this means if it has the post_type "page"
 * @param   ID number  optional  when in ID gets provided is_page() checks if you are on a post/page/content with that ID 
 *
 *
 * @method  get_page()  returns you all page properties in sandboxTheme.page or single properties if a propertyname is provided
 * @param   property string  optional  throws an error if the property does not exist.
 *
 *
 * @method  get_feature()  returns you all registered features or a single feature if a featurename is provided
 * @param   feature_name string  optional  throws an error if the feature does not exist.
 */
 ```
