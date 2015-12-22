var page;
$('#form-hashtag').submit(function(e) {
  e.preventDefault();
  var hashtag1 = $('#input-hashtag-1').val();
  var hashtag2 = $('#input-hashtag-2').val();
  var hashtag3 = $('#input-hashtag-3').val();
  var hashtag4 = $('#input-hashtag-4').val();
  var hashtags = [hashtag1, hashtag2, hashtag3, hashtag4];

  var labels = [];
  chartData.labels = labels;
  var count = 0;
  $('#info').text('');
  console.log(hashtags);

  hashtags.forEach(function(hashtag, i) {
    chartData.datasets[i].data = [];
    $.getJSON('/json/' + hashtag).then(function(data) {
      console.log(data);
      $('#info').append('Hashtag ' + parseInt(i+1) + ': '+ data.value.text + '<br>');
      $('#info').append('Total: '+ data.value.total + '<br>');
      $('#info').append('Cluster: ' + parseInt(data.cluster.cluster+1) + '<br>');
      $('#info').append('Max Index: ' + data.value.maxIndex+ '<br><br>');

      if (data) {
        if ($('#input-level').prop('checked')) {
          chartData.datasets[i].data = data.value.fullTemporalArr;
          if (!chartData.labels.length) {
            for (var j = 1; j <= data.value.fullTemporalArr.length; j++) {
              if (j % 50 == 0) {
                chartData.labels.push(j);
              } else {
                chartData.labels.push("");
              }
            }
          }
        } else {
          if ($('#input-norm').prop('checked')) {
            chartData.datasets[i].data = data.cluster.temporal;
          } else {
            chartData.datasets[i].data = data.value.temporalArr;
          }
          if (!chartData.labels.length) {
            for (var j = 1; j <= data.value.temporalArr.length; j++) {
              if ((j-2) % 20== 0) {
                chartData.labels.push(j-42);
              } else {
                chartData.labels.push("");
              }
            }
          }
        }
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
    bezierCurve: true,
    scaleBeginAtZero : true,
    pointDot: false,
    scaleShowGridLines : false,
    scaleShowHorizontalLines: false,
    scaleShowVerticalLines: false,
  });
}

var canvas;
var ctx;
var chartData = {
  labels: [],
  datasets: [
    {
      label: "#",
      fillColor: "rgba(66,139,202,0.2)",
      strokeColor: "rgba(66,139,202,1)",
      pointColor: "rgba(66,139,202,1)",

      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(151,187,205,1)",
      data: []
    },
    {
      label: "#",
      fillColor: "rgba(217,83,79,0.2)",
      strokeColor: "rgba(217,83,79,1)",
      pointColor: "rgba(217,83,79,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: []
    },
    {
      label: "#",
      fillColor: "rgba(240,173,78,0.2)",
      strokeColor: "rgba(240,173,78,1)",
      pointColor: "rgba(240,173,78,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: []
    },
    {
      label: "#",
      fillColor: "rgba(92,184,92,0.2)",
      strokeColor: "rgba(92,184,92,1)",
      pointColor: "rgba(92,184,92,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: []
    }
  ]
};
var chart;

$('#form-bar').submit(function(e) {
  e.preventDefault();
  var limit = $('#input-limit').val();
  var skip = $('#input-skip').val();
  $.getJSON('/hashtags/', {limit :limit, skip: skip}).then(function(data) {
    if (data) {
      barChart.datasets[0].data = [];
      barChart.labels = [];
      data.forEach(function(hashtag) {
        barChart.datasets[0].data.push(hashtag.total);
        barChart.labels.push(hashtag.text);
      });
      canvas2 = document.createElement('canvas');
      canvas2.id = 'barchart';
      canvas2.width = 1200;
      canvas2.height = 400;
      document.getElementById('barchart-container').innerHTML = '';
      document.getElementById('barchart-container').appendChild(canvas2);
      ctx = canvas2.getContext('2d');
      chart = new Chart(ctx).Bar(barChart, {
        scaleBeginAtZero : true,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        barShowStroke : true,
        barStrokeWidth : 2,
        barValueSpacing : 5,
        barDatasetSpacing : 1,
      });
    }
  });
  return false;
});
var canvas2;
var ctx2;
var barChart = {
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
    }
  ]
};
var bar;
