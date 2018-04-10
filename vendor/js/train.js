'use strict';

$(document).ready(function () {
  
  //
  $("#persongroup_personBtn").click(function () {
    $.ajax({
        url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/esuns/persons?start=0&top=1000",
        type: "GET",
        beforeSend: function (xhrObj) {
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "e3d783c055a94a8db9be946cfe308f10");
        }
      })
      .done(function (response) {
        // $('#groupPersonText').html('抓到資料囉!');
        $.each(response, function (index, element) {
          $('.info').append(
            $('<li>', {
              text: [index + 1] + '.' + '名稱：' + element.name
            }),
            $('<li>', {
              text: 'ID：' + element.personId
            }),
            $('<li>', {
              text: 'FaceID：' + element.persistedFaceIds
            }),
            $('<li>', {
              text: '訊息：' + element.userData
            }),
            $('<p>')
          );
        });
      })
      .fail(function () {
        alert("error");
      })
  })

  //
  $("#train_statusBtn").click(function () {
    $.ajax({
        url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/esuns/training",
        type: "GET",
        beforeSend: function (xhrObj) {
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "e3d783c055a94a8db9be946cfe308f10");
        }
      })
      .done(function (response) {
        console.log(response);
        $('#trainStatusText').text('status: ' + response.status + ', createdDateTime: ' + response.createdDateTime + ', lastActionDateTime: ' + response.lastActionDateTime);
      })
      .fail(function () {
        alert("error");
      })
  })

  //
  $("#train_Btn").click(function () {
    $.ajax({
        url: "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/esuns/train",
        type: "POST",
        beforeSend: function (xhrObj) {
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "e3d783c055a94a8db9be946cfe308f10");
        },
        complete: function(xhr, textStatus) {
          console.log(xhr.status);
          if (xhr.status ==202) {
            $('#trainStatusText').text('Success!');
          } else {
            $('#trainStatusText').text(xhr.status);
          }
        }
      })
  })

})