$('#form-hashtag').submit(function(e) {
  e.preventDefault();
  var hashtag1 = $('#input-hashtag-1').val();
  var hashtag2 = $('#input-hashtag-2').val();
  var hashtags = [hashtag1, hashtag2];

  var labels = getDates(new Date('19 Aug 2015'), new Date('4 Sep 2015'));
  chartData.labels = labels;
  var count = 0;
  $('#info').text('');
  hashtags.forEach(function(hashtag, i) {
    chartData.datasets[i].data = []
    $.getJSON('/json/' + hashtag).then(function(data) {
      $('#info').append(data.text + ' : ' + data.aas + '<br>');
      if (data) {
        labels.forEach(function(label) {
          if (data.temporal[label]) {
            chartData.datasets[i].data.push(data.temporal[label]);
          } else {
            chartData.datasets[i].data.push(0);
          }
        });
        count++;
        if (count == hashtags.length) {
          plot(chartData);
        }
      }
    }).fail(function(){
      count++;
      if (count == hashtags.length) {
        plot(chartData);
      }
    });
  });

  return false;
});

function plot(cData) {
  // create a canvas a plot
  canvas = document.createElement('canvas');
  canvas.id = 'chart';
  canvas.width = 1200;
  canvas.height = 400;
  document.getElementById('chart-container').innerHTML = '';
  document.getElementById('chart-container').appendChild(canvas);
  ctx = canvas.getContext('2d');
  chart = new Chart(ctx).Line(cData, {
    bezierCurve: true
  });
}

function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(moment(currentDate).format('D MMM YYYY'))
        currentDate = moment(currentDate).add(1, 'days');
    }
    return dateArray;
}

var canvas;
var ctx;
var chartData = {
  labels: [],
  datasets: [
    {
      label: "#",
      fillColor: "rgba(151,187,205,0.2)",
      strokeColor: "rgba(151,187,205,1)",
      pointColor: "rgba(151,187,205,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      data: []
    },
    {
      label: "#",
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: []
    }

  ]
};
var chart;
