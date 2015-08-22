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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      chart = new Chart(ctx).Line(chartData);
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

var canvas = document.getElementById('chart');
var ctx = canvas.getContext('2d');
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
