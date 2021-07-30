;(function($){
  'use strict';
  
  /**
   * @namespace sandboxTheme
   */
  window.sandboxTheme = window.sandboxTheme || {};

  /**
   * @namespace features
   * @memberof sandboxTheme
   */
  sandboxTheme.features = $.extend(true, sandboxTheme.features || {}, {


    /**
     * @member  {object}  accordeon
     * Accordeon
     * 
     * Hides or shows content between configured heading elements inside a configured container element.
     * The headings turn to triggers to open or close an accordeon segment.
     * Open/Close is animated with jQuery slideUp/slideDown methods.
     * 
     * @memberof sandboxTheme.features
     * @example
     * <div class="content">
     *   <h3>Example heading</h3>
     *   <p>Example content</p>
     * </div>
     */
    accordeon: {
      options: {
        /**
         * Speed of the slideUp/Down animation in MS
         * @type {Number}
         */
        duration: 300,

        /**
         * Index of Accordeon to open.
         * 
         * First number is the index of the content if there are more then one.
         * Second number ist the index of the accordeon in that content to open.
         * Empty string let all accordeons be closed exept there is a hash opener in the URL.
         * 
         * @type {String} String containing two numbers. 
         * @example
         * '01' Opens the second accordeon in the first content occurances
         */
        open_index: '',

        /**
         * where to look for accordion container and headings
         * 
         * @type      {Object}
         * @property  {String}  container  CSS selector for the container of the headings
         * @property  {String}  heading    CSS selector for the headings
         */
        selectors: {
          container: '.content',     
          heading: 'h3'
        },

        /**
         * you will find these class names combined with the features name so you can style it
         * 
         * @type      {Object}
         * @property  {String}  heading  Accordion heading class
         * @property  {String}  content  Accordion content class
         * @property  {String}  no       Accordion leave out class
         * @property  {String}  opened   Accordion is opened
         * @property  {String}  enabled  Global body class is accordeon feature has been enabled
         */
        classNames: {
          heading: 'heading',
          content: 'content',
          no: 'no',
          opened: 'opened',
          enabled: 'enabled',
        }
      },
      templates: {
        div: '<div />',
      },

      /**
       * @method [callback_slideupdown]
       *
       * Gets executed after a slideUp/slideDown animation has being finished.
       * 
       * Triggers resize and scroll events because the height of the document has changed.
       * 
       */
      callback_slideupdown: function(){
        sandboxTheme.trigger('resize');
        sandboxTheme.trigger('scroll');
      },
      /**
       * @method [events]
       * 
       * Checks if there are any 'h3' in the index.html and fliters them so only the firtst h3 is going to be selected that means no children are going to be used.
       * If there are it is going to make a new link, when that link is presseed it will extend and schow the hidden text.
       * Whould you kick it again the call would change and and the schown text will get hiden again.
       * 
       */
      events: function(){
        var selectors = this.options.selectors,
            classNames = this.options.classNames,
            duration = this.options.duration,
            info = this.info,
            accordeon = this;

        this.containers.forEach(function(content, content_index){
          var headings = content.querySelectorAll(selectors.heading),
              child_headings = Array.prototype.filter.call(headings,function(heading){
                return heading.parentElement === content;
              });

          if ( child_headings.length > 0 ) {
            child_headings.forEach(function(heading, heading_index){
              heading.firstElementChild.addEventListener('click', function(event){
                var accordeon_content = document.getElementById(event.target.hash.replace('#', '')),
                    $accordeon_content = $(accordeon_content);

                if ( heading.classList.contains(classNames.opened) ) {
                  heading.classList.remove(classNames.opened);
                  window.history.pushState(null, document.title, window.location.pathname + window.location.search);

                  $accordeon_content.slideUp(duration, accordeon.callback_slideupdown);
                } else {
                  heading.classList.add(classNames.opened);
                  window.history.pushState(null, document.title, event.target.hash);

                  $accordeon_content.slideDown(duration, function(){
                    accordeon_content.style.display = accordeon_content.dataset.display;
                    accordeon.callback_slideupdown();
                  });
                }
                event.preventDefault();
              });
            });
          }
        });
      },

      /**
       * @method [ready]
       * 
       * make a link inside headings to click on to show the hidden accordeon content.
       * wraps all content between headings into an accordeon div
       * shows the first accordeon content
       */
      ready: function(){
        var selectors = this.options.selectors,
            classNames = this.options.classNames,
            info = this.info,
            templates = this.templates,
            default_open_index = this.options.open_index;

        this.containers = document.querySelectorAll(selectors.content + ':not(.' + classNames.no '-' + info.class_name + ')');

        this.containers.forEach(function(content, content_index){
          var headings = content.querySelectorAll(selectors.heading),
              child_headings = Array.prototype.filter.call(headings,function(heading){
                return heading.parentElement === content;
              });

            child_headings.forEach(function(heading, heading_index){
            var accordeon_content,
                accordeon_class = info.class_name + '-' + classNames.content,
                accordeon_id = accordeon_class + '-' + content_index + heading_index,
                heading_content = document.createElement('a'),
                open_index = default_open_index,
                open_content_index = -1,
                open_heading_index = -1,
                has_open_index = false;
            
            // heading manipulation
            heading.classList.add(info.class_name + '-' + classNames.heading);
            heading_content.insertAdjacentHTML('afterbegin', heading.innerHTML);
            heading_content.setAttribute('href', '#' + accordeon_id);
            heading.replaceChildren(heading_content);
          
            // content manipulation
            $(heading).nextUntil(selectors.heading).wrapAll(templates.div);
            accordeon_content = heading.nextElementSibling;
            accordeon_content.classList.add(accordeon_class);
            accordeon_content.setAttribute('id', accordeon_id);
            accordeon_content.dataset.display = getComputedStyle(accordeon_content, null).display;

            if ( info.hash !== false ) {
              open_index = info.hash.replace('content-', '');
            } 

            if ( open_index.length > 0 ) {
              open_content_index = parseInt(open_index.charAt(0));
              open_heading_index = parseInt(open_index.charAt(1));
              has_open_index = open_content_index >= 0 && open_heading_index >= 0;
            }

            if ( has_open_index && content_index === open_content_index && heading_index === open_heading_index ) {
              // active initialation
              heading.classList.add(classNames.opened);
            } else {
              // inactive initialation
              accordeon_content.style.display = 'none';
            }
          });
        });
        // $.log(this.$content);
        this.events();
      },

      /**
       * @method setup
       * 
       * returns true because its used on every page.
       * 
       * @memberof sandboxTheme.features.accordeon
       * 
       * @returns  boolean  is_setup
       */
      setup: function(){
        document.body.classList.add(this.info.class_name + '-' + this.options.classNames.enabled);
        return true; // sandboxTheme.is_page(8); // true on Kurssuche;
      }
    }

  });
})(jQuery);
