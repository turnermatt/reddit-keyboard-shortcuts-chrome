

(function () {
	
	var jQuery = $;
  if (typeof jQuery == 'undefined') {
    console.log('jQuery not present on page');
    return;
  }

  var helpText =
    ['Keyboard shortcuts include: ', '\n',
     'j — Go to the next article', '\n',
     'k — Go to the previous article', '\n',
     'v — Open current article in a new tab (You may need to configure the popup blocker to allow popups from reddit)', '\n',
     'ENTER — Open current article without opening a new tab', '\n',
     "c — Open current article's comments page", '\n',
     'u — Up-vote current article', '\n',
     'd — Down-vote current article', '\n',
     'i ,�� Show all image links inline',
     'y ,�� Hide current article',
     '? — Display help'];

  var links = jQuery('#siteTable .thing').not('.hidden');

  var current = 0;

  var toggleHighlight = function () {
    var currentLink = jQuery(links[current]);
    if (currentLink.hasClass('highlighted')) {
      jQuery(currentLink).find('.rank .kbsc-selected-indicator').remove();
      currentLink.removeClass('highlighted');
    } else {
      jQuery(currentLink).find('.rank').prepend('<div class="kbsc-selected-indicator" style="float:left; position:absolute; color:black;">&raquo;</div>');
      currentLink.addClass('highlighted');
    }
  };

  // highlight the first link
  toggleHighlight();

  var scroller = (function () {
    function getElementY(element) {
      return jQuery(element).position().top;
    }

    return {
      showElement: function (element) {
        var position = getElementY(element);
        var height = jQuery(window).height();
        var scrollPosition = window.pageYOffset;

        if ((height + scrollPosition - position) < 10 || (position - scrollPosition) < 10) {
          window.scrollTo(0, position);
        }
      }
    };
  })();

  var openCurrentLink = function (sameWindow) {
    var currentElement = jQuery(links[current]);
    var currentLink = currentElement.find('a.title');
    currentLink.mousedown(); // fire reddit's link tracking
    var url = currentLink.attr('href');
    if (sameWindow) {
      window.location.href = url;
    } else {
      window.open(url);
    }
  };

  var actions = {
    106: function () { // j -- move to next item
      if (current == links.length - 1) {
        // we're at the last link
        return;
      }
      toggleHighlight();
      current++;
      toggleHighlight();
      scroller.showElement(links[current]);
    },

    107: function () { // k -- move to next item
      if (!current) {
        // we're at the first link
        return;
      }
      toggleHighlight();
      current--;
      toggleHighlight();
      scroller.showElement(links[current]);
    },

    63: function () { // ? - show help
      window.alert(helpText.join(''));
    },

    118: openCurrentLink, // v -- open item in a new tab/window,

    117: function () { // up arrow - upvote article
      jQuery(links[current]).find('.up').click();
    },

    100: function () { // down arrow - downvote article
      jQuery(links[current]).find('.down').click();
    },

    99: function () { // c -- comments page
      var href = jQuery(links[current]).find('a.comments').attr('href');
      window.open(href);
    },

    13: function () { // Enter key -- show current link in the same window
      openCurrentLink(true);
    },
    
    121: function () { // y -- hide
    	jQuery(links[current]).find('form.hide-button a').click();
    	links.splice(current,1);
    	toggleHighlight();
    },
    
    105: function () { // i -- show all images inline
    	showAllImages();
    }
  };

  // disregard key presses on the following elements
  var ignoreTheseTags = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'];

  var handleKeyPress = function (event) {
    var tagName = event.target.tagName;
    if (ignoreTheseTags.filter(function (i) {
        return i === tagName;
      }).length) {
      return;
    }

    var code = event.charCode || event.keyCode;
    if (actions[code]) {
      actions[code]();
      event.preventDefault();
    }
  };

  window.document.addEventListener('keypress', handleKeyPress, true);
})();
