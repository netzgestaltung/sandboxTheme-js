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
     * accordeon
     */
    accordeon: {
      options: {
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
        selectors: {
          content: '.content',
          heading: 'h3'
        },
        classNames: {
          heading: 'heading',
          content: 'content',
          active: 'active',
          enabled: 'enabled',
        }
      },
      templates: {
        div: '<div />',
        link: '<a href="" />'
      },
      info: {

      },
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
            info = this.info,
            accordeon = this;

        this.contents.forEach(function(content, content_index){
          var headings = content.querySelectorAll(selectors.heading),
              child_headings = Array.prototype.filter.call(headings,function(heading){
                return heading.parentElement === content;
              });

          if ( child_headings.length > 0 ) {
            child_headings.forEach(function(heading, heading_index){
              heading.firstElementChild.addEventListener('click', function(event){
                var accordeon_content = document.getElementById(event.target.hash.replace('#', '')),
                    $accordeon_content = $(accordeon_content);

                if ( heading.classList.contains(classNames.active) ) {
                  heading.classList.remove(classNames.active);
                  window.history.pushState(null, document.title, window.location.pathname + window.location.search);
                  $accordeon_content.slideUp(300, accordeon.callback_slideupdown);
                } else {
                  heading.classList.add(classNames.active);
                  window.history.pushState(null, document.title, event.target.hash);
                  $accordeon_content.slideDown(300, function(){
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

        this.$content = $(selectors.content);
        this.contents = document.querySelectorAll(selectors.content);

        this.contents.forEach(function(content, content_index){
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
              heading.classList.add(classNames.active);
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
