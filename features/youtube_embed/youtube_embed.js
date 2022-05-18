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
     * @member  {object}  youtube_embed
     * Youtube embed GPDR/DSGVO conform
     * 
     * Example YouTube URL formats
     * * https://www.youtube.com/embed?v=aqz-KE-bpKQ
     * * https://www.youtube.com/watch?v=aqz-KE-bpKQ
     * * https://youtu.be/aqz-KE-bpKQ
     *
     * Download the Youtube Preview image from here
     * {@link https://get-youtube-video-thumbnail-image.com}
     *
     * Upload it to your server and use it as preview image src attribute
     * 
     * @memberof sandboxTheme.features
     * @example
     * <figure class="youtube-preview">
     *   <a href="https://youtu.be/aqz-KE-bpKQ">
     *     <img src="img/big-buck-bunny-preview.jpg" />
     *   </a>
     *   <figcaption>Mit Klick auf das Vorschaubild wir eine Verbindung zu Youtube aufgebaut. Lesen Sie sich unsere <a href="../datenschutzerklaerung.html">Datenschutzerklärung</a> durch!</figcaption>
     * </figure>
     */
    youtube_embed: {
      options: {
        youtube_api_src: 'https://www.youtube.com/iframe_api',
        autoplay: true,
        classNames:{
          preview: 'youtube-preview',
          iframe: 'youtube-iframe',
          started: 'started',
          api_script: 'youtube-api',
        },
        selectors: {
          preview: 'figure.youtube-preview',
          caption: 'figcaption',
          api_script: '#youtube-api',
        }
      },
      youtube_parser: function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return ( match && match[7].length === 11 ) ? match[7] : false;
      },
      events: function events(){
        var classNames = this.options.classNames,
            selectors = this.options.selectors,
            autoplay = this.options.autoplay,
            youtube_api_src = this.options.youtube_api_src,
            youtube_embed = this;
            
        this.previews.forEach(function(preview){
          var starters = preview.querySelectorAll(':scope > a');
          
          starters.forEach(function(starter){
            starter.addEventListener('click', function(event){
              var player_id = Date.now().toString(),
                  preview_img = starter.querySelector('img'),
                  youtube_id = youtube_embed.youtube_parser(starter.href),
                  api_script = document.querySelector(selectors.api_script),
                  player,
                  player_ready = function(){
                    preview.classList.add(classNames.started); // Use CSS to hide elements
                    if ( autoplay ) {
                      player.playVideo();
                    }
                  },
                  player_call = function(){
                    timeout = clearTimeout(timeout);
                    if ( typeof window.YT === 'undefined' || window.YT.loaded === 0 ) {
                      console.log('loading YT');
                      timeout = setTimeout(player_call, 15);
                    } else {
                      player = new YT.Player(player_id, {
                        height: preview_img.height,
                        width: preview_img.width,
                        videoId: youtube_id,
                        events: {
                          'onReady': player_ready,
                        }
                      });
                    }
                  },
                  timeout;

              starter.id = player_id;
              
              if ( api_script === null ) {
                api_script = document.createElement('script');
                api_script.id = classNames.api_script;
                api_script.src = youtube_api_src;
                api_script.onload = player_call;
                              
                document.head.appendChild(api_script);
              } else {
                player_call();
              }
              event.preventDefault();              
            });
          });
        });
      },
      ready: function ready(){
        // register youtube previews to the feature
        this.previews = document.querySelectorAll(this.options.selectors.preview);

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
