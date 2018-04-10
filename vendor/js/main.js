(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    var width = 480;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    //
    var dataURL = null;
    var faceID = null;
    var draw = null;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      // photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
  
      navigator.getMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);
  
      navigator.getMedia(
        {
          video: true,
          audio: false
        },
        function(stream) {
          if (navigator.mozGetUserMedia) {
            video.mozSrcObject = stream;
          } else {
            var vendorURL = window.URL || window.webkitURL;
            video.src = vendorURL.createObjectURL(stream);
          }
          video.play();
        },
        function(err) {
          console.log("An error occured! " + err);
        }
      );
  
      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (4/3);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
      }, false);
      
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      var data = canvas.toDataURL('image/png');
      // photo.setAttribute('src', data);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
      
        var data = canvas.toDataURL('image/png');
        dataURL = data;
        // photo.setAttribute('src', data);

        draw = context;
      } else {
        clearphoto();
      }
    }

    function facelandmark(response) {
      context = draw;
      if (width && height) {
        // context.drawImage(video, 0, 0, width, height);
        context.strokeStyle="#0000ff";
        context.strokeRect(response[0].faceRectangle.left,response[0].faceRectangle.top,response[0].faceRectangle.width,response[0].faceRectangle.height)
    
      } else {
        clearphoto();
      }
    }


    ////////////////////////////////////////////////////////////////
    makeblob = function (dataURL) {
      var BASE64_MARKER = ';base64,';
      if (dataURL.indexOf(BASE64_MARKER) == -1) {
          var parts = dataURL.split(',');
          var contentType = parts[0].split(':')[1];
          var raw = decodeURIComponent(parts[1]);
          return new Blob([raw], { type: contentType });
      }
      var parts = dataURL.split(BASE64_MARKER);
      var contentType = parts[0].split(':')[1];
      var raw = window.atob(parts[1]);
      var rawLength = raw.length;

      var uInt8Array = new Uint8Array(rawLength);

      for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }

      return new Blob([uInt8Array], { type: contentType });
  }
    ////////////////////////////////////////////////////////////////
    $("#detectBtn").click(function () {
  
      $.ajax({
          url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect",
  
          // Request headers.
          beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "e3d783c055a94a8db9be946cfe308f10");
          },
          type: "POST",
          processData: false,
          data: makeblob(dataURL)
        })
        .done(function (response) {
          var paragraph = document.getElementById("result_text");
          paragraph.innerText = "Result\nfaceId: " + response[0].faceId + "\nfaceRectangle:\n-top: " + response[0].faceRectangle.top + "\n-left: " + response[0].faceRectangle.left + "\n-width: " + response[0].faceRectangle.width + "\n-height: " + response[0].faceRectangle.height;
        })
        .done(function (response) {
          //
          console.log(response);
          faceID = response[0].faceId;
          facelandmark(response);
        })
        .fail(function () {
          alert("error");
        })
    })


  // Face - Identify
  $("#IdentifyBtn").click(function () {
    var dataJSON = JSON.stringify({
      faceIds: [faceID],
      personGroupId: "esuns",
      maxNumOfCandidatesReturned: 1
    })
    // document.querySelector("#imageDiv").src = detectURL;

    $.ajax({
        url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify",

        // Request headers.
        beforeSend: function (xhrObj) {
          xhrObj.setRequestHeader("Content-Type", "application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "e3d783c055a94a8db9be946cfe308f10");
        },
        type: "POST",
        data: dataJSON
      })
      .done(function (response) {
        var result = response[0].candidates[0]
        var paragraph = document.getElementById("result_text");
        paragraph.innerText += "\npersonId: " + result.personId + "\n信心程度: " + result.confidence;
      })
      .fail(function () {
        alert("error");
      })
  })



  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
  })();