/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {

  'use strict';

  Drupal.behaviors.bootstrap_barrio_subtheme = {
    attach: function (context, settings) {

    }
  };

  $(function(){

    $('.envision_person').on('click',function(){
      // If modal doesn't exist on page, add it
      if (!$('.modal').length) {
        var modalHtml = ''+
          '<div class="modal fade" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
              '<div class="modal-content">'+
                '<div class="modal-header">'+
                  '<h5 class="modal-title"></h5>'+
                  '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                  '</button>'+
                '</div>'+
                '<div class="modal-body">'+
                '</div>'+
                '<div class="modal-footer">'+
                  '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>';
        $('body').append(modalHtml);
      }

      var personNameTitle = $('.envision_person_name_title h3',this).text();
      var personDetails = $('.person_details',this).html();
      $('.modal-title').html(personNameTitle);
      $('.modal-body').html(personDetails);
      $('.modal').modal();
    });

  });

})(jQuery, Drupal);


// YouTube embed API
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('envision_video', {
        height:'390',
        width:'100%',
        videoId: 'gYXa8mWDKeI',
        playerVars:{
            autoplay:1,
            controls:0,
            showinfo:0, // Hides video info, like title
            modestbranding:1, // Removes YouTube branding on video
            loop:1,
            playlist:'gYXa8mWDKeI', // This is required for looping to work, according to YouTube documentation
            mute:1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //     setTimeout(stopVideo, 6000);
    //     done = true;
    // }
}


function stopVideo() {
    player.stopVideo();
}
;
(function ($, Drupal) {

    'use strict';
  
    Drupal.behaviors.bootstrap_barrio_subtheme = {
        attach: function (context, settings) {
  
        }
    };

    /*
    $('.nav-item.dropdown').on('click',function(){
        if ($(window).width() > 991) {
            window.location = $('.nav-link',this).attr('href');
        } else if ($(window).width() <= 991) {

        }
    }).on('mouseenter',function(){
        $('.dropdown-menu',this).show();
    }).on('mouseleave',function(){
        $('.dropdown-menu',this).hide();
    });
    */

    $('.nav-item.dropdown').on('click',function(){
        if ($(window).width() > 991) {
            window.location = $('.nav-link',this).attr('href');
        }
    }).on('mouseenter',function(){
        $('.dropdown-menu',this).show();
    }).on('mouseleave',function(){
        $('.dropdown-menu',this).hide();
    });

    $('.modal_trigger').on('click',function(){
        var modalText = $(this).closest('.ckeditor_bootstrap_modal').find('.modal_text').html();
        if ($('.modal').length) {
            $('.modal-body').html(modalText);
            $('.modal').modal();
        } else {
            $('.node__content').prepend(
                '<div class="modal" tabindex="-1" role="dialog">' +
                '<div class="modal-dialog" role="document">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<h5 class="modal-title"></h5>' +
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            modalText +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
            );
            
            $('.modal').modal();
        }
    })
    
})(jQuery, Drupal);


// (function() {var walkme = document.createElement('script'); walkme.type = 'text/javascript'; walkme.async = true; walkme.src = 'https://cdn.walkme.com/users/293aad5b684a4b8699ff542571eae413/walkme_293aad5b684a4b8699ff542571eae413_https.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(walkme, s); window._walkmeConfig = {smartLoad:true}; })();;
(function(a){function b(a){return a.replace(/[&<>"'`=\/]/g,function(a){return e[a]})}var c={host:"https://www.instagram.com/",username:"",tag:"",container:"",display_profile:!0,display_biography:!0,display_gallery:!0,display_igtv:!1,callback:null,styling:!0,items:8,items_per_row:4,margin:.5,image_size:640,lazy_load:!1,on_error:console.error},d={150:0,240:1,320:2,480:3,640:4},e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};a.instagramFeed=function(e){var f=a.fn.extend({},c,e);if(""==f.username&&""==f.tag)return f.on_error("Instagram Feed: Error, no username nor tag defined.",1),!1;if("undefined"!=typeof f.get_data&&console.warn("Instagram Feed: options.get_data is deprecated, options.callback is always called if defined"),null==f.callback&&""==f.container)return f.on_error("Instagram Feed: Error, neither container found nor callback defined.",2),!1;var g=""==f.username,h=g?f.host+"explore/tags/"+f.tag+"/":f.host+f.username+"/";return a.get(h,function(c){try{c=c.split("window._sharedData = ")[1].split("</script>")[0]}catch(a){return void f.on_error("Instagram Feed: It looks like the profile you are trying to fetch is age restricted. See https://github.com/jsanahuja/InstagramFeed/issues/26",3)}if(c=JSON.parse(c.substr(0,c.length-1)),c=c.entry_data.ProfilePage||c.entry_data.TagPage,"undefined"==typeof c)return void f.on_error("Instagram Feed: It looks like YOUR network has been temporary banned because of too many requests. See https://github.com/jsanahuja/jquery.instagramFeed/issues/25",4);if(c=c[0].graphql.user||c[0].graphql.hashtag,""!=f.container){var e={profile_container:"",profile_image:"",profile_name:"",profile_biography:"",gallery_image:""};if(f.styling){e.profile_container=" style='text-align:center;'",e.profile_image=" style='border-radius:10em;width:15%;max-width:125px;min-width:50px;'",e.profile_name=" style='font-size:1.2em;'",e.profile_biography=" style='font-size:1em;'";var h=(100-2*f.margin*f.items_per_row)/f.items_per_row;e.gallery_image=" style='margin:"+f.margin+"% "+f.margin+"%;width:"+h+"%;float:left;'"}var j="";f.display_profile&&(j+="<div class='instagram_profile'"+e.profile_container+">",j+="<img class='instagram_profile_image' src='"+c.profile_pic_url+"' alt='"+(g?c.name+" tag pic":c.username+" profile pic")+"'"+e.profile_image+(f.lazy_load?" loading='lazy'":"")+" />",j+=g?"<p class='instagram_tag'"+e.profile_name+"><a href='https://www.instagram.com/explore/tags/"+f.tag+"' rel='noopener' target='_blank'>#"+f.tag+"</a></p>":"<p class='instagram_username'"+e.profile_name+">@"+c.full_name+" (<a href='https://www.instagram.com/"+f.username+"' rel='noopener' target='_blank'>@"+f.username+"</a>)</p>",!g&&f.display_biography&&(j+="<p class='instagram_biography'"+e.profile_biography+">"+c.biography+"</p>"),j+="</div>");var k="undefined"==typeof d[f.image_size]?d[640]:d[f.image_size];if(f.display_gallery)if("undefined"!=typeof c.is_private&&!0===c.is_private)j+="<p class='instagram_private'><strong>This profile is private</strong></p>";else{var l=(c.edge_owner_to_timeline_media||c.edge_hashtag_to_media).edges;s=l.length>f.items?f.items:l.length,j+="<div class='instagram_gallery'>";for(var m=0;m<s;m++){var n,o,p,q="https://www.instagram.com/p/"+l[m].node.shortcode;switch(l[m].node.__typename){case"GraphSidecar":o="sidecar",n=l[m].node.thumbnail_resources[k].src;break;case"GraphVideo":o="video",n=l[m].node.thumbnail_src;break;default:o="image",n=l[m].node.thumbnail_resources[k].src;}p="undefined"!=typeof l[m].node.edge_media_to_caption.edges[0]&&"undefined"!=typeof l[m].node.edge_media_to_caption.edges[0].node&&"undefined"!=typeof l[m].node.edge_media_to_caption.edges[0].node.text&&null!==l[m].node.edge_media_to_caption.edges[0].node.text?l[m].node.edge_media_to_caption.edges[0].node.text:"undefined"!=typeof l[m].node.accessibility_caption&&null!==l[m].node.accessibility_caption?l[m].node.accessibility_caption:(g?c.name:c.username)+" image "+m,j+="<a href='"+q+"' class='instagram-"+o+"' rel='noopener' target='_blank'>",j+="<img"+(f.lazy_load?" loading='lazy'":"")+" src='"+n+"' alt='"+b(p)+"'"+e.gallery_image+" />",j+="</a>"}j+="</div>"}if(f.display_igtv&&"undefined"!=typeof c.edge_felix_video_timeline){var r=c.edge_felix_video_timeline.edges,s=r.length>f.items?f.items:r.length;if(0<r.length){j+="<div class='instagram_igtv'>";for(var m=0;m<s;m++)j+="<a href='https://www.instagram.com/p/"+r[m].node.shortcode+"' rel='noopener' target='_blank'>",j+="<img"+(f.lazy_load?" loading='lazy'":"")+" src='"+r[m].node.thumbnail_src+"' alt='"+f.username+" instagram image "+m+"'"+e.gallery_image+" />",j+="</a>";j+="</div>"}}a(f.container).html(j)}null!=f.callback&&f.callback(c)}).fail(function(a){f.on_error("Instagram Feed: Unable to fetch the given user/tag. Instagram responded with the status code: "+a.status,5)}),!0}})(jQuery);
;
(function (Drupal, drupalSettings, $) {
  'use strict';
  Drupal.behaviors.simple_instagram_feed = {
    attach: function (context, settings) {
      // Avoid sending multiple requests to the Instagram.
      if (context !== document) {
        return;
      }
      var simple_instagram_feed_array = Object.keys(drupalSettings.simple_instagram_feed).map(function (e) {
        return drupalSettings.simple_instagram_feed[e]
      })

      for (var i = 0; i < simple_instagram_feed_array.length; i++) {
        var instagram_username = simple_instagram_feed_array[i].instagram_username;
        var display_profile = simple_instagram_feed_array[i].display_profile;
        var display_biography = simple_instagram_feed_array[i].display_biography;
        var items = simple_instagram_feed_array[i].items;
        var image_size = simple_instagram_feed_array[i].image_size;
        var styling = (simple_instagram_feed_array[i].styling === 'true' ? true : false);
        var unique_id = simple_instagram_feed_array[i].unique_id;
        var lazy_load = simple_instagram_feed_array[i].lazy_load;
        var captions = simple_instagram_feed_array[i].captions;
        // if captions are enabled, styling must be enabled by force.
        if (captions) {
           styling = true;
        }
        // Verify items per row.
        var items_per_row;
        if (simple_instagram_feed_array[i].items_per_row_type == 0) {
          items_per_row = simple_instagram_feed_array[i].items_per_row_default;
        } else {
          var screenWidth = $(window).width();
          if (screenWidth < 720) {
            items_per_row = simple_instagram_feed_array[i].items_per_row_l_720;
          } else if (screenWidth >= 720 && screenWidth < 960) {
            items_per_row = simple_instagram_feed_array[i].items_per_row_l_960;
          } else {
            items_per_row = simple_instagram_feed_array[i].items_per_row_h_960;
          }
        }

        var feed_settings = {
          host: 'https://images' + ~~(Math.random() * 3333) + '-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https://www.instagram.com/',
          username: instagram_username,
          max_tries: 8,
          container: "#".concat(unique_id),
          display_profile: display_profile,
          display_biography: display_biography,
          display_captions: captions,
          display_gallery: true,
          callback: null,
          styling: styling,
          items: items,
          image_size: image_size,
          margin: 0.25,
          lazy_load: lazy_load,
        };

        if (styling) {
          feed_settings.items_per_row = items_per_row;
        }

        $.instagramFeed(feed_settings, context);

        $(window, context).resize(function () {
          screenWidth = $(window).width();
          var width;
          for (i = 0; i < simple_instagram_feed_array.length; i++) {
            if (simple_instagram_feed_array[i].items_per_row_type == 1) {
              if (screenWidth < 720) {
                width = (100 - 0.5 * 2 * simple_instagram_feed_array[i].items_per_row_l_720) / simple_instagram_feed_array[i].items_per_row_l_720;
              } else if (screenWidth >= 720 && screenWidth < 960) {
                width = (100 - 0.5 * 2 * simple_instagram_feed_array[i].items_per_row_l_960) / simple_instagram_feed_array[i].items_per_row_l_960;
              } else {
                width = (100 - 0.5 * 2 * simple_instagram_feed_array[i].items_per_row_h_960) / simple_instagram_feed_array[i].items_per_row_h_960;
              }
              var block_id = "block-" + simple_instagram_feed_array[i].block_instance;
              $("#" + block_id + " img", context).width(width + "%");
            }
          }
        });
      }
    }
  };
})(Drupal, drupalSettings, jQuery);
;
