function initCustomization(settings) {
    $('.customLabels').remove();
    for (x in settings) {
        let y = x;
        let selector = '#custom' + y;
        let itemS = '#item' + y;
        var item = settings[x];

        if (!item['default_text'] && !item['max_length']) {
            html = '<p data-x="' + item['position_x'] + '"  class="customLabels customImages" style="position:absolute; top:' + item['position_y'] + 'px;left:' + item['position_x'] + 'px;font-size:30px" id="item' + x + '"><i class="fa fa-photo"></i></p>';

        } else {
            html = '<p data-x="' + item['position_x'] + '"  class="customLabels" style="position:absolute; color:' + item['color'] + ';top:' + item['position_y'] + 'px;left:' + item['position_x'] + 'px; font-size: ' + item['size'] + 'px;opacity:' + item['opacity'] + ';font-family: ' + item['family'] + '" id="item' + x + '">' + item['default_text'] + '</p>';
        }
        $('#customBox').append(html);

        var label = $('#item' + x);
        var height = label.css('height').split('px')[0];
        var prevY = label.css('top').split('px')[0];
        var newY = parseInt(prevY) - (parseInt(height) / 2);
        label.css('top', newY + 'px');

        var width = parseInt(label.css('width').split('px')[0]);
        var xpos = parseInt(item['position_x']);
        var newx = (xpos - (width / 2));
        label.css('left', newx + 'px');
    };
}

function updateLabel(elem, counter) {
    var val = $(elem).val();
    var label = $('#item' + counter);
    label.html(val);

    var width = parseInt(label.css('width').split('px')[0]);
    var xpos = parseInt(label.attr('data-x'));
    var newx = (xpos - (width / 2));
    label.css('left', newx + 'px');

}
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var trackChange = function (element) {
    var observer = new MutationObserver(function (mutations, observer) {
        if (mutations[0].attributeName == "value") {
            $(element).trigger("change");
        }
    });
    observer.observe(element, {
        attributes: true
    });
}

// Just pass an element to the function to start tracking
trackChange($("#input-customImage")[0]);
function updateImage(elem) {
    var src = $(elem).val();

    $('#customImage').attr('src', '../image/' + src);

}
$("#input-customImage").bind('change', function () { updateImage(this); });

var label_counter = 0;

function addField(x, y) {
    var row = addCustomFields();
    var elem = '#custom-row' + row;
    $(elem + ' [name*=position_x]').val(x);
    $(elem + ' [name*=position_y]').val(y);
}

function addLabel(x, y) {
    let mode = $('#mode:checked').val();
    let html = '';

    if (mode == 'text') {
        html = '<p id="item' + (custom_row - 1) + '" class="customLabel" style="position: absolute; color: black; top: ' + y + 'px; left: ' + x + 'px; font-size: 30px; opacity: 0.6; font-family: arial;" >Placeholder Text</p>';
    }
    else {
        html = '<p id="item' + (custom_row - 1) + '" class="customLabel" style="position: absolute; color: black; top: ' + y + 'px; left: ' + x + 'px; font-size: 30px; opacity: 0.6; font-family: arial;" ><i class="fa fa-photo"></i></p>';
    }
    $('#customBox').append(html);
    var label = $('.customLabel').last();
    var width = label.css('width').split('px')[0];
    var prevX = label.css('left').split('px')[0];
    var newX = parseInt(prevX) - (parseInt(width) / 2);
    var height = label.css('height').split('px')[0];

    var prevY = label.css('top').split('px')[0];
    var newY = parseInt(prevY) - (parseInt(height) / 2);



    label.css('left', newX + 'px');
    label.attr('data-x', x);
    label.css('top', newY + 'px');
}
document.getElementById('customImage').onclick = function clickEvent(e) {
    // e = Mouse click event.
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    addField(x, y);

}
document.getElementById('customBox').onclick = function clickEvent(e) {
    // e = Mouse click event.
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var y = e.clientY - rect.top;  //y position within the element.
    addLabel(x, y);

}


function addCustomFields() {

    let mode = $('#mode:checked').val();
    let html = '';

    if (mode == 'image') {
        html = '<tr id="custom-row' + custom_row + '">';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][label]" value="Text" placeholder="Label" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][position_x]" value="" placeholder="Position X" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][position_y]" value="" placeholder="Position Y" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][height]" value="" placeholder="Height" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][width]" value="" placeholder="Width" class="form-control" /></td>';
        html += '  <td class="text-center"><input type="checkbox" name="product_custom[' + custom_row + '][required]" value="1" /></td>';
        html += '  <td class="text-right"><button type="button" onclick="$(\'#custom-row' + custom_row + ',#item' + custom_row + '\').remove();" data-toggle="tooltip" title="{{ button_remove }}" class="btn btn-danger"><i class="fa fa-minus-circle"></i></button></td>';
        html += '</tr>';
        $('#customImagesTable tbody').append(html);
    } else {
        html = '<tr id="custom-row' + custom_row + '">';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][label]" value="Text" placeholder="Label" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][default_text]" onInput="updateLabel(this,\'' + custom_row + '\')"  value="Placeholder Text" placeholder="Default Text" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][family]" value="arial" placeholder="Font Family" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][size]" value="30" placeholder="Font Size" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][opacity]" value="0.6" placeholder="Opacity" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][color]" value="black" placeholder="Color" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][position_x]" value="" placeholder="Position X" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][position_y]" value="" placeholder="Position Y" class="form-control" /></td>';
        html += '  <td class="text-left"><input type="text" name="product_custom[' + custom_row + '][max_length]" value="30" placeholder="Max Length" class="form-control" /></td>';
        html += '  <td class="text-center"><input type="checkbox" name="product_custom[' + custom_row + '][required]" value="1" /></td>';
        html += '  <td class="text-right"><button type="button" onclick="$(\'#custom-row' + custom_row + ',#item' + custom_row + '\').remove();" data-toggle="tooltip" title="{{ button_remove }}" class="btn btn-danger"><i class="fa fa-minus-circle"></i></button></td>';
        html += '</tr>';
        $('#custom tbody').append(html);
    }
    
    return custom_row++;
}