(function(window){
  'use strict';

  function shop(element){
    this.element = element;
    this._init();
  }

  shop.prototype = {
    _init : function(){
      var self = this;

      this.touch = Modernizr.touch;

      this.products = this.element.querySelectorAll('ul.grid > li');
      Array.prototype.slice.call(this.products).forEach(function(element, i) {
        var content = element.querySelector('div.content'),
          item = content.querySelector('div.item'),
          rotate = content.querySelector('span.rotate');

      if(self.touch){
        rotate.addEventListener('touchstart', function(){self._rotateItem(this, item);});

        var options = content.querySelector(ul.options),
          wood = options.querySelector('li.optwood > span'),
          stain = options.querySelector('li.optstain > span');

        wood.addEventListener('touchstart', function(){self.showItemOptions(this);});
        stain.addEventListener('touchstart', function(){self.showItemOptions(this);});
      }
      else{
        rotate.addEventListener('click', function(){self._rotateItem(this, item);});
      }
      });
    },

    _rotateItem : function(trigger, item){
      if(item.getAttribute('data-open') === 'open'{
        item.setAttribute('data-open', '');
        trigger.className = trigger.className.replace(/\brotate-active\b/,'');
        item.className = item.className.replace(/\bitem-showback\b/,'');
      }
      else{
        item.setAttribute('data-open', 'open');
        trigger.className += 'rotate-active';
        item.className += 'item-showback';
      }
    },

    _showItemOptions : function(trigger){
      if(trigger.getAttribute('data-open') === 'open') {
        trigger.setAttribute('data-open','');
        trigger.parentNode.className = trigger.parentNode.className.replace(/\boption-active\b/,'');
      }
      else {
        trigger.setAttribute('data-open', 'open');
        trigger.parentNode.className += 'option-active';
      }
    },
  }

  window.shop = shop;

})(window);

