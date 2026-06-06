jQuery(function($) {
  /**
 * General Form Fields
 */
(function() {
  /**
   * Suggestion Field
   */
  $(window).on('suggestion-field-init', function(e, target) {
    $.require('components/handlebars/dist/handlebars.js', function() {
      target = $(target);

      var container = $('<ul>').appendTo(target);
      var spinnerItem = $(`
        <li class="d-flex align-items-center">
          <div class="spinner-border mr-3" role="status"></div>
          <span>Please Wait ...</span>
        </li>
      `);
      container.prepend(spinnerItem);

      var searching = false,
        xhr = false,
        prevent = false,
        value = target.attr('data-value'),
        format = target.attr('data-format'),
        targetLabel = target.attr('data-target-label'),
        targetValue = target.attr('data-target-value'),
        url = target.attr('data-url'),
        template = target.attr('data-template');

      if (template) {
        template = $(template).html();
      } else {
        template = '<li class="suggestion-item">{VALUE}</li>';
      }

      if(!targetLabel || !targetValue || !url || !value) {
        return;
      }

      targetLabel = $(targetLabel);
      targetValue = $(targetValue);

      $(window).click(function(e) {
        target.addClass('d-none');
      });

      var loadSuggestions = function(list, callback) {
        container.html('');

        list.forEach(function(item) {
          var label = '';
          //if there is a format, yay.
          if (format) {
            label = Handlebars.compile(format)(item);
          //otherwise best guess?
          } else {
            for (var key in item) {
              if(
                //if it is not a string
                typeof item[key] !== 'string'
                //it's a string but is like a number
                || !isNaN(parseFloat(item[key]))
                //it's a string and is not like a number
                // but the first character is like a number
                || !isNaN(parseFloat(item[key][0]))
              ) {
                continue;
              }

              label = item[key];
            }
          }

          //if still no label
          if(!label.length) {
            //just get the first one, i guess.
            for (var key in item) {
              label = item[key];
              break;
            }
          }

          var templateValue = value;
          if (templateValue.indexOf('{{') !== 0) {
            templateValue = '{{'+ templateValue +'}}';
          }

          var row = Handlebars.compile(template.replace('{VALUE}', label))(item);

          var data = {
            label: label,
            value: Handlebars.compile(templateValue)(item)
          };

          row = $(row).click(function() {
            callback(data);
          });

          container.append(row);
        });

        if(list.length) {
          target.removeClass('d-none');
        } else {
          target.addClass('d-none');
        }
      };

      targetLabel
        .keypress(function(e) {
          //if enter
          if(e.keyCode == 13 && prevent) {
            e.preventDefault();
          }
        })
        .keydown(function(e) {
          //if backspace
          if(e.keyCode == 8) {
            //undo the value
            targetValue.val('');
          }

          //if esc
          if(e.keyCode == 27) {
            //hide dropdown
            return target.addClass('d-none');
          }

          prevent = false;
          if(!target.hasClass('d-none')) {
            switch(e.keyCode) {
              case 40: //down
                var next = $('li.hover', target).removeClass('hover').index() + 1;

                if(next === $('li', target).length) {
                  next = 0;
                }

                $('li:eq('+next+')', target).addClass('hover');

                return;
              case 38: //up
                var prev = $('li.hover', target).removeClass('hover').index() - 1;

                if(prev < 0) {
                  prev = $('li', target).length - 1;
                }

                $('li:eq('+prev+')', target).addClass('hover');

                return;
              case 13: //enter
                if($('li.hover', target).length) {
                  $('li.hover', target)[0].click();
                  prevent = true;
                }
                return;
              case 37:
              case 39:
                return;
            }
          }

          if(searching) {
            //return;
          }

          setTimeout(function() {
            if (targetLabel.val() == '') {
              return;
            }

            if (!spinnerItem.parent().length) {
              container.prepend(spinnerItem);
            }
            target.removeClass('d-none');

            if (xhr) {
              xhr.abort();
            }

            //searching = true;
            xhr = $.ajax({
              url : url.replace('{QUERY}', targetLabel.val()),
              type : 'GET',
              success : function(response) {
                var list = [];

                if(typeof response.results !== 'undefined'
                  && typeof response.results.rows !== 'undefined'
                  && response.results.rows instanceof Array
                ) {
                  list = response.results.rows;
                }

                loadSuggestions(list, function(item) {
                  if (!item.value) {
                    return;
                  }
                  targetValue.val(item.value);
                  targetLabel.val(item.label).trigger('keyup');
                });

                searching = false;
              }, error : function() {
                searching = false;
              }
            });
          }, 1);
        });
    });
  });

  /**
   * Tag Field
   */
  $(window).on('tag-field-init', function(e, target) {
    target = $(target);

    //TEMPLATES
    var tagTemplate = '<div class="tag"><input type="text" class="tag-input'
    + ' text-field system-form-control" name="{NAME}[]" placeholder="Tag" value="" />'
    + '<a class="remove" href="javascript:void(0)"><i class="fa fa-times">'
    + '</i></a></div>';

    var addResize = function(filter) {
      var input = $('input[type=text]', filter);

      input.keyup(function() {
        var value = input.val() || input.attr('placeholder');

        var test = $('<span>').append(value).css({
          visibility: 'hidden',
          position: 'absolute',
          top: 0, left: 0
        }).appendTo(document.body);

        var width = test.width() + 10;

        $(this).width(Math.max(width, 40));
        test.remove();
      }).trigger('keyup');
    };

    var addRemove = function(filter) {
      $('a.remove', filter).click(function() {
        var val = $('input', filter).val();

        $(this).parent().remove();
      });
    };

    //INITITALIZERS
    var initTag = function(filter) {
      addRemove(filter);
      addResize(filter);

      $('input', filter).blur(function() {
        //if no value
        if(!$(this).val() || !$(this).val().length) {
          //remove it
          $(this).next().click();
        }

        var count = 0;
        var currentTagValue = $(this).val();
        $('div.tag input', target).each(function() {
          if(currentTagValue === $(this).val()) {
            count++;
          }
        });

        if(count > 1) {
          $(this).parent().remove();
        }
      });
    };

    //EVENTS
    target.click(function(e) {
      if($(e.target).hasClass('tag-field')) {
        var last = $('div.tag:last', this);

        if(!last.length || $('input', last).val()) {
          last = $(tagTemplate.replace('{NAME}', target.data('name')));
          target.append(last);

          initTag(last);
        }

        $('input', last).focus();
      }
    });

    //INITIALIZE
    $('div.tag', target).each(function() {
      initTag($(this));
    });
  });

  /**
   * Multiple Input
   */
  $(window).on('multiple-input-init', function (e, target) {
    target = $(target);

    var name = target.attr('data-name');
    var schema = target.attr('data-schema');

    var placeholder = target.attr('data-placeholder');

    //INITITALIZERS
    var initInput = function (filter) {
      $('a.remove', filter).click(function () {
        filter.remove();
      });
    };

    //append meta template
    $('button.input-add', target).click(function () {
      //TEMPLATES
      var template =
        '<div class="field-row input-group mb-3">'
      +    '<input '
      +      'autocomplete = "off" '
      +      'class="form-control text-capitalize {SUGGESTION_LABEL}" '
      +      'name = "_' + schema + '_ids[]" '
      +      'placeholder = "Enter ' + schema+'" '
      +      'type = "text" value = "" '
      +    '/> '
      +    '<div class="input-group-append"> '
      +      '<a class="input-group-text text-danger remove" href="javascript:void(0)"> '
      +        '<i class="fas fa-times"></i> '
      +      '</a> '
      +    '</div> '
      +    '<input class="{SUGGESTION_VALUE}" name="'+ name + '" type="hidden" value="" /> '
      +    '<div class="input-suggestion d-none" '
      +      'data-do="suggestion-field" '
      +      'data-format="{{' + schema + '_title}}" '
      +      'data-target-label="{LABEL}" '
      +      'data-target-value="{VALUE}" '
      +      'data-url="../' + schema + '/search?q={QUERY}&render=false" '
      +      'data-value="' + schema + '_id"> '
      +    '</div> '
      +  '</div>';

      var total = $('.input-suggestion', target).length;

      template = template
        .replace('{SUGGESTION_LABEL}', 'suggestion-label-' + schema + '_' + total)
        .replace('{SUGGESTION_VALUE}', 'suggestion-value-' + schema + '_' + total)
        .replace('{LABEL}', 'input.suggestion-label-' + schema + '_' + total)
        .replace('{VALUE}', 'input.suggestion-value-' + schema + '_' + total)

      $(this).before(template);
      var item = $(this).prev();

      initInput(item);

      item.doon();
      return false;
    });
  });

  /**
   * Texts Field
   */
  $(window).on('textlist-field-init', function (e, target) {
      target = $(target);

      var name = target.attr('data-name');
      var placeholder = target.attr('data-placeholder');

      //TEMPLATES
      var template ='<div class="field-row input-group mb-3">'
          + '<div class="input-group-prepend">'
          + '<a class="input-group-text move-up" href="javascript:void(0)">'
          + '<i class="fas fa-arrow-up"></i></a></div><div class="input-group-prepend">'
          + '<a class="input-group-text move-down" href="javascript:void(0)">'
          + '<i class="fas fa-arrow-down"></i></a></div>'
          + '<input class="text-field form-control system-form-control" type="text" name="'
          + name + '[]" value="" /><div class="input-group-append">'
          + '<a class="input-group-text text-danger remove" '
          + 'href="javascript:void(0)">'
          + '<i class="fas fa-times"></i></a></div></div>';

      //INITITALIZERS
      var initTag = function (filter) {
          $('a.remove', filter).click(function () {
              filter.remove();
          });

          $('a.move-up', filter).click(function () {
              var prev = filter.prev();

              if (prev.length && prev.hasClass('field-row')) {
                  prev.before(filter);
              }
          });

          $('a.move-down', filter).click(function () {
              var next = filter.next();

              if (next.length && next.hasClass('field-row')) {
                  next.after(filter);
              }
          });
      };

      //append meta template
      $('a.field-add', target).click(function () {
          var key = $('div.field-row', target).length;
          $(this).before(template);
          var item = $(this).prev();

          if (placeholder) {
              $('input.text-field', item).attr('placeholder', placeholder);
          }

          initTag(item);

          return false;
      });

      //INITIALIZE
      $('div.field-row', target).each(function () {
          initTag($(this));
      });
  });

  /**
   * Textareas Field
   */
  $(window).on('textarealist-field-init', function (e, target) {
      target = $(target);

      var name = target.attr('data-name');
      var rows = target.attr('data-rows');
      var placeholder = target.attr('data-placeholder');

      //TEMPLATES
      var template ='<div class="field-row input-group mb-3">'
          + '<div class="input-group-prepend">'
          + '<a class="input-group-text move-up" href="javascript:void(0)">'
          + '<i class="fas fa-arrow-up"></i></a></div><div class="input-group-prepend">'
          + '<a class="input-group-text move-down" href="javascript:void(0)">'
          + '<i class="fas fa-arrow-down"></i></a></div>'
          + '<textarea class="text-field form-control system-form-control" name="'
          + name + '[]"></textarea><div class="input-group-append">'
          + '<a class="input-group-text text-danger remove" '
          + 'href="javascript:void(0)">'
          + '<i class="fas fa-times"></i></a></div></div>';

      //INITITALIZERS
      var initTag = function (filter) {
          $('a.remove', filter).click(function () {
              filter.remove();
          });

          $('a.move-up', filter).click(function () {
              var prev = filter.prev();

              if (prev.length && prev.hasClass('field-row')) {
                  prev.before(filter);
              }
          });

          $('a.move-down', filter).click(function () {
              var next = filter.next();

              if (next.length && next.hasClass('field-row')) {
                  next.after(filter);
              }
          });
      };

      //append meta template
      $('a.field-add', target).click(function () {
          var key = $('div.field-row', target).length;
          $(this).before(template);
          var item = $(this).prev();

          if (placeholder) {
              $('textarea.text-field', item).attr('placeholder', placeholder);
          }

          if (rows) {
              $('textarea.text-field', item).attr('rows', rows);
          }

          initTag(item);

          return false;
      });

      //INITIALIZE
      $('div.field-row', target).each(function () {
          initTag($(this));
      });
  });

  /**
   * WYSIWYGs Field
   */
  $(window).on('wysiwyglist-field-init', function (e, target) {
      target = $(target);

      var name = target.attr('data-name');
      var rows = target.attr('data-rows');
      var placeholder = target.attr('data-placeholder');

      //TEMPLATES
      var template = '<div class="field-row mb-3">'
          + '<div class="btn-group mb-2"><a class="btn btn-danger remove" '
          + 'href="javascript:void(0)">'
          + '<i class="fas fa-times"></i></a>'
          + '<a class="btn move-up" href="javascript:void(0)">'
          + '<i class="fas fa-arrow-up"></i></a>'
          + '<a class="btn move-down" href="javascript:void(0)">'
          + '<i class="fas fa-arrow-down"></i></a></div>'
          + '<textarea data-do="wysiwyg" class="text-field form-control system-form-control" name="'
          + name + '[]"></textarea></div>';

      //INITITALIZERS
      var initTag = function (filter) {
          $('a.remove', filter).click(function () {
            filter.remove();
          });

          $('a.move-up', filter).click(function () {
              var prev = filter.prev();

              if (prev.length && prev.hasClass('field-row')) {
                  var value1 = $('textarea', filter).data('editor').getValue();
                  var value2 = $('textarea', prev).data('editor').getValue();

                  $('textarea', prev).data('editor').setValue(value1);
                  $('textarea', filter).data('editor').setValue(value2);
              }
          });

          $('a.move-down', filter).click(function () {
              var next = filter.next();

              if (next.length && next.hasClass('field-row')) {
                  var value1 = $('textarea', filter).data('editor').getValue();
                  var value2 = $('textarea', next).data('editor').getValue();

                  $('textarea', next).data('editor').setValue(value1);
                  $('textarea', filter).data('editor').setValue(value2);
              }
          });
      };

      //append meta template
      $('a.field-add', target).click(function () {
          var key = $('div.field-row', target).length;
          $(this).before(template);
          var item = $(this).prev();

          if (placeholder) {
              $('textarea.text-field', item).attr('placeholder', placeholder);
          }

          if (rows) {
              $('textarea.text-field', item).attr('rows', rows);
          }

          initTag(item);

          item.doon();

          return false;
      });

      //INITIALIZE
      $('div.field-row', target).each(function () {
          initTag($(this));
      });
  });

  /**
   * Meta Field
   */
  $(window).on('meta-field-init', function(e, target) {
    target = $(target);

    var placeholderKey = target.data('placeholder-key') || 'Key';
    var placeholderValue = target.data('placeholder-value') || 'Value';

    //TEMPLATES
    var template = `<div class="field-row input-group mb-3">
      <input
        class="meta-input key form-control"
        type="text"
        placeholder="${placeholderKey}"
        required
      />
      <textarea
        class="meta-input value form-control"
        rows="1"
        placeholder="${placeholderValue}"
        required
      ></textarea>
      <input type="hidden" name="" value=""/>
      <div class="input-group-append">
        <a class="input-group-text text-danger remove" href="javascript:void(0)">
          <i class="fas fa-times"></i>
        </a>
      </div>
    </div>`;

    if (target.data('field') === 'input') {
      template = `<div class="field-row input-group mb-3">
        <input
          class="meta-input key form-control"
          type="text"
          placeholder="${placeholderKey}"
          required
        />
        <input
          class="meta-input value form-control"
          placeholder="${placeholderValue}"
          required
        />
        <input type="hidden" name="" value=""/>
        <div class="input-group-append">
          <a class="input-group-text text-danger remove" href="javascript:void(0)">
            <i class="fas fa-times"></i>
          </a>
        </div>
      </div>`;
    }

    //INITITALIZERS
    var initTag = function(filter) {
      var hidden = filter.find('input[type="hidden"]')

      $('a.remove', filter).click(function() {
        filter.remove();
      });

      $('.meta-input.key', filter).blur(function() {
        //if no value
        if(!$(this).val() || !$(this).val().length) {
          hidden.attr('name', '');
          return;
        }

        hidden.attr('name', $(target).data('name') + '[' + $(this).val() +']');
      });

      $('.meta-input.value', filter).blur(function() {
        //if no value
        if(!$(this).val() || !$(this).val().length) {
          hidden.attr('value', '');
          return;
        }

        hidden.attr('value', $(this).val());
      });
    };

    //append meta template
    $('a.field-add', target).click(function() {
      var key = $('div.field-row', target).length;
      $(this).before(template);
      var item = $(this).prev();

      $('.meta-input.key', item).attr('placeholder', placeholderKey);
      $('.meta-input.value', item).attr('placeholder', placeholderValue);

      initTag(item);

      return false;
    });

    //INITIALIZE
    $('div.field-row', target).each(function() {
      initTag($(this));
    });
  });

  /**
   * Table Field
   */
  $(window).on('table-field-init', function(e, target) {
    target = $(target);

    //attributes
    var name = target.data('name');
    var columns = target.data('columns') || '';
    columns = columns.split('|');

    //TEMPLATES
    var template ='<tr><td><a class="btn btn-danger '
      + 'remove" href="javascript:void(0)"><i class="fas fa-times">'
      + '</i></a></td></tr>';

    var templateRow = '<td><input class="input-column '
      + 'form-control" type="text" /></td>';

    //INITITALIZERS
    var init = function(row) {
      $('a.remove', row).click(function() {
        row.remove();

        $('tbody tr', target).each(function(index) {
          $(this)
            .data('index', index)
            .attr('data-index', index);

          $('input', this).attr(
            'name',
            name + '[' + index + '][]'
          );
        });
      });
    };

    //append meta template
    $('a.row-add', target).click(function() {
      var index = $('tbody tr', target).length;
      var row = $(template)
        .data('index', index)
        .attr('data-index', index);

      columns.forEach(function(label) {
        var column = $(templateRow);

        $('input', column)
          .attr(
            'name',
            name + '[' + index + '][]'
          )
          .attr(
            'placeholder',
            label
          );

        row.append(column);
      });

      $('tbody', target).append(row);

      init(row);

      return false;
    });

    //INITIALIZE
    $('tbody tr', target).each(function() {
      init($(this));
    });
  });

  /**
   * Image Field
   * HTML config for single images
   * data-do="image-field"
   * data-name="profile_image"
   * data-width="200"
   * data-height="200"
   * data-alt="Change this Photo"
   *
   * HTML config for multiple images
   * data-do="image-field"
   * data-name="profile_image"
   * data-width="200"
   * data-height="200"
   * data-multiple="1"
   * data-alt="Change this Photo"
   *
   * HTML config for single images / multiple sizes
   * data-do="image-field"
   * data-name="profile_image"
   * data-width="0|200|100"
   * data-height="0|200|100"
   * data-label="original|small|large"
   * data-display="large|small"
   * data-alt="Change this Photo"
   *
   * HTML config for multiple images / multiple sizes
   * data-do="image-field"
   * data-name="profile_image"
   * data-width="0|200|100"
   * data-height="0|200|100"
   * data-label="original|small|large"
   * data-display="large"
   * data-multiple="1"
   * data-alt="Change this Photo"
   */
  $(window).on('image-field-init', function(e, target) {
    $.require('components/yarn-cropper/cropper.min.js', function() {
      //current
      var container = $(target);

      //get meta data

      //for hidden fields
      var name = container.attr('data-name');

      //for file field
      var multiple = container.attr('data-multiple');

      //for image fields
      var alt = container.attr('data-alt');
      var classes = container.attr('data-class');

      var width = parseInt(container.attr('data-width') || 0);
      var height = parseInt(container.attr('data-height') || 0);

      var widths = container.attr('data-width') || '0';
      var heights = container.attr('data-height') || '0';
      var labels = container.attr('data-label') || '';
      var displays = container.attr('data-display') || '';

      widths = widths.split('|');
      heights = heights.split('|');
      labels = labels.split('|');
      displays = displays.split('|');

      if (!displays[0].length) {
        displays = false;
      }

      if (widths.length !== heights.length) {
        throw 'Invalid Attributes. Width and Height counts are not the same.';
      }

      //make an image config
      var config = [];
      widths.forEach(function(width, i) {
        var label = labels[i] || '' + i;

        if (widths.length === 1 &&
          (
            typeof labels[i] === 'undefined' ||
            !labels[i].length
          )
        ) {
          label = false;
        }

        config.push({
          label: label,
          display: !displays || displays.indexOf(label) !== -1,
          width: parseInt(widths[i]),
          height: parseInt(heights[i])
        });
      });

      //make a file
      var file = $('<input type="file" />')
        .attr('accept', 'image/png,image/jpg,image/jpeg,image/gif')
        .addClass('d-none')
        .appendTo(target);

      if (multiple) {
        file.attr('multiple', 'multiple');
      }

      //listen for clicks
      container.click(function(e) {
        if (e.target !== file[0]) {
          file.click();
        }
      });

      var generate = function(file, name, width, height, display) {
        var image = new Image();

        //listen for when the src is set
        image.onload = function() {
          //if no dimensions, get the natural dimensions
          width = width || this.width;
          height = height || this.height;

          //so we can crop
          $.cropper(file, width, height, function(data) {
            //create img and input tags
            $('<input type="hidden" />')
              .attr('name', name)
              .val(data)
              .appendTo(target);

            if (display) {
              $('<img />')
                .addClass(classes)
                .attr('alt', alt)
                .attr('src', data)
                .appendTo(target);
            }
          });
        };

        image.src = URL.createObjectURL(file);
      };

      file.change(function() {
        if (!this.files || !this.files[0]) {
          return;
        }

        //remove all
        $('input[type="hidden"], img', target).remove();

        for (var i = 0; i < this.files.length; i++) {
          config.forEach(function(file, meta) {
            //expecting
            //  meta[label]
            //  meta[display]
            //  meta[width]
            //  meta[height]

            //make a path
            var path = '';

            if (meta.label !== false) {
              path = '[' + meta.label + ']';
            }

            if (multiple) {
              path = '[' + i + ']' + path;
            }

            path = name + path;

            generate(
              file,
              path,
              meta.width,
              meta.height,
              meta.display
            );
          }.bind(null, this.files[i]));
        }

        // if auto submit
        if (container.attr('data-submit') === 'true') {
          setTimeout(function() {
            container.closest('form').submit();
          }, 500);
        }
      });
    });
  });

  /**
   * File Field
   * HTML config for single files
   * data-do="file-field"
   * data-name="post_files"
   *
   * HTML config for multiple files
   * data-do="file-field"
   * data-name="post_files"
   * data-multiple="1"
   */
  $(window).on('file-field-init', function (e, target) {
    var onAcquire = function (extensions) {
      var template = {
        previewFile:
          '<div class="file-field-preview-container">'
          + '<i class="fas fa-file text-info"></i>'
          + '<span class="file-field-extension">{EXTENSION}</span>'
          + '</div>',
        previewImage:
          '<div class="file-field-preview-container">'
          + '<img src="{DATA}" width="50" />'
          + '</div>',
        actions:
          '<td class="file-field-actions">'
            + '<a class="text-info file-field-move-up" href="javascript:void(0)">'
              + '<i class="fas fa-arrow-up"></i>'
            + '</a>'
            + '&nbsp;&nbsp;&nbsp;'
            + '<a class="text-info file-field-move-down" href="javascript:void(0)">'
              + '<i class="fas fa-arrow-down"></i>'
            + '</a>'
            + '&nbsp;&nbsp;&nbsp;'
            + '<a class="btn btn-danger file-field-remove" href="javascript:void(0)">'
              + '<i class="fas fa-times"></i>'
            + '</a>'
          + '</td>',
        row:
          '<tr class="file-field-item">'
          + '<td class="file-field-preview">{PREVIEW}</td>'
          + '<td class="file-field-name">'
            + '{FILENAME}'
            + '<input class="system-form-control system-file-input form-control" name="{NAME}" type="hidden" value="{DATA}" placeholder="eg. http://website.com/image.jpg" required />'
          + '</td>'
          + '{ACTIONS}'
          + '</tr>'
      };

      //current
      var container = $(target);
      var body = $('tbody', container);
      var foot = $('tfoot', container);

      var noresults = $('tr.file-field-none', body);

      //get meta data

      //for hidden fields
      var name = container.attr('data-name');

      //for file field
      var multiple = container.attr('data-multiple');

      if (
        typeof container.attr('data-img-only') &&
        container.attr('data-img-only') !== false
      ) {
        var imgOnly = container.attr('data-img-only');
      }

      var accept = container.attr('data-accept') || false;
      var classes = container.attr('data-class');
      var width = parseInt(container.attr('data-width') || 0);
      var height = parseInt(container.attr('data-height') || 0);

      //make a file
      var file = $('<input type="file" />').hide();

      if (multiple) {
        file.attr('multiple', 'multiple');
      }

      if (accept) {
        file.attr('accept', accept);
      }

      foot.append(file);

      $('button.file-field-upload', container).click(function (e) {
        file.click();
      });

      $('button.file-field-link', container).click(function (e) {
        var path = name + '[]';
        var actions = template.actions;

        if (!multiple) {
          $('tr', body).each(function () {
            if ($(this).hasClass('file-field-none')) {
              return;
            }

            $(this).remove();
          });

          actions = '';
          path = name;
        }

        noresults.hide();

        if (imgOnly) {
          var preview = template.previewFile.replace('{EXTENSION}', 'Not a Valid Image');
        } else {
          var preview = template.previewFile.replace('{EXTENSION}', 'Invalid File');
        }

        var row = $(
          template.row
            .replace('{PREVIEW}', preview)
            .replace('{FILENAME}', '')
            .replace('{NAME}', path)
            .replace('{DATA}', '')
            .replace('{ACTIONS}', actions)
        ).appendTo(body);

        listen(row, body);

        $('input.system-file-input', row)
          .attr('type', 'url')
          .blur(function () {
            var url = $(this).val();
            if (imgOnly) {
              var extension = 'Not a Valid Image';
            } else {
              var extension = 'Invalid File';
            }
            if (url.indexOf('.') !== -1) {
              extension = url.split('.').pop();
            }

            preview = template.previewFile.replace('{EXTENSION}', extension);

            //if it's an image
            if (
              [
                'jpg',
                'jpeg',
                'pjpeg',
                'svg',
                'png',
                'ico',
                'gif'
              ].indexOf(extension) !== -1
            ) {
              preview = template.previewImage.replace('{DATA}', url);
            } else if (imgOnly) {
              preview = template.previewFile.replace('{EXTENSION}', 'Not a Valid Image');
            }

            $('td.file-field-preview', row).html(preview);
          });
      });

      var listen = function (row, body) {
        $('a.file-field-remove', row).click(function () {
          row.remove();
          if ($('tr', body).length < 2) {
            noresults.show();
          }
        });

        $('a.file-field-move-up', row).click(function () {
          var prev = row.prev();

          if (prev.length && !prev.hasClass('file-field-none')) {
            prev.before(row);
          }
        });

        $('a.file-field-move-down', row).click(function () {
          var next = row.next();

          if (next.length) {
            next.after(row);
          }
        });
      };

      var generate = function (file, name, width, height, row) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          var extension = file.name.split('.').pop();

          if (file.name.indexOf('.') === -1) {
            extension = 'unknown';
          }

          if (imgOnly) {
          var preview = template.previewFile.replace('{EXTENSION}', 'Not a Valid Image');
          } else {
          var preview = template.previewFile.replace('{EXTENSION}', extension);
          }

          if (file.type.indexOf('image/') === 0) {
            preview = template.previewImage.replace('{DATA}', reader.result);
          }

          noresults.hide();

          row = $(
            row
              .replace('{NAME}', name)
              .replace('{DATA}', reader.result)
              .replace('{PREVIEW}', preview)
              .replace('{FILENAME}', file.name)
          ).appendTo(body);

          listen(row, body);

          if (file.type.indexOf('image/') === 0 && (width !== 0 || height !== 0)) {
            //so we can crop
            $.cropper(file, width, height, function (data) {
              $('div.file-field-preview-container img', row).attr('src', data);
              $('input[type="hidden"]', row).val(data);
            });
          }

          //add mime type
          if (typeof extensions[file.type] !== 'string') {
            extensions[file.type] = extension;
          }
        };
      };

      file.change(function () {
        if (!this.files || !this.files[0]) {
          return;
        }

        if (!multiple) {
          $('tr', body).each(function () {
            if ($(this).hasClass('file-field-none')) {
              return;
            }

            $(this).remove();
          })
        }

        for (var row, path = '', i = 0; i < this.files.length; i++, path = '') {
          row = template.row.replace('{ACTIONS}', '');
          if (multiple) {
            path = '[]' + path;
            row = template.row.replace('{ACTIONS}', template.actions);
          }

          path = name + path;
          generate(this.files[i], path, width, height, row);
        }
      });

      $('tr', body).each(function () {
        if ($(this).hasClass('file-field-none')) {
          return;
        }

        listen($(this), body)
      });
    };

    $.require([
      'cdn/json/extensions.json',
      'components/yarn-cropper/cropper.min.js'
    ], onAcquire);
  });

  /**
   * Direct CDN Upload
   */
  $(window).on('wysiwyg-editor-init', function(e, target) {
    var advanced = '<div class="wysiwyg-toolbar position-relative" style="display: none;">'
      + '<div class="btn-group">'
        + '<a class="btn btn-default" data-wysihtml-command="bold" title="CTRL+B"><i class="fas fa-bold"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="italic" title="CTRL+I"><i class="fas fa-italic"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="underline" title="CTRL+U"><i class="fas fa-underline"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="strike" title="CTRL+U"><i class="fas fa-strikethrough"></i></a>'
      + '</div> '
      + '<div class="btn-group">'
        + '<a class="btn btn-info" data-wysihtml-command="createLink"><i class="fas fa-external-link-alt"></i></a>'
        + '<a class="btn btn-danger" data-wysihtml-command="removeLink"><i class="fas fa-ban"></i></a>'
      + '</div> '
      + '<a class="btn btn-purple" data-wysihtml-command="insertImage"><i class="fas fa-image"></i></a> '
      + '<div class="dropdown d-inline-block">'
        + '<button aria-haspopup="true" aria-expanded="false" class="btn btn-grey" data-toggle="dropdown" type="button">Headers <i class="fas fa-chevron-down"></i></button>'
        + '<div class="dropdown-menu">'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-blank-value="true">Normal</a>'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h1">Header 1</a>'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h2">Header 2</a>'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h3">Header 3</a>'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h4">Header 4</a>'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h5">Header 5</a>'
          + '<a class="dropdown-item" data-wysihtml-command="formatBlock" data-wysihtml-command-value="h6">Header 6</a>'
        + '</div>'
      + '</div> '
      + '<div class="dropdown d-inline-block">'
        + '<button aria-haspopup="true" aria-expanded="false" class="btn btn-pink" data-toggle="dropdown" type="button">Colors <i class="fas fa-chevron-down"></i></button>'
        + '<div class="dropdown-menu">'
          + '<a class="dropdown-item text-danger" data-wysihtml-command="foreColor" data-wysihtml-command-value="red"><i class="fas fa-square-full"></i> Red</a>'
          + '<a class="dropdown-item text-success" data-wysihtml-command="foreColor" data-wysihtml-command-value="green"><i class="fas fa-square-full"></i> Green</a>'
          + '<a class="dropdown-item text-primary" data-wysihtml-command="foreColor" data-wysihtml-command-value="blue"><i class="fas fa-square-full"></i> Blue</a>'
          + '<a class="dropdown-item text-purple" data-wysihtml-command="foreColor" data-wysihtml-command-value="purple"><i class="fas fa-square-full"></i> Purple</a>'
          + '<a class="dropdown-item text-warning" data-wysihtml-command="foreColor" data-wysihtml-command-value="orange"><i class="fas fa-square-full"></i> Orange</a>'
          + '<a class="dropdown-item text-yellow" data-wysihtml-command="foreColor" data-wysihtml-command-value="yellow"><i class="fas fa-square-full"></i> Yellow</a>'
          + '<a class="dropdown-item text-pink" data-wysihtml-command="foreColor" data-wysihtml-command-value="pink"><i class="fas fa-square-full"></i> Pink</a>'
          + '<a class="dropdown-item text-white" data-wysihtml-command="foreColor" data-wysihtml-command-value="white"><i class="fas fa-square-full"></i> White</a>'
          + '<a class="dropdown-item text-inverse" data-wysihtml-command="foreColor" data-wysihtml-command-value="black"><i class="fas fa-square-full"></i> Black</a>'
        + '</div>'
      + '</div> '
      + '<div class="btn-group">'
        + '<a class="btn btn-default" data-wysihtml-command="insertUnorderedList"><i class="fas fa-list-ul"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="insertOrderedList"><i class="fas fa-list-ol"></i></a>'
      + '</div> '
      + '<div class="btn-group">'
        + '<a class="btn btn-light" data-wysihtml-command="undo"><i class="fas fa-undo"></i></a><a class="btn btn-light" data-wysihtml-command="redo"><i class="fas fa-redo"></i></a>'
      + '</div> '
      + '<a class="btn btn-light" data-wysihtml-command="insertSpeech"><i class="fas fa-comments"></i></a> '
      + '<a class="btn btn-inverse" data-wysihtml-action="change_view"><i class="fas fa-code"></i></a> '
      + '<div class="wysiwyg-dialog" data-wysihtml-dialog="createLink" style="display: none;">'
        + '<input class="form-control" data-wysihtml-dialog-field="href" placeholder="http://" />'
        + '<input class="form-control mb-2" data-wysihtml-dialog-field="title" placeholder="Title" />'
        + '<a class="btn btn-primary" data-wysihtml-dialog-action="save" href="javascript:void(0)">OK</a>'
        + '<a class="btn btn-danger" data-wysihtml-dialog-action="cancel" href="javascript:void(0)">Cancel</a>'
      + '</div>'
      + '<div class="wysiwyg-dialog" data-wysihtml-dialog="insertImage" style="display: none;">'
        + '<input class="form-control" data-wysihtml-dialog-field="src" placeholder="http://">'
        + '<input class="form-control" data-wysihtml-dialog-field="alt" placeholder="alt">'
        + '<select class="form-control mb-2" data-wysihtml-dialog-field="className">'
          + '<option value="">None</option>'
          + '<option value="float-left">Left</option>'
          + '<option value="float-right">Right</option>'
        + '</select>'
        + '<a class="btn btn-primary" data-wysihtml-dialog-action="save" href="javascript:void(0)">OK</a>'
        + '<a class="btn btn-danger" data-wysihtml-dialog-action="cancel" href="javascript:void(0)">Cancel</a>'
      + '</div>'
    + '</div>';

    var basic = '<div class="wysiwyg-toolbar position-relative" style="display: none;">'
      + '<div class="btn-group">'
        + '<a class="btn btn-default" data-wysihtml-command="bold" title="CTRL+B"><i class="fas fa-bold"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="italic" title="CTRL+I"><i class="fas fa-italic"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="underline" title="CTRL+U"><i class="fas fa-underline"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="strike" title="CTRL+U"><i class="fas fa-strikethrough"></i></a>'
      + '</div> '
      + '<div class="btn-group">'
        + '<a class="btn btn-default" data-wysihtml-command="insertUnorderedList"><i class="fas fa-list-ul"></i></a>'
        + '<a class="btn btn-default" data-wysihtml-command="insertOrderedList"><i class="fas fa-list-ol"></i></a>'
      + '</div> '
      + '<a class="btn btn-light" data-wysihtml-command="insertSpeech"><i class="fas fa-comments"></i></a> '
    + '</div>';

    $.require.load(
      [
        'components/wysihtml/dist/minified/wysihtml.min.js',
        'components/wysihtml/dist/minified/wysihtml.all-commands.min.js',
        'components/wysihtml/dist/minified/wysihtml.table_editing.min.js',
        'components/wysihtml/dist/minified/wysihtml.toolbar.min.js',
        'components/wysihtml/parser_rules/advanced_unwrap.js'
      ],
      function() {
        var template = basic;
        var mode = $(target).attr('data-mode');
        if (mode === 'advanced') {
          template = advanced;
        }

        var toolbar = $(template);

        $(target).before(toolbar);


        var e = new wysihtml.Editor(target, {
          toolbar:    toolbar[0],
          parserRules:  wysihtmlParserRules
        });
      }
    );
  });

  /**
   * Code Editor - Ace
   */
  $(window).on('code-editor-init', function(e, target) {
    $.require.load('components/ace-editor-builds/src/ace.js', function() {
      target = $(target);

      var mode = target.attr('data-mode');
      var width = target.attr('data-height') || 0;
      var height = target.attr('data-height') || 500;

      var container = $('<section>')
        .addClass('form-control')
        .addClass('code-editor-container');

      if(width) {
        container.width(width);
      }

      if(height) {
        container.height(height);
      }

      target.after(container);

      var editor = ace.edit(container[0]);

      if(mode) {
        // set mode
        editor.getSession().setMode('ace/mode/' + mode);
      }

      // set editor default value
      editor.setValue(target.val());

      target.closest('form').submit(function() {
        target.val(editor.getValue());
      });

      target.hide();
    });
  });

  /**
   * Markdown Editor -
   */
  $(window).on('markdown-editor-init', function(e, target) {
    $.require.load(
      [
        'components/bootstrap-markdown-editor-4/dist/css/bootstrap-markdown-editor.min.css',
        'components/ace-editor-builds/src/ace.js',
        'components/bootstrap-markdown-editor-4/dist/js/bootstrap-markdown-editor.min.js'
      ],
      function() {
        target = $(target);

        var width = target.attr('data-height') || 0;
        var height = target.attr('data-height') || 500;

        if(width) {
          target.width(width);
        }

        if(height) {
          target.height(height);
        }

        target.markdownEditor();
      }
    );
  });

  /**
   * Generate Slug
   */
  $(window).on('slugger-init', function(e, target) {
    var source = $(target).attr('data-source');

    if(!source || !source.length) {
      return;
    }

    var upper = $(target).attr('data-upper');
    var space = $(target).attr('data-space') || '-';

    $(source).keyup(function() {
      var slug = $(this)
        .val()
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
        .replace(/\-\-+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');

      if (upper) {
        slug = slug.replace(
          /(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
          function(s) {
            return s.toUpperCase();
          }
        );
      }

      slug = slug.replace(/\-/g, space);

      $(target).val(slug).trigger('change');
    });
  });

  /**
   * Mask
   */
  $(window).on('mask-field-init', function(e, target) {
    $.require(
      'components/inputmask/dist/jquery.inputmask.min.js',
      function() {
        var format = $(target).attr('data-format');
        $(target).inputmask(format);
      }
    );
  });

  /**
   * Phone Field
   */
  $(window).on('phone-field-init', function(e, target) {
    $.require(
      [
        'components/intl-tel-input/build/css/intlTelInput.min.css',
        'components/intl-tel-input/build/js/intlTelInput-jquery.min.js'
      ],
      function() {
        var format = $(target).attr('data-format');
        $(target).intlTelInput();
      }
    );
  });

  /**
   * Password
   */
  $(window).on('password-field-init', function(e, target) {
    var strong = new RegExp(
      '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})'
    );
    var medium = new RegExp(
      '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))'
      + '|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))'
    );

    var input = $('input', target);
    var toggle = $('.toggle', target);
    var icon = $('.fas', toggle);

    input.on('keydown', function() {
      $(target)
        .removeClass('weak')
        .removeClass('medium')
        .removeClass('strong');

      setTimeout(function() {
        var value = input.val();
        if (!value.length) {
          return;
        }

        if (strong.test(value)) {
          $(target).addClass('strong');
        } else if (medium.test(value)) {
          $(target).addClass('medium');
        } else {
          $(target).addClass('weak');
        }
      });
    });

    toggle.click(function() {
      if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
      } else {
        input.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
      }
    });
  });

  /**
   * Mask
   */
  $(window).on('knob-field-init', function(e, target) {
    $.require(
      'components/jquery-knob/dist/jquery.knob.min.js',
      function() {
        $(target).knob();
      }
    );
  });

  /**
   * Select
   */
  $(window).on('select-field-init', function(e, target) {
    $.require(
      [
        'components/select2/dist/css/select2.min.css',
        'components/select2/dist/js/select2.full.min.js'
      ],
      function() {
        const value = $(target).data('value');
        $('option', target).each(function() {
          if ($(this).val() === value) {
            $(this).attr('selected', 'selected');
            $(this).prop('selected', true);
          }
        });

        if ($(target).data('use-select2')) {
          $(target).select2();
        }
      }
    );
  });

  /**
   * Countries Dropdown
   */
  $(window).on('country-dropdown-init', function(e, target) {
    $.require(
      [
        'cdn/json/countries.json',
        'components/select2/dist/css/select2.min.css',
        'components/select2/dist/js/select2.full.min.js'
      ],
      function(countries) {
        const value = $(target).data('value');

        $('<option>')
          .attr('value', '')
          .text('Choose a Country')
          .appendTo(target);

        //populate
        countries.forEach(function(country) {
          const option = $('<option>')
            .attr('value', country.abbreviation)
            .text(country.country)
            .appendTo(target);

          if (country.abbreviation === value) {
            option.attr('selected', 'selected');
            option.prop('selected', true);
          }
        });

        if ($(target).data('use-select2') !== 'false'
          && $(target).data('use-select2') !== false
        ) {
          $(target).select2();
        }
      }
    );
  });

  /**
   * Currency Dropdown
   */
  $(window).on('currency-dropdown-init', function(e, target) {
    $.require(
      [
        'cdn/json/currencies.json',
        'components/select2/dist/css/select2.min.css',
        'components/select2/dist/js/select2.full.min.js'
      ],
      function(currencies) {
        const value = $(target).data('value');

        $('<option>')
          .attr('value', '')
          .text('Choose a Currency')
          .appendTo(target);

        //populate
        Object.keys(currencies).forEach(function(abbr) {
          const name = currencies[abbr].name
          const symbol = currencies[abbr].symbol_native

          const option = $('<option>')
            .attr('value', abbr)
            .text(`${name} ( ${symbol} )`)
            .appendTo(target);

          if (abbr === value) {
            option.attr('selected', 'selected');
            option.prop('selected', true);
          }
        });

        if ($(target).data('use-select2') !== 'false'
          && $(target).data('use-select2') !== false
        ) {
          $(target).select2();
        }
      }
    );
  });

  /**
   * Multirange
   */
  $(window).on('multirange-field-init', function(e, target) {
    var onAcquire = function() {
      target = $(target);

      var params = {};
      // loop all attributes
      $.each(target[0].attributes,function(index, attr) {
        // skip if data do and on
        if (attr.name == 'data-do' || attr.name == 'data-on') {
          return true;
        }

        // look for attr with data- as prefix
        if (attr.name.search(/data-/g) > -1) {
          // get parameter name
          var key = attr.name
            .replace('data-', '')
            .replace('-', '_');

          // prepare parameter
          params[key] = attr.value;

          // if value is boolean
          if(attr.value == 'true') {
            params[key] = attr.value == 'true' ? true : false;
          }
        }
      });

      target.ionRangeSlider(params);
    };

    $.require(
      [
        'components/ion-rangeSlider/css/ion.rangeSlider.css',
        'components/ion-rangeSlider/css/ion.rangeSlider.skinFlat.css',
        'components/ion-rangeSlider/js/ion.rangeSlider.min.js'
      ],
      onAcquire
    );
  });

  /**
   * Date Field
   */
  $(window).on('date-field-init', function(e, target) {
    $.require(
      [
        'components/flatpickr/dist/flatpickr.min.css',
        'components/flatpickr/dist/flatpickr.min.js'
      ],
      function() {
        $(target).flatpickr({
          dateFormat: "Y-m-d",
        });
      }
    );
  });

  /**
   * Time Field
   */
  $(window).on('time-field-init', function(e, target) {
    $.require(
      [
        'components/flatpickr/dist/flatpickr.min.css',
        'components/flatpickr/dist/flatpickr.min.js'
      ],
      function() {
        $(target).flatpickr({
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
        });
      }
    );
  });

  /**
   * DateTime Field
   */
  $(window).on('datetime-field-init', function(e, target) {
    $.require(
      [
        'components/flatpickr/dist/flatpickr.min.css',
        'components/flatpickr/dist/flatpickr.min.js'
      ],
      function() {
        $(target).flatpickr({
          enableTime: true,
          dateFormat: "Y-m-d H:i",
        });
      }
    );
  });

  /**
   * Date Range Field
   */
  $(window).on('date-range-field-init', function(e, target) {
    $.require(
      [
        'components/flatpickr/dist/flatpickr.min.css',
        'components/flatpickr/dist/flatpickr.min.js'
      ],
      function() {
        $(target).flatpickr({
          mode: "range",
          dateFormat: "Y-m-d",
        });
      }
    );
  });

  /**
   * DateTime Range Field
   */
  $(window).on('datetime-range-field-init', function(e, target) {
    $.require(
      [
        'components/flatpickr/dist/flatpickr.min.css',
        'components/flatpickr/dist/flatpickr.min.js'
      ],
      function() {
        $(target).flatpickr({
          mode: "range",
          enableTime: true,
          dateFormat: "Y-m-d H:i",
        });
      }
    );
  });

  /**
   * Datetime range splitter
   */
  $(window).on('datetime-range-splitter-init', function(e, target) {
    const display = $('input.datetime-display', target);
    const start = $('input.datetime-start', target);
    const end = $('input.datetime-end', target);

    function updateDates() {
      const value = display.val();
      const range = value.split(' to ');
      if (range.length === 1) {
        range.push(range[0]);
      }

      if (range[0].trim().length) {
        start.val(range[0].trim() + ':00');
      } else {
        start.val('');
      }

      if (range[1].trim().length) {
        end.val(range[1].trim() + ':00');
      } else {
        end.val('');
      }

      start.trigger('change');
      end.trigger('change');
    }

    display.on('change', updateDates).on('blur', updateDates)
  });

  /**
   * Icon field
   */
  $(window).on('icon-field-init', function(e, target) {
    $.require('cdn/json/icons.json', function(icons) {
      target = $(target);

      var targetLevel = parseInt(target.attr('data-target-parent')) || 0;

      var suggestion = $('<div>')
        .addClass('input-suggestion')
        .addClass('icon-field')
        .hide();

      var parent = target;
      for(var i = 0; i < targetLevel; i++) {
        parent = parent.parent();
      }

      parent.after(suggestion);

      target.click(function() {
        suggestion.show();
      })
      .blur(function() {
        setTimeout(function() {
          suggestion.hide();
        }, 100);
      });

      icons.forEach(function(icon) {
        $('<i>')
          .addClass(icon)
          .addClass('fa-fw')
          .appendTo(suggestion)
          .click(function() {
            var input = target.parent().find('input').eq(0);
            input.val(this.className.replace(' fa-fw', ''));

            var preview = target.parent().find('i').eq(0);
            if(!preview.parent().hasClass('icon-suggestion')) {
              preview[0].className = this.className;
            }

            suggestion.hide();
            target.focus();
          });
      });

      $('i', target.attr('data-target'));
    });
  });

  /**
   * Max Char Field
   */
  $(window).on('max-char-field-init', function(e, target) {
    target = $(target);
    const max = target.attr('maxlength');
    const count = target.val().length;
    const counter = $('<div>')
      .css('position', 'absolute')
      .css('right', '16px')
      .text(`${count}/${max}`);

    target.after(counter);

    target.on('keyup', function() {
      setTimeout(function() {
        const count = target.val().length;
        counter.text(`${count}/${max}`);
      });
    });
  });

  /**
   * Copy Field
   */
  $(window).on('copy-field-init', function(e, target) {
    target = $(target);
    const source = $(target.data('source'));
    source.on('change', function(e) {
      target.val(source.val());
    });
  });

  /**
   * Object Range Change
   */
  $(window).on('object-range-change', function(e, target) {
    var target = $(target);

    var form = $('<form>')
      .attr('method', 'get');

    //if relation exists
    if (typeof target.val() !== 'undefined' && target.val() !== '') {
      $('<input>')
        .attr('type', 'hidden')
        .attr('name', 'range')
        .attr('value', target.val())
        .appendTo(form);
    }

    form.hide().appendTo(document.body).submit();
  });

  /**
   * Fieldset Init
   */
  $(window).on('fieldset-init', function (e, target) {
    var target = $(target);
    //name of the field
    var name = target.data('name');
    //keyword of fieldset
    var fieldset = target.data('fieldset');
    //whether to show the add button
    var multiple = target.data('multiple');
    //get uuid
    var uuid = target.data('uuid') || '';
    //label name
    var label = target.data('label');
    //get the template
    var template = target.data('template');

    if (template) {
      template = $(template).html();
    } else {
      template = target.children('.template-fieldset-row')
        .remove()
        .html();
    }

    //INITITALIZERS
    var init = function (row) {
      row.find('a.fieldset-remove').click(function () {
        if ($(this).parents('[data-do=fieldset]')[0] !== target[0]) {
          return;
        }
        //we only need to change the
        //elements after the one removed
        var rows = row.nextAll('.fieldset-row');

        var index = $(row).index() || 0;

        // Now remove the target
        row.remove();

        rows.each(function () {
          //update the label, it's easy! :D
          var labelTemplate = $(this).parent().attr('data-label');
          var rows = $(this)
            .parents('.fieldset-row[data-multiple]')
            .get()
            .reverse();

          rows.forEach(function (row, i) {
            labelTemplate = labelTemplate.replace(
              new RegExp('{INDEX_' + i + '}', 'g'),
              $(row).index() + 1
            );
          });

          labelTemplate = labelTemplate.replace(
            new RegExp('{INDEX_' + rows.length + '}', 'g'),
            $(this).index() + 1
          );

          $(this)
            .children('div.box-head')
            .find('h3.fieldset-label')
            .html(labelTemplate);

          //next update the fields, it's hard... :(
          // Get all the inputs
          var fields = $('.system-form-field', this);

          // Re-index
          reindex(fields, true, index++);
        });
      });

      $(row).doon();
    };

    //append meta template
    $('.fieldset-add', target).click(function () {
      if ($(this).parents('[data-do=fieldset]')[0] !== target[0]) {
        return;
      }

      var indexes = {};
      var rows = $(this)
        .parents('.fieldset-row[data-multiple]')
        .get()
        .reverse();

      rows.forEach(function (row, i) {
        indexes['{INDEX_' + i + '}'] = $(row).index();
      });

      indexes['{INDEX_' + rows.length + '}'] = $(this).siblings('.fieldset-row').length;

      var row = $(template.replace(
        new RegExp('{UUID}','g'),
        uuid + '' + rows.length)
      );

      var id = $(row).attr('id');
      if (typeof id !== typeof undefined && id !== false) {
        id = id.replace('{INDEX_0}', indexes['{INDEX_0}']);
        $(row).attr('id', id);
      }

      $('.system-form-control', row).each(function () {
        var name = $(this).attr('name');
        for (var index in indexes) {
          name = name.replace(index, indexes[index]);
        }

        $(this).attr('name', name);
      });

      //consider file fields
      $('[data-name]', row).each(function () {
        var name = $(this).attr('data-name');
        for (var index in indexes) {
          name = name.replace(index, indexes[index]);
        }

        $(this).attr('data-name', name);
      });

      //consider suggestion-fields
      $('.input-suggestion', row).each(function () {
        var targetLabel = $(this).attr('data-target-label');
        var targetValue = $(this).attr('data-target-value');
        for (var index in indexes) {
          targetLabel = targetLabel.replace(index, indexes[index]);
          targetValue = targetValue.replace(index, indexes[index]);
        }

        $(this).attr('data-target-label', targetLabel);
        $(this).attr('data-target-value', targetValue);
      });

      var labelTemplate = label;
      for (var index in indexes) {
        labelTemplate = labelTemplate.replace(index, indexes[index] + 1);
      }

      $('.fieldset-label', row).html(labelTemplate);

      //insert and activate scripts
      $(this).before(row);

      init(row);
    });

    //INITIALIZE
    $(target)
      .children('.fieldset-row')
      .each(function () {
        init($(this));
      });

    var reindex = function (fields, filter, start) {
      var inputs = $('.system-form-control', fields);
      // Get the input names
      var names = {};
      $.each(inputs, function (index, element) {
        // Get the original name
        var original = $(element).attr('name');
        // Convert to dot e.g a.b.c
        var name = original
          .replace(/\[|\]/g, '.')
          .replace(/\.\./g, '.');

        // Trim trailing dots
        name = name.substr(0, name.length - 1);

        // Convert to object
        dotToObject(name, original, names);
      });

      // Get the re-index filters
      var filters = [];

      // Filter?
      // if (filter) {
      //     $('[data-name]').map(function(index, element) {
      //         filters.push($(element).data('name'));
      //     });
      // }

      // Re-index names
      var reindexed = arrange(names, filters, start);
      // Serialized it so we can build something like a[b][c]
      var serialized = serialize(reindexed);
      // Split by pairs
      serialized = serialized.split('&');

      // On each serialized pairs
      for (var i in serialized) {
        // Get the parts key & value
        var parts = serialized[i].split('=');

        // Iterate on each input elements
        $.each(inputs, function (index, element) {
          // Get the name
          var name = $(element).attr('name');

          // Has matched the original name?
          if (name === parts[1]) {
            // Replace it with the re-indexed name
            $(element).attr('name', parts[0]);

            // Case for Filelist/File Fields
            if ($(element).hasClass('system-file-input')) {
              var container = $(element).parentsUntil('.system-form-field').last();
              container.attr('data-name', parts[0].replace('[]', ''));
            }

            // Case for tag field
            if ($(element).hasClass('tag-input')) {
              var container = $(element).parentsUntil('div.form-tag').last();
              container
                .data('name', parts[0].replace('[]', ''))
                .attr('data-name', parts[0].replace('[]', ''));
            }
          }
        });
      }
    };

    var arrange = function (object, filters, start = 0) {
      // Re-arranged object
      var rearranged = {};
      // Get all the keys
      var keys = Object.keys(object);
      // Current index
      var index = start;

      // On each keys
      for (var i in keys) {
        // Get the current key
        var key = keys[i];
        // Get the current value
        var current = object[keys[i]];
        // Get the type
        var type = Object.prototype.toString.call(current);

        // If it's a string but it's an object
        if (isNaN(parseInt(key)) && type === '[object Object]' && key !== '{INDEX}') {
          // If it's not fieldset
          if (filters.length && filters.indexOf(key) === -1) {
            continue;
          }

          // Recurse object
          rearranged[key] = arrange(current, filters, index);

          continue;
        // If it's a number and it's an object, re-index
        } else if ((!isNaN(parseInt(key)) || key === '{INDEX}') && type === '[object Object]') {
          // Re-index the object
          rearranged[index] = arrange(current, filters);
          index++;
        } else {
          // Just set the value
          rearranged[key] = current;
        }
      }

      return rearranged;
    };

    var dotToObject = function (path, value, object) {
      // Get the parts
      var parts = path.split('.'), part;
      var last = parts.pop();
      var pointer = object;
      // On each part
      while (part = parts.shift()) {
        // Create if doesnt exists
        if (typeof pointer[part] !== 'object') {
          pointer[part] = {};
        }

        // Update pointer
        pointer = pointer[part];
      }

      // Set value
      pointer[last] = value;
    };

    var serialize = function (object, prefix) {
      var string = [], property;

      // On each property
      for (property in object) {
        if (object.hasOwnProperty(property)) {
          // Figure out the key
          var key = prefix ?
            prefix + '[' + property + ']' :
            property;

          // Get the value
          var value = object[property];

          // Push or recurse the pair
          string.push(
            (value !== null && typeof value === 'object') ?
            serialize(value, key) :
            key + '=' + value
          );
        }
      }

      return string.join('&');
    };
  });

  /**
   * Star Rating Field Init
   */
  $(window).on('stars-field-init', function (e, target) {
      target = $(target);

      var input = target.find('input.system-form-control');

      //cache rows
      var rows = target.find('.star');
      var range = 0, stop = 0;

      //INITIALIZER
      var init = function () {
          rows
          .each(function () {
              var icon = $(this).find('i');
              icon.on('mousemove', hover.bind(icon, icon.outerWidth()));
              icon.on('click', function () {
                  //not sure why .val is not working :(
                  input.attr('value', range);
              });
          });

          //reset if didn't select
          target.on('mouseleave', function () {
              range = 0, stop = 0;
              fill(input.val());
          });
      };

      //on hover determine steps
      var hover = function (width, e) {
          var index = $(this).parent().index();
          //determine whether it's half step
          var half = Math.ceil(width / 2);
          var position = Math.ceil(
              e.pageX - $(this).parent().offset().left
          );

          //small threshold to be able to reset to 0
          if (index === 0 && position < 8) {
              range = 0;
              return fill(0);
          }

          //half step?
          if (position <= half) {
              range = index + .5;

          //whole step?
          } else {
              range = index + 1;
          }

          //do not rerender if value
          //doesn't change
          if (stop === range) {
              return;
          }

          //set stop threshold
          fill(range);
          stop = range;
      };

      //fill the stars
      var fill = function (range) {
          //determine whether it's a full or half step
          var half = range.toString().indexOf('.5') > 0;
          range = Math.round(range);

          //fill in each rows
          rows.each(function (index) {
              var star = $(this).find('i');

              //half step?
              if (index === range - 1 && half) {
                  star.attr('class', 'fas fa-star-half-alt text-warning');
                  return;
              }

              //whole step?
              if (index < range) {
                  star.attr('class', 'fas fa-star text-warning');

              //empty step?
              } else {
                  star.attr('class', 'far fa-star');
              }
          });
      };

      //INITIALIZE
      init();
  });
})();

  /**
 * General Forms
 */
(function() {
  /**
   * Direct CDN Upload
   */
  $(window).on('cdn-upload-submit', function(e, target, next) {
    //the total of files to be uploaded
    var total = 0;
    //hiddens will have base 64
    $('input[type="hidden"]', target).each(function() {
      var hidden = $(this);
      var data = hidden.val();
      //check for base 64
      if(data.indexOf(';base64,') === -1) {
        return;
      }

      //add on to the total
      total ++;
    });

    //if there is nothing to upload
    if(!total) {
      if (typeof next === 'function') {
        return next(e, target);
      }
      //let the form submit as normal
      return;
    }

    //otherwise we are uploading something, so we need to wait
    e.preventDefault();

    $.require('cdn/json/extensions.json', function(extensions) {
      //setup cdn configuration
      var container = $(target);
      var config = { form: {}, inputs: {} };

      //though we upload this with s3 you may be using cloudfront
      config.cdn = container.attr('data-cdn');
      config.progress = container.attr('data-progress');
      config.complete = container.attr('data-complete');

      //form configuration
      config.form['enctype'] = container.attr('data-enctype');
      config.form['method'] = container.attr('data-method');
      config.form['action'] = container.attr('data-action');

      //inputs configuration
      config.inputs['acl'] = container.attr('data-acl');
      config.inputs['key'] = container.attr('data-key');
      config.inputs['X-Amz-Credential'] = container.attr('data-credential');
      config.inputs['X-Amz-Algorithm'] = container.attr('data-algorythm');
      config.inputs['X-Amz-Date'] = container.attr('data-date');
      config.inputs['Policy'] = container.attr('data-policy');
      config.inputs['X-Amz-Signature'] = container.attr('data-signature');

      var id = 0,
        // /upload/123abc for example
        prefix = config.inputs.key,
        //the amount of uploads complete
        completed = 0;

      //hiddens will have base 64
      $('input[type="hidden"]', target).each(function() {
        var hidden = $(this);
        var data = hidden.val();
        //check for base 64
        if(data.indexOf(';base64,') === -1) {
          return;
        }

        //parse out the base 64 so we can make a file
        var base64 = data.split(';base64,');
        var mime = base64[0].split(':')[1];

        var extension = extensions[mime] || 'unknown';
        //this is what hidden will be assigned to when it's uploaded
        var path = prefix + (++id) + '.' + extension;

        //EPIC: Base64 to File Object
        var byteCharacters = window.atob(base64[1]);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += 512) {
          var slice = byteCharacters.slice(offset, offset + 512);

          var byteNumbers = new Array(slice.length);

          for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        var file = new File(byteArrays, {type: mime});

        //This Code is to verify that we are
        //encoding the file data correctly
        //see: http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
        //var reader  = new FileReader();
        //var preview = $('<img>').appendTo(target)[0];
        //reader.addEventListener("load", function () {
        //  preview.src = reader.result;
        //}, false);
        //reader.readAsDataURL(file);
        //return;

        //prepare the S3 form to upload just this file
        var form = new FormData();
        for(var name in config.inputs) {
          if(name === 'key') {
            form.append('key', path);
            continue;
          }

          form.append(name, config.inputs[name]);
        }

        //lastly add this file object
        form.append('file', file);

        // Need to use jquery ajax
        // so that auth can catch
        // up request, and append access
        // token into it
        $.ajax({
          url: config.form.action,
          type: config.form.method,
          // form data
          data: form,
          // disable cache
          cache: false,
          // do not set content type
          contentType: false,
          // do not proccess data
          processData: false,
          // on error
          error: function(xhr, status, message) {
            notifier.fadeOut('fast', function() {
              notifier.remove();
            });

            $.notify(message, 'danger');
          },
          // on success
          success : function() {
            //now we can reassign hidden value from
            //base64 to CDN Link
            hidden.val(config.cdn + '/' + path);

            //if there is more to upload
            if ((++completed) < total) {
              //update bar
              var percent = Math.floor((completed / total) * 100);
              bar.css('width', percent + '%').html(percent + '%');

              //do nothing else
              return;
            }

            notifier.fadeOut('fast', function() {
              notifier.remove();
            });

            $.notify(config.complete, 'success');

            //all hidden fields that could have possibly
            //been converted has been converted
            //submit the form
            if (typeof next === 'function') {
              return next(e, target);
            }

            target.submit();
          }
        });
      });

      var message = '<div>' + config.progress + '</div>';
      var progress = '<div class="progress"><div class="progress-bar"'
      + 'role="progressbar" aria-valuenow="2" aria-valuemin="0"'
      + 'aria-valuemax="100" style="min-width: 2em; width: 0%;">0%</div></div>';

      var notifier = $.notify(message + progress, 'info', 0);
      var bar = $('div.progress-bar', notifier);
    });
  });

  /**
   * JS Native Validator
   */
  $(window).on('bootstrap-validator-init', function (e, target) {
    $('input,select,textarea', target).blur($.formCheck).change($.formCheck);
  });

  /**
   * JS Native Validator
   */
  $(window).on('bootstrap-validator-submit', function (e, target) {
    $('input,select,textarea', target).each(function() {
      $.formCheck.call(this);
    });

    if (!target.reportValidity()) {
      e.preventDefault();
      $.notify('Errors were found in the form you submitted.', 'error');
      e.return = false;
    }
  });
})();

  /**
* General Search
*/
(function () {
  function parseJson(file, next) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      try {
        var rows = JSON.parse(reader.result);
      } catch (e) {
        return $.notify('Invalid JSON', 'danger');
      }
      next({rows: rows});
    };
  }

  function parseCsv(file, next) {
    $(file).parse({
      config: {
        header: true,
        skipEmptyLines: true,
        complete: function (results, file) {
          var rows = results.data;
          if (typeof rows !== 'object' || !(rows instanceof Array)) {
            return $.notify('Invalid CSV', 'danger');
          }

          rows.forEach(function(row, i) {
            var json = $.registry();
            for (var key in row) {
              if (!row[key] || !(row[key] + '').length) {
                continue;
              }

              var keys = key.split('/');
              json.set(...keys, row[key]);
            }

            rows[i] = json.get();
          });
          next({rows: rows});
        },
        error: function (error, file, input, reason) {
          $.notify(error.message, 'error');
        }
      }
    });
  }

  function importSend(url, notifier, progress, complete, data) {
    $.post(url, data, function (response) {
      notifier.fadeOut('fast', function () {
        notifier.remove();
      });

      if (response.error) {
        var message = response.message;
        var row, value;
        if (response.validation && typeof response.validation.rows === 'object') {
          for (var index in response.validation.rows) {
            for (var name in response.validation.rows[index]) {
              row = parseInt(index) + 1
              value = response.validation.rows[index][name];
              message += `<br /> ROW ${row} - ${name} - ${value}`;
            }
          }
        }

        return $.notify(message, 'danger');
      }

      if (typeof complete === 'undefined') {
        complete = response.message;
      }

      $.notify(complete, 'success');

      setTimeout(function () {
        window.location.reload();
      }, 1000);
    });
  }

  /**
   * Search table check all
   */
  $(window).on('table-checkall-init', function (e, trigger) {
    var table = $(trigger).data('table');

    var show = $($(trigger).data('toggle-show'));
    var hide = $($(trigger).data('toggle-hide'));

    function toggle(on) {
      if (on) {
        show.removeClass('d-none');
        hide.addClass('d-none');
      } else {
        show.addClass('d-none');
        hide.removeClass('d-none');
      }
    }

    $(trigger).click(function () {
      if ($(trigger).prop('checked')) {
        $('input[type="checkbox"]', table).prop('checked', true);
        toggle(true);
      } else {
        $('input[type="checkbox"]', table).prop('checked', false);
        toggle(false);
      }
    });

    $('input[type="checkbox"]', table).click(function () {
      var anyChecked = false;
      var allChecked = true;
      $('input[type="checkbox"]', table).each(function () {
        if (!$(this).prop('checked')) {
          allChecked = false;
        }

        if ($(this).prop('checked')) {
          anyChecked = true;
        }
      });

      $(trigger).prop('checked', allChecked);
      toggle(anyChecked);
    });
  });

  /**
   * Importer init
   */
  $(window).on('import-init', function (e, trigger) {
    $(trigger).toggleClass('disabled');

    $.require('components/papaparse/papaparse.min.js', function () {
      $(trigger).toggleClass('disabled');
    });
  });

  /**
   * Importer tool
   */
  $(window).on('import-click', function (e, trigger) {
    var url = $(trigger).attr('data-url');
    var progress = $(trigger).attr('data-progress');
    var complete = $(trigger).attr('data-complete');

    if (typeof progress === 'undefined') {
      progress = 'We are importing you data. Please do not refresh page.';
    }

    //make a file
    $('<input type="file" />')
      .attr(
        'accept',
        [
          'text/plain',
          'text/csv',
          'text/x-csv',
          'application/vnd.ms-excel',
          'application/csv',
          'application/x-csv',
          'text/comma-separated-values',
          'text/x-comma-separated-values',
          'text/tab-separated-values',
          'text/json',
          'application/json'
        ].join(',')
      )
      .change(function () {
        var message = '<div>'+progress+'</div>';
        var notifier = $.notify(message, 'info', 0);

        if (!this.files || !this.files[0]) {
          return;
        }

        //switch for file mimes
        switch (this.files[0].name.split('.').pop().toLowerCase()) {
          case 'csv':
            parseCsv(this, importSend.bind(null, url, notifier, progress, complete));
            break;
          case 'json':
            parseJson(this.files[0], importSend.bind(null, url, notifier, progress, complete));
            break;
        }
      })
      .click();
  });

  /**
   * Confirm UI
   */
  $(window).on('confirm-click', function (e, trigger) {
    if (!window.confirm('Are you sure you want to remove?')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
})();

  /**
 * App Panel UI
 */
(function() {
  const cdn = $('html').attr('data-cdn') || '';
  const panel = $('aside.panel-sidebar-right');
  const screens = [];

  $.extend({
    panel: {
      addScreen: function(html, template) {
        const screen = $('<section>').addClass('view-mobile').html(html);

        if (template) {
          screen.attr('data-template', template).data('template', template);
        }

        if (!screens.length) {
          panel.html('');
          panel.append(screen);
        } else {
          panel.append(screen);

          panel.animate({
            scrollLeft: panel.width() * screens.length
          }, 500);
        }

        screens.push(screen.doon());
        return screens.length - 1;
      },
      removeScreen: function(reload, callback = $.noop) {
        if (screens.length < 2) {
          //trigger the class changer thing
          const trigger = $('<button>')
            .data('name', 'no-sidebar-right')
            .data('selector', 'section.layout-panel');

          $(window).trigger('add-class-click', trigger);
          return;
        }

        const backScreenIndex = screens.length - 2;

        //if they want to reload
        if (reload) {
          $.panel.reloadScreen(backScreenIndex);
        } else if (screens[backScreenIndex].data('reload') === true) {
          $.panel.reloadScreen(backScreenIndex);
          screens[backScreenIndex].data('reload', false);
        }

        panel.animate({
          scrollLeft: panel.width() * backScreenIndex
        }, 500, function() {
          screens.pop();
          callback($('section.view-mobile:last').remove());
        });

        return screens.length;
      },
      reloadScreen: function(index) {
        if (!index && index !== 0 && index !== '0') {
          index = screens.length - 1;
        }

        var template = screens[index].data('template');

        // for referenes and files / flows
        if (typeof template === 'undefined') {
          var template = $('section.view-mobile:nth-child(2) form').data('template');

          if ($('form[data-back]').data('back')) {
            var template = $('section.view-mobile:nth-child(3) form').data('back');
          }
        }

        if (!template) {
          return false;
        }

        if (~template.indexOf('://') || template.indexOf('/') === 0) {
          $.panel.replaceScreen(index, `<img class="loading" src="${cdn}/images/loader.gif" />`);

          $.get(template, function(response) {
            $.panel.replaceScreen(index, response);
          });
        } else {
          $.panel.replaceScreen(index, $(template).html());
        }

        return true;
      },
      replaceScreen: function(index, html, template) {
        if (typeof screens[index] === 'undefined') {
          return;
        }

        const screen = $('<section>').addClass('view-mobile').html(html);

        var template = screens[index].data('template');
        if (template) {
          screen.attr('data-template', template).data('template', template);
        }

        $('section.view-mobile', panel).eq(index).replaceWith(screen);

        panel.animate({
          scrollLeft: panel.width() * screens.length
        }, 500);

        screens[index] = screen.doon();
      }
    }
  });

  function formSubmit(target, next = $.noop) {
    target = $(target);

    const method = target.attr('method') || 'post';
    const action = target.attr('action') || window.location.href;

    if (!target[0].checkValidity()) {
      return false;
    }

    //get the data
    const data = target.serialize() || {};

    //ajax it up
    $[method](action, data, function(response) {
      //allow custom response handling
      if(next(response, data, target) !== false) {
        //if no response
        if (typeof response !== 'object') {
          $.notify('Server Error', 'error');
          return;
        }
        //if response error
        if (response.error) {
          const message = response.message || 'Server Error';
          if (!response.validation) {
            $.notify(message, 'error');
            return;
          }

          $.notify(
            $.buildNotification(message, response.validation),
            'error'
          );
        }
      }
    });
  }

  $(window).on('panel-mobile-open-click', function(e, trigger) {
    trigger = $(trigger);

    //empty the screens
    screens.length = 0;

    //trigger the class changer thing
    trigger.data('name', 'no-sidebar-right');
    trigger.data('selector', 'section.layout-panel');
    $(window).trigger('remove-class-click', trigger);

    const template = trigger.data('template');

    if (~template.indexOf('://') || template.indexOf('/') === 0) {
      const index = $.panel.addScreen(
        '<div class="spinner-border mr-3" role="status"></div>',
        template
      );

      const method = trigger.data('method') || 'get';
      const form = trigger.data('form');

      let data = {};
      if (form) {
        data = $(form).serialize() || {};
      }

      $[method](template, data, function(response) {
        $.panel.replaceScreen(index, response, template);
      });
    //if its HTML
    } else if (template.indexOf('<') === 0) {
      $.panel.addScreen($(template).html());
    //selector?
    } else {
      $.panel.addScreen($(template).html(), template);
    }

    if (trigger.data('container') && trigger.data('id')) {
      $(trigger.data('container')).attr('data-id', trigger.data('id'));
    }
  });

  $(window).on('panel-mobile-forward-click', function(e, trigger) {
    trigger = $(trigger);

    const template = trigger.data('template');

    //if its a URL
    if (~template.indexOf('://') || template.indexOf('/') === 0) {
      const index = $.panel.addScreen(
        '<div class="spinner-border mr-3" role="status"></div>',
        template
      );

      const method = trigger.data('method') || 'get';
      const form = trigger.data('form');

      let data = {};
      if (form) {
        data = $(form).serialize() || {};
      }

      let payload = trigger.data('payload') || '';
      if ((trigger.data('payload-selector') || '').length) {
        payload = $(trigger.data('payload-selector')).text();
      }

      if (payload.length) {
        data = payload;
        if (payload.indexOf('[') === 0
          || payload.indexOf('{') === 0
        ) {
          data = JSON.parse(payload);
        }
      }

      $[method](template, data, function(response) {
        $.panel.replaceScreen(index, response, template);
      });
    //if its HTML
    } else if (template.indexOf('<') === 0) {
      $.panel.addScreen($(template).html());
    //selector?
    } else {
      $.panel.addScreen($(template).html(), template);
    }

    if (trigger.data('container') && trigger.data('id')) {
      $(trigger.data('container')).attr('data-id', trigger.data('id'));
    }
  });

  $(window).on('panel-mobile-back-click', function(e, trigger = null, callback = $.noop) {
    let reload = 0;
    if (trigger) {
      reload = $(trigger).data('reload') || 0;
    }

    $.panel.removeScreen(reload, callback);
  });

  $(window).on('panel-mobile-reload-click', function(e, trigger) {
    const index = $(trigger).data('index');
    $.panel.reloadScreen(index);
  });

  $(window).on('panel-form-init', function(e, target) {
    $(window).trigger('bootstrap-validator-init', [target]);
  });

  $(window).on('panel-form-submit', function(e, target, callback) {
    //validate
    e.type = 'bootstrap-validator-submit';
    $(window).trigger(e, [target]);
    if (e.return === false) {
      return;
    }

    e.return = false;
    e.preventDefault();

    var after = $(target).data('after') || 'none';
    var expected = $(target).data('response') || 'json';
    var next = function(response, data, target) {
      //if no response or error
      if (typeof response === 'object' && response.error) {
        //dont do next
        return;
      }

      if (expected === 'json' && typeof response !== 'object') {
        //dont do next
        return;
      }

      if (after === 'reload') {
        window.location.reload();
      } else if (after === 'reback') {
        $.panel.removeScreen(1);
      } else if (after === 'rebackall') {
        screens.forEach(screen => {
          screen.data('reload', true);
        });
        $.panel.removeScreen(0);
      } else if (after === 'back') {
        $.panel.removeScreen(0);
      }

      if (typeof callback === 'function') {
        callback(response);
      }

      return false;
    };

    //check for upload
    if ($(target).data('s3')) {
      $(window).trigger('cdn-upload-submit', [target, function() {
        formSubmit(target, next);
      }]);
      return;
    }

    formSubmit(target, next);
    return false;
  });
})();

  /**
 * Other UI
 */
(function() {
  /**
   * General - add class on click
   */
  $(window).on('add-class-click', function (e, target) {
    target = $(target);
    const name = target.data('name');
    const selector = target.data('selector');

    if (!name || !selector) {
      return;
    }

    $(selector).addClass(name);
  });

  /**
   * General - remove class on click
   */
  $(window).on('remove-class-click', function (e, target) {
    target = $(target);
    const name = target.data('name');
    const selector = target.data('selector');

    if (!name || !selector) {
      return;
    }

    $(selector).removeClass(name);
  });

  /**
   * Prettyfy
   */
  $(window).on('prettify-init', function(e, target) {
    var loaded = false;
    $.require.load(
      'components/google-code-prettify/src/prettify.js',
      'components/google-code-prettify/src/prettify.css',
      function() {
        if(!loaded) {
          PR.prettyPrint();
          loaded = true;
        }
      }
    );
  });

  /**
   * Modal Link
   */
  $(window).on('modal-link-init', function(e, target) {
    target = $(target);

    const template = target.data('template');
    const data = {};

    target.on('click', function() {
      $.get(template, data, function(response) {

        let modal = response.results.body;
        const clone = $(modal).clone().modal('show').doon();

        let script = ``;
        if (response.results.script) {
          script = `<script type="text/javascript" src="${response.results.script}"></script>`;
        }

        let css = ``;
        if (response.results.css) {
          css = `<link href="${response.results.css}" rel="stylesheet" type="text/css" />`;
          $('head').append($(css));
        }

        clone.on('shown.bs.modal', function() {
          $('body').append($(script));
        });

        clone.on('hidden.bs.modal', function() {
          clone.remove();
          $('div.modal-backdrop').remove();
          $(`script[src="${response.results.script}"]`).remove();
          $(`link[href="${response.results.css}"]`).remove();
        });
      });
    });
  });

  /**
   * Confirm UI
   */
  $(window).on('confirm-click', function(e, trigger) {
    var message = $(trigger).data('message') || 'Are you sure?';
    if (!window.confirm(message)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  /**
   * Wizard UI
   */
  $(window).on('wizard-init', function(e, container) {
    container = $(container);
    const steps = container.children();

    let activeIndex = 0;
    let activeStep = steps.eq(activeIndex);

    container.on('wizard-prev-step', function(e, callback) {
      callback = callback || function() {};
      if ((activeIndex - 1) < 0) {
        return;
      }

      activeStep = steps.eq(--activeIndex);

      $(container).animate({
        scrollLeft: container.width() * activeIndex
      }, 1000, function() {
        if (activeStep.attr('id')) {
          window.location.hash = activeStep.attr('id');
        }

        callback();
      });
    });

    container.on('wizard-next-step', function(e, callback) {
      callback = callback || function() {};

      if ((activeIndex + 1) >= steps.length) {
        if (container[0].tagName === 'FORM') {
          container.submit();
        }

        return;
      }

      activeStep = steps.eq(++activeIndex);

      $(container).animate({
        scrollLeft: container.width() * activeIndex
      }, 1000, function() {
        if (activeStep.attr('id')) {
          window.location.hash = activeStep.attr('id')
        }

        callback();
      });
    });

    steps.each(function(i) {
      const step = $(this);
      $('.wizard-prev', this).click(function() {
        container.trigger('wizard-prev-step');
      });

      $('.wizard-next', this).click(function() {
        if (!step.data('validate')) {
          return container.trigger('wizard-next-step');
        }

        step.data('validate')(function(error) {
          if (!error) {
            return container.trigger('wizard-next-step');
          }
        });
      });
    });

    if (window.location.hash && steps.index($(window.location.hash)) !== -1) {
      checkMove(container, activeIndex, steps.index($(window.location.hash)));
    }

    function checkMove(container, activeIndex, toIndex) {
      if (activeIndex >= toIndex) {
        return;
      }

      const next = checkMove.bind(null, container, activeIndex + 1, toIndex);
      const steps = container.children();
      let activeStep = steps.eq(activeIndex);

      if (!activeStep.data('validate')) {
        return container.trigger('wizard-next-step', next);
      }

      activeStep.data('validate')(function(error) {
        if (!error) {
          return container.trigger('wizard-next-step', next);
        }
      });
    }
  });
})();

/**
 * Notifier
 */
(function() {
  $(window).on('notify-init', function(e, trigger) {
    var timeout = parseInt($(trigger).attr('data-timeout') || 3000);

    if(!timeout) {
      return;
    }

    setTimeout(function() {
      $(trigger).fadeOut('fast', function() {
        $(trigger).remove();
      });

    }, timeout);
  });
})();

  (function() {
  $.extend({
    formCheck: function() {
      const field = $(this);
      //remove errors
      this.setCustomValidity('');
      //remove readonly for now
      const readonly = field.prop('readonly');
      if (readonly) {
        field.prop('readonly', false).removeAttr('readonly');
      }

      if(!this.checkValidity()) {
        this.setCustomValidity('Invalid Format');
        if (this.validity.valueMissing) {
          this.setCustomValidity('Required Field');
        } else if (this.validity.patternMismatch) {
          this.setCustomValidity('Invalid Format');
        } else if (this.validity.tooLong) {
          this.setCustomValidity('Characters Exceed Limit');
        } else if (this.validity.tooShort) {
          this.setCustomValidity('Not Enough Characters');
        } else if (this.validity.rangeOverflow) {
          this.setCustomValidity('Too Large');
        } else if (this.validity.rangeUnderflow) {
          this.setCustomValidity('Too Small');
        }
      }

      if (!this.checkValidity()) {
        const format = field.attr('format');
        if (format && format.length && !(new RegExp(format)).test(field.val())) {
          this.setCustomValidity('Invalid Format');
        }

        if (field.prop('required') && !field.val().length) {
          this.setCustomValidity('Required Field');
        }
      }

      field.trigger('validation-check');
      //put readonly back
      if (readonly) {
        field.prop('readonly', true).attr('readonly', 'readonly');
      }
    },
    buildNotification: function(message, items) {
      const list = [];
      Object.keys(items).forEach(function (name) {
        const value = items[name];
        if (typeof value === 'object' && value !== null) {
          const notifications = buildErrorNotification(name, value);
          list.push(`<li>${notifications}</li>`);
        } else {
          list.push(`<li>${name} - ${value}</li>`);
        }
      });
      return `${message}<ul>${list.join('')}</ul>`;
    },
    makeFieldName: function(...name) {
      // foo, bar, zoo
      // -> foo][bar][zoo]
      name = name.join('][') + ']';
      // -> foo[bar][zoo]
      return name.replace(']', '')
    },
    json2flat: function(json, ...keys) {
      const flat = {};
      Object.keys(json).forEach((key) => {
        if (typeof json[key] !== 'object' || json[key] === null) {
          flat[$.makeFieldName(...keys, key)] = json[key];
        }

        Object.assign(flat, this.json2query(json[key], ...keys, key));
      });

      return flat;
    },
    json2query: function(json, ...keys) {
      return this.param(this.json2flat(json));
    },
    notify: function(message, type, timeout) {
      if(type === 'danger') {
        type = 'error';
      }

      var toast = toastr[type](message, type[0].toUpperCase() + type.substr(1), {
        positionClass: 'toast-bottom-left',
        timeOut: timeout
      });

      return toast;
    },
    registry: function(data = {}) {
      return {
        has: function(...path) {
          if (!path.length) {
            return false;
          }

          let found = true;
          const last = path.pop();
          let pointer = data;

          path.forEach((step, i) => {
            if (!found) {
              return;
            }

            if (typeof pointer[step] !== 'object') {
              found = false;
              return;
            }

            pointer = pointer[step];
          });

          return !(!found || typeof pointer[last] === 'undefined');
        },
        set: function(...path) {
          if (path.length < 1) {
            return this;
          }

          if (typeof path[0] === 'object') {
            Object.keys(path[0]).forEach(key => {
              this.set(key, path[0][key]);
            });

            return this;
          }

          const value = path.pop();
          let last = path.pop(), pointer = data;

          path.forEach((step, i) => {
            if (step === null || step === '') {
              path[i] = step = Object.keys(pointer).length;
            }

            if (typeof pointer[step] !== 'object') {
              pointer[step] = {};
            }

            pointer = pointer[step];
          });

          if (last === null || last === '') {
            last = Object.keys(pointer).length;
          }

          pointer[last] = value;

          //loop through the steps one more time fixing the objects
          pointer = data;
          path.forEach((step) => {
            const next = pointer[step];
            //if next is not an array and next should be an array
            if (!Array.isArray(next) && this.shouldBeAnArray(next)) {
              //transform next into an array
              pointer[step] = this.makeArray(next);
            //if next is an array and next should not be an array
            } else if (Array.isArray(next) && !this.shouldBeAnArray(next)) {
              //transform next into an object
              pointer[step] = this.makeObject(next);
            }

            pointer = pointer[step];
          });

          return this;
        },
        get: function(...path) {
          if (!path.length) {
            return data;
          }

          if (!this.has(...path)) {
            return null;
          }

          const last = path.pop();
          let pointer = data;

          path.forEach((step, i) => {
            pointer = pointer[step];
          });

          return pointer[last];
        },

        shouldBeAnArray: function(object) {
          if (typeof object !== 'object') {
            return false;
          }

          if (!Object.keys(object).length) {
            return false;
          }

          for (let key in object) {
            if (isNaN(parseInt(key)) || String(key).indexOf('.') !== -1) {
              return false;
            }
          }

          return true;
        },
        makeObject: function(array) {
          return Object.assign({}, array);
        },
        makeArray: function(object) {
          const array = [];
          Object.keys(object).sort().forEach(function(key) {
            array.push(object[key]);
          });

          return array;
        }
      };
    },
  });

  $.fn.extend({
    setFieldValue: function(name, value) {
      if (typeof value === 'undefined' || value === null) {
        value = '';
      }

      $(`[name="${name}"]`, this).each(function () {
        const field = $(this);
        //if select
        if (field.is('select')) {
          //loop through the options
          $('option', field).each(function() {
            //update selected
            $(this)
              .attr('selected', this.value == value)
              .prop('selected', this.value == value);
          });
          return;
        }

        //if radio or checkbox
        if (field.attr('type') === 'radio' || field.attr('type') === 'checkbox') {
          //update checked
          $(this)
            .attr('checked', field.val() == value)
            .prop('checked', field.val() == value);
          return;
        }

        //try to set the value
        field.val(value);
      });

    },
    json2form: function(json, ...keys) {
      const form = this;
      Object.keys(json).forEach((key) => {
        if (typeof json[key] !== 'object' || json[key] === null) {
          return form.setFieldValue($.makeFieldName(...keys, key), json[key]);
        }

        form.json2form(json[key], ...keys, key);
      })
    },
    form2json: function() {
      const json = $.registry();
      $(this).serializeArray().forEach((serial) => {
        const path = serial.name.replace(/\][^\]]*$/g, '').replace('[', '][').split('][');
        json.set(...path, serial.value)
      });

      return json.get()
    },
    compile: function(variables) {
      var template = this.text();

      for(var key in variables) {
        template = template.replace(
          new RegExp('{' + key + '}', 'ig'),
          variables[key]
        );
      }

      return $(template);
    }
  });
})();


  /**
   * Initialize
   */
  (function() {
    var cdn = $('html').attr('data-cdn') || '';
    // configure require
    require.config({
      cdn: {
        root : cdn
      },
      components: {
        root : cdn + '/components'
      }
    });

    //need to load dependencies
    $.require(
      [
        'components/doon/doon.min.js',
        'components/toastr/build/toastr.min.css',
        'components/toastr/build/toastr.min.js'
      ],
      function() {
        //activate all scripts
        $(document.body).doon();
      }
    );
  })();
});