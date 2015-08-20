var ctx = document.getElementById('chart').getContext('2d');
var data = {
    labels: ["19/8", "20/8", "21/8", "22/8", "23/8", "24/8", "25/8","26/8", "27/8", "28/8", "29/8"],
    datasets: [
        {
            label: "#hashtag1",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [10, 22, 50, 100, 233, 340, 500, 300, 220, 100, 10, 0]
        },
        {
            label: "#hashtag2",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 100, 600, 90, 20, 90, 50, 70, 80, 10, 0, 2]
        }
    ]
};
var myLineChart = new Chart(ctx).Line(data);
