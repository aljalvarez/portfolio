"use strict";

var position = jQuery(window).scrollTop();

jQuery(document).on("ready", function () {

    jQuery(window).on('scroll', function () {
        animateLogoBackground();
    });

    jQuery(".site-content").fitVids();


    //Portfolio
    var grid = jQuery('.grid').imagesLoaded(function () {
        grid.isotope({
            percentPosition: true,
            itemSelector: '.grid-item',
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });

        jQuery('.filters-button-group').on('click', '.button', function () {
            var filterValue = jQuery(this).attr('data-filter');
            grid.isotope({filter: filterValue});
        });

        // change is-checked class on buttons
        jQuery('.button-group').each(function (i, buttonGroup) {
            var $buttonGroup = jQuery(buttonGroup);
            $buttonGroup.on('click', '.button', function () {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                jQuery(this).addClass('is-checked');
            });
        });
    });


    //Placeholder show/hide
    jQuery('input, textarea').on('focus', function () {
        jQuery(this).data('placeholder', jQuery(this).attr('placeholder'));
        jQuery(this).attr('placeholder', '');
    });
    jQuery('input, textarea').on('blur', function () {
        jQuery(this).attr('placeholder', jQuery(this).data('placeholder'));
    });


    //Fix for default menu
    jQuery('.default-menu ul').addClass('main-menu sm sm-clean');

});



jQuery(window).on('load', function () {

    //Home Carousel Slider
    jQuery(".carousel-slider .carousel").each(function () {
        jQuery(this).flickity({
            contain: true,
            freeScroll: false,
            cellAlign: 'left',
            pageDots: false
        });
    });


    jQuery(".category-filter").on('click', function () {
        jQuery(".category-filter-list").slideToggle("fast");
    });


//Set menu
    jQuery('.main-menu').smartmenus({
        subMenusSubOffsetX: 1,
        subMenusSubOffsetY: -8,
        markCurrentItem: true
    });

    var $mainMenu = jQuery('.main-menu').on('click', 'span.sub-arrow', function (e) {
        var obj = $mainMenu.data('smartmenus');
        if (obj.isCollapsible()) {
            var $item = jQuery(this).parent(),
                    $sub = $item.parent().dataSM('sub');
            $sub.dataSM('arrowClicked', true);
        }
    }).bind({
        'beforeshow.smapi': function (e, menu) {
            var obj = $mainMenu.data('smartmenus');
            if (obj.isCollapsible()) {
                var $menu = jQuery(menu);
                if (!$menu.dataSM('arrowClicked')) {
                    return false;
                }
                $menu.removeDataSM('arrowClicked');
            }
        }
    });


//Show-Hide header sidebar
    jQuery('#toggle').on("click", multiClickFunctionStop);

    jQuery('.doc-loader').fadeOut();
});



//------------------------------------------------------------------------
//Helper Methods -->
//------------------------------------------------------------------------

var animateLogoBackground = function (e) {
    var scroll = jQuery(window).scrollTop();
    if (scroll > position) {
        jQuery('.welcome-image').css('top', '-=0.6');
    } else {
        jQuery('.welcome-image').css('top', '+=0.6');
    }
    position = scroll;
};

var multiClickFunctionStop = function (e) {
    e.preventDefault();
    jQuery('#toggle').off("click");
    jQuery('#toggle').toggleClass("on");

    jQuery('html, body, .sidebar, .menu-left-part, .menu-right-part, .site-content').toggleClass("open").delay(500).queue(function (next) {
        jQuery(this).toggleClass("done");
        next();
    });
    jQuery('#toggle').on("click", multiClickFunctionStop);
};

function is_touch_device() {
    return !!('ontouchstart' in window);
}

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}


var SendMail = function () {

    var emailVal = jQuery('#contact-email').val();
    if (isValidEmailAddress(emailVal)) {
        var params = {
            'action': 'SendMessage',
            'name': jQuery('#name').val(),
            'email': jQuery('#contact-email').val(),
            'subject': jQuery('#subject').val(),
            'message': jQuery('#message').val()
        };
        jQuery.ajax({
            type: "POST",
            url: "php/sendMail.php",
            data: params,
            success: function (response) {
                if (response) {
                    var responseObj = jQuery.parseJSON(response);
                    if (responseObj.ResponseData)
                    {
                        alert(responseObj.ResponseData);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //xhr.status : 404, 303, 501...
                var error = null;
                switch (xhr.status)
                {
                    case "301":
                        error = "Redirection Error!";
                        break;
                    case "307":
                        error = "Error, temporary server redirection!";
                        break;
                    case "400":
                        error = "Bad request!";
                        break;
                    case "404":
                        error = "Page not found!";
                        break;
                    case "500":
                        error = "Server is currently unavailable!";
                        break;
                    default:
                        error = "Unespected error, please try again later.";
                }
                if (error) {
                    alert(error);
                }
            }
        });
    } else
    {
        alert('Your email is not in valid format');
    }
};

/**
* demo.js
* http://www.codrops.com
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* Copyright 2019, Codrops
* http://www.codrops.com
*/
{
    // helper functions
    const MathUtils = {
        // map number x from range [a, b] to [c, d]
        map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
        // linear interpolation
        lerp: (a, b, n) => (1 - n) * a + n * b
    };

    // body element
    const body = document.body;
    
    // calculate the viewport size
    let winsize;
    const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
    calcWinsize();
    // and recalculate on resize
    window.addEventListener('resize', calcWinsize);

    // scroll position and update function
    let docScroll;
    const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
    window.addEventListener('scroll', getPageYScroll);

    // Item
    class Item {
        constructor(el) {
            // the .item element
            this.DOM = {el: el};
            // the inner image
            this.DOM.image = this.DOM.el.querySelector('.item__img');
            this.renderedStyles = {
                // here we define which property will change as we scroll the page and the items is inside the viewport
                // in this case we will be translating the image on the y-axis
                // we interpolate between the previous and current value to achieve a smooth effect
                innerTranslationY: {
                    // interpolated value
                    previous: 0, 
                    // current value
                    current: 0, 
                    // amount to interpolate
                    ease: 0.1,
                    // the maximum value to translate the image is set in a CSS variable (--overflow)
                    maxValue: parseInt(getComputedStyle(this.DOM.image).getPropertyValue('--overflow'), 15),
                    // current value setter
                    // the value of the translation will be:
                    // when the item's top value (relative to the viewport) equals the window's height (items just came into the viewport) the translation = minimum value (- maximum value)
                    // when the item's top value (relative to the viewport) equals "-item's height" (item just exited the viewport) the translation = maximum value
                    setValue: () => {
                        const maxValue = this.renderedStyles.innerTranslationY.maxValue;
                        const minValue = -1 * maxValue;
                        return Math.max(Math.min(MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, minValue, maxValue), maxValue), minValue)
                    }
                }
            };
            // set the initial values
            this.update();
            // use the IntersectionObserver API to check when the element is inside the viewport
            // only then the element translation will be updated
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
            });
            this.observer.observe(this.DOM.el);
            // init/bind events
            this.initEvents();
        }
        update() {
            // gets the item's height and top (relative to the document)
            this.getSize();
            // sets the initial value (no interpolation)
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }
            // translate the image
            this.layout();
        }
        getSize() {
            const rect = this.DOM.el.getBoundingClientRect();
            this.props = {
                // item's height
                height: rect.height,
                // offset top relative to the document
                top: docScroll + rect.top 
            }
        }
        initEvents() {
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // on resize rest sizes and update the translation value
            this.update();
        }
        render() {
            // update the current and interpolated values
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            // and translates the image
            this.layout();
        }
        layout() {
            // translates the image
            this.DOM.image.style.transform = `translate3d(0,${this.renderedStyles.innerTranslationY.previous}px,0)`;
        }
    }

    // SmoothScroll
    class SmoothScroll {
        constructor() {
            // the <main> element
            this.DOM = {main: document.querySelector('main')};
            // the scrollable element
            // we translate this element when scrolling (y-axis)
            this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
            // the items on the page
            this.items = [];
            [...this.DOM.main.querySelectorAll('.content > .item')].forEach(item => this.items.push(new Item(item)));
            // here we define which property will change as we scroll the page
            // in this case we will be translating on the y-axis
            // we interpolate between the previous and current value to achieve the smooth scrolling effect
            this.renderedStyles = {
                translationY: {
                    // interpolated value
                    previous: 0, 
                    // current value
                    current: 0, 
                    // amount to interpolate
                    ease: 0.1,
                    // current value setter
                    // in this case the value of the translation will be the same like the document scroll
                    setValue: () => docScroll
                }
            };
            // set the body's height
            this.setSize();
            // set the initial values
            this.update();
            // the <main> element's style needs to be modified
            this.style();
            // init/bind events
            this.initEvents();
            // start the render loop
            requestAnimationFrame(() => this.render());
        }
        update() {
            // sets the initial value (no interpolation) - translate the scroll value
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }   
            // translate the scrollable element
            this.layout();
        }
        layout() {
            // translates the scrollable element
            this.DOM.scrollable.style.transform = `translate3d(0,${-1*this.renderedStyles.translationY.previous}px,0)`;
        }
        setSize() {
            // set the heigh of the body in order to keep the scrollbar on the page
            body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
        }
        style() {
            // the <main> needs to "stick" to the screen and not scroll
            // for that we set it to position fixed and overflow hidden 
            this.DOM.main.style.position = 'fixed';
            this.DOM.main.style.width = this.DOM.main.style.height = '100%';
            this.DOM.main.style.top = this.DOM.main.style.left = 0;
            this.DOM.main.style.overflow = 'hidden';
        }
        initEvents() {
            // on resize reset the body's height
            window.addEventListener('resize', () => this.setSize());
        }
        render() {
            // update the current and interpolated values
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            // and translate the scrollable element
            this.layout();
            
            // for every item
            for (const item of this.items) {
                // if the item is inside the viewport call it's render function
                // this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
                if ( item.isVisible ) {
                    item.render();
                }
            }
            
            // loop..
            requestAnimationFrame(() => this.render());
        }
    }

    /***********************************/
    /********** Preload stuff **********/

    // Preload images
    const preloadImages = () => {
        return new Promise((resolve, reject) => {
            imagesLoaded(document.querySelectorAll('.item__img'), {background: true}, resolve);
        });
    };
    
    // And then..
    preloadImages().then(() => {
        // Remove the loader
        document.body.classList.remove('loading');
        // Get the scroll position
        getPageYScroll();
        // Initialize the Smooth Scrolling
        new SmoothScroll();
    });
}