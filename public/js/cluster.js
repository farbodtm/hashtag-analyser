
if (page =='cluster') {

  $(function () {

    $.getJSON('/cluster/json/' + collection + '/' + hts + '/' + cl).then(function(data) {

    console.log(collection);
      for (var cluster in data) {
        var temporal = data[cluster].temporal;
        chartData.datasets[0].data = [];
        chartData.labels = [];
        for (var i = 0; i < temporal.length; i++) {
          chartData.labels.push(i);
          chartData.datasets[0].data.push(temporal[i]);
        }
        plotIt(chartData, data[cluster].hashtags, cluster);
      }
    });
  });

  function plotIt(cData, hashtags, i) {
    // create a canvas a plot
    canvas = document.createElement('canvas');
    canvas.id = 'chart';
    canvas.width = 1200;
    canvas.height = 400;
    var con = $('<div class="chart-container"></div>');
    con.append(canvas);
    $('.main').append(con);

    var words = $('<div class="words"></div>');
    var text = '<h4> Cluster ' + (parseInt(i)+1) + '</h4>';
    text += '<h4>Number of hashtags: ' + hashtags.length + '</h4>';
    if (showHashtag == '1') {
      for (var i = 0; i < hashtags.length; i++) {
        if (/^[A-Za-z0-9]*$/.test(hashtags[i])) {
          text += "#" + hashtags[i];
          if (i != hashtags.length-1) {
            text += " - ";
          }
        }
      }
    }

    text += '<br><br>';
    words.html(text);
    $('.main').append(words);
    ctx = canvas.getContext('2d');
    chart = new Chart(ctx).Line(cData, {
      bezierCurve: true,
      scaleBeginAtZero : true,
      pointDot: false,
      animation: false
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

}
