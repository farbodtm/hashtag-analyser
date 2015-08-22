$('#form-hashtag').submit(function(e) {
  e.preventDefault();
  var hashtag = $('#input-hashtag').val();
  $.getJSON('/json/' + hashtag, function(data) {
    if (data) {
      var labels = getDates(new Date('19 Aug 2015'), new Date('25 Aug 2015'));
      chartData.labels = labels;
      chartData.datasets[0].data = []
      labels.forEach(function(label) {
        if (data.temporal[label]) {
          chartData.datasets[0].data.push(data.temporal[label]);
        } else {
          chartData.datasets[0].data.push(0);
        }
      });
      // create a canvas a plot
      canvas = document.createElement('canvas');
      canvas.id = 'chart';
      canvas.width = 1200;
      canvas.height = 400;
      document.getElementById('chart-container').innerHTML = '';
      document.getElementById('chart-container').appendChild(canvas);
      ctx = canvas.getContext('2d');
      chart = new Chart(ctx).Line(chartData, {
        bezierCurve: true
      });
    }
  });
  return false;
});

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
        }
    ]
};
var chart;
