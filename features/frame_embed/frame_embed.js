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
     * @member  {object}  frame_embed
     * iframe embed GPDR/DSGVO conform
     * 
     * @memberof sandboxTheme.features
     * @example
     * <figure class="frame-preview">
     *   <a href="">
     *     <img src="img/" />
     *   </a>
     *   <figcaption>Mit Klick auf das Vorschaubild wir eine Verbindung zu google aufgebaut. Lesen Sie sich unsere <a href="../datenschutzerklaerung.html">Datenschutzerklärung</a> durch!</figcaption>
     * </figure>
     */
    frame_embed: {
      options: {
        classNames:{
          started: 'started'
        },
        selectors: {
          preview: 'figure.frame-preview',
          frame: '.frame',
        }
      },
      templates:{
        frame: '<iframe class="frame" allowfullscreen="allowfullscreen" frameborder="0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />'
      },
      start: function(trigger){
        var classNames = this.options.classNames,
            templates = this.templates,
            $frame = $(templates.frame);
        
        $frame.attr('src', trigger.dataset.frame);
        $(trigger).parent().append($frame).addClass(classNames.started);
      },
      end: function(trigger){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            $frame = $(trigger).siblings(selectors.frame);
        
        $frame.remove();
        $(trigger).parent().removeClass(classNames.started);
      },
      events: function events(){
        var classNames = this.options.classNames,
            frame_embed = this,
            $triggers = this.$previews.children('a');
        
        $triggers.on('click', function(event){
          if ( $(this).parent().hasClass(classNames.started) ) {
            frame_embed.end(this);
          } else {
            $triggers.each(function(){
              frame_embed.end(this);
            });
            frame_embed.start(this);
          }
          event.preventDefault();
        });
      },
      ready: function ready(){
        // register frame previews to the feature
        this.$previews = $(this.options.selectors.preview);

        // use events function to add event handlers
        this.events();
      },
      setup: function setup(){
        var is_setup = true; // is_allowed_page && !( is_denied_permanet || is_denied_by_url );

        // return value gets evaluated at pageload.
        // must return Boolean() true or false
        // if false, other API function will be left out and the script gets faster
        return is_setup;
      }
    }

  });
})(jQuery);
