function initCustomization(settings) {
  for (x in settings) {
    let y = x;
    let selector = "#custom" + y;

    var item = settings[x];
    var html;
    if (!item["default_text"] && !item["max_length"]) {
      html =
        '<p class="imgPlaceholder"  data-x="' +
        item["position_x"] +
        '" data-y="' +
        item["position_y"] +
        '"  style="position:absolute; top:' +
        item["position_y"] +
        "px;left:" +
        item["position_x"] +
        'px; font-size: 30px;" id="item' +
        x +
        '"><i class="fa fa-photo"></i></p>';
    } else {
      html =
        '<p data-x="' +
        item["position_x"] +
        '" style="position:absolute; color:' +
        item["color"] +
        ";top:" +
        item["position_y"] +
        "px; opacity:" +
        item["opacity"] +
        "; left:" +
        item["position_x"] +
        "px; font-size: " +
        item["size"] +
        "px;font-family: " +
        item["family"] +
        '" id="item' +
        x +
        '">' +
        item["default_text"] +
        "</p>";
    }
    $("#imageBox").append(html);

    var label = $("#item" + x);
    if (!item["default_text"] && !item["max_length"]) {
      label.html('<i class="fa fa-photo"></i>');
    }
    var height = label.css("height").split("px")[0];
    var prevY = label.css("top").split("px")[0];
    var newY = parseInt(prevY) - parseInt(height) / 2;
    label.css("top", newY + "px");
  }
}

$(".customText").on("input", function () {
  let itemS = "#" + $(this).attr("id").replace("custom", "item");
  var val = $(this).val();
  let itemSelector = itemS;
  $(itemSelector).html(val);
  var width = parseInt($(itemSelector).css("width").split("px")[0]);
  var xpos = parseInt($(itemSelector).attr("data-x"));
  $(itemSelector).css("left", xpos - width / 2 + "px");
});

$(".customImage").on("change", function () {
  let itemS = "#" + $(this).attr("id").replace("custom", "item");
  let form = "#" + $(this).attr("id").replace("custom", "form-upload");
  let input = "#" + $(this).attr("id").replace("custom", "customImageVal");

  var width = $(this).attr('data-width');
  var height = $(this).attr('data-height');
  
  var val = '<img style="width:'+width+';max-width:none;max-height:'+height+';display:block" />';

  var that = $(this)[0];
  let itemSelector = itemS;
  $(itemSelector).html(val);

  if (that.files.length > 0) {
    var src = URL.createObjectURL(that.files[0]);
    var preview = $(itemSelector + " img")[0];
    if (src != preview.src) preview.src = src;
    $.ajax({
      url: "index.php?route=product/product/upload",
      type: "post",
      dataType: "json",
      data: new FormData($(form)[0]),
      cache: false,
      contentType: false,
      processData: false,
      beforeSend: function () {
        // $("#button-upload").button("loading");
      },
      complete: function () {
        // $("#button-upload").button("reset");
      },
      success: function (json) {

        $(input).val(json.filename);
        checkStatus();
        
      },
      error: function (xhr, ajaxOptions, thrownError) {
        alert(
          thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText
        );
      },
    });
  }

  var width = parseInt($(itemSelector).css("width").split("px")[0]);
  var xpos = parseInt($(itemSelector).attr("data-x"));
  $(itemSelector).css("left", xpos - width / 2 + "px");

  var height = parseInt($(itemSelector).css("height").split("px")[0]);
  var ypos = parseInt($(itemSelector).attr("data-y"));
  $(itemSelector).css("top", ypos - height / 2 + "px");


  $(itemSelector + " img").on('load',function(){
    var width = parseInt($(itemSelector).css("width").split("px")[0]);
    var xpos = parseInt($(itemSelector).attr("data-x"));
    $(itemSelector).css("left", xpos - width / 2 + "px");

    var height = parseInt($(itemSelector).css("height").split("px")[0]);
    var ypos = parseInt($(itemSelector).attr("data-y"));
    $(itemSelector).css("top", ypos - height / 2 + "px");

  });
});

$(document).ready(function () {
  initCustomization(settings);
  $(".customText").trigger("input");


  $('.imgPlaceholder').each(function(index,item){ 
    var width = parseInt($(item).css('width').split('px')[0]) / 2;  
    var xpos = parseInt($(item).attr('data-x'));  
    $(item).attr('data-x', xpos + width); 
  });

});